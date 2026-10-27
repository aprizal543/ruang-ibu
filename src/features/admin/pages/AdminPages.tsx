import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CaretLeft, CaretRight, ChatCircleText, Check, EyeSlash, Info, Trash, WarningCircle } from '@phosphor-icons/react'
import { questionArticleRegistry } from '../../../content/questionArticleRegistry'
import { AdminApiError, deleteQuestion, getQuestion, getQuestions, getSummary, moderateQuestion, saveAnswer } from '../api/adminApi'
import type { AdminQuestion, AdminQuestionPage, AdminSummary, ModerationStatus } from '../types/admin'

const statuses: Array<{ id: ModerationStatus; label: string }> = [
  { id: 'pending', label: 'Menunggu' }, { id: 'approved', label: 'Disetujui' }, { id: 'answered', label: 'Dijawab' }, { id: 'rejected', label: 'Ditolak' }, { id: 'hidden', label: 'Disembunyikan' },
]
const historyStatuses = ['approved', 'answered', 'rejected', 'hidden'] as const
const articleTitle = new Map(questionArticleRegistry.map((article) => [article.slug, article.title]))
const statusLabels: Record<ModerationStatus, string> = { pending: 'Menunggu', approved: 'Disetujui', answered: 'Dijawab', rejected: 'Ditolak', hidden: 'Disembunyikan' }
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
  const pendingResource = useResource<AdminQuestionPage>((signal) => getQuestions({ status: 'pending', limit: 5 }, signal), [])
  const recentResource = useResource<AdminQuestionPage>((signal) => getQuestions({ limit: 5 }, signal), [])
  const summary = summaryResource.data
  const metrics: Array<{ key: keyof AdminSummary; label: string; tone: string }> = [
    { key: 'total', label: 'Total pertanyaan', tone: 'forest' }, { key: 'pending', label: 'Menunggu moderasi', tone: 'peach' }, { key: 'approved', label: 'Disetujui', tone: 'sage' },
    { key: 'answered', label: 'Sudah dijawab', tone: 'green' }, { key: 'rejected', label: 'Ditolak', tone: 'neutral' }, { key: 'hidden', label: 'Disembunyikan', tone: 'neutral' },
  ]
  return <div className="admin-page" data-admin-page="overview">
    <PageHeading eyebrow="RUANG PENGELOLA" title="Ringkasan" description="Pantau pertanyaan dan tindak lanjut dari ibu." action={<Link className="admin-button" to="/admin/questions"><ChatCircleText size={18} /> Buka Tanya Jawab</Link>} />
    {summaryResource.error ? <StateMessage error={summaryResource.error} retry={summaryResource.reload} /> : summaryResource.loading ? <LoadingState label="Memuat ringkasan…" /> : <section className="admin-metrics" aria-label="Ringkasan pertanyaan">
      {metrics.map((metric) => <article key={metric.key} className={`admin-metric admin-metric--${metric.tone}`}><span>{metric.label}</span><strong data-admin-stat={metric.key}>{summary?.[metric.key] ?? 0}</strong></article>)}
    </section>}
    <div className="admin-overview-grid">
      <section className="admin-panel"><div className="admin-panel__heading"><div><p className="admin-eyebrow">PERLU DITINJAU</p><h2>Menunggu moderasi</h2></div><Link to="/admin/questions?status=pending">Lihat semua <ArrowRight size={16} /></Link></div>
        {pendingResource.loading ? <LoadingState /> : pendingResource.error ? <StateMessage error={pendingResource.error} retry={pendingResource.reload} /> : pendingResource.data?.questions.length ? <QuestionList questions={pendingResource.data.questions} compact /> : <EmptyState title="Belum ada pertanyaan yang menunggu moderasi." />}
      </section>
      <section className="admin-panel"><div className="admin-panel__heading"><div><p className="admin-eyebrow">TERBARU</p><h2>Aktivitas pertanyaan</h2></div><Link to="/admin/history">Buka riwayat <ArrowRight size={16} /></Link></div>
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
  const status = statuses.some((candidate) => candidate.id === statusParam) ? statusParam as ModerationStatus : undefined
  const articleSlug = searchParams.get('articleSlug') ?? undefined
  const [cursorStack, setCursorStack] = useState<Array<string | null>>([null])
  useEffect(() => setCursorStack([null]), [status, articleSlug, history])
  const cursor = cursorStack.at(-1) ?? null
  const effectiveStatus = history && !status ? historyStatuses : status
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
  const description = history ? 'Lihat pertanyaan yang telah diputuskan dan tindak lanjut terakhir.' : 'Periksa setiap pertanyaan sebelum menentukan apakah layak ditampilkan.'
  return <div className="admin-page" data-admin-page={history ? 'history' : 'questions'}>
    <PageHeading eyebrow={history ? 'ARSIP MODERASI' : 'RUANG PENGELOLA'} title={title} description={description} />
    <section className="admin-panel admin-inbox">
      <div className="admin-filter-bar">
        <label className="admin-field admin-field--filter"><span>Status</span><select aria-label="Filter status" value={status ?? ''} onChange={(event) => setFilter('status', event.target.value)}><option value="">{history ? 'Semua riwayat' : 'Semua status'}</option>{statuses.filter((item) => !history || item.id !== 'pending').map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
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
  const [publicName, setPublicName] = useState('')
  const [publicQuestion, setPublicQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [editingAnswer, setEditingAnswer] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'reject' | 'hide' | 'delete' | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<{ text: string; kind: 'success' | 'error'; conflict?: boolean } | null>(null)
  useEffect(() => {
    if (!question) return
    setPublicName(question.publicDisplayName ?? question.displayName)
    setPublicQuestion(question.publicQuestion ?? question.question)
    setAnswer(question.answer ?? '')
    setEditingAnswer(question.status === 'approved' || !question.answer)
  }, [question?.id, question?.updatedAt, question?.answerUpdatedAt])

  const act = async (action: 'approve' | 'reject' | 'hide') => {
    if (!question) return
    setBusy(true); setNotice(null)
    try {
      await moderateQuestion(question.id, action === 'approve' ? { action, publicDisplayName: publicName, publicQuestionText: publicQuestion } : { action })
      setNotice({ text: action === 'approve' ? 'Pertanyaan berhasil disetujui.' : action === 'reject' ? 'Pertanyaan berhasil ditolak.' : 'Pertanyaan berhasil disembunyikan.', kind: 'success' })
      reload()
    } catch (reason) { setNotice({ text: reason instanceof AdminApiError ? reason.message : 'Perubahan belum dapat disimpan.', kind: 'error', conflict: reason instanceof AdminApiError && reason.status === 409 }) }
    finally { setBusy(false); setConfirmAction(null) }
  }
  const submitAnswer = async (event: FormEvent) => {
    event.preventDefault()
    if (!question) return
    setBusy(true); setNotice(null)
    try {
      await saveAnswer(question.id, answer)
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
          {question.status === 'pending' && <section className="admin-panel admin-moderation-panel"><div className="admin-panel__heading"><div><p className="admin-eyebrow">PEMERIKSAAN PUBLIKASI</p><h2>Siapkan versi yang tampil</h2></div></div>
            <p className="admin-warning"><WarningCircle size={18} /> Pastikan pertanyaan tidak memuat informasi pribadi atau kesehatan sensitif sebelum dipublikasikan.</p>
            <label className="admin-field"><span>Nama yang akan ditampilkan</span><input value={publicName} maxLength={50} onChange={(event) => setPublicName(event.target.value)} /></label>
            <label className="admin-field"><span>Pertanyaan yang akan ditampilkan</span><textarea value={publicQuestion} maxLength={1000} rows={5} onChange={(event) => setPublicQuestion(event.target.value)} /><small>{publicQuestion.length}/1.000 karakter</small></label>
            <div className="admin-action-row"><button type="button" className="admin-button admin-button--danger-outline" onClick={() => setConfirmAction('reject')} disabled={busy}>Tolak</button><button type="button" className="admin-button" onClick={() => void act('approve')} disabled={busy || publicName.trim().length < 2 || publicQuestion.trim().length < 10}>{busy ? 'Menyimpan…' : <><Check size={18} /> Setujui pertanyaan</>}</button></div>
          </section>}
          {(question.status === 'approved' || question.status === 'answered') && <section className="admin-panel admin-answer-panel"><div className="admin-panel__heading"><div><p className="admin-eyebrow">JAWABAN PENGELOLA</p><h2>{question.answer ? 'Jawaban diterbitkan' : 'Tulis jawaban'}</h2></div>{question.answer && !editingAnswer && <button className="admin-button admin-button--secondary" type="button" onClick={() => setEditingAnswer(true)}>Edit jawaban</button>}</div>
            <p className="admin-warning"><Info size={18} /> Jawaban harus bersifat edukatif, tidak memberikan diagnosis atau menggantikan pemeriksaan bidan/dokter.</p>
            {question.answer && !editingAnswer && <div className="admin-answer-current"><p>{question.answer}</p><small>{question.answerUpdatedAt ? `Diperbarui ${formatDate(question.answerUpdatedAt)}` : ''}{question.answeredBy ? ` · ${question.answeredBy}` : ''}</small></div>}
            {editingAnswer && <form onSubmit={submitAnswer}><label className="admin-field"><span>Jawaban pengelola</span><textarea value={answer} maxLength={2000} minLength={10} rows={7} onChange={(event) => setAnswer(event.target.value)} required /><small>{answer.length}/2.000 karakter · minimal 10 karakter</small></label><div className="admin-action-row"><button type="button" className="admin-button admin-button--secondary" onClick={() => { setAnswer(question.answer ?? ''); setEditingAnswer(false) }} disabled={busy}>Batal</button><button type="submit" className="admin-button" disabled={busy || answer.trim().length < 10}>{busy ? 'Menyimpan…' : question.answer ? 'Simpan perubahan' : 'Simpan dan publikasikan'}</button></div></form>}
          </section>}
        </div>
        <aside className="admin-detail-side">
          <section className="admin-panel admin-public-preview"><p className="admin-eyebrow">VERSI PUBLIK</p><h2>Pratinjau tampilan</h2>{question.status === 'pending' ? <div className="admin-public-preview__body"><strong>{publicName}</strong><p>{publicQuestion}</p></div> : question.status === 'approved' || question.status === 'answered' ? <div className="admin-public-preview__body"><strong>{question.publicDisplayName}</strong><p>{question.publicQuestion}</p>{question.answer && <div><span>Jawaban Ruang Ibu</span><p>{question.answer}</p></div>}</div> : <div className="admin-public-preview__private">Pertanyaan ini tidak ditampilkan kepada publik.</div>}<small>Pratinjau internal. Pertanyaan baru tampil setelah disetujui.</small></section>
          <section className="admin-panel admin-history-card"><p className="admin-eyebrow">WAKTU PENANGANAN</p><h2>Informasi status</h2><dl className="admin-metadata"><div><dt>Dikirim</dt><dd>{formatDate(question.createdAt)}</dd></div><div><dt>Terakhir ditangani</dt><dd>{formatDate(question.moderatedAt)}</dd></div><div><dt>Masa retensi saat ini</dt><dd>{formatDate(question.expiresAt)}</dd></div></dl>{question.moderatedBy && <small>Petugas: {question.moderatedBy}</small>}</section>
          {(question.status === 'approved' || question.status === 'answered') && <button className="admin-button admin-button--danger-outline admin-hide-button" type="button" onClick={() => setConfirmAction('hide')}><EyeSlash size={18} /> Sembunyikan pertanyaan</button>}
          <button className="admin-button admin-button--text-danger admin-delete-button" type="button" onClick={() => setConfirmAction('delete')}><Trash size={17} /> Hapus pertanyaan</button>
        </aside>
      </div>
      {confirmAction && <ConfirmDialog title={confirmAction === 'reject' ? 'Tolak pertanyaan ini?' : confirmAction === 'hide' ? 'Sembunyikan pertanyaan ini?' : 'Hapus pertanyaan ini?'} description={confirmAction === 'reject' ? 'Pertanyaan yang ditolak tidak akan ditampilkan kepada publik.' : confirmAction === 'hide' ? 'Pertanyaan ini dan jawabannya tidak lagi tampil pada halaman publik.' : 'Pertanyaan beserta jawaban terkait akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.'} confirmLabel={confirmAction === 'reject' ? 'Tolak pertanyaan' : confirmAction === 'hide' ? 'Sembunyikan' : 'Hapus pertanyaan'} destructive={confirmAction === 'delete'} busy={busy} onCancel={() => setConfirmAction(null)} onConfirm={() => confirmAction === 'delete' ? void remove() : void act(confirmAction)} />}
    </>}
  </div>
}

export function AdminSettingsPage() {
  return <div className="admin-page" data-admin-page="settings"><PageHeading eyebrow="PREFERENSI PENGELOLA" title="Pengaturan dasar" description="Informasi akses dan kebijakan data yang saat ini berlaku." />
    <section className="admin-panel admin-settings-panel"><p className="admin-eyebrow">AKSES DAN PRIVASI</p><h2>Akses pengelola</h2><p>Dashboard dan API pengelola harus dilindungi Cloudflare Access pada route <code>/admin</code>, <code>/admin/*</code>, dan <code>/api/admin/*</code>. Akses web ini tidak menyediakan login sendiri.</p><div className="admin-setup-note"><WarningCircle size={20} /><div><strong>Konfigurasi Cloudflare belum diverifikasi untuk Preview.</strong><p>Jika API belum tersedia, dashboard menolak akses dan tidak menampilkan data lokal atau contoh.</p></div></div></section>
    <section className="admin-panel admin-settings-panel"><p className="admin-eyebrow">RETENSI · BELUM DISETUJUI CUSTOMER</p><h2>Nilai implementasi sementara</h2><p>Angka berikut adalah default M3 untuk bahan review, bukan kebijakan final. Tidak ada penghapusan terjadwal dan dashboard ini tidak menyediakan purge massal.</p><ul className="admin-retention-list"><li><span>Pertanyaan menunggu moderasi</span><strong>90 hari sejak dikirim</strong></li><li><span>Ditolak atau disembunyikan</span><strong>30 hari sejak ditangani</strong></li><li><span>Disetujui atau dijawab</span><strong>365 hari sejak ditangani</strong></li></ul><p className="admin-settings-footnote">Sebelum kebijakan disetujui, penghapusan hanya dapat dilakukan satu per satu dengan konfirmasi.</p></section>
  </div>
}
