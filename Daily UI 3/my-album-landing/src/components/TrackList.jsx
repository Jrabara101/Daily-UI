// src/components/TrackList.jsx
import React, { useState } from 'react';
import './css/TrackList.css';

export default function TrackList() {
  const [playingTrack, setPlayingTrack] = useState(null);

  const tracks = [
    { 
      id: 1,
      title: "Midnight Skies", 
      duration: "3:45",
      img: "/assets/track1.jpg", 
      audio: "/assets/track1.mp3" 
    },
    { 
      id: 2,
      title: "Neon Dreams", 
      duration: "4:12",
      img: "/assets/track2.jpg", 
      audio: "/assets/track2.mp3" 
    },
    { 
      id: 3,
      title: "City Lights", 
      duration: "3:58",
      img: "/assets/track3.jpg", 
      audio: "/assets/track3.mp3" 
    },
    { 
      id: 4,
      title: "Silent Echoes", 
      duration: "5:20",
      img: "/assets/track4.jpg", 
      audio: "/assets/track4.mp3" 
    },
    { 
      id: 5,
      title: "Starlit Horizon", 
      duration: "4:05",
      img: "/assets/track5.jpg", 
      audio: "/assets/track5.mp3" 
    },
    { 
      id: 6,
      title: "Velvet Rain", 
      duration: "3:32",
      img: "/assets/track6.jpg", 
      audio: "/assets/track6.mp3" 
    }
  ];

  const handlePlay = (trackId) => {
    setPlayingTrack(trackId);
  };

  return (
    <section className="tracklist-section">
      <div className="container">
        <h2 className="section-title">Album Tracks</h2>
        <p className="section-subtitle">12 tracks of pure musical journey</p>
        
        <div className="tracks-grid">
          {tracks.map((track) => (
            <div 
              key={track.id} 
              className={`track-card ${playingTrack === track.id ? 'playing' : ''}`}
            >
              <div className="track-image-wrapper">
                <img src={track.img} alt={track.title} className="track-image" />
                <div className="track-overlay">
                  <button 
                    className="play-button"
                    onClick={() => handlePlay(track.id)}
                  >
                    <span className="play-icon">▶</span>
                  </button>
                </div>
              </div>
              
              <div className="track-info">
                <h3 className="track-title">{track.title}</h3>
                <span className="track-duration">{track.duration}</span>
              </div>
              
              <audio 
                id={`audio-${track.id}`}
                src={track.audio}
                onEnded={() => setPlayingTrack(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
