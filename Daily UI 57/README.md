# CineFlow — The Pro-Grade Media Engine

A custom, high-performance HTML5 video player built from scratch with React.js, featuring advanced state management, gestural interactions, and adaptive streaming support.

## 🎯 Features

### Advanced UI/UX
- **Gestural Interaction System**: Double-tap right side to seek +10s, swipe vertically to adjust volume, pinch to zoom
- **Smart Thumbnail Scrubbing**: Frame-accurate thumbnail preview on progress bar hover
- **Dynamic Chapters**: Visual chapter segments with titles on hover (JSON chapter map support)
- **Theater Mode**: Seamless FLIP animation transition with dimmed background

### Senior Front-end Engineering
- **Custom Media State Machine**: Robust state management using XState (Idle, Loading, Buffering, Playing, Paused, Seeking, Error)
- **Buffer Visualization**: Real-time visualization of buffered ranges using HTMLMediaElement.buffered API
- **Picture-in-Picture**: Native PiP support with requestPictureInPicture() API
- **Page Visibility API**: Auto-pause when switching tabs
- **HLS/DASH Integration**: Adaptive bitrate streaming support with hls.js

## 🚀 Getting Started

### Installation

```bash
cd "Daily UI 57"
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 📦 Dependencies

- **React 19**: UI framework
- **XState 5**: State machine management
- **@xstate/react**: React bindings for XState
- **hls.js**: HLS streaming support

## 🎮 Usage

### Basic Usage

```jsx
import { VideoPlayer } from './components/VideoPlayer';

<VideoPlayer
  src="https://example.com/video.mp4"
  isHLS={false}
  chapters={[
    { start: 0, title: 'Introduction' },
    { start: 30, title: 'Chapter 1' },
  ]}
/>
```

### HLS Stream

```jsx
<VideoPlayer
  src="https://example.com/stream.m3u8"
  isHLS={true}
/>
```

## 🎨 Gestures

- **Double-tap right side**: Seek forward 10 seconds
- **Swipe vertically**: Adjust volume
- **Pinch**: Zoom in/out (fill screen)

## 📊 State Machine

The player uses XState to manage complex media states:

- `idle`: Initial state
- `loading`: Video is loading
- `buffering`: Waiting for data
- `playing`: Video is playing
- `paused`: Video is paused
- `seeking`: Seeking to new position
- `error`: Error occurred

## 🎬 Theater Mode

Theater mode uses FLIP (First, Last, Invert, Play) animation technique for 60fps performance, using CSS transforms instead of layout properties.

## 📝 Chapter Format

Chapters are defined as JSON:

```json
[
  { "start": 0, "title": "Introduction" },
  { "start": 30, "title": "Getting Started" },
  { "start": 90, "title": "Advanced Features" }
]
```

## 🔧 Architecture

- **State Machine**: `src/machines/videoPlayerMachine.js`
- **Custom Hook**: `src/hooks/useVideoPlayer.js`
- **Components**: `src/components/`
- **Utilities**: `src/utils/`

## 📄 License

MIT

