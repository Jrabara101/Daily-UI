import * as Icons from 'lucide-react'

export default function Icon({ name, className, size = 20, ...props }) {
  const IconComponent = Icons[name] || Icons.AlertCircle
  
  return <IconComponent className={className} size={size} {...props} />
}

