import { useState } from 'react'
import { Settings, Palette, Type, AlertTriangle, CheckCircle } from 'lucide-react'

export default function ControlPanel({
  logoParams,
  wordmarkParams,
  onLogoChange,
  onWordmarkChange,
  contrastWarning,
}) {
  const [activeTab, setActiveTab] = useState('logo');

  return (
    <div className="w-80 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border-color)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Design Controls
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'logo'
                ? 'bg-[var(--accent)] text-white'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
            }`}
          >
            <Palette className="w-4 h-4 inline mr-1" />
            Logo
          </button>
          <button
            onClick={() => setActiveTab('wordmark')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'wordmark'
                ? 'bg-[var(--accent)] text-white'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
            }`}
          >
            <Type className="w-4 h-4 inline mr-1" />
            Wordmark
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'logo' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Color 1
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={logoParams.color1}
                  onChange={(e) => onLogoChange({ ...logoParams, color1: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border border-[var(--border-color)]"
                />
                <input
                  type="text"
                  value={logoParams.color1}
                  onChange={(e) => onLogoChange({ ...logoParams, color1: e.target.value })}
                  className="flex-1 px-3 py-2 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Color 2
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={logoParams.color2}
                  onChange={(e) => onLogoChange({ ...logoParams, color2: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border border-[var(--border-color)]"
                />
                <input
                  type="text"
                  value={logoParams.color2}
                  onChange={(e) => onLogoChange({ ...logoParams, color2: e.target.value })}
                  className="flex-1 px-3 py-2 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Color 3
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={logoParams.color3}
                  onChange={(e) => onLogoChange({ ...logoParams, color3: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border border-[var(--border-color)]"
                />
                <input
                  type="text"
                  value={logoParams.color3}
                  onChange={(e) => onLogoChange({ ...logoParams, color3: e.target.value })}
                  className="flex-1 px-3 py-2 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Stroke Weight: {logoParams.strokeWeight}px
              </label>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={logoParams.strokeWeight}
                onChange={(e) => onLogoChange({ ...logoParams, strokeWeight: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Spacing: {logoParams.spacing}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={logoParams.spacing}
                onChange={(e) => onLogoChange({ ...logoParams, spacing: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {activeTab === 'wordmark' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={wordmarkParams.text}
                onChange={(e) => onWordmarkChange({ ...wordmarkParams, text: e.target.value })}
                className="w-full px-3 py-2 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Font Size: {wordmarkParams.fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                step="1"
                value={wordmarkParams.fontSize}
                onChange={(e) => onWordmarkChange({ ...wordmarkParams, fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Kerning: {wordmarkParams.kerning.toFixed(2)}
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={wordmarkParams.kerning}
                onChange={(e) => onWordmarkChange({ ...wordmarkParams, kerning: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                Negative = tighter, Positive = looser
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Wordmark Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={wordmarkParams.color}
                  onChange={(e) => onWordmarkChange({ ...wordmarkParams, color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border border-[var(--border-color)]"
                />
                <input
                  type="text"
                  value={wordmarkParams.color}
                  onChange={(e) => onWordmarkChange({ ...wordmarkParams, color: e.target.value })}
                  className="flex-1 px-3 py-2 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contrast Warning Section */}
      {contrastWarning && contrastWarning.level !== 'pass' && (
        <div className={`p-4 border-t border-[var(--border-color)] ${
          contrastWarning.level === 'fail' ? 'bg-[var(--error-bg)]' : 'bg-[var(--warning-bg)]'
        }`}>
          <div className="flex items-start gap-2">
            {contrastWarning.level === 'fail' ? (
              <AlertTriangle className="w-5 h-5 text-[var(--error-text)] flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-[var(--warning-text)] flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className={`text-sm font-medium ${
                contrastWarning.level === 'fail' ? 'text-[var(--error-text)]' : 'text-[var(--warning-text)]'
              }`}>
                Accessibility Warning
              </div>
              <div className={`text-xs mt-1 ${
                contrastWarning.level === 'fail' ? 'text-[var(--error-text)]' : 'text-[var(--warning-text)]'
              }`}>
                Contrast ratio: {contrastWarning.ratio.toFixed(2)}:1
                {contrastWarning.level === 'fail' && ' (Below WCAG AA minimum)'}
                {contrastWarning.level === 'aa' && ' (Meets AA, but not AAA)'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}












