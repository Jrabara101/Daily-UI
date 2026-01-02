import { useState, useEffect, useRef } from 'react'
import { Bell, ChevronDown, Building2, User, Settings, LogOut } from 'lucide-react'
import './TopNavigation.css'

const notifications = [
  {
    id: 1,
    message: 'Mark Edwards mentioned you in the #warehouse channel.',
    type: 'collaboration',
    time: '28m ago',
    icon: '💬'
  },
  {
    id: 2,
    message: 'SAP Data Lake connection successfully connected',
    type: 'insights',
    time: '2h ago',
    icon: '📊'
  }
]

function TopNavigation() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setNotificationsOpen(false)
        setProfileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus trap for notifications dropdown
  useEffect(() => {
    if (notificationsOpen && notificationsRef.current) {
      const firstFocusable = notificationsRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (firstFocusable) firstFocusable.focus()
    }
  }, [notificationsOpen])

  // Focus trap for profile dropdown
  useEffect(() => {
    if (profileOpen && profileRef.current) {
      const firstFocusable = profileRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (firstFocusable) firstFocusable.focus()
    }
  }, [profileOpen])

  const unreadCount = 4

  return (
    <header className="top-navigation">
      <div className="top-nav-content">
        <div className="top-nav-right">
          {/* Notifications */}
          <div ref={notificationsRef} className="dropdown-container">
            <button
              className="notification-button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen)
                setProfileOpen(false)
              }}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setNotificationsOpen(!notificationsOpen)
                  setProfileOpen(false)
                }
                if (e.key === 'ArrowDown' && !notificationsOpen) {
                  e.preventDefault()
                  setNotificationsOpen(true)
                }
              }}
            >
              <div className="notification-icon-wrapper">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </div>
              <span className="button-label">Notifications</span>
            </button>

            {notificationsOpen && (
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Notifications</h3>
                  <button className="mark-all-read">Mark all as read</button>
                </div>
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-icon">{notification.icon}</div>
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-meta">
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)} • {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="show-all-button">Show all</button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="dropdown-container">
            <button
              className="profile-button"
              onClick={() => {
                setProfileOpen(!profileOpen)
                setNotificationsOpen(false)
              }}
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setProfileOpen(!profileOpen)
                  setNotificationsOpen(false)
                }
                if (e.key === 'ArrowDown' && !profileOpen) {
                  e.preventDefault()
                  setProfileOpen(true)
                }
              }}
            >
              <div className="profile-info">
                <span className="profile-name">Robert Dorwart</span>
                <ChevronDown
                  className={`chevron-icon ${profileOpen ? 'open' : ''}`}
                  size={16}
                />
              </div>
              <div className="profile-avatar">
                {!avatarError ? (
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
                    alt="Profile"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="avatar-fallback">
                    <User size={20} />
                  </div>
                )}
              </div>
              <span className="button-label">Profile</span>
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <button className="dropdown-item">
                  <Building2 size={16} />
                  <span>My Organization</span>
                </button>
                <button className="dropdown-item">
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button className="dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item danger">
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNavigation

