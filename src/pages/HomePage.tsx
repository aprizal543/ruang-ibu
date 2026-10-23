import { ArrowRightIcon, HeartIcon, LeafIcon, PlayIcon, UsersThreeIcon } from '@phosphor-icons/react'
import BottomTabBar from '../components/layout/BottomTabBar'
import Header from '../components/layout/Header'
import ActionPill from '../components/ui/ActionPill'
import HomeEditorialContent from '../components/home/HomeEditorialContent'
import heroImage from '../../assets/images/hero/pexels-hero-mobile.webp'

const benefits = [
  { label: 'Pilihan edukasi', Icon: LeafIcon },
  { label: 'Mudah dipahami', Icon: HeartIcon },
  { label: 'Sumber tersedia', Icon: UsersThreeIcon },
]

export default function HomePage() {
  return (
    <div className="home-shell">
      <a className="skip-link sr-only focus:not-sr-only" href="#main-content">Lewati ke konten</a>
      <Header />

      <main className="home-main" id="main-content">
        <div className="home-first-screen">
          <section className="hero" aria-labelledby="home-title">
            <img
              className="hero__photo"
              src={heroImage}
              alt="Ibu hamil duduk dengan tenang sambil memegang perutnya"
              fetchPriority="high"
            />
            <div className="hero__wash" aria-hidden="true" />

            <div className="hero__content">
              <h1 className="hero__title" id="home-title">
                <span>Untuk</span>
                <span>Perjalanan</span>
                <span>Ibu yang</span>
                <span>Lebih <em>Tenang</em></span>
              </h1>

              <p className="hero__description">
                Kenali berbagai terapi komplementer untuk mendukung kenyamanan ibu selama kehamilan trimester III dan persalinan.
              </p>

              <div className="hero__actions">
                <ActionPill href="/terapi" variant="primary" icon={<ArrowRightIcon size={19} weight="regular" />}>
                  Jelajahi Terapi
                </ActionPill>
                <ActionPill href="/relaksasi" variant="secondary" icon={<PlayIcon size={17} weight="fill" />}>
                  Dengarkan Relaksasi
                </ActionPill>
              </div>
            </div>
          </section>

          <section className="benefits" aria-label="Tentang materi Ruang Ibu">
            {benefits.map(({ label, Icon }) => (
              <div className="benefit" key={label}>
                <span className="benefit__icon" aria-hidden="true"><Icon size={25} weight="light" /></span>
                <span className="benefit__label">{label}</span>
              </div>
            ))}
          </section>
        </div>

        <HomeEditorialContent />
      </main>

      <BottomTabBar />
    </div>
  )
}
