import { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import './App.css';

// Sample chapter data
const sampleChapters = [
  { start: 0, title: 'Introduction' },
  { start: 30, title: 'Getting Started' },
  { start: 90, title: 'Advanced Features' },
  { start: 180, title: 'Best Practices' },
  { start: 240, title: 'Conclusion' },
];

function App() {
  const [videoSrc, setVideoSrc] = useState('');
  const [isHLS, setIsHLS] = useState(false);
  const [chapters, setChapters] = useState(sampleChapters);

  // Example video sources - replace with your own
  const exampleVideos = [
    { name: 'Sample MP4', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isHLS: false },
    { name: 'Sample HLS', src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', isHLS: true },
  ];

  const handleLoadVideo = (src, hls) => {
    setVideoSrc(src);
    setIsHLS(hls);
  };

  const handleChaptersChange = (e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      if (Array.isArray(parsed)) {
        setChapters(parsed);
      }
    } catch (err) {
      console.error('Invalid JSON:', err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 CineFlow — The Pro-Grade Media Engine</h1>
        <p>Custom HTML5 Video Player with Advanced Features</p>
      </header>

      <div className="app-content">
        <div className="controls-panel">
          <div className="control-group">
            <h3>Video Source</h3>
            <div className="video-buttons">
              {exampleVideos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handleLoadVideo(video.src, video.isHLS)}
                  className="video-btn"
                >
                  {video.name}
                </button>
              ))}
            </div>
            <div className="custom-source">
              <input
                type="text"
                placeholder="Or enter custom video URL"
                value={videoSrc}
                onChange={(e) => {
                  setVideoSrc(e.target.value);
                  setIsHLS(e.target.value.endsWith('.m3u8'));
                }}
                className="source-input"
              />
              <button
                onClick={() => handleLoadVideo(videoSrc, isHLS)}
                className="load-btn"
                disabled={!videoSrc}
              >
                Load
              </button>
            </div>
          </div>

          <div className="control-group">
            <h3>Chapters (JSON)</h3>
            <textarea
              value={JSON.stringify(chapters, null, 2)}
              onChange={handleChaptersChange}
              className="chapters-input"
              rows="8"
              placeholder='[{"start": 0, "title": "Chapter 1"}, ...]'
            />
          </div>

          <div className="features-list">
            <h3>Features</h3>
            <ul>
              <li>✅ Custom Media State Machine (XState)</li>
              <li>✅ Gestural Interactions (double-tap, swipe, pinch)</li>
              <li>✅ Smart Thumbnail Scrubbing</li>
              <li>✅ Dynamic Chapters with Visual Segments</li>
              <li>✅ Theater Mode with FLIP Animation</li>
              <li>✅ Buffer Range Visualization</li>
              <li>✅ Picture-in-Picture Support</li>
              <li>✅ Page Visibility API Integration</li>
              <li>✅ HLS/DASH Support (hls.js)</li>
            </ul>
          </div>
        </div>

        <div className="player-container">
          {videoSrc ? (
            <VideoPlayer
              src={videoSrc}
              isHLS={isHLS}
              chapters={chapters}
            />
          ) : (
            <div className="placeholder">
              <p>Select a video source to begin</p>
              <p className="hint">
                Try the sample videos above or enter your own URL
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

