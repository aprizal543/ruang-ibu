import { Route, Routes } from 'react-router-dom'
import TherapyDetailPage from './components/therapy/TherapyDetailPage'
import { therapyArticles } from './content/therapyArticles'
import { therapyReferences } from './content/therapyReferences'
import HomePage from './pages/HomePage'
import TherapyPage from './pages/TherapyPage'
import RelaxationPage from './pages/RelaxationPage'
import PregnancyGuidePage from './pages/PregnancyGuidePage'
import BirthGuidePage from './pages/BirthGuidePage'
import EvaluationPage from './pages/EvaluationPage'

function NotBuiltYet() {
  return (
    <main className="not-built" aria-labelledby="not-built-title">
      <h1 id="not-built-title">Halaman ini sedang disiapkan</h1>
      <p>Untuk saat ini, silakan kembali ke Beranda.</p>
      <a href="/">Kembali ke Beranda</a>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/terapi" element={<TherapyPage />} />
      <Route path="/relaksasi" element={<RelaxationPage />} />
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
      <Route path="*" element={<NotBuiltYet />} />
    </Routes>
  )
}
