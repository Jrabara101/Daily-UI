// src/components/AboutAlbum.jsx
import React from 'react';
import './css/AboutAlbum.css';

export default function AboutAlbum() {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          {/* Left Column - Story */}
          <div className="about-story">
            <h2 className="about-title">About the Album</h2>
            <p className="about-text">
              Written during sleepless city nights, <strong>Midnight Skies</strong> is 
              a sonic exploration of urban dreams and nocturnal emotions. This album 
              blends ethereal synth melodies with heartfelt lyrics to create an 
              immersive listening experience.
            </p>
            <p className="about-text">
              Each track tells a story of longing, hope, and the beauty found in 
              late-night solitude. From the opening notes to the final fade, 
              you'll journey through neon-lit streets and starlit horizons.
            </p>
            <div className="about-quote">
              <span className="quote-mark">"</span>
              <p className="quote-text">
                A masterpiece of modern synth-pop. Every track resonates with emotion 
                and authenticity.
              </p>
              <p className="quote-author">— IndieWave Magazine</p>
            </div>
          </div>

          {/* Right Column - Stats & Highlights */}
          <div className="about-highlights">
            <div className="highlight-card">
              <div className="highlight-icon">🎵</div>
              <h3 className="highlight-number">12</h3>
              <p className="highlight-label">Original Tracks</p>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">🎧</div>
              <h3 className="highlight-number">500K+</h3>
              <p className="highlight-label">Streams in First Week</p>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">⭐</div>
              <h3 className="highlight-number">4.9/5</h3>
              <p className="highlight-label">Fan Rating</p>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">📻</div>
              <h3 className="highlight-number">Top 10</h3>
              <p className="highlight-label">IndieWave Charts</p>
            </div>

            {/* Featured On */}
            <div className="featured-section">
              <h4 className="featured-title">Featured On</h4>
              <ul className="featured-list">
                <li>🎙️ IndieWave Radio</li>
                <li>📰 MusicPress Daily</li>
                <li>🎸 New Sounds Playlist</li>
                <li>🌟 Spotify Editorial Pick</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
