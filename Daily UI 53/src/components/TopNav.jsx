import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import { notificationsData, profileMenuData } from '../data/navigationData'

export default function TopNav() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationPosition, setNotificationPosition] = useState({ top: 0, right: 0 })
  const [profilePosition, setProfilePosition] = useState({ top: 0, right: 0 })
  
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)
  const notificationsDropdownRef = useRef(null)
  const profileDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false)
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationsToggle = () => {
    if (!notificationsOpen && notificationsRef.current) {
      const rect = notificationsRef.current.getBoundingClientRect()
      setNotificationPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
    }
    setNotificationsOpen(!notificationsOpen)
    setProfileOpen(false)
  }

  const handleProfileToggle = () => {
    if (!profileOpen && profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect()
      setProfilePosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
    }
    setProfileOpen(!profileOpen)
    setNotificationsOpen(false)
  }

  const unreadCount = notificationsData.filter((n) => n.unread).length

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-end gap-6">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={handleNotificationsToggle}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileToggle}
              className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Profile"
            >
              <span className="hidden sm:block font-medium">Robert Dorwart</span>
              <Icon
                name={profileOpen ? 'ChevronUp' : 'ChevronDown'}
                size={16}
                className="hidden sm:block"
              />
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  RD
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Dropdown (Portal) */}
      {notificationsOpen &&
        createPortal(
          <div
            ref={notificationsDropdownRef}
            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[320px] max-w-md"
            style={{
              top: `${notificationPosition.top}px`,
              right: `${notificationPosition.right}px`,
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notificationsData.map((notification) => (
                <a
                  key={notification.id}
                  href="#"
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="mt-0.5">
                    <Icon
                      name={notification.icon}
                      className="text-gray-400"
                      size={18}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {notification.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {notification.category}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  )}
                </a>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-200">
              <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                Show all
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Profile Dropdown (Portal) */}
      {profileOpen &&
        createPortal(
          <div
            ref={profileDropdownRef}
            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[200px]"
            style={{
              top: `${profilePosition.top}px`,
              right: `${profilePosition.right}px`,
            }}
          >
            <div className="py-2">
              {profileMenuData.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name={item.icon} className="text-gray-500" size={18} />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

