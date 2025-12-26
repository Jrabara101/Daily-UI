import { useState, useEffect } from 'react'
import { useSEO } from './hooks/useSEO'
import pressData from './data/pressData.json'
import PressKit from './components/PressKit'
import BrandAssets from './components/BrandAssets'
import PressFeed from './components/PressFeed'
import Leadership from './components/Leadership'
import ContactCTA from './components/ContactCTA'
import SectionHeader from './components/SectionHeader'

function App() {
  const [pressReleases] = useState(pressData.pressReleases)
  const [brandAssets] = useState(pressData.brandAssets)
  const [leadership] = useState(pressData.leadership)

  // SEO hook
  useSEO({
    title: `${pressData.company.name} Newsroom - Press & Media`,
    description: `${pressData.company.name} corporate newsroom featuring press releases, media kit, brand assets, and executive leadership information.`,
    keywords: "press releases, media kit, brand assets, corporate news, executive leadership, media inquiries",
    ogTitle: `${pressData.company.name} Newsroom`,
    ogDescription: "Access press releases, download brand assets, and connect with our media team.",
    canonical: "https://techcorp.com/newsroom"
  })

  // Add structured data
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": pressData.company.name,
      "url": "https://techcorp.com/newsroom",
      "description": pressData.company.tagline
    }
    
    let script = document.querySelector('script[type="application/ld+json"][data-seo]')
    if (!script) {
      script = document.createElement('script')
      script.setAttribute('type', 'application/ld+json')
      script.setAttribute('data-seo', 'true')
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(structuredData)
  }, [])

  return (
    <>
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {pressData.company.name}
                </h1>
                <p className="text-sm text-gray-600">{pressData.company.tagline}</p>
              </div>
              <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
                <a href="#press-releases" className="text-gray-700 hover:text-gray-900 transition-colors focus-visible-ring rounded">
                  Press Releases
                </a>
                <a href="#brand-assets" className="text-gray-700 hover:text-gray-900 transition-colors focus-visible-ring rounded">
                  Brand Assets
                </a>
                <a href="#leadership" className="text-gray-700 hover:text-gray-900 transition-colors focus-visible-ring rounded">
                  Leadership
                </a>
                <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors focus-visible-ring rounded">
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Press Kit Section */}
          <PressKit mediaKit={pressData.mediaKit} />

          {/* Brand Assets Section */}
          <section id="brand-assets" className="mb-20 scroll-mt-20">
            <SectionHeader 
              title="Brand Assets" 
              subtitle="Download logos, screenshots, and executive photos"
            />
            <BrandAssets assets={brandAssets} />
          </section>

          {/* Press Releases Section */}
          <section id="press-releases" className="mb-20 scroll-mt-20">
            <SectionHeader 
              title="Press Releases" 
              subtitle="Latest news and announcements"
            />
            <PressFeed releases={pressReleases} />
          </section>

          {/* Leadership Section */}
          <section id="leadership" className="mb-20 scroll-mt-20">
            <SectionHeader 
              title="Leadership Team" 
              subtitle="Meet our executive leadership"
            />
            <Leadership executives={leadership} />
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-20 scroll-mt-20">
            <ContactCTA contact={pressData.contact} />
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-8 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-600 text-sm">
              © {new Date().getFullYear()} {pressData.company.name}. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App

