# Chroma-Sync — Professional Color Grading Engine

A high-performance, accessible color manipulation suite built with React and TypeScript. Supports multiple color spaces (HEX, RGB, HSL, CMYK, OKLCH), palette generation algorithms, and real-time WCAG contrast auditing.

## Features

### 🎨 Multi-Model Color Space Support
- **HEX**: Standard hex color format
- **RGB**: Red, Green, Blue color space
- **HSL**: Hue, Saturation, Lightness
- **CMYK**: Cyan, Magenta, Yellow, Key (Black)
- **OKLCH**: Perceptually uniform color space for consistent lightness

### 🎯 Real-Time Contrast Auditor
- Automated WCAG 2.1 pass/fail ratios
- Different text sizes (normal and large)
- Visual preview with white and black text
- AA and AAA compliance indicators

### 🌈 Generative Palette Algorithms
- **Complementary**: Colors opposite on the color wheel (180°)
- **Triadic**: Three evenly spaced colors (120° apart)
- **Tetradic**: Four evenly spaced colors (90° apart)
- **Analogous**: Adjacent colors on the color wheel (±30°)

### 👁️ Color Blindness Simulator
- **Protanopia**: Red-blind simulation
- **Deuteranopia**: Green-blind simulation
- **Tritanopia**: Blue-blind simulation
- Side-by-side comparison view

### 🖱️ EyeDropper Integration
- Native EyeDropper API support
- Pick colors from anywhere on your screen
- Works in Chrome 95+, Edge 95+, Opera 81+

### 🎛️ Advanced Controls
- GPU-accelerated Canvas color picker (60fps)
- Custom gradient sliders with dynamic CSS variables
- Precision input fields
- Undo/Redo history (up to 50 states)

### 💾 Persistence & Export
- localStorage persistence for recent colors
- Export to Tailwind Config
- Export to CSS Variables
- Export to JSON
- Export to Adobe Swatch Exchange (.ase)

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:3000`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
Daily UI 60/
├── src/
│   ├── core/
│   │   ├── types.ts                 # Color type definitions & type guards
│   │   ├── conversions.ts           # Color space conversion utilities
│   │   ├── contrast.ts              # WCAG 2.1 contrast calculations
│   │   └── palettes.ts              # Palette generation algorithms
│   ├── components/
│   │   ├── ColorPicker.tsx          # GPU-accelerated Canvas picker
│   │   ├── ColorSliders.tsx         # Custom gradient sliders
│   │   ├── ContrastAuditor.tsx      # Real-time WCAG scorecard
│   │   ├── PaletteGenerator.tsx     # Generated palette display
│   │   ├── ColorBlindSimulator.tsx  # SVG filter simulator
│   │   ├── ExportPanel.tsx          # Export format selector
│   │   └── EyeDropper.tsx           # EyeDropper API integration
│   ├── hooks/
│   │   ├── useColorHistory.ts       # Undo/redo state management
│   │   ├── useDebounce.ts           # Input debouncing utility
│   │   └── useLocalStorage.ts       # Persistence hook
│   ├── utils/
│   │   └── exportFormats.ts         # Export format handlers
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # React entry point
│   └── index.css                    # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Usage

### Color Picker
1. Use the Canvas color picker to select a base color
2. Adjust the hue ring and saturation/brightness square
3. Use the sliders for precise adjustments

### Generating Palettes
1. Select a base color
2. The application automatically generates Complementary, Triadic, Tetradic, and Analogous palettes
3. Click on any swatch to select that color
4. Copy colors to clipboard using the copy button

### Contrast Checking
1. The contrast auditor updates in real-time as you change colors
2. View WCAG 2.1 compliance for both white and black text
3. See recommendations for optimal text colors

### Color Blindness Testing
1. Toggle the color blindness simulator
2. Select a type (Protanopia, Deuteranopia, Tritanopia)
3. View how your palette appears to users with color vision deficiencies

### Exporting
1. Choose your desired export format
2. Enter a palette name
3. Click the export button to download

## Browser Support

- **Modern browsers** with support for:
  - ES6+ JavaScript
  - Canvas API
  - SVG Filters
  - CSS Custom Properties
- **EyeDropper API**: Chrome 95+, Edge 95+, Opera 81+

## Accessibility

- WCAG 2.1 AA/AAA contrast compliance checking
- Keyboard navigation support
- ARIA labels for screen readers
- Focus indicators
- Respects `prefers-reduced-motion` setting

## License

This project is part of the Daily UI Design Challenge.

## Acknowledgments

- Daily UI for the design prompt
- WCAG 2.1 for contrast guidelines
- OKLCH color space implementation based on scientific research

