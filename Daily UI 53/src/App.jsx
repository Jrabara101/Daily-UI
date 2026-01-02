import { useState } from 'react'
import SidebarNavigation from './components/SidebarNavigation'
import TopNavigation from './components/TopNavigation'
import './App.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeRoute, setActiveRoute] = useState('home/live-network')

  return (
    <div className="app-container">
      <SidebarNavigation
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
      />
      <div className="main-content">
        <TopNavigation />
        <div className="content-area">
          <h1 className="page-title">
            {activeRoute.split('/').pop().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h1>
          <p className="page-description">
            Current route: {activeRoute}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

