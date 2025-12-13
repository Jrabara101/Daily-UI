# Daily UI 34 - Pixel Car Drive

A 2D pixel art car driving game built with Three.js. Drive your car through pixelated streets, navigate to destinations, and arrive at your home!

## Features

- 🚗 **8 Different Cars** - Choose from 8 pixel art car sprites
- 👤 **Character Selection** - Choose between boy or girl character
- 🗺️ **Navigation System** - Set destinations and track your journey
- 🏠 **Arrival Scenes** - Arrive at randomly selected houses
- 🛣️ **Tile-based Roads** - Procedurally generated road tiles
- 🎮 **Keyboard Controls** - WASD or Arrow keys to drive
- 📱 **Navigation UI** - Real-time distance, time, and speed tracking

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5174`)

## Controls

- **W / ↑** - Drive forward
- **S / ↓** - Drive backward
- **A / ←** - Turn left
- **D / →** - Turn right
- **Click** - Interact with UI elements

## Game Flow

1. **Select Your Car** - Choose from 8 different pixel art cars
2. **Select Your Character** - Choose boy or girl character
3. **Set Destination** - Enter your destination (default: "Home")
4. **Start Navigation** - Begin your journey
5. **Drive** - Use WASD or Arrow keys to navigate
6. **Arrive** - Reach your destination and see your character at a random house

## Technologies Used

- Three.js - 3D graphics and rendering
- Vite - Build tool and dev server
- HTML5 Canvas - Mini map rendering
- CSS3 - Pixel art styling and UI

## Project Structure

```
Daily UI 34/
├── main.js              # Main game logic and Three.js setup
├── styles.css           # Pixel art styling
├── index.html           # Game UI and structure
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── 1.png - 8.png        # Car sprites
├── 9.png - 12.png       # House sprites
├── boy.png, girl.png   # Character sprites
├── street_tile_2.png    # Road tile 1
├── street_tile_2_1.png  # Road tile 2
└── unnamed.jpg          # UI reference

```

## Build for Production

```bash
npm run build
```

## Notes

- All images use pixel art rendering for crisp, retro aesthetics
- The game uses an orthographic camera for a 2D top-down view
- Road tiles are procedurally generated using the street tile images
- Navigation tracking updates in real-time as you drive


