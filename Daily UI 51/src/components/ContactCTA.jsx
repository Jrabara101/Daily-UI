import { Mail, Clock, Phone, MapPin } from 'lucide-react'

function ContactCTA({ contact }) {
  return (
    <section className="bg-gray-900 text-white rounded-2xl p-8 md:p-12">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-bold mb-4">
          Media Inquiries
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Get in touch with our media team for press inquiries, interviews, and media requests.
        </p>

        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Email</h3>
              <a
                href={`mailto:${contact.mediaEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors text-lg focus-visible-ring rounded"
              >
                {contact.mediaEmail}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Response Time</h3>
              <p className="text-gray-300 text-lg">{contact.responseTime}</p>
            </div>
          </div>

          {contact.phone && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Phone</h3>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-lg focus-visible-ring rounded"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}

          {contact.address && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Address</h3>
                <p className="text-gray-300 text-lg">{contact.address}</p>
              </div>
            </div>
          )}
        </div>

        <a
          href={`mailto:${contact.mediaEmail}?subject=Media Inquiry`}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus-visible-ring"
        >
          <Mail className="w-5 h-5" aria-hidden="true" />
          Send Media Inquiry
        </a>
      </div>
    </section>
  )
}

export default ContactCTA

