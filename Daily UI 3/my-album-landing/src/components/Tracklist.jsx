import React from 'react';
import './Tracklist.css';
import { Play, Pause, MoreHorizontal } from 'lucide-react';

const Tracklist = ({ tracks, currentTrackId, isPlaying, onPlayTrack, onTogglePlay }) => {
  const handleTrackClick = (id) => {
    if (currentTrackId === id) {
      onTogglePlay();
    } else {
      onPlayTrack(id);
    }
  };

  return (
    <div className="component-container glass tracklist-container">
      <h2 className="section-title">TRACKLIST</h2>
      
      <div className="tracks-wrapper">
        {tracks && tracks.map((track) => {
          const isActive = currentTrackId === track.id;
          
          return (
            <div 
              key={track.id} 
              className={`track-item ${isActive ? 'active' : ''}`}
              onClick={() => handleTrackClick(track.id)}
            >
              <div className="track-number">
                {isActive ? (
                  isPlaying ? (
                    <div className="playing-eq">
                      <span className="eq-bar"></span>
                      <span className="eq-bar"></span>
                      <span className="eq-bar"></span>
                    </div>
                  ) : (
                    <Pause size={16} className="text-accent" />
                  )
                ) : (
                  <span>{track.id.toString().padStart(2, '0')}</span>
                )}
              </div>
              
              <div className="track-info">
                <span className="track-title">{track.title}</span>
              </div>
              
              <div className="track-actions">
                <span className="track-duration">{track.duration}</span>
                <button className="track-more-btn">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {(!tracks || tracks.length === 0) && (
          <div className="text-secondary" style={{padding: '1rem', textAlign: 'center'}}>Loading tracks from backend...</div>
        )}
      </div>
    </div>
  );
};

export default Tracklist;
