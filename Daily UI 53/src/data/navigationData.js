/**
 * Navigation structure matching the design
 */

export const navigationData = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    path: '/',
    submenu: [
      { id: 'overview', label: 'Overview', path: '/overview' },
      { id: 'live-network', label: 'Live Network', path: '/live-network', active: true },
      { id: 'todos', label: "To-Do's", path: '/todos' },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: 'Lightbulb',
    path: '/insights',
    submenu: [
      { id: 'analytics', label: 'Analytics Dashboard', path: '/insights/analytics' },
      { id: 'reports', label: 'Reports', path: '/insights/reports' },
      { id: 'trends', label: 'Trends', path: '/insights/trends' },
    ],
  },
  {
    id: 'data-lake',
    label: 'Data Lake',
    icon: 'Database',
    path: '/data-lake',
    submenu: [
      { id: 'connections', label: 'Connections', path: '/data-lake/connections' },
      { id: 'datasets', label: 'Datasets', path: '/data-lake/datasets' },
      { id: 'pipelines', label: 'Pipelines', path: '/data-lake/pipelines' },
    ],
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    icon: 'MessageSquare',
    path: '/collaboration',
    submenu: [
      { id: 'channels', label: 'Channels', path: '/collaboration/channels' },
      { id: 'direct-messages', label: 'Direct Messages', path: '/collaboration/dm' },
      { id: 'meetings', label: 'Meetings', path: '/collaboration/meetings' },
    ],
  },
]

export const appsData = [
  {
    id: 'demand-planning',
    label: 'Demand Planning',
    icon: 'BarChart3',
    path: '/apps/demand-planning',
  },
]

export const footerNavData = [
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
  },
  {
    id: 'info',
    label: 'Info',
    icon: 'Info',
    path: '/info',
  },
  {
    id: 'logout',
    label: 'Log Out',
    icon: 'ArrowRight',
    path: '/logout',
  },
]

export const notificationsData = [
  {
    id: 1,
    title: 'Mark Edwards mentioned you in the #warehouse channel.',
    category: 'Collaboration',
    time: '28m ago',
    icon: 'MessageSquare',
    unread: true,
  },
  {
    id: 2,
    title: 'SAP Data Lake connection successfully connected',
    category: 'Insights',
    time: '2h ago',
    icon: 'Database',
    unread: true,
  },
  {
    id: 3,
    title: 'New report available: Q4 Sales Summary',
    category: 'Insights',
    time: '5h ago',
    icon: 'FileText',
    unread: true,
  },
  {
    id: 4,
    title: 'Team meeting scheduled for tomorrow',
    category: 'Collaboration',
    time: '1d ago',
    icon: 'Calendar',
    unread: true,
  },
]

export const profileMenuData = [
  {
    id: 'organization',
    label: 'My Organization',
    icon: 'Building2',
    path: '/organization',
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: 'User',
    path: '/profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
  },
  {
    id: 'logout',
    label: 'Log Out',
    icon: 'LogOut',
    path: '/logout',
  },
]

// Flatten all navigation items for command palette search
export function getAllNavigationItems() {
  const items = []
  
  navigationData.forEach((item) => {
    items.push({
      id: item.id,
      label: item.label,
      path: item.path,
      category: 'Navigation',
      icon: item.icon,
    })
    
    if (item.submenu) {
      item.submenu.forEach((subItem) => {
        items.push({
          id: subItem.id,
          label: subItem.label,
          path: subItem.path,
          category: item.label,
          icon: item.icon,
        })
      })
    }
  })
  
  appsData.forEach((item) => {
    items.push({
      id: item.id,
      label: item.label,
      path: item.path,
      category: 'Apps',
      icon: item.icon,
    })
  })
  
  footerNavData.forEach((item) => {
    items.push({
      id: item.id,
      label: item.label,
      path: item.path,
      category: 'Settings',
      icon: item.icon,
    })
  })
  
  return items
}

