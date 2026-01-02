# Daily UI Challenge #53 - Mega Menu Navigation System

An advanced navigation system featuring smart hover detection, keyboard navigation, and a command palette interface.

## Features

### Option 1: Mega-Menu System
- **Smart Hover Detection**: Implemented using a triangle algorithm that detects user intent when moving the mouse toward sub-menus
- **Keyboard Navigation**: Full support for arrow keys and vim-style navigation (h, j, k, l)
- **React Portals**: Dropdowns and submenus are rendered using React Portals to prevent clipping issues
- **Content-Rich Submenus**: Expandable navigation items with organized sub-sections
- **Collapsible Sidebar**: Sidebar can be collapsed to icon-only mode with hover tooltips

### Option 2: Command Palette
- **Fuzzy Search**: Powered by Fuse.js for typo-tolerant searching
- **Keyboard-First**: Open with `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- **Fast Filtering**: Instant search results with smooth animations
- **Focus Trapping**: Accessibility-first with proper focus management

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Fuse.js** - Fuzzy search library
- **Lucide React** - Icon library

## Getting Started

### Installation

```bash
cd "Daily UI 53"
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Keyboard Shortcuts

- **Cmd/Ctrl + K**: Open Command Palette
- **Arrow Up/Down**: Navigate menu items
- **Arrow Right**: Expand submenu
- **Arrow Left**: Collapse submenu
- **Enter**: Select/activate menu item
- **Escape**: Close menus/palette

### Features in Detail

#### Smart Hover (Triangle Algorithm)
The navigation system uses an intent-based hover detection algorithm that:
- Tracks mouse velocity and position
- Calculates whether the user is moving toward a submenu
- Prevents accidental menu closures when moving between menu items and submenus
- Uses geometric calculations (triangle method) to predict user intent

#### Keyboard Navigation
Full keyboard support including:
- Arrow key navigation
- Vim-style navigation (h, j, k, l)
- Visual focus indicators
- Tab trapping for accessibility

#### React Portals
All dropdown menus and submenus (when sidebar is collapsed) are rendered using React Portals to:
- Ensure they're never clipped by parent containers
- Render at the document root level
- Maintain proper z-index stacking

#### Command Palette
A powerful command palette that:
- Searches across all navigation items
- Uses fuzzy matching (handles typos like "sttings" → "Settings")
- Groups results by category
- Provides instant filtering with smooth animations

## Project Structure

```
Daily UI 53/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Main sidebar navigation
│   │   ├── TopNav.jsx           # Top navigation bar
│   │   ├── CommandPalette.jsx   # Command palette modal
│   │   └── Icon.jsx             # Icon wrapper component
│   ├── data/
│   │   └── navigationData.js    # Navigation structure data
│   ├── utils/
│   │   ├── smartHover.js        # Smart hover algorithm
│   │   └── keyboardNavigation.js # Keyboard navigation utilities
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
└── README.md
```

## Design Notes

The design matches the provided mockups featuring:
- Collapsed sidebar state with icon-only navigation
- Expanded sidebar with full labels and submenus
- Top navigation with notifications dropdown (with unread count badge)
- Profile dropdown with user information
- Clean, modern UI with proper spacing and hover states
- Active state indicators for current navigation items

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Daily UI Challenge series.

