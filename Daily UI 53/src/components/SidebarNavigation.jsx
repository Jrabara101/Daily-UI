import { useState, useEffect, useRef } from 'react'
import {
  Home,
  Lightbulb,
  Database,
  MessageSquare,
  Settings,
  Info,
  ArrowLeft,
  Target,
  Clock,
  Grid3x3,
  Download,
  Sparkles
} from 'lucide-react'
import './SidebarNavigation.css'

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    route: 'home',
    subItems: [
      { id: 'overview', label: 'Overview', route: 'home/overview' },
      { id: 'live-network', label: 'Live Network', route: 'home/live-network' },
      { id: 'todos', label: "To-Do's", route: 'home/todos' }
    ]
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: Lightbulb,
    route: 'insights',
    subItems: [
      { id: 'analytics', label: 'Analytics', route: 'insights/analytics' },
      { id: 'reports', label: 'Reports', route: 'insights/reports' }
    ]
  },
  {
    id: 'data-lake',
    label: 'Data Lake',
    icon: Database,
    route: 'data-lake',
    subItems: [
      { id: 'connections', label: 'Connections', route: 'data-lake/connections' },
      { id: 'datasets', label: 'Datasets', route: 'data-lake/datasets' }
    ]
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    icon: MessageSquare,
    route: 'collaboration',
    subItems: [
      { id: 'channels', label: 'Channels', route: 'collaboration/channels' },
      { id: 'messages', label: 'Messages', route: 'collaboration/messages' }
    ]
  }
]

const appItems = [
  { id: 'demand-planning', label: 'Demand Planning', icon: Grid3x3, route: 'apps/demand-planning' },
  { id: 'add-module', label: 'Add Module', icon: Download, route: 'apps/add-module' }
]

function SidebarNavigation({ collapsed, onToggleCollapse, activeRoute, onRouteChange }) {
  const [expandedItems, setExpandedItems] = useState(['home'])
  const [hoveredItem, setHoveredItem] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)
  const sidebarRef = useRef(null)
  const submenuRefs = useRef({})
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const lastMousePositionRef = useRef({ x: 0, y: 0 })

  // Track mouse movement for smart hover
  useEffect(() => {
    const handleMouseMove = (e) => {
      lastMousePositionRef.current = { ...mousePositionRef.current }
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Check if mouse is moving toward submenu (triangle algorithm)
  const isMovingTowardSubmenu = (itemId) => {
    const submenuRef = submenuRefs.current[itemId]
    if (!submenuRef) return false

    const submenuRect = submenuRef.getBoundingClientRect()
    const current = mousePositionRef.current
    const last = lastMousePositionRef.current

    // Calculate direction vector
    const dx = current.x - last.x
    const dy = current.y - last.y

    // Calculate vector from current position to submenu
    const toSubmenuX = submenuRect.left - current.x
    const toSubmenuY = submenuRect.top - current.y

    // Check if moving toward submenu (dot product > 0)
    const dotProduct = dx * toSubmenuX + dy * toSubmenuY
    return dotProduct > 0
  }

  const handleItemMouseEnter = (itemId) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    setHoveredItem(itemId)
  }

  const handleItemMouseLeave = (itemId) => {
    const timeout = setTimeout(() => {
      // Check if mouse is moving toward submenu before closing
      if (!isMovingTowardSubmenu(itemId)) {
        setHoveredItem(null)
      } else {
        // Re-check after a short delay
        setTimeout(() => {
          if (!isMovingTowardSubmenu(itemId)) {
            setHoveredItem(null)
          }
        }, 100)
      }
    }, 150) // Delay before closing
    setHoverTimeout(timeout)
  }

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSubmenuMouseEnter = (itemId) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    setHoveredItem(itemId)
  }

  const handleSubmenuMouseLeave = () => {
    setHoveredItem(null)
  }

  const handleRouteClick = (route) => {
    onRouteChange(route)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setHoveredItem(null)
        setExpandedItems([])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getActiveParent = () => {
    return navigationItems.find(item =>
      item.subItems?.some(sub => sub.route === activeRoute)
    )?.id
  }

  useEffect(() => {
    const activeParent = getActiveParent()
    if (activeParent) {
      setExpandedItems(prev => 
        prev.includes(activeParent) ? prev : [...prev, activeParent]
      )
    }
  }, [activeRoute])

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
    >
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="company-name">
            <Sparkles className="company-icon" size={20} />
            <span>Company Name</span>
          </div>
        )}
        {collapsed && (
          <div className="company-icon-only">
            <Sparkles size={20} />
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedItems.includes(item.id)
          const isHovered = hoveredItem === item.id
          const isActive = item.subItems?.some(sub => sub.route === activeRoute)
          const hasSubItems = item.subItems && item.subItems.length > 0

          return (
            <div key={item.id} className="nav-item-wrapper">
              <div
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => hasSubItems && toggleExpanded(item.id)}
                onMouseEnter={() => handleItemMouseEnter(item.id)}
                onMouseLeave={() => handleItemMouseLeave(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    hasSubItems && toggleExpanded(item.id)
                  }
                  if (e.key === 'ArrowRight' && hasSubItems) {
                    e.preventDefault()
                    if (!isExpanded) toggleExpanded(item.id)
                  }
                  if (e.key === 'ArrowLeft' && hasSubItems && isExpanded) {
                    e.preventDefault()
                    toggleExpanded(item.id)
                  }
                }}
                tabIndex={0}
              >
                <Icon className="nav-icon" size={20} />
                {!collapsed && <span className="nav-label">{item.label}</span>}
                {!collapsed && hasSubItems && (
                  <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>›</span>
                )}
              </div>

              {/* Collapsed state tooltip */}
              {collapsed && isHovered && hasSubItems && (
                <div
                  ref={(el) => (submenuRefs.current[item.id] = el)}
                  className="collapsed-submenu"
                  onMouseEnter={() => handleSubmenuMouseEnter(item.id)}
                  onMouseLeave={handleSubmenuMouseLeave}
                >
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`submenu-item ${subItem.route === activeRoute ? 'active' : ''}`}
                      onClick={() => handleRouteClick(subItem.route)}
                    >
                      {subItem.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Expanded state submenu */}
              {!collapsed && isExpanded && hasSubItems && (
                <div className="submenu">
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`submenu-item ${subItem.route === activeRoute ? 'active' : ''}`}
                      onClick={() => handleRouteClick(subItem.route)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleRouteClick(subItem.route)
                        }
                      }}
                      tabIndex={0}
                    >
                      {subItem.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Apps Section */}
      <div className="sidebar-section">
        {!collapsed && <div className="section-label">Apps</div>}
        {appItems.map((app) => {
          const Icon = app.icon
          return (
            <div
              key={app.id}
              className={`nav-item ${app.route === activeRoute ? 'active' : ''}`}
              onClick={() => handleRouteClick(app.route)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleRouteClick(app.route)
                }
              }}
              tabIndex={0}
            >
              <Icon className="nav-icon" size={20} />
              {!collapsed && <span className="nav-label">{app.label}</span>}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div
          className="nav-item"
          onClick={() => handleRouteClick('settings')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleRouteClick('settings')
            }
          }}
          tabIndex={0}
        >
          <Settings className="nav-icon" size={20} />
          {!collapsed && <span className="nav-label">Settings</span>}
        </div>
        <div
          className="nav-item"
          onClick={() => handleRouteClick('info')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleRouteClick('info')
            }
          }}
          tabIndex={0}
        >
          <Info className="nav-icon" size={20} />
          {!collapsed && <span className="nav-label">Info</span>}
        </div>
        <div className="sidebar-divider"></div>
        <div
          className="nav-item"
          onClick={onToggleCollapse}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggleCollapse()
            }
          }}
          tabIndex={0}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ArrowLeft className={`nav-icon ${collapsed ? 'rotate-180' : ''}`} size={20} />
          {!collapsed && <span className="nav-label">Collapse</span>}
        </div>
      </div>
    </aside>
  )
}

export default SidebarNavigation

