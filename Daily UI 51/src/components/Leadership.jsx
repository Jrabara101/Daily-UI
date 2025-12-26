import { Mail, Linkedin } from 'lucide-react'

function Leadership({ executives }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {executives.map((executive) => (
        <article
          key={executive.id}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
          {/* Photo */}
          <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
            {executive.photo ? (
              <img
                src={executive.photo}
                alt={`${executive.name}, ${executive.title}`}
                className="w-full h-full object-cover"
                loading="lazy"
                srcSet={`
                  ${executive.photo}?w=300 300w,
                  ${executive.photo}?w=600 600w
                `}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-400 text-sm font-medium">
                  {executive.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {executive.name}
            </h3>
            <p className="text-gray-600 font-medium mb-4">
              {executive.title}
            </p>
            <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-4">
              {executive.bio}
            </p>

            {/* Contact Links */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <a
                href={`mailto:${executive.email}`}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors focus-visible-ring rounded"
                aria-label={`Email ${executive.name}`}
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Email</span>
              </a>
              {executive.linkedin && (
                <a
                  href={`https://${executive.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors focus-visible-ring rounded"
                  aria-label={`${executive.name} on LinkedIn`}
                >
                  <Linkedin className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default Leadership

