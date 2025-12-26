import { Copy, Download, Check } from 'lucide-react'
import { useState } from 'react'

function PressCard({ release }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    const url = window.location.origin + `/press-releases/${release.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    alert(`Downloading ${release.title}...\n\nIn production, this would download: ${release.downloadUrl}`)
  }

  const date = new Date(release.date)
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <article 
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 print:break-inside-avoid"
      itemScope
      itemType="https://schema.org/NewsArticle"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <time 
            dateTime={release.date}
            className="block text-2xl font-bold text-gray-900 mb-2"
            itemProp="datePublished"
          >
            {formattedDate}
          </time>
          <span 
            className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
            itemProp="articleSection"
          >
            {release.category}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleCopyLink}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus-visible-ring"
            aria-label="Copy press release link"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus-visible-ring"
            aria-label="Download press release"
            title="Download PDF"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3" itemProp="headline">
        {release.title}
      </h3>
      
      <p className="text-gray-700 mb-4 leading-relaxed" itemProp="description">
        {release.excerpt}
      </p>

      {release.tags && release.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {release.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export default PressCard

