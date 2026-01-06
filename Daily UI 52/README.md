# Brand Alchemist - Daily UI 52

A sophisticated React + Vite application for creating and managing brand logos with real-time preview, accessibility checking, and professional export capabilities.

## Features

### 🎨 Advanced UI/UX

- **Live-Preview Workspace**: Central canvas where the logo updates in real-time as users adjust parameters (color, spacing, stroke weight)
- **Contextual Mockups**: Automatically inject the user's logo onto digital mockups (mobile app header, browser tab, business card)
- **Design Constraints Engine**: Prevent "bad" design by implementing "Safe Zones" with WCAG contrast ratio warnings

### 🛠️ Technical Features

- **Generative SVG Manipulation**: SVG as code with dynamic path data, viewBox settings, and CSS variables
- **Dynamic Wordmark**: Adjustable kerning (letter spacing) via slider control
- **Theme Engine**: CSS Custom Properties for instant theme switching (Dark Mode, Light Mode, High-Contrast)
- **Export Pipeline**: Export logos in multiple formats (SVG, PNG) and sizes using Canvas API

## Getting Started

### Installation

```bash
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

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Adjust Logo Parameters**: Use the control panel to modify:
   - Logo colors (3 color palette)
   - Stroke weight
   - Spacing

2. **Customize Wordmark**: 
   - Enter your brand name
   - Adjust font size
   - Fine-tune kerning (letter spacing)
   - Set text color

3. **Test Background Colors**: Change the background color to see how your logo looks in different contexts

4. **Accessibility Checking**: The app automatically checks contrast ratios and warns if your logo doesn't meet WCAG standards

5. **View Mockups**: Click "Show Mockups" to see your logo in real-world contexts

6. **Export**: Choose between SVG or PNG format and export your logo in multiple sizes

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Canvas API** - PNG export functionality

## Project Structure

```
Daily UI 52/
├── src/
│   ├── components/
│   │   ├── SVGLogo.jsx          # Generative SVG logo component
│   │   ├── Wordmark.jsx          # Dynamic wordmark with kerning
│   │   ├── ControlPanel.jsx      # Parameter controls
│   │   ├── LivePreview.jsx       # Live preview workspace
│   │   ├── Mockups.jsx           # Contextual mockups
│   │   ├── ThemeSwitcher.jsx     # Theme engine
│   │   └── ExportPanel.jsx       # Export functionality
│   ├── utils/
│   │   ├── colorUtils.js         # WCAG contrast calculations
│   │   └── exportUtils.js        # SVG/PNG export utilities
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles with theme variables
├── index.html
├── package.json
└── vite.config.js
```

## Accessibility

The application implements WCAG 2.1 contrast ratio calculations to ensure accessible color combinations. It provides real-time warnings when:
- Contrast ratio is below WCAG AA standards (< 4.5:1 for normal text)
- Contrast ratio meets AA but not AAA standards
- Logo passes all accessibility checks

## Browser Support

Modern browsers with support for:
- ES6+ JavaScript
- SVG
- Canvas API
- CSS Custom Properties






