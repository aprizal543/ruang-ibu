import { useEffect, useRef, useState, type FormEvent } from 'react'
import { getPublicQuestions, getTurnstileSiteKey, PublicQuestionApiError, submitPublicQuestion, type PublicQuestion } from './publicQuestionsApi'
import '../../styles/public-questions.css'

interface TurnstileRenderOptions {
  sitekey: string
  action: 'ask_question'
  theme: 'light'
  appearance: 'interaction-only'
  execution: 'execute'
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
}

interface TurnstileApi {
  render(element: HTMLElement, options: TurnstileRenderOptions): string
  execute(widgetId: string): void
  reset(widgetId?: string): void
  remove(widgetId: string): void
}

declare global {
  interface Window { turnstile?: TurnstileApi }
}

let turnstileScriptPromise: Promise<void> | undefined

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (turnstileScriptPromise) return turnstileScriptPromise
  const loading = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile-script]')
    if (!script) {
      script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.turnstileScript = 'true'
      document.head.append(script)
    }
    const onLoad = () => window.turnstile ? resolve() : reject(new Error('Verifikasi tidak tersedia.'))
    const onError = () => reject(new Error('Verifikasi tidak dapat dimuat.'))
    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })
    if (window.turnstile) resolve()
  }).catch((error: unknown) => {
    turnstileScriptPromise = undefined
    throw error
  })
  turnstileScriptPromise = loading
  return loading
}

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date)
}

function PublicQuestionItem({ question }: { question: PublicQuestion }) {
  const [answerOpen, setAnswerOpen] = useState(false)
  const answerPanelId = `public-qna-answer-${question.id}`

  return <li className="public-qna__item">
    <div className="public-qna__question-meta"><strong>{question.displayName}</strong>{question.createdAt && <time dateTime={question.createdAt}>{formatDate(question.createdAt)}</time>}</div>
    <p>{question.question}</p>
    {question.answer ? <>
      <button
        className="public-qna__answer-toggle"
        type="button"
        aria-expanded={answerOpen}
        aria-controls={answerPanelId}
        onClick={() => setAnswerOpen((open) => !open)}
      >{answerOpen ? 'Sembunyikan jawaban' : 'Lihat jawaban'}</button>
      <div id={answerPanelId} className="public-qna__answer" hidden={!answerOpen}>
        <h3>Jawaban Ruang Ibu</h3><p>{question.answer.text}</p>
      </div>
    </> : <span className="public-qna__unanswered">Belum dijawab</span>}
  </li>
}

function QuestionList({ questions }: { questions: PublicQuestion[] }) {
  if (questions.length === 0) return <p className="public-qna__empty">Belum ada pertanyaan untuk materi ini.</p>
  return <ol className="public-qna__list" aria-label="Tanya Jawab untuk materi ini">
    {questions.map((question) => <PublicQuestionItem question={question} key={question.id} />)}
  </ol>
}

export default function PublicArticleQuestions({ articleSlug }: { articleSlug: string }) {
  const [questions, setQuestions] = useState<PublicQuestion[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [listError, setListError] = useState('')
  const [listLoading, setListLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [siteKey, setSiteKey] = useState('')
  const [formUnavailable, setFormUnavailable] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [question, setQuestion] = useState('')
  const [consented, setConsented] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [notice, setNotice] = useState('')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const widgetContainer = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const tokenResolve = useRef<((token: string) => void) | null>(null)
  const tokenReject = useRef<((error: Error) => void) | null>(null)
  const tokenTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setListLoading(true)
    setListError('')
    setQuestions([])
    setCursor(null)
    void getPublicQuestions(articleSlug, null, controller.signal).then((page) => {
      setQuestions(page.questions)
      setCursor(page.nextCursor)
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setListError(error instanceof Error ? error.message : 'Pertanyaan belum dapat dimuat.')
    }).finally(() => { if (!controller.signal.aborted) setListLoading(false) })
    return () => controller.abort()
  }, [articleSlug])

  useEffect(() => {
    if (!formOpen || siteKey) return
    const controller = new AbortController()
    void getTurnstileSiteKey(controller.signal).then(({ turnstileSiteKey }) => {
      if (!turnstileSiteKey.trim()) throw new Error('Formulir belum dapat digunakan.')
      setSiteKey(turnstileSiteKey)
      setFormUnavailable('')
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setFormUnavailable(error instanceof Error ? error.message : 'Formulir belum dapat digunakan. Coba lagi nanti.')
    })
    return () => controller.abort()
  }, [formOpen, siteKey])

  useEffect(() => {
    if (!formOpen || !siteKey || !widgetContainer.current) return
    let cancelled = false
    void loadTurnstile().then(() => {
      if (cancelled || !widgetContainer.current || !window.turnstile) return
      widgetId.current = window.turnstile.render(widgetContainer.current, {
        sitekey: siteKey,
        action: 'ask_question',
        theme: 'light',
        appearance: 'interaction-only',
        execution: 'execute',
        callback: (token) => {
          setSubmitError('')
          tokenResolve.current?.(token)
          tokenResolve.current = null
          tokenReject.current = null
          if (tokenTimeout.current) clearTimeout(tokenTimeout.current)
          tokenTimeout.current = null
        },
        'expired-callback': () => {
          const reject = tokenReject.current
          tokenResolve.current = null
          tokenReject.current = null
          if (tokenTimeout.current) clearTimeout(tokenTimeout.current)
          tokenTimeout.current = null
          reject?.(new Error('Verifikasi kedaluwarsa. Tekan Kirim Pertanyaan untuk mencoba lagi.'))
        },
        'error-callback': () => {
          const reject = tokenReject.current
          tokenResolve.current = null
          tokenReject.current = null
          if (tokenTimeout.current) clearTimeout(tokenTimeout.current)
          tokenTimeout.current = null
          reject?.(new Error('Verifikasi belum berhasil. Periksa koneksi, lalu coba lagi.'))
        },
      })
      setTurnstileReady(true)
    }).catch(() => {
      if (!cancelled) setFormUnavailable('Verifikasi keamanan belum dapat dimuat. Coba lagi saat koneksi tersedia.')
    })
    return () => {
      cancelled = true
      if (tokenTimeout.current) clearTimeout(tokenTimeout.current)
      tokenTimeout.current = null
      tokenReject.current?.(new Error('Formulir ditutup.'))
      tokenResolve.current = null
      tokenReject.current = null
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = null
      setTurnstileReady(false)
    }
  }, [formOpen, siteKey])

  async function loadNextPage() {
    if (!cursor || pageLoading) return
    setPageLoading(true)
    setListError('')
    try {
      const page = await getPublicQuestions(articleSlug, cursor)
      setQuestions((current) => [...current, ...page.questions])
      setCursor(page.nextCursor)
    } catch (error) {
      setListError(error instanceof Error ? error.message : 'Pertanyaan belum dapat dimuat.')
    } finally {
      setPageLoading(false)
    }
  }

  async function retryQuestions() {
    setListLoading(true)
    setListError('')
    try {
      const page = await getPublicQuestions(articleSlug)
      setQuestions(page.questions)
      setCursor(page.nextCursor)
    } catch (error) {
      setListError(error instanceof Error ? error.message : 'Pertanyaan belum dapat dimuat.')
    } finally {
      setListLoading(false)
    }
  }

  function requestTurnstileToken(): Promise<string> {
    if (!widgetId.current || !window.turnstile) return Promise.reject(new Error('Verifikasi belum siap. Coba lagi.'))
    return new Promise((resolve, reject) => {
      tokenResolve.current = resolve
      tokenReject.current = reject
      tokenTimeout.current = setTimeout(() => {
        tokenResolve.current = null
        tokenReject.current = null
        tokenTimeout.current = null
        reject(new Error('Verifikasi terlalu lama. Tekan Kirim Pertanyaan untuk mencoba lagi.'))
      }, 120_000)
      try {
        window.turnstile?.execute(widgetId.current!)
      } catch {
        if (tokenTimeout.current) clearTimeout(tokenTimeout.current)
        tokenTimeout.current = null
        tokenResolve.current = null
        tokenReject.current = null
        reject(new Error('Verifikasi belum berhasil. Silakan coba lagi.'))
      }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting || !consented || !turnstileReady) return
    setSubmitting(true)
    setSubmitError('')
    setNotice('')
    try {
      const turnstileToken = await requestTurnstileToken()
      const optionalName = displayName.trim()
      const receipt = await submitPublicQuestion({
        articleSlug,
        ...(optionalName ? { displayName: optionalName } : {}),
        question: question.trim(),
        consentToPublicDisplay: true,
        turnstileToken,
      })
      setQuestions((current) => [receipt.question, ...current.filter((item) => item.id !== receipt.question.id)])
      setNotice('Pertanyaan berhasil dikirim dan langsung tampil di Tanya Jawab.')
      setDisplayName('')
      setQuestion('')
      setConsented(false)
      setFormOpen(false)
      toggleRef.current?.focus()
    } catch (error) {
      setSubmitError(error instanceof PublicQuestionApiError ? error.message : error instanceof Error ? error.message : 'Pertanyaan belum dapat dikirim. Silakan coba lagi.')
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
    } finally {
      setSubmitting(false)
    }
  }

  function closeForm() {
    if (submitting) return
    setFormOpen(false)
    toggleRef.current?.focus()
  }

  return <section className="public-qna" aria-labelledby="public-qna-heading" data-public-qna>
    <header className="public-qna__header">
      <p className="public-qna__eyebrow">RUANG DISKUSI</p>
      <h2 id="public-qna-heading">Tanya Jawab</h2>
      <p>Pertanyaan dan jawaban untuk materi ini.</p>
    </header>
    <div aria-live="polite" aria-busy={listLoading}>
      {listLoading ? <p className="public-qna__state" role="status">Memuat Tanya Jawab…</p>
        : listError ? <div className="public-qna__state public-qna__state--error" role="alert"><p>{listError}</p><button type="button" onClick={() => void retryQuestions()}>Coba muat ulang</button></div>
          : <QuestionList questions={questions} />}
    </div>
    {cursor && <button className="public-qna__more" type="button" onClick={() => void loadNextPage()} disabled={pageLoading}>{pageLoading ? 'Memuat…' : 'Muat pertanyaan lainnya'}</button>}
    {notice && <p className="public-qna__form-message" role="status" aria-live="polite">{notice}</p>}
    <button
      ref={toggleRef}
      className="public-qna__toggle"
      type="button"
      aria-expanded={formOpen}
      aria-controls="public-qna-form-panel"
      onClick={() => { setNotice(''); setFormOpen((open) => !open) }}
    >{formOpen ? '− Tutup' : '+ Ajukan Pertanyaan'}</button>
    {formOpen && <div className="public-qna__form-wrap" id="public-qna-form-panel">
      <div className="public-qna__form-heading"><h3>Ajukan pertanyaan</h3><button className="public-qna__close" type="button" onClick={closeForm} disabled={submitting}>Tutup</button></div>
      <p className="public-qna__disclaimer">Pertanyaan yang dikirim dapat langsung dibaca pengunjung lain. Tanya Jawab ini bersifat edukasi, bukan pengganti penilaian bidan atau dokter. Jangan sertakan informasi pribadi atau keluhan darurat.</p>
      {formUnavailable ? <p className="public-qna__state public-qna__state--error" role="alert">{formUnavailable}</p> : <form onSubmit={(event) => void handleSubmit(event)}>
        <label className="public-qna__field"><span>Nama tampilan <small>(opsional)</small></span><input autoComplete="nickname" maxLength={50} value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Boleh dikosongkan" /></label>
        <label className="public-qna__field"><span>Pertanyaan</span><textarea required minLength={10} maxLength={1000} rows={4} value={question} onChange={(event) => setQuestion(event.target.value)} aria-describedby="public-qna-question-help" /><small id="public-qna-question-help">{question.length}/1.000 karakter · minimal 10. Jangan cantumkan kontak atau nomor identitas.</small></label>
        <label className="public-qna__consent"><input type="checkbox" required checked={consented} onChange={(event) => setConsented(event.target.checked)} /><span>Saya setuju pertanyaan ini dapat dibaca pengunjung lain setelah dikirim.</span></label>
        <div className="public-qna__verification"><div ref={widgetContainer} aria-label="Verifikasi keamanan" />{!turnstileReady && <p role="status">Menyiapkan verifikasi…</p>}</div>
        {submitError && <p className="public-qna__form-message public-qna__form-message--error" role="alert">{submitError}</p>}
        <button className="public-qna__submit" type="submit" disabled={submitting || !turnstileReady || !consented || question.trim().length < 10}>{submitting ? 'Memverifikasi dan mengirim…' : 'Kirim Pertanyaan'}</button>
      </form>}
    </div>}
  </section>
}
