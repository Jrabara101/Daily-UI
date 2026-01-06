import { useState, useRef, useEffect } from 'react';

/**
 * Smart Thumbnail Scrubbing Progress Bar with Chapter Support
 */
export const ProgressBar = ({ 
  currentTime, 
  duration, 
  bufferedRanges, 
  chapters = [],
  onSeek,
  onHover,
  onLeave,
  thumbnailPreview,
  hoverTime,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const progressRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = percentage * duration;
    
    setHoverPosition(percentage * 100);
    setIsHovering(true);
    
    if (onHover) {
      onHover(time);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (onLeave) {
      onLeave();
    }
  };

  const handleClick = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = percentage * duration;
    
    if (onSeek) {
      onSeek(time);
    }
  };

  const getChapterAtTime = (time) => {
    return chapters.find(
      (chapter, index) => 
        time >= chapter.start && 
        (index === chapters.length - 1 || time < chapters[index + 1].start)
    );
  };

  const currentChapter = getChapterAtTime(currentTime);
  const hoverChapter = hoverTime ? getChapterAtTime(hoverTime) : null;

  return (
    <div className="progress-container">
      {/* Chapter segments */}
      {chapters.length > 0 && (
        <div className="chapter-segments">
          {chapters.map((chapter, index) => {
            const startPercent = (chapter.start / duration) * 100;
            const endPercent = index < chapters.length - 1
              ? (chapters[index + 1].start / duration) * 100
              : 100;
            const width = endPercent - startPercent;
            
            return (
              <div
                key={index}
                className="chapter-segment"
                style={{
                  left: `${startPercent}%`,
                  width: `${width}%`,
                }}
                title={chapter.title}
              />
            );
          })}
        </div>
      )}

      {/* Buffered ranges visualization */}
      <div className="buffered-ranges">
        {bufferedRanges.map((range, index) => {
          const startPercent = (range.start / duration) * 100;
          const endPercent = (range.end / duration) * 100;
          const width = endPercent - startPercent;
          
          return (
            <div
              key={index}
              className="buffered-range"
              style={{
                left: `${startPercent}%`,
                width: `${width}%`,
              }}
            />
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        className="progress-bar"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div
          className="progress-filled"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />

        {/* Hover preview */}
        {isHovering && (
          <div
            className="hover-preview"
            style={{ left: `${hoverPosition}%` }}
          >
            {thumbnailPreview && (
              <div className="thumbnail-preview">
                <img src={thumbnailPreview} alt="Preview" />
                <div className="thumbnail-time">
                  {formatTime(hoverTime)}
                </div>
                {hoverChapter && (
                  <div className="thumbnail-chapter">
                    {hoverChapter.title}
                  </div>
                )}
              </div>
            )}
            <div className="hover-indicator" />
          </div>
        )}

        {/* Current chapter indicator */}
        {currentChapter && (
          <div
            className="current-chapter-indicator"
            style={{ left: `${(currentChapter.start / duration) * 100}%` }}
          >
            <span>{currentChapter.title}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

