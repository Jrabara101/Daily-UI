import SVGLogo from './SVGLogo'
import Wordmark from './Wordmark'

/**
 * Contextual Mockups - Show logo in real-world contexts
 */
export default function Mockups({
  logoParams,
  wordmarkParams,
  backgroundColor,
}) {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Contextual Mockups
      </h3>

      {/* Mobile App Header Mockup */}
      <div className="bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div 
          className="px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: backgroundColor || '#ffffff' }}
        >
          <SVGLogo {...logoParams} size={32} />
          <Wordmark {...wordmarkParams} fontSize={18} />
        </div>
      </div>

      {/* Browser Tab Mockup */}
      <div className="bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] overflow-hidden">
        <div className="bg-gray-200 px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="flex-1 bg-white rounded px-2 py-1 text-xs text-gray-600">
            https://yoursite.com
          </div>
        </div>
        <div 
          className="px-4 py-4 flex items-center justify-center gap-3"
          style={{ backgroundColor: backgroundColor || '#ffffff' }}
        >
          <SVGLogo {...logoParams} size={40} />
          <Wordmark {...wordmarkParams} fontSize={20} />
        </div>
      </div>

      {/* Business Card Mockup */}
      <div 
        className="rounded-lg border-2 border-gray-300 overflow-hidden shadow-lg"
        style={{ 
          backgroundColor: backgroundColor || '#ffffff',
          aspectRatio: '16/9',
          maxWidth: '400px',
        }}
      >
        <div className="h-full p-6 flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <SVGLogo {...logoParams} size={60} />
            <Wordmark {...wordmarkParams} fontSize={24} />
          </div>
          <div className="text-sm" style={{ color: wordmarkParams.color || '#1a1a1a' }}>
            <div className="font-semibold">John Doe</div>
            <div>CEO & Founder</div>
            <div className="mt-2">hello@company.com</div>
            <div>+1 (555) 123-4567</div>
          </div>
        </div>
      </div>
    </div>
  );
}




