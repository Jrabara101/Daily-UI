// src/components/Gallery.jsx
import React, { useState } from 'react';
import './css/Gallery.css';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    { id: 1, type: 'image', src: '/assets/gallery1.jpg', alt: 'Album Cover' },
    { id: 2, type: 'image', src: '/assets/gallery2.jpg', alt: 'Studio Session' },
    { id: 3, type: 'image', src: '/assets/gallery3.jpg', alt: 'Live Performance' },
    { id: 4, type: 'video', src: '/assets/promo-video.mp4', poster: '/assets/video-poster.jpg' },
    { id: 5, type: 'image', src: '/assets/gallery4.jpg', alt: 'Behind the Scenes' },
    { id: 6, type: 'image', src: '/assets/gallery5.jpg', alt: 'Recording' }
  ];

  return (
    <section className="gallery-section">
      <div className="container">
        <h2 className="section-title">Gallery</h2>
        <p className="section-subtitle">Behind the music, inside the studio</p>

        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div 
              key={item.id} 
              className="gallery-item"
              onClick={() => item.type === 'image' && setSelectedImage(item)}
            >
              {item.type === 'image' ? (
                <>
                  <img src={item.src} alt={item.alt} className="gallery-image" />
                  <div className="gallery-overlay">
                    <span className="zoom-icon">🔍</span>
                  </div>
                </>
              ) : (
                <div className="video-wrapper">
                  <video 
                    src={item.src}
                    poster={item.poster}
                    controls
                    className="gallery-video"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <span className="close-button">✕</span>
          <img 
            src={selectedImage.src} 
            alt={selectedImage.alt} 
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
