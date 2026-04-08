import React from 'react';
import './Hero.css';
import { PlayCircle, Share2, Heart } from 'lucide-react';

const Hero = ({ onListenNow }) => {
  return (
    <div className="hero-container">
      <div className="hero-background"></div>
      
      <div className="hero-content glass">
        <div className="album-art-wrapper">
          <img src="/album-cover.png" alt="Echoes of Silence" className="album-art" />
          <div className="album-art-glow"></div>
        </div>
        
        <div className="album-info">
          <div className="release-badge">OUT NOW</div>
          <h1 className="album-title">DIONELA ESSENTIALS</h1>
          <h2 className="artist-name">DIONELA</h2>
          <p className="album-description">
            Experience the soulful and romantic R&B sounds of Dionela. A collection of his greatest hits like Sining, Oksihina, and Marilag.
          </p>
          
          <div className="action-buttons">
            <button className="btn btn-primary d-flex" onClick={onListenNow}>
              <PlayCircle size={20} style={{marginRight: '8px'}} /> LISTEN NOW
            </button>
            <div className="icon-actions">
              <button className="icon-btn"><Heart size={22} /></button>
              <button className="icon-btn"><Share2 size={22} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
