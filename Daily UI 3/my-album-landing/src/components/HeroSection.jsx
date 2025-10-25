// src/components/HeroSection.jsx
import React from "react";
import './css/HeroSection.css';


export default function HeroSection() {
  return (
    <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
            <h1 className="hero-title">
                Experience the Sound of <span className="highlight">Midnight Skies</span>
            </h1>
            <p className="hero-subtitle">
                Dive in 12 tracks of dreamlike synth and soulful storytelling
            </p>
            <button className="cta-button">
                <span className="cta-icon">▶</span> Listen Now
            </button>
        </div>

        <div className="particles">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </section>
  );
}