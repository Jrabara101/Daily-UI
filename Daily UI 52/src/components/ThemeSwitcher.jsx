import { Moon, Sun, Contrast } from 'lucide-react'
import { useState, useEffect } from 'react'

const themes = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
  { id: 'high-contrast', name: 'High Contrast', icon: Contrast },
]

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('theme', currentTheme)
  }, [currentTheme])

  return (
    <div className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
      {themes.map((theme) => {
        const Icon = theme.icon
        return (
          <button
            key={theme.id}
            onClick={() => setCurrentTheme(theme.id)}
            className={`p-2 rounded transition-colors ${
              currentTheme === theme.id
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
            }`}
            title={theme.name}
          >
            <Icon className="w-4 h-4" />
          </button>
        )
      })}
    </div>
  )
}





