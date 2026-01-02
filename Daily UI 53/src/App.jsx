import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import CommandPalette from './components/CommandPalette'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Handle Cmd+K / Ctrl+K to open command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen])

  const handleNavigate = (path) => {
    console.log('Navigate to:', path)
    // In a real app, you would use a router here
    // router.push(path)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <TopNav />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {/* Demo Content */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Live Network Dashboard
                </h1>
                <p className="text-gray-600">
                  Monitor and manage your network infrastructure in real-time
                </p>
              </div>

              {/* Control Panel */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Navigation Controls
                  </h2>
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Keyboard Shortcuts
                    </h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>
                        <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">
                          Cmd/Ctrl + K
                        </kbd>{' '}
                        - Open Command Palette
                      </li>
                      <li>
                        <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">
                          ↑↓
                        </kbd>{' '}
                        - Navigate menu items
                      </li>
                      <li>
                        <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">
                          →
                        </kbd>{' '}
                        - Expand submenu
                      </li>
                      <li>
                        <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">
                          ←
                        </kbd>{' '}
                        - Collapse submenu
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Features
                    </h3>
                    <ul className="space-y-1 text-sm text-green-800 list-disc list-inside">
                      <li>Smart hover detection (triangle algorithm)</li>
                      <li>Full keyboard navigation support</li>
                      <li>React Portal-based dropdowns</li>
                      <li>Command Palette with fuzzy search</li>
                      <li>Collapsible sidebar navigation</li>
                      <li>Content-rich submenus</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Demo Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Active Connections', value: '1,234', change: '+12%' },
                  { label: 'Data Processed', value: '45.2 TB', change: '+8%' },
                  { label: 'Response Time', value: '24ms', change: '-5%' },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-green-600">{stat.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  )
}

export default App

