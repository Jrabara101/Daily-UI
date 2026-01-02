import { useState, useMemo } from 'react'
import ControlPanel from './components/ControlPanel'
import LivePreview from './components/LivePreview'
import Mockups from './components/Mockups'
import ThemeSwitcher from './components/ThemeSwitcher'
import ExportPanel from './components/ExportPanel'
import { getContrastRatio, getContrastWarning } from './utils/colorUtils'

function App() {
  const [logoParams, setLogoParams] = useState({
    color1: '#06b6d4',
    color2: '#ec4899',
    color3: '#10b981',
    strokeWeight: 2,
    spacing: 10,
  })

  const [wordmarkParams, setWordmarkParams] = useState({
    text: 'BRAND NAME',
    fontSize: 32,
    fontWeight: 700,
    color: '#1a1a1a',
    kerning: 0,
  })

  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [showMockups, setShowMockups] = useState(false)

  // Calculate contrast warning for wordmark against background
  const contrastWarning = useMemo(() => {
    const ratio = getContrastRatio(wordmarkParams.color, backgroundColor)
    const warning = getContrastWarning(wordmarkParams.color, backgroundColor, wordmarkParams.fontSize >= 24)
    return {
      ratio,
      level: warning,
    }
  }, [wordmarkParams.color, backgroundColor, wordmarkParams.fontSize])

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Brand Alchemist</h1>
          <p className="text-sm text-[var(--text-secondary)]">Logo Design System Builder</p>
        </div>
        <ThemeSwitcher />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Control Panel */}
        <ControlPanel
          logoParams={logoParams}
          wordmarkParams={wordmarkParams}
          onLogoChange={setLogoParams}
          onWordmarkChange={setWordmarkParams}
          contrastWarning={contrastWarning}
        />

        {/* Live Preview Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Background Color Control */}
          <div className="px-6 py-3 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Background Color:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-8 rounded cursor-pointer border border-[var(--border-color)]"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-24 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm"
              />
            </div>
            <button
              onClick={() => setShowMockups(!showMockups)}
              className="ml-auto px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded text-sm font-medium transition-colors"
            >
              {showMockups ? 'Hide' : 'Show'} Mockups
            </button>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-y-auto">
            {showMockups ? (
              <Mockups
                logoParams={logoParams}
                wordmarkParams={wordmarkParams}
                backgroundColor={backgroundColor}
              />
            ) : (
              <LivePreview
                logoParams={logoParams}
                wordmarkParams={wordmarkParams}
                backgroundColor={backgroundColor}
              />
            )}
          </div>
        </div>

        {/* Export Panel */}
        <ExportPanel logoParams={logoParams} wordmarkParams={wordmarkParams} />
      </div>
    </div>
  )
}

export default App

