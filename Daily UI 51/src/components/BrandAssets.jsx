import { useState } from 'react'
import { X } from 'lucide-react'
import AssetDownload from './AssetDownload'

function BrandAssets({ assets }) {
  const [previewAsset, setPreviewAsset] = useState(null)

  const logos = assets.filter(a => a.type === 'logo')
  const screenshots = assets.filter(a => a.type === 'screenshot')
  const headshots = assets.filter(a => a.type === 'headshot')

  const handleClosePreview = () => {
    setPreviewAsset(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClosePreview()
    }
  }

  return (
    <>
      {/* Logos Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Logos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {logos.map((asset) => (
            <AssetDownload
              key={asset.id}
              asset={asset}
              onPreview={setPreviewAsset}
            />
          ))}
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Screenshots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screenshots.map((asset) => (
            <AssetDownload
              key={asset.id}
              asset={asset}
              onPreview={setPreviewAsset}
            />
          ))}
        </div>
      </div>

      {/* Executive Headshots Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Executive Headshots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {headshots.map((asset) => (
            <AssetDownload
              key={asset.id}
              asset={asset}
              onPreview={setPreviewAsset}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={handleClosePreview}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={handleClosePreview}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2 focus-visible-ring rounded"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 id="lightbox-title" className="text-2xl font-bold text-gray-900 mb-2">
                  {previewAsset.name}
                </h3>
                <p className="text-gray-600 mb-4">{previewAsset.description}</p>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  {previewAsset.thumbnail ? (
                    <img
                      src={previewAsset.thumbnail.replace('-thumb', '')}
                      alt={`High-resolution preview of ${previewAsset.name}`}
                      className="w-full h-full object-contain"
                      loading="eager"
                    />
                  ) : (
                    <span className="text-gray-400">
                      High-resolution preview of {previewAsset.name}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {previewAsset.formats.map((format) => {
                    const formatLower = format.toLowerCase()
                    const url = previewAsset.downloads[formatLower]
                    return (
                      <a
                        key={format}
                        href={url}
                        download
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Download {format}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BrandAssets

