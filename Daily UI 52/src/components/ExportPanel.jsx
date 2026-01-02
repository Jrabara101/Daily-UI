import { Download, FileImage, FileCode } from 'lucide-react'
import { useState, useRef } from 'react'
import { exportSVG, exportPNG } from '../utils/exportUtils'
import SVGLogo from './SVGLogo'

export default function ExportPanel({ logoParams, wordmarkParams }) {
  const [exportFormat, setExportFormat] = useState('png')
  const [isExporting, setIsExporting] = useState(false)
  const svgRef = useRef(null)

  const handleExport = async () => {
    if (!svgRef.current) return

    setIsExporting(true)
    try {
      const svgElement = svgRef.current.querySelector('svg')
      if (!svgElement) return

      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true)

      if (exportFormat === 'svg') {
        exportSVG(clonedSvg, 'logo.svg')
      } else {
        // Export individual PNG sizes
        const sizes = [512, 256, 128, 64]
        for (const size of sizes) {
          await exportPNG(svgElement, size, size, `logo-${size}x${size}.png`, 2)
          // Small delay to prevent browser blocking multiple downloads
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
        Export Logo
      </h3>

      {/* Hidden SVG for export */}
      <div ref={svgRef} className="hidden">
        <SVGLogo {...logoParams} size={512} viewBoxSize={512} />
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setExportFormat('svg')}
          className={`flex-1 px-3 py-2 rounded border transition-colors ${
            exportFormat === 'svg'
              ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
              : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--accent)]'
          }`}
        >
          <FileCode className="w-4 h-4 inline mr-2" />
          SVG
        </button>
        <button
          onClick={() => setExportFormat('png')}
          className={`flex-1 px-3 py-2 rounded border transition-colors ${
            exportFormat === 'png'
              ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
              : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--accent)]'
          }`}
        >
          <FileImage className="w-4 h-4 inline mr-2" />
          PNG
        </button>
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
      </button>

      {exportFormat === 'png' && (
        <p className="text-xs text-[var(--text-secondary)] mt-2 text-center">
          Exports multiple sizes: 512×512, 256×256, 128×128, 64×64
        </p>
      )}
    </div>
  )
}

