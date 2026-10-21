import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

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
      <Route path="*" element={<NotBuiltYet />} />
    </Routes>
  )
}
