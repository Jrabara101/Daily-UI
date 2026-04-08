import React, { useState, useEffect } from 'react';
import Hero from './components/Hero.jsx';
import Tracklist from './components/Tracklist.jsx';
import TourDates from './components/TourDates.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    // Fetch tracks from the PHP backend API
    fetch(`/api?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setTracks(data.data);
        }
      })
      .catch(err => console.error("Error fetching tracks from backend:", err));
  }, []);

  const handlePlayTrack = (trackId) => {
    const index = tracks.findIndex(t => t.id === trackId);
    if (index !== -1) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setShowPlayer(true);
    }
  };

  const togglePlay = () => {
    if (!showPlayer) setShowPlayer(true);
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (tracks.length > 0) {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (tracks.length > 0) {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setIsPlaying(true);
    }
  };

  const currentTrack = tracks[currentTrackIndex] || null;

  return (
    <div className={`app-container ${showPlayer ? 'player-active' : ''}`}>
      <Hero onListenNow={() => handlePlayTrack(tracks.length > 0 ? tracks[0].id : 1)} />
      
      <div className="content-section">
        <Tracklist 
          tracks={tracks} 
          currentTrackId={currentTrack?.id} 
          isPlaying={isPlaying} 
          onPlayTrack={handlePlayTrack} 
          onTogglePlay={togglePlay}
        />
        <TourDates />
      </div>

      {showPlayer && tracks.length > 0 && (
        <MusicPlayer 
          track={currentTrack} 
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}

export default App;
