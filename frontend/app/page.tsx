import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Stats from '@/components/landing/Stats'

export default function LandingPage() {
  return (
    <main style={{ background: 'var(--bg)', transition: 'background 300ms ease' }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Footer />
    </main>
  )
}
