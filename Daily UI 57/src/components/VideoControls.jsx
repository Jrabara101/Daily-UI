import { useState } from 'react';

/**
 * Video Player Controls
 */
export const VideoControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  currentQuality,
  isPictureInPicture,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onToggleTheaterMode,
  onTogglePictureInPicture,
  onToggleFullscreen,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlaybackRateMenu, setShowPlaybackRateMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

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

  return (
    <div className="video-controls">
      <div className="controls-top">
        {/* Quality indicator */}
        {currentQuality !== null && (
          <div className="quality-indicator">
            {currentQuality === 0 ? 'Auto' : `${currentQuality}p`}
          </div>
        )}
      </div>

      <div className="controls-bottom">
        <div className="controls-left">
          <button
            className="control-btn"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span className="time-separator">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div
            className="volume-control"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              className="control-btn"
              onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
              aria-label={volume > 0 ? 'Mute' : 'Unmute'}
            >
              {volume === 0 ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : volume < 0.5 ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.83 16h-1.75l-1.5-1.5h5.92v-1h-5.92l1.5-1.5h1.75c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zM3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            {showVolumeSlider && (
              <div className="volume-slider-container">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="volume-slider"
                  orient="vertical"
                />
              </div>
            )}
          </div>
        </div>

        <div className="controls-right">
          <div
            className="playback-rate-control"
            onMouseEnter={() => setShowPlaybackRateMenu(true)}
            onMouseLeave={() => setShowPlaybackRateMenu(false)}
          >
            <button className="control-btn">
              {playbackRate}x
            </button>
            {showPlaybackRateMenu && (
              <div className="dropdown-menu">
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                  <button
                    key={rate}
                    className={playbackRate === rate ? 'active' : ''}
                    onClick={() => {
                      onPlaybackRateChange(rate);
                      setShowPlaybackRateMenu(false);
                    }}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {currentQuality !== null && (
            <div
              className="quality-control"
              onMouseEnter={() => setShowQualityMenu(true)}
              onMouseLeave={() => setShowQualityMenu(false)}
            >
              <button className="control-btn">
                Quality
              </button>
              {showQualityMenu && (
                <div className="dropdown-menu">
                  <button
                    className={currentQuality === 0 ? 'active' : ''}
                    onClick={() => setShowQualityMenu(false)}
                  >
                    Auto
                  </button>
                  <button
                    className={currentQuality === 360 ? 'active' : ''}
                    onClick={() => setShowQualityMenu(false)}
                  >
                    360p
                  </button>
                  <button
                    className={currentQuality === 720 ? 'active' : ''}
                    onClick={() => setShowQualityMenu(false)}
                  >
                    720p
                  </button>
                  <button
                    className={currentQuality === 1080 ? 'active' : ''}
                    onClick={() => setShowQualityMenu(false)}
                  >
                    1080p
                  </button>
                </div>
              )}
            </div>
          )}

          {document.pictureInPictureEnabled && (
            <button
              className="control-btn"
              onClick={onTogglePictureInPicture}
              aria-label="Picture in Picture"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 7h-8v6h8V7zm0-2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h8zM3 3v18h18v-2H5V3H3zm14 12h-4v-2h4v2zm0-4h-4V9h4v2z" />
              </svg>
            </button>
          )}

          <button
            className="control-btn"
            onClick={onToggleTheaterMode}
            aria-label="Theater Mode"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
            </svg>
          </button>

          <button
            className="control-btn"
            onClick={onToggleFullscreen}
            aria-label="Fullscreen"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

