import { Download } from 'lucide-react'

function PressKit({ mediaKit }) {
  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    // For demo purposes, we'll show a message
    alert(`Downloading ${mediaKit.downloadUrl}...\n\nIn production, this would download the media kit ZIP file.`)
  }

  return (
    <section className="mb-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Media Kit
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Complete brand assets package for journalists and media professionals
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Last updated: {new Date(mediaKit.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>Size: {mediaKit.size}</span>
          </div>
          <ul className="mt-4 flex flex-wrap gap-3">
            {mediaKit.includes.map((item, index) => (
              <li 
                key={index}
                className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleDownload}
            className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus-visible-ring"
            aria-label="Download media kit"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce" aria-hidden="true" />
            Download Media Kit
          </button>
        </div>
      </div>
    </section>
  )
}

export default PressKit

