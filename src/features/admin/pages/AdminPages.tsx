import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CaretLeft, CaretRight, ChatCircleText, Check, EyeSlash, Info, Trash, WarningCircle } from '@phosphor-icons/react'
import { questionArticleRegistry } from '../../../content/questionArticleRegistry'
import { AdminApiError, deleteQuestion, getQuestion, getQuestions, getSummary, getModeratorPreauthorizations, moderateQuestion, preauthorizeModerator, revokeModeratorPreauthorization, saveAnswer } from '../api/adminApi'
import { useAdminUser } from '../auth-context'
import type { AdminQuestion, AdminQuestionPage, AdminSummary, ModerationStatus, ModeratorPreauthorization } from '../types/admin'

const statuses: Array<{ id: ModerationStatus | 'unanswered'; label: string }> = [
  { id: 'unanswered', label: 'Belum dijawab' }, { id: 'answered', label: 'Sudah dijawab' }, { id: 'rejected', label: 'Ditolak' }, { id: 'hidden', label: 'Disembunyikan' },
]
const historyStatuses: readonly ModerationStatus[] = ['answered', 'rejected', 'hidden']
const articleTitle = new Map(questionArticleRegistry.map((article) => [article.slug, article.title]))
const statusLabels: Record<ModerationStatus, string> = { pending: 'Perlu diperiksa', approved: 'Belum dijawab', answered: 'Sudah dijawab', rejected: 'Ditolak', hidden: 'Disembunyikan' }
const dateFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const formatDate = (value: string | null | undefined) => value ? dateFormat.format(new Date(value)) : '—'

function useResource<T>(loader: (signal: AbortSignal) => Promise<T>, deps: readonly unknown[]) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<AdminApiError | null>(null)
  const [loading, setLoading] = useState(true)
  const [revision, setRevision] = useState(0)
  const reload = useCallback(() => setRevision((value) => value + 1), [])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    loader(controller.signal).then((value) => setData(value)).catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') return
      setError(reason instanceof AdminApiError ? reason : new AdminApiError(500, 'request_failed', 'Data belum dapat dimuat.'))
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  // Loader identity is deliberately controlled by caller dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, revision])
  return { data, error, loading, reload }
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="admin-page-heading"><div>{eyebrow && <p className="admin-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="admin-page-heading__description">{description}</p>}</div>{action}</div>
}

function StateMessage({ error, retry }: { error: AdminApiError; retry?: () => void }) {
  const copy = error.status === 401 ? 'Akses pengelola diperlukan atau sesi Anda telah berakhir.'
    : error.status === 403 ? 'Akun ini belum memiliki izin sebagai pengelola.'
      : error.status === 503 ? 'Akses pengelola belum tersedia. Hubungi administrator website.'
        : error.status === 0 ? 'Layanan belum dapat dijangkau. Periksa koneksi, lalu coba lagi.'
          : 'Data belum dapat dimuat. Coba lagi.'
  return <div className="admin-state admin-state--error" role="alert"><WarningCircle size={24} aria-hidden="true" /><div><strong>{copy}</strong>{error.status === 409 && <p>Status pertanyaan mungkin sudah berubah. Muat ulang untuk melihat data terbaru.</p>}{retry && <button className="admin-button admin-button--secondary" type="button" onClick={retry}>Coba lagi</button>}</div></div>
}

function LoadingState({ label = 'Memuat data…' }: { label?: string }) { return <div className="admin-state" role="status"><span className="admin-spinner" aria-hidden="true" />{label}</div> }
function EmptyState({ title, detail }: { title: string; detail?: string }) { return <div className="admin-empty"><span className="admin-empty__icon" aria-hidden="true"><ChatMark /></span><strong>{title}</strong>{detail && <p>{detail}</p>}</div> }
function ChatMark() { return <span aria-hidden="true">♡</span> }

function StatusBadge({ status }: { status: ModerationStatus }) { return <span className={`admin-status admin-status--${status}`}>{statusLabels[status]}</span> }

function ConfirmDialog({ title, description, confirmLabel, busy, onCancel, onConfirm, destructive = false }: { title: string; description: string; confirmLabel: string; busy?: boolean; onCancel: () => void; onConfirm: () => void; destructive?: boolean }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const busyRef = useRef(busy)
  const cancelAction = useRef(onCancel)
  busyRef.current = busy
  cancelAction.current = onCancel
  useEffect(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    cancelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busyRef.current) { cancelAction.current(); return }
      if (event.key !== 'Tab') return
      const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled)') ?? [])]
      if (!focusable.length) return
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus() }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0]?.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown); previousFocus.current?.focus() }
  }, [])
  return <div className="admin-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel() }}>
    <div ref={dialogRef} className="admin-dialog" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" aria-describedby="admin-confirm-description">
      <span className={`admin-dialog__icon${destructive ? ' is-danger' : ''}`} aria-hidden="true">{destructive ? <Trash size={22} /> : <WarningCircle size={22} />}</span>
      <h2 id="admin-confirm-title">{title}</h2><p id="admin-confirm-description">{description}</p>
      <div className="admin-dialog__actions"><button ref={cancelRef} className="admin-button admin-button--secondary" type="button" onClick={onCancel} disabled={busy}>Batal</button><button className={`admin-button${destructive ? ' admin-button--danger' : ''}`} type="button" onClick={onConfirm} disabled={busy}>{busy ? 'Memproses…' : confirmLabel}</button></div>
    </div>
  </div>
}

function Toast({ children, kind = 'success', action }: { children: ReactNode; kind?: 'success' | 'error'; action?: ReactNode }) { return <div className={`admin-toast admin-toast--${kind}`} role="status" aria-live="polite">{kind === 'success' ? <Check size={18} /> : <WarningCircle size={18} />}{children}{action}</div> }

export function AdminOverviewPage() {
  const summaryResource = useResource<AdminSummary>(getSummary, [])
  const unansweredResource = useResource<AdminQuestionPage>((signal) => getQuestions({ status: ['pending', 'approved'], limit: 5 }, signal), [])
  const recentResource = useResource<AdminQuestionPage>((signal) => getQuestions({ limit: 5 }, signal), [])
  const summary = summaryResource.data
  const metrics: Array<{ key: keyof AdminSummary; label: string; tone: string }> = [
    { key: 'total', label: 'Total pertanyaan', tone: 'forest' }, { key: 'approved', label: 'Belum dijawab', tone: 'peach' }, { key: 'answered', label: 'Sudah dijawab', tone: 'green' },
  ]
  return <div className="admin-page" data-admin-page="overview">
    <PageHeading eyebrow="RUANG PENGELOLA" title="Ringkasan" description="Pantau pertanyaan dan tindak lanjut dari ibu." action={<Link className="admin-button" to="/admin/questions"><ChatCircleText size={18} /> Buka Tanya Jawab</Link>} />
    {summaryResource.error ? <StateMessage error={summaryResource.error} retry={summaryResource.reload} /> : summaryResource.loading ? <LoadingState label="Memuat ringkasan…" /> : <section className="admin-metrics" aria-label="Ringkasan pertanyaan">
      {metrics.map((metric) => <article key={metric.key} className={`admin-metric admin-metric--${metric.tone}`}><span>{metric.label}</span><strong data-admin-stat={metric.key}>{metric.key === 'approved' ? (summary?.approved ?? 0) + (summary?.pending ?? 0) : summary?.[metric.key] ?? 0}</strong></article>)}
    </section>}
    <div className="admin-overview-grid">
      <section className="admin-panel"><div className="admin-panel__heading"><div><p className="admin-eyebrow">TINDAK LANJUT</p><h2>Belum dijawab</h2></div><Link to="/admin/questions?status=unanswered">Lihat semua <ArrowRight size={16} /></Link></div>
        {unansweredResource.loading ? <LoadingState /> : unansweredResource.error ? <StateMessage error={unansweredResource.error} retry={unansweredResource.reload} /> : unansweredResource.data?.questions.length ? <QuestionList questions={unansweredResource.data.questions} compact /> : <EmptyState title="Belum ada pertanyaan yang perlu dijawab." />}
      </section>
      <section className="admin-panel"><div className="admin-panel__heading"><div><p className="admin-eyebrow">TERBARU</p><h2>Pertanyaan terbaru</h2></div><Link to="/admin/history">Buka riwayat <ArrowRight size={16} /></Link></div>
        {recentResource.loading ? <LoadingState /> : recentResource.error ? <StateMessage error={recentResource.error} retry={recentResource.reload} /> : recentResource.data?.questions.length ? <QuestionList questions={recentResource.data.questions} compact /> : <EmptyState title="Belum ada pertanyaan." detail="Pertanyaan baru akan muncul di sini setelah diterima." />}
      </section>
    </div>
  </div>
}

function QuestionList({ questions, compact = false }: { questions: AdminQuestion[]; compact?: boolean }) {
  return <div className={`admin-question-list${compact ? ' is-compact' : ''}`}>
    {questions.map((question) => <Link className="admin-question-row" key={question.id} to={`/admin/questions/${encodeURIComponent(question.id)}`}>
      <span className="admin-question-row__main"><span className="admin-question-row__top"><strong>{question.displayName}</strong><StatusBadge status={question.status} /></span><span className="admin-question-row__article">{articleTitle.get(question.articleSlug) ?? 'Materi Ruang Ibu'}</span><span className="admin-question-row__preview">{question.question}</span></span>
      <time className="admin-question-row__date" dateTime={question.createdAt}>{formatDate(question.createdAt)}</time><CaretRight size={18} aria-hidden="true" />
    </Link>)}
  </div>
}

function QuestionCollectionPage({ history = false }: { history?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusParam = searchParams.get('status')
  const status = statuses.some((candidate) => candidate.id === statusParam) ? statusParam as ModerationStatus | 'unanswered' : undefined
  const articleSlug = searchParams.get('articleSlug') ?? undefined
  const [cursorStack, setCursorStack] = useState<Array<string | null>>([null])
  useEffect(() => setCursorStack([null]), [status, articleSlug, history])
  const cursor = cursorStack.at(-1) ?? null
  const effectiveStatus: ModerationStatus | readonly ModerationStatus[] | undefined = status === 'unanswered'
    ? ['pending', 'approved']
    : history && !status ? historyStatuses : status
  const loader = useCallback((signal: AbortSignal) => getQuestions({ status: effectiveStatus, articleSlug, cursor, limit: 20 }, signal), [effectiveStatus, articleSlug, cursor])
  const { data, error, loading, reload } = useResource(loader, [loader])
  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    next.delete('cursor')
    setSearchParams(next)
  }
  const visibleQuestions = data?.questions ?? []
  const title = history ? 'Riwayat penanganan' : 'Tanya Jawab'
  const description = history ? 'Lihat jawaban dan pertanyaan yang disembunyikan atau ditolak.' : 'Baca pertanyaan pengunjung dan tulis jawaban jika diperlukan.'
  return <div className="admin-page" data-admin-page={history ? 'history' : 'questions'}>
    <PageHeading eyebrow={history ? 'ARSIP MODERASI' : 'RUANG PENGELOLA'} title={title} description={description} />
    <section className="admin-panel admin-inbox">
      <div className="admin-filter-bar">
        <label className="admin-field admin-field--filter"><span>Status</span><select aria-label="Filter status" value={status ?? ''} onChange={(event) => setFilter('status', event.target.value)}><option value="">{history ? 'Semua riwayat' : 'Semua status'}</option>{statuses.filter((item) => !history || ['answered', 'rejected', 'hidden'].includes(item.id)).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label className="admin-field admin-field--filter"><span>Materi</span><select aria-label="Filter materi" value={articleSlug ?? ''} onChange={(event) => setFilter('articleSlug', event.target.value)}><option value="">Semua materi</option>{questionArticleRegistry.map((article) => <option key={article.slug} value={article.slug}>{article.title}</option>)}</select></label>
      </div>
      <div className="admin-list-heading"><div><h2>{history ? 'Pertanyaan ditangani' : 'Daftar pertanyaan'}</h2><span>{loading ? 'Memuat…' : `${visibleQuestions.length} pada halaman ini`}</span></div></div>
      {loading ? <LoadingState label="Memuat daftar pertanyaan…" /> : error ? <StateMessage error={error} retry={reload} /> : visibleQuestions.length ? <QuestionList questions={visibleQuestions} /> : <EmptyState title={history ? 'Belum ada pertanyaan dalam riwayat ini.' : 'Belum ada pertanyaan untuk filter ini.'} detail="Ubah filter materi atau status untuk melihat daftar lain." />}
      {data && !error && <div className="admin-pagination"><button type="button" className="admin-button admin-button--secondary" onClick={() => setCursorStack((stack) => stack.length > 1 ? stack.slice(0, -1) : stack)} disabled={cursorStack.length <= 1 || loading}><CaretLeft size={17} /> Sebelumnya</button><span>Halaman {cursorStack.length}</span><button type="button" className="admin-button admin-button--secondary" onClick={() => data.nextCursor && setCursorStack((stack) => [...stack, data.nextCursor])} disabled={!data.nextCursor || loading}>Berikutnya <CaretRight size={17} /></button></div>}
    </section>
  </div>
}

export function AdminQuestionsPage() { return <QuestionCollectionPage /> }
export function AdminHistoryPage() { return <QuestionCollectionPage history /> }

export function AdminQuestionDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const loader = useCallback((signal: AbortSignal) => getQuestion(id, signal), [id])
  const { data: question, error, loading, reload } = useResource(loader, [loader])
  const adminUser = useAdminUser()
  const [publicName, setPublicName] = useState('')
  const [publicQuestion, setPublicQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [editingAnswer, setEditingAnswer] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'hide' | 'delete' | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<{ text: string; kind: 'success' | 'error'; conflict?: boolean } | null>(null)
  useEffect(() => {
    if (!question) return
    setPublicName(question.publicDisplayName ?? question.displayName)
    setPublicQuestion(question.publicQuestion ?? question.question)
    setAnswer(question.answer ?? '')
    setEditingAnswer(question.status === 'approved' || !question.answer)
  }, [question?.id, question?.updatedAt, question?.answerUpdatedAt])

  const hide = async () => {
    if (!question) return
    setBusy(true); setNotice(null)
    try {
      await moderateQuestion(question.id, { action: 'hide' })
      setNotice({ text: 'Pertanyaan berhasil disembunyikan.', kind: 'success' })
      reload()
    } catch (reason) { setNotice({ text: reason instanceof AdminApiError ? reason.message : 'Perubahan belum dapat disimpan.', kind: 'error', conflict: reason instanceof AdminApiError && reason.status === 409 }) }
    finally { setBusy(false); setConfirmAction(null) }
  }
  const submitAnswer = async (event: FormEvent) => {
    event.preventDefault()
    if (!question) return
    setBusy(true); setNotice(null)
    try {
      const legacyPublicText = question.status === 'pending'
        ? { publicDisplayName: publicName, publicQuestionText: publicQuestion }
        : undefined
      await saveAnswer(question.id, answer, legacyPublicText)
      setEditingAnswer(false)
      setNotice({ text: question.answer ? 'Jawaban berhasil diperbarui.' : 'Jawaban berhasil dipublikasikan.', kind: 'success' })
      reload()
    } catch (reason) { setNotice({ text: reason instanceof AdminApiError ? reason.message : 'Jawaban belum dapat disimpan.', kind: 'error', conflict: reason instanceof AdminApiError && reason.status === 409 }) }
    finally { setBusy(false) }
  }
  const remove = async () => {
    if (!question) return
    setBusy(true)
    try { await deleteQuestion(question.id); navigate('/admin/questions', { replace: true }) }
    catch (reason) { setNotice({ text: reason instanceof AdminApiError ? reason.message : 'Pertanyaan belum dapat dihapus.', kind: 'error' }); setConfirmAction(null) }
    finally { setBusy(false) }
  }

  return <div className="admin-page" data-admin-page="question-detail">
    <Link className="admin-back-link" to={question?.status === 'rejected' || question?.status === 'hidden' || question?.status === 'answered' ? '/admin/history' : '/admin/questions'}><ArrowLeft size={18} /> Kembali ke daftar</Link>
    {loading ? <LoadingState label="Memuat detail pertanyaan…" /> : error ? <StateMessage error={error} retry={reload} /> : question && <>
      <PageHeading eyebrow={articleTitle.get(question.articleSlug) ?? 'Materi Ruang Ibu'} title="Detail pertanyaan" action={<StatusBadge status={question.status} />} />
      {notice && <Toast kind={notice.kind} action={notice.conflict ? <button type="button" className="admin-toast__refresh" onClick={reload}>Muat ulang</button> : undefined}>{notice.text}</Toast>}
      <div className="admin-detail-grid">
        <div className="admin-detail-main">
          <section className="admin-panel admin-submission"><div className="admin-panel__heading"><div><p className="admin-eyebrow">KIRIMAN ASLI · PRIVAT</p><h2>Pertanyaan dari pengunjung</h2></div></div>
            <div className="admin-private-notice"><Info size={18} /><span>Informasi ini hanya untuk pengelola. Periksa kemungkinan data pribadi sebelum menyusun versi publik.</span></div>
            <dl className="admin-metadata"><div><dt>Nama panggilan</dt><dd>{question.displayName}</dd></div><div><dt>Materi</dt><dd>{articleTitle.get(question.articleSlug) ?? question.articleSlug}</dd></div><div><dt>Dikirim</dt><dd>{formatDate(question.createdAt)}</dd></div>{question.email && <div><dt>Email opsional · privat</dt><dd className="admin-private-value">{question.email}</dd></div>}</dl>
            <div className="admin-question-original"><span>Pertanyaan asli · privat</span><p>{question.question}</p></div>
          </section>
          {(question.status === 'pending' || question.status === 'approved' || question.status === 'answered') && <section className="admin-panel admin-answer-panel"><div className="admin-panel__heading"><div><p className="admin-eyebrow">JAWABAN PENGELOLA</p><h2>{question.answer ? 'Jawaban diterbitkan' : 'Tulis jawaban'}</h2></div>{question.answer && !editingAnswer && <button className="admin-button admin-button--secondary" type="button" onClick={() => setEditingAnswer(true)}>Edit jawaban</button>}</div>
            <p className="admin-warning"><Info size={18} /> Jawaban harus bersifat edukatif, tidak memberikan diagnosis atau menggantikan pemeriksaan bidan/dokter.</p>
            {question.status === 'pending' && <><p className="admin-warning"><WarningCircle size={18} /> Ini pertanyaan lama yang belum tampil. Periksa nama dan isi sebelum menerbitkannya bersama jawaban.</p>
              <label className="admin-field"><span>Nama yang ditampilkan</span><input value={publicName} maxLength={50} onChange={(event) => setPublicName(event.target.value)} /></label>
              <label className="admin-field"><span>Pertanyaan yang ditampilkan</span><textarea value={publicQuestion} maxLength={1000} rows={4} onChange={(event) => setPublicQuestion(event.target.value)} /><small>{publicQuestion.length}/1.000 karakter</small></label>
            </>}
            {question.answer && !editingAnswer && <div className="admin-answer-current"><p>{question.answer}</p><small>{question.answerUpdatedAt ? `Diperbarui ${formatDate(question.answerUpdatedAt)}` : ''}{question.answeredBy ? ` · ${question.answeredBy}` : ''}</small></div>}
            {(editingAnswer || question.status === 'pending') && <form onSubmit={submitAnswer}><label className="admin-field"><span>Jawaban pengelola</span><textarea value={answer} maxLength={2000} minLength={10} rows={7} onChange={(event) => setAnswer(event.target.value)} required /><small>{answer.length}/2.000 karakter · minimal 10 karakter</small></label><div className="admin-action-row">{question.answer && <button type="button" className="admin-button admin-button--secondary" onClick={() => { setAnswer(question.answer ?? ''); setEditingAnswer(false) }} disabled={busy}>Batal</button>}<button type="submit" className="admin-button" disabled={busy || answer.trim().length < 10 || (question.status === 'pending' && (publicName.trim().length < 2 || publicQuestion.trim().length < 10))}>{busy ? 'Menyimpan…' : question.answer ? 'Simpan perubahan' : 'Simpan dan publikasikan jawaban'}</button></div></form>}
          </section>}
        </div>
        <aside className="admin-detail-side">
          <section className="admin-panel admin-public-preview"><p className="admin-eyebrow">TAMPILAN PENGUNJUNG</p><h2>Pratinjau</h2>{question.status === 'pending' ? <div className="admin-public-preview__body"><strong>{publicName}</strong><p>{publicQuestion}</p></div> : question.status === 'approved' || question.status === 'answered' ? <div className="admin-public-preview__body"><strong>{question.publicDisplayName}</strong><p>{question.publicQuestion}</p>{question.answer && <div><span>Jawaban Ruang Ibu</span><p>{question.answer}</p></div>}</div> : <div className="admin-public-preview__private">Pertanyaan ini tidak ditampilkan kepada pengunjung.</div>}<small>{question.status === 'pending' ? 'Pertanyaan lama akan tampil bersama jawaban setelah disimpan.' : 'Pertanyaan tampil sebelum jawaban diterbitkan.'}</small></section>
          <section className="admin-panel admin-history-card"><p className="admin-eyebrow">WAKTU PENANGANAN</p><h2>Informasi status</h2><dl className="admin-metadata"><div><dt>Dikirim</dt><dd>{formatDate(question.createdAt)}</dd></div><div><dt>Terakhir ditangani</dt><dd>{formatDate(question.moderatedAt)}</dd></div><div><dt>Masa retensi saat ini</dt><dd>{formatDate(question.expiresAt)}</dd></div></dl>{question.moderatedBy && <small>Petugas: {question.moderatedBy}</small>}</section>
          {(question.status === 'pending' || question.status === 'approved' || question.status === 'answered') && <button className="admin-button admin-button--secondary admin-hide-button" type="button" onClick={() => setConfirmAction('hide')}><EyeSlash size={18} /> Sembunyikan pertanyaan</button>}
          {adminUser.role === 'owner' && <button className="admin-button admin-button--text-danger admin-delete-button" type="button" onClick={() => setConfirmAction('delete')}><Trash size={17} /> Hapus pertanyaan</button>}
        </aside>
      </div>
      {confirmAction && <ConfirmDialog title={confirmAction === 'hide' ? 'Sembunyikan pertanyaan ini?' : 'Hapus pertanyaan ini?'} description={confirmAction === 'hide' ? 'Pertanyaan ini dan jawabannya tidak lagi tampil pada halaman publik.' : 'Pertanyaan beserta jawaban terkait akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.'} confirmLabel={confirmAction === 'hide' ? 'Sembunyikan' : 'Hapus pertanyaan'} destructive={confirmAction === 'delete'} busy={busy} onCancel={() => setConfirmAction(null)} onConfirm={() => confirmAction === 'delete' ? void remove() : void hide()} />}
    </>}
  </div>
}

export function AdminSettingsPage() {
  const user = useAdminUser()
  const [authorizations, setAuthorizations] = useState<ModeratorPreauthorization[]>([])
  const [authorizationsLoading, setAuthorizationsLoading] = useState(user.role === 'owner')
  const [authorizationsError, setAuthorizationsError] = useState('')
  const [email, setEmail] = useState('')
  const [formBusy, setFormBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const [revokeId, setRevokeId] = useState<string | null>(null)
  const [revokeBusy, setRevokeBusy] = useState(false)
  const loadAuthorizations = useCallback(async (signal?: AbortSignal) => {
    const rows = await getModeratorPreauthorizations(signal)
    if (!signal?.aborted) {
      setAuthorizations(rows)
      setAuthorizationsError('')
    }
  }, [])
  useEffect(() => {
    if (user.role !== 'owner') return
    const controller = new AbortController()
    setAuthorizationsLoading(true)
    void loadAuthorizations(controller.signal).catch((reason: unknown) => {
      if (!controller.signal.aborted) setAuthorizationsError(reason instanceof AdminApiError ? reason.message : 'Daftar akses belum dapat dimuat.')
    }).finally(() => { if (!controller.signal.aborted) setAuthorizationsLoading(false) })
    return () => controller.abort()
  }, [loadAuthorizations, user.role])

  const submitPreauthorization = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formBusy) return
    setFormBusy(true)
    setFeedback(null)
    try {
      await preauthorizeModerator(email)
      setEmail('')
      setFeedback({ kind: 'success', text: 'Praotorisasi Moderator dibuat. Berlaku selama 30 hari.' })
      await loadAuthorizations()
    } catch (reason) {
      const text = reason instanceof AdminApiError && reason.status === 409
        ? 'Alamat ini sudah memiliki akun atau praotorisasi aktif.'
        : reason instanceof AdminApiError ? reason.message : 'Praotorisasi belum dapat dibuat.'
      setFeedback({ kind: 'error', text })
    } finally { setFormBusy(false) }
  }

  const revokePreauthorization = async () => {
    if (!revokeId || revokeBusy) return
    setRevokeBusy(true)
    try {
      await revokeModeratorPreauthorization(revokeId)
      setFeedback({ kind: 'success', text: 'Praotorisasi berhasil dicabut.' })
      setRevokeId(null)
      await loadAuthorizations()
    } catch (reason) {
      setFeedback({ kind: 'error', text: reason instanceof AdminApiError ? reason.message : 'Praotorisasi belum dapat dicabut.' })
    } finally { setRevokeBusy(false) }
  }

  return <div className="admin-page" data-admin-page="settings"><PageHeading eyebrow="PREFERENSI PENGELOLA" title="Pengaturan dasar" description="Informasi akun dan kebijakan data yang saat ini berlaku." />
    <section className="admin-panel admin-settings-panel"><p className="admin-eyebrow">AKSES DAN PRIVASI</p><h2>Akun pengelola</h2><dl className="admin-metadata"><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Peran</dt><dd>{user.role === 'owner' ? 'Pemilik' : 'Moderator'}</dd></div><div><dt>Metode masuk</dt><dd>Google Identity Services</dd></div><div><dt>Sesi</dt><dd>Maksimal 8 jam · berakhir setelah 30 menit tidak aktif</dd></div></dl><p>Hanya akun Google yang telah ditautkan secara privat ke identitas pengelola yang dapat masuk. Untuk mengubah akses akun, hubungi pemilik Ruang Ibu.</p></section>
    {user.role === 'owner' && <section className="admin-panel admin-settings-panel" data-admin-preauthorization>
      <p className="admin-eyebrow">AKSES PENGELOLA</p><h2>Praotorisasi Moderator</h2>
      <p>Tambahkan alamat Gmail customer. Saat orang tersebut masuk dengan Google dan email terverifikasi cocok, akun Moderator akan diaktifkan. Role Moderator ditetapkan oleh server dan praotorisasi berlaku selama 30 hari.</p>
      <p className="admin-private-notice">Praotorisasi tidak mengirim email dan tidak memberi akses sampai login Google pertama berhasil diverifikasi. Jangan memasukkan alamat selain yang sudah disetujui.</p>
      <form className="admin-preauth-form" onSubmit={(event) => void submitPreauthorization(event)}>
        <label className="admin-field" htmlFor="moderator-preauthorization-email">Alamat Gmail customer
          <input id="moderator-preauthorization-email" type="email" autoComplete="email" inputMode="email" maxLength={254} required value={email} onChange={(event) => setEmail(event.currentTarget.value)} placeholder="nama@gmail.com" />
        </label>
        <button className="admin-button" type="submit" disabled={formBusy}>{formBusy ? 'Menyimpan…' : 'Praotorisasi Moderator'}</button>
      </form>
      {feedback && <Toast kind={feedback.kind} >{feedback.text}</Toast>}
      {authorizationsError && <div className="admin-state admin-state--error" role="alert">{authorizationsError}<button className="admin-button admin-button--secondary" type="button" onClick={() => { setAuthorizationsLoading(true); void loadAuthorizations().catch(() => setAuthorizationsError('Daftar akses belum dapat dimuat.')).finally(() => setAuthorizationsLoading(false)) }}>Coba lagi</button></div>}
      <div className="admin-preauth-list" aria-live="polite">
        <h3>Daftar praotorisasi</h3>
        {authorizationsLoading ? <LoadingState label="Memuat daftar akses…" /> : authorizations.length === 0 ? <p className="admin-preauth-empty">Belum ada praotorisasi Moderator.</p> : authorizations.map((authorization) => <div className="admin-preauth-row" key={authorization.id}>
          <div><strong>{authorization.email}</strong><span className="admin-preauth-meta">Moderator · {authorization.status === 'active' ? 'Aktif' : authorization.status === 'expired' ? 'Kedaluwarsa' : authorization.status === 'consumed' ? 'Sudah diaktifkan' : 'Dicabut'} · berakhir {dateFormat.format(new Date(authorization.expiresAt))}</span></div>
          {authorization.status === 'active' && <button className="admin-button admin-button--secondary" type="button" onClick={() => setRevokeId(authorization.id)}>Cabut akses</button>}
        </div>)}
      </div>
    </section>}
    <section className="admin-panel admin-settings-panel"><p className="admin-eyebrow">RETENSI · BELUM DISETUJUI CUSTOMER</p><h2>Nilai implementasi sementara</h2><p>Angka berikut adalah default M3 untuk bahan review, bukan kebijakan final. Tidak ada penghapusan terjadwal dan dashboard ini tidak menyediakan purge massal.</p><ul className="admin-retention-list"><li><span>Pertanyaan menunggu moderasi</span><strong>90 hari sejak dikirim</strong></li><li><span>Ditolak atau disembunyikan</span><strong>30 hari sejak ditangani</strong></li><li><span>Disetujui atau dijawab</span><strong>365 hari sejak ditangani</strong></li></ul><p className="admin-settings-footnote">Sebelum kebijakan disetujui, penghapusan hanya dapat dilakukan satu per satu dengan konfirmasi.</p></section>
    {revokeId && <ConfirmDialog title="Cabut praotorisasi ini?" description="Customer tidak dapat mengaktifkan akses Moderator menggunakan praotorisasi ini. Jika akun sudah diaktifkan, pencabutan ini tidak menonaktifkan akun tersebut." confirmLabel="Cabut praotorisasi" busy={revokeBusy} onCancel={() => setRevokeId(null)} onConfirm={() => void revokePreauthorization()} destructive />}
  </div>
}
