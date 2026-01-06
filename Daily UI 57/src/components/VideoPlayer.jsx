import { useEffect, useRef, useState } from 'react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { createGestureHandler } from '../utils/gestures';
import { createFLIPAnimation, getBoundingRect } from '../utils/flipAnimation';
import { ProgressBar } from './ProgressBar';
import { VideoControls } from './VideoControls';
import './VideoPlayer.css';

/**
 * Main Video Player Component
 * Integrates all features: gestures, theater mode, chapters, etc.
 */
export const VideoPlayer = ({ 
  src, 
  isHLS = false, 
  chapters = [],
  poster,
}) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const backdropRef = useRef(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const {
    videoRef,
    state,
    currentState,
    send,
    thumbnailPreview,
    hoverTime,
    handleProgressHover,
    handleProgressLeave,
  } = useVideoPlayer(src, isHLS);

  // Gesture handlers
  const handleDoubleTapRight = () => {
    if (videoRef.current) {
      const newTime = Math.min(
        videoRef.current.currentTime + 10,
        videoRef.current.duration
      );
      send({ type: 'SEEK', time: newTime });
      
      // Show gesture feedback
      const feedback = document.getElementById('gesture-feedback');
      if (feedback) {
        feedback.textContent = '+10s';
        feedback.classList.add('show');
        setTimeout(() => {
          feedback.classList.remove('show');
        }, 500);
      }
    }
  };

  const handleSwipeVertical = (delta) => {
    const newVolume = Math.max(0, Math.min(1, state.volume + delta));
    send({ type: 'SET_VOLUME', volume: newVolume });
    
    // Show gesture feedback
    const feedback = document.getElementById('gesture-feedback');
    if (feedback) {
      const volumePercent = Math.round(newVolume * 100);
      feedback.textContent = `🔊 ${volumePercent}%`;
      feedback.classList.add('show');
      setTimeout(() => {
        feedback.classList.remove('show');
      }, 500);
    }
  };

  const handlePinchZoom = (zoomIn) => {
    if (videoRef.current) {
      if (zoomIn) {
        videoRef.current.style.objectFit = 'cover';
      } else {
        videoRef.current.style.objectFit = 'contain';
      }
      
      // Show gesture feedback
      const feedback = document.getElementById('gesture-feedback');
      if (feedback) {
        feedback.textContent = zoomIn ? '🔍 Fill' : '🔍 Fit';
        feedback.classList.add('show');
        setTimeout(() => {
          feedback.classList.remove('show');
        }, 500);
      }
    }
  };

  const gestures = createGestureHandler({
    onDoubleTapRight: handleDoubleTapRight,
    onSwipeVertical: handleSwipeVertical,
    onPinchZoom: handlePinchZoom,
  });

  // Theater mode with FLIP animation
  const handleTheaterMode = async () => {
    if (!playerRef.current || !containerRef.current) return;

    const fromRect = getBoundingRect(playerRef.current);
    setIsTheaterMode(!isTheaterMode);
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const toRect = getBoundingRect(playerRef.current);
    
    if (fromRect && toRect) {
      await createFLIPAnimation(playerRef.current, fromRect, toRect);
    }

    // Toggle backdrop
    if (backdropRef.current) {
      backdropRef.current.style.opacity = !isTheaterMode ? '1' : '0';
    }
  };

  // Fullscreen
  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      if (currentState === 'playing') {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      } else {
        setShowControls(true);
      }
    };

    resetControlsTimeout();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [currentState]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    if (currentState === 'playing' || currentState === 'buffering') {
      send({ type: 'PAUSE' });
    } else {
      send({ type: 'PLAY' });
    }
  };

  const handleSeek = (time) => {
    send({ type: 'SEEK', time });
  };

  const handleVolumeChange = (volume) => {
    send({ type: 'SET_VOLUME', volume });
  };

  const handlePlaybackRateChange = (rate) => {
    send({ type: 'SET_PLAYBACK_RATE', rate });
  };

  const handleTogglePictureInPicture = () => {
    send({ type: 'TOGGLE_PICTURE_IN_PICTURE' });
  };

  return (
    <div
      ref={containerRef}
      className={`video-player-container ${isTheaterMode ? 'theater-mode' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        if (currentState === 'playing') {
          controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
          }, 3000);
        }
      }}
      onMouseLeave={() => {
        if (currentState === 'playing') {
          setShowControls(false);
        }
      }}
    >
      {/* Backdrop for theater mode */}
      <div
        ref={backdropRef}
        className="video-backdrop"
        style={{ opacity: isTheaterMode ? 1 : 0 }}
      />

      <div
        ref={playerRef}
        className="video-player"
        onTouchStart={gestures.onTouchStart}
        onTouchMove={gestures.onTouchMove}
      >
        <video
          ref={videoRef}
          className="video-element"
          poster={poster}
          playsInline
        />

        {/* Loading state */}
        {currentState === 'loading' && (
          <div className="loading-overlay">
            <div className="spinner" />
            <p>Loading video...</p>
          </div>
        )}

        {/* Error state */}
        {currentState === 'error' && (
          <div className="error-overlay">
            <p>Error: {state.error || 'Failed to load video'}</p>
            <button onClick={() => send({ type: 'LOAD_VIDEO', src, isHLS })}>
              Retry
            </button>
          </div>
        )}

        {/* Controls overlay */}
        <div className={`controls-overlay ${showControls ? 'visible' : ''}`}>
          <VideoControls
            isPlaying={currentState === 'playing' || currentState === 'buffering'}
            currentTime={state.currentTime}
            duration={state.duration}
            volume={state.volume}
            playbackRate={state.playbackRate}
            currentQuality={state.currentQuality}
            isPictureInPicture={state.isPictureInPicture}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onPlaybackRateChange={handlePlaybackRateChange}
            onToggleTheaterMode={handleTheaterMode}
            onTogglePictureInPicture={handleTogglePictureInPicture}
            onToggleFullscreen={handleFullscreen}
          />

          <ProgressBar
            currentTime={state.currentTime}
            duration={state.duration}
            bufferedRanges={state.bufferedRanges}
            chapters={chapters}
            onSeek={handleSeek}
            onHover={handleProgressHover}
            onLeave={handleProgressLeave}
            thumbnailPreview={thumbnailPreview}
            hoverTime={hoverTime}
          />
        </div>

        {/* Gesture feedback */}
        <div className="gesture-feedback" id="gesture-feedback" />
      </div>
    </div>
  );
};
