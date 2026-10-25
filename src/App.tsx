import { useCallback, useRef, useState } from 'react'
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
