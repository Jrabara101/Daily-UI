import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import './MusicPlayer.css';

const MusicPlayer = ({ track, isPlaying, onTogglePlay, onNext, onPrev }) => {
  const playerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [durationSecs, setDurationSecs] = useState(0);

  const handleProgress = (state) => {
    setProgress(state.played * 100);
    setCurrentTime(formatTime(state.playedSeconds));
  };

  const handleDuration = (dur) => {
    setDurationSecs(dur);
    setDuration(formatTime(dur));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    setProgress(e.target.value);
    const fraction = parseFloat(e.target.value) / 100;
    if (playerRef.current) {
      if (typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(fraction, 'fraction');
      } else if (typeof playerRef.current.getInternalPlayer === 'function') {
        const internalPlayer = playerRef.current.getInternalPlayer();
        if (internalPlayer && typeof internalPlayer.seekTo === 'function') {
           internalPlayer.seekTo(fraction * playerRef.current.getDuration(), true);
        }
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!track) return null;

  return (
    <div className="music-player glass">
      <ReactPlayer 
        ref={playerRef}
        url={track.url}
        playing={isPlaying}
        muted={isMuted}
        style={{ display: 'none' }}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={onNext}
      />
      
      <div className="player-info">
        <div className="player-art">
          <img src="/album-cover.png" alt="Album Cover" />
        </div>
        <div className="player-track-details">
          <div className="player-title">{track.title}</div>
          <div className="player-artist">Dionela</div>
        </div>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button className="ctrl-btn" onClick={onPrev}><SkipBack size={20} /></button>
          <button className="ctrl-btn play-btn" onClick={onTogglePlay}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="play-icon-ml" />}
          </button>
          <button className="ctrl-btn" onClick={onNext}><SkipForward size={20} /></button>
        </div>
        
        <div className="progress-container">
          <span className="time-text">{currentTime}</span>
          <input 
            type="range" 
            className="progress-bar" 
            value={progress || 0} 
            onChange={handleSeek} 
            min="0" 
            max="100" 
            step="0.01"
          />
          <span className="time-text">{duration}</span>
        </div>
      </div>

      <div className="player-volume">
        <button className="ctrl-btn" onClick={toggleMute}>
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
