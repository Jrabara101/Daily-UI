import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import { navigationData, appsData, footerNavData } from '../data/navigationData'
import { SmartHoverManager } from '../utils/smartHover'
import { KEYBOARD_KEYS, getNavigationDirection } from '../utils/keyboardNavigation'

export default function Sidebar({ collapsed = false }) {
  const [expandedItems, setExpandedItems] = useState(['home'])
  const [hoveredItem, setHoveredItem] = useState(null)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [focusedIndex, setFocusedIndex] = useState(null)
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 })
  
  const hoverManagerRef = useRef(new SmartHoverManager())
  const menuItemRefs = useRef({})
  const submenuRefs = useRef({})

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      hoverManagerRef.current.updateMousePosition(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      hoverManagerRef.current.cleanup()
    }
  }, [])

  const toggleExpanded = useCallback((itemId) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }, [])

  const handleMenuItemEnter = useCallback((itemId, itemRef) => {
    if (collapsed && navigationData.find((item) => item.id === itemId)?.submenu) {
      if (itemRef?.current) {
        const itemRect = itemRef.current.getBoundingClientRect()
        setSubmenuPosition({
          top: itemRect.top,
          left: itemRect.right + 8,
        })
      }
      hoverManagerRef.current.onMenuEnter(itemId, () => {
        setHoveredItem(itemId)
        setActiveSubmenu(itemId)
      })
    } else if (!collapsed) {
      if (navigationData.find((item) => item.id === itemId)?.submenu) {
        setExpandedItems((prev) =>
          prev.includes(itemId) ? prev : [...prev, itemId]
        )
      }
    }
  }, [collapsed])

  const handleMenuItemLeave = useCallback((itemId, itemRef, submenuRef) => {
    if (collapsed) {
      hoverManagerRef.current.onMenuLeave(
        itemRef?.current?.getBoundingClientRect(),
        submenuRef?.current?.getBoundingClientRect(),
        () => {
          setHoveredItem(null)
          setActiveSubmenu(null)
        }
      )
    }
  }, [collapsed])

  const handleSubmenuEnter = useCallback(() => {
    hoverManagerRef.current.onSubmenuEnter()
  }, [])

  const handleSubmenuLeave = useCallback(() => {
    hoverManagerRef.current.onSubmenuLeave(() => {
      setActiveSubmenu(null)
      setHoveredItem(null)
    })
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e, itemId, index) => {
    const direction = getNavigationDirection(e.key)
    
    if (direction === 'down' || direction === 'up') {
      e.preventDefault()
      const allItems = [
        ...navigationData,
        { id: 'apps-separator', type: 'separator' },
        ...appsData,
        { id: 'footer-separator', type: 'separator' },
        ...footerNavData,
      ]
      const currentIndex = allItems.findIndex((item) => item.id === itemId)
      let newIndex = currentIndex + (direction === 'down' ? 1 : -1)
      newIndex = Math.max(0, Math.min(newIndex, allItems.length - 1))
      setFocusedIndex(newIndex)
      menuItemRefs.current[allItems[newIndex].id]?.focus()
    } else if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.ARROW_RIGHT) {
      const item = navigationData.find((i) => i.id === itemId)
      if (item?.submenu) {
        e.preventDefault()
        toggleExpanded(itemId)
      }
    } else if (e.key === KEYBOARD_KEYS.ARROW_LEFT) {
      const item = navigationData.find((i) => i.id === itemId)
      if (item?.submenu && expandedItems.includes(itemId)) {
        e.preventDefault()
        toggleExpanded(itemId)
      }
    }
  }, [expandedItems, toggleExpanded])

  const renderSubmenu = (item) => {
    if (!item.submenu) return null

    const isActive = activeSubmenu === item.id || (!collapsed && expandedItems.includes(item.id))
    
    const submenuRef = (el) => {
      if (el) {
        submenuRefs.current[item.id] = el
      }
    }

    const submenuContent = (
      <div
        ref={submenuRef}
        className={`absolute left-full ml-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 ${
          isActive ? 'block' : 'hidden'
        } ${collapsed ? '' : 'relative left-0 ml-0 w-auto shadow-none'}`}
        style={collapsed && activeSubmenu === item.id ? submenuPosition : {}}
        onMouseEnter={handleSubmenuEnter}
        onMouseLeave={handleSubmenuLeave}
      >
        {item.submenu.map((subItem) => (
          <a
            key={subItem.id}
            href={subItem.path}
            className={`block px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
              subItem.active
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700'
            }`}
          >
            {subItem.label}
          </a>
        ))}
      </div>
    )

    if (collapsed && isActive) {
      return createPortal(
        submenuContent,
        document.body
      )
    }

    return !collapsed ? submenuContent : null
  }

  return (
    <aside
      className={`bg-white rounded-lg shadow-sm transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } h-full flex flex-col`}
    >
      {/* Logo/Company Name */}
      <div className="px-4 py-6 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon name="Sparkles" className="text-white" size={16} />
            </div>
            <span className="font-semibold text-gray-900">Company Name</span>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon name="Sparkles" className="text-white" size={16} />
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navigationData.map((item, index) => {
            const isExpanded = expandedItems.includes(item.id)
            const isHovered = hoveredItem === item.id
            const itemRef = (el) => {
              menuItemRefs.current[item.id] = el
            }

            return (
              <li key={item.id} className="relative">
                <a
                  ref={itemRef}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                    isHovered || isExpanded
                      ? 'bg-gray-50 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => handleMenuItemEnter(item.id, itemRef)}
                  onMouseLeave={() =>
                    handleMenuItemLeave(
                      item.id,
                      itemRef,
                      submenuRefs.current[item.id]
                    )
                  }
                  onFocus={() => setFocusedIndex(index)}
                  onKeyDown={(e) => handleKeyDown(e, item.id, index)}
                  tabIndex={0}
                >
                  <Icon
                    name={item.icon}
                    className={isHovered || isExpanded ? 'text-blue-600' : 'text-gray-500'}
                    size={20}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.submenu && (
                        <Icon
                          name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                          className="text-gray-400"
                          size={16}
                        />
                      )}
                    </>
                  )}
                </a>

                {/* Submenu */}
                {item.submenu && !collapsed && isExpanded && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.id}>
                        <a
                          href={subItem.path}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            subItem.active
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {subItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>

        {/* Apps Section */}
        {!collapsed && (
          <>
            <div className="px-4 py-2 mt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Apps
              </span>
            </div>
            <ul className="space-y-1 px-2">
              {appsData.map((app) => (
                <li key={app.id}>
                  <a
                    href={app.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Icon name={app.icon} className="text-gray-500" size={20} />
                    <span>{app.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/apps/add"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Plus" className="text-gray-500" size={20} />
                  <span>Add Module</span>
                </a>
              </li>
            </ul>
          </>
        )}

        {collapsed && (
          <div className="px-2 mt-4">
            <div className="flex flex-col gap-2">
              {appsData.map((app) => (
                <a
                  key={app.id}
                  href={app.path}
                  className="flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  title={app.label}
                >
                  <Icon name={app.icon} className="text-gray-500" size={20} />
                </a>
              ))}
              <a
                href="/apps/add"
                className="flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                title="Add Module"
              >
                <Icon name="Plus" className="text-gray-500" size={20} />
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Footer Navigation */}
      <div className="border-t border-gray-100 py-2">
        <ul className="space-y-1 px-2">
          {footerNavData.map((item) => (
            <li key={item.id}>
              <a
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors ${
                  collapsed ? 'justify-center' : ''
                }`}
                title={collapsed ? item.label : ''}
              >
                <Icon name={item.icon} className="text-gray-500" size={20} />
                {!collapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Render submenus as portals when collapsed */}
      {collapsed &&
        navigationData.map((item) => {
          if (!item.submenu) return null
          return (
            <div key={item.id}>
              {renderSubmenu(item)}
            </div>
          )
        })}
    </aside>
  )
}

