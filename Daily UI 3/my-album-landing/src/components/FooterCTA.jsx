// src/components/FooterCTA.jsx
import React, { useState } from 'react';
import './css/FooterCTA.css';

export default function FooterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission (connect to your backend/email service)
    console.log('Email submitted:', email);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="footer-section">
      {/* CTA Area */}
      <div className="footer-cta">
        <div className="container">
          <h2 className="footer-title">Join the Journey</h2>
          <p className="footer-subtitle">
            Pre-save the album now and get exclusive early access to new releases
          </p>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
              />
              <button type="submit" className="submit-button">
                {submitted ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </div>
          </form>

          {/* Social Links */}
          <div className="social-links">
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="social-icon">🎵</span> Spotify
            </a>
            <a href="https://apple.com/music" target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="social-icon">🎧</span> Apple Music
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="social-icon">📷</span> Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="social-icon">🐦</span> Twitter
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p className="copyright">
          © 2025 Midnight Skies. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <span className="separator">•</span>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
