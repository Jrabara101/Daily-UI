import SVGLogo from './SVGLogo'
import Wordmark from './Wordmark'

/**
 * Live Preview Workspace - Central canvas with real-time updates
 */
export default function LivePreview({
  logoParams,
  wordmarkParams,
  backgroundColor = '#ffffff',
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8" style={{ backgroundColor }}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-8">
          <SVGLogo {...logoParams} size={120} />
          <Wordmark {...wordmarkParams} />
        </div>
      </div>
    </div>
  );
}













