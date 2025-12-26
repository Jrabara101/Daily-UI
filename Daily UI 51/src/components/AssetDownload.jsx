import { useState } from 'react'
import { Download, Copy, Check } from 'lucide-react'

function AssetDownload({ asset, onPreview }) {
  const [copied, setCopied] = useState(false)

  const handleDownload = (format, url) => {
    // In a real app, this would trigger the actual download
    alert(`Downloading ${asset.name} (${format.toUpperCase()})...\n\nIn production, this would download: ${url}`)
  }

  const handleCopyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(window.location.origin + url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const primaryFormat = asset.formats[0]?.toLowerCase()
  const primaryUrl = asset.downloads[primaryFormat]

  return (
    <article className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Thumbnail */}
      <div 
        className="relative aspect-video bg-gray-100 cursor-pointer overflow-hidden"
        onClick={() => onPreview(asset)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onPreview(asset)
          }
        }}
        aria-label={`Preview ${asset.name}`}
      >
        {asset.thumbnail ? (
          <img
            src={asset.thumbnail}
            alt={`${asset.name} - ${asset.description}`}
            className="w-full h-full object-cover"
            loading="lazy"
            srcSet={`
              ${asset.thumbnail}?w=400 400w,
              ${asset.thumbnail}?w=800 800w,
              ${asset.thumbnail}?w=1200 1200w
            `}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">
              {asset.type === 'logo' ? 'Logo' : asset.type === 'headshot' ? 'Photo' : 'Screenshot'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
            Click to preview
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-1">{asset.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
        
        {/* Formats */}
        <div className="flex flex-wrap gap-2 mb-4">
          {asset.formats.map((format) => {
            const formatLower = format.toLowerCase()
            const url = asset.downloads[formatLower]
            return (
              <button
                key={format}
                onClick={() => handleDownload(formatLower, url)}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus-visible-ring"
                aria-label={`Download ${asset.name} as ${format}`}
              >
                {format}
              </button>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleDownload(primaryFormat, primaryUrl)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex-1 justify-center focus-visible-ring"
            aria-label={`Quick download ${asset.name}`}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Quick Download
          </button>
          <button
            onClick={() => handleCopyLink(primaryUrl)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus-visible-ring"
            aria-label="Copy download link"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

export default AssetDownload

