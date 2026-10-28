import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import TherapyDetailPage from './components/therapy/TherapyDetailPage'
import { therapyArticles } from './content/therapyArticles'
import { therapyReferences } from './content/therapyReferences'
import HomePage from './pages/HomePage'
import TherapyPage from './pages/TherapyPage'
import RelaxationPage from './pages/RelaxationPage'
import ImmersiveAudioPage from './pages/ImmersiveAudioPage'
import RelaxationExperience from './features/relaxation/RelaxationExperience'
import PregnancyGuidePage from './pages/PregnancyGuidePage'
import BirthGuidePage from './pages/BirthGuidePage'
import EvaluationPage from './pages/EvaluationPage'
import { AboutPage, FaqPage, NotFoundPage, SafetyPage, SourcesPage } from './pages/InformationPages'
import SiteMenu from './components/layout/SiteMenu'
import RouteScrollManager from './components/navigation/RouteScrollManager'

const AdminLayout = lazy(() => import('./features/admin/components/AdminLayout'))
const AdminLoginPage = lazy(() => import('./features/admin/pages/AdminLoginPage'))
const AdminOverviewPage = lazy(() => import('./features/admin/pages/AdminPages').then((module) => ({ default: module.AdminOverviewPage })))
const AdminQuestionsPage = lazy(() => import('./features/admin/pages/AdminPages').then((module) => ({ default: module.AdminQuestionsPage })))
const AdminQuestionDetailPage = lazy(() => import('./features/admin/pages/AdminPages').then((module) => ({ default: module.AdminQuestionDetailPage })))
const AdminHistoryPage = lazy(() => import('./features/admin/pages/AdminPages').then((module) => ({ default: module.AdminHistoryPage })))
const AdminSettingsPage = lazy(() => import('./features/admin/pages/AdminPages').then((module) => ({ default: module.AdminSettingsPage })))

function TherapyArticleRoute() {
  const { slug } = useParams()
  const article = slug ? therapyArticles[slug] : undefined
  if (!article) return <NotFoundPage />
  return <TherapyDetailPage article={article} references={therapyReferences} />
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLElement | null>(null)

  const openMenu = useCallback(() => {
    menuTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setMenuOpen(true)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <RouteScrollManager />
      <Routes>
        <Route path="/" element={<HomePage menuOpen={menuOpen} onOpenMenu={openMenu} />} />
        <Route path="/terapi" element={<TherapyPage />} />
        <Route path="/relaksasi" element={<RelaxationExperience />}>
          <Route index element={<RelaxationPage />} />
          <Route path=":trackId" element={<ImmersiveAudioPage />} />
        </Route>
        <Route path="/hamil" element={<PregnancyGuidePage />} />
        <Route path="/bersalin" element={<BirthGuidePage />} />
        <Route path="/evaluasi" element={<EvaluationPage />} />
        <Route path="/admin/login" element={<Suspense fallback={<p role="status" aria-live="polite">Memuat halaman masuk…</p>}><AdminLoginPage /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<p role="status" aria-live="polite">Memuat ruang pengelola…</p>}><AdminLayout /></Suspense>}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="questions" element={<AdminQuestionsPage />} />
          <Route path="questions/:id" element={<AdminQuestionDetailPage />} />
          <Route path="history" element={<AdminHistoryPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
        <Route path="/panduan/hamil" element={<PregnancyGuidePage />} />
        <Route path="/panduan/bersalin" element={<BirthGuidePage />} />
        <Route
          path="/terapi/teknik-pernapasan"
          element={<TherapyDetailPage article={therapyArticles['teknik-pernapasan']} references={therapyReferences} />}
        />
        <Route
          path="/terapi/terapi-musik"
          element={<TherapyDetailPage article={therapyArticles['musik-relaksasi']} references={therapyReferences} />}
        />
        <Route
          path="/terapi/relaksasi-otot-ringan"
          element={<TherapyDetailPage article={therapyArticles['relaksasi-otot-ringan']} references={therapyReferences} />}
        />
        <Route
          path="/terapi/pijat-pendamping"
          element={<TherapyDetailPage article={therapyArticles['pijat-pendamping-persalinan']} references={therapyReferences} />}
        />
        <Route path="/terapi/:slug" element={<TherapyArticleRoute />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/sumber" element={<SourcesPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/tanda-bahaya" element={<SafetyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteMenu open={menuOpen} onClose={closeMenu} onNavigate={closeMenu} triggerRef={menuTriggerRef} />
    </>
  )
}
