# Daily UI 51 - Corporate Newsroom

A professional corporate newsroom built with React and Vite Rolldown, designed for journalists and media professionals to quickly access press releases, brand assets, and executive information.

## Features

### Design Requirements ✅
- **Press Kit Sidebar/Header**: Sticky media kit download section with ZIP file
- **Brand Asset Grid**: Clean gallery with logos (Light/Dark), product screenshots, and executive headshots
- **Press Release Feed**: List/grid with bold dates and tag filters (Product Launch, Philanthropy, Corporate)
- **Leadership Section**: High-quality executive cards with names, titles, and bios
- **Contact CTA**: High-contrast media inquiries section with response time promise
- **Bold Minimalism**: Large headings, plenty of white space, subtle micro-interactions

### Technical Requirements ✅
- **Component Architecture**: Reusable components (PressCard, AssetDownload, SectionHeader)
- **Filtering System**: Functional filter bar for year and category without page reload
- **Advanced Media Handling**:
  - Responsive images with srcset support
  - Copy to clipboard for press release links
  - Lightroom-style modal for high-res image preview
- **SEO & Accessibility**:
  - Semantic HTML (article, time, section)
  - Descriptive alt text for images
  - react-helmet for dynamic meta tags
- **Stretch Goals**:
  - Debounced search bar for real-time filtering
  - Keyboard navigation support
  - Print-friendly CSS

### Performance Optimizations ✅
- **LCP Optimization**: Optimized hero images (ready for WebP)
- **Accessibility**: Full keyboard navigation (Tab through filters and downloads)
- **Print-Friendly**: @media print stylesheet for clean PDF printing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
Daily UI 51/
├── src/
│   ├── components/
│   │   ├── AssetDownload.jsx      # Individual asset download card
│   │   ├── BrandAssets.jsx        # Brand assets grid with lightbox
│   │   ├── ContactCTA.jsx           # Media inquiries contact section
│   │   ├── Leadership.jsx         # Executive leadership cards
│   │   ├── PressCard.jsx          # Individual press release card
│   │   ├── PressFeed.jsx          # Press releases with filtering/search
│   │   ├── PressKit.jsx           # Media kit download section
│   │   └── SectionHeader.jsx      # Reusable section header
│   ├── data/
│   │   └── pressData.json         # All press data (releases, assets, leadership)
│   ├── hooks/
│   │   └── useDebounce.js         # Debounce hook for search
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles with print support
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Data Structure

The app uses a local JSON file (`src/data/pressData.json`) that contains:
- Company information
- Media kit details
- Press releases with categories, tags, and dates
- Brand assets (logos, screenshots, headshots)
- Leadership team information
- Contact information

## Customization

### Adding Press Releases
Edit `src/data/pressData.json` and add new entries to the `pressReleases` array.

### Adding Brand Assets
Add new entries to the `brandAssets` array in the JSON file. Supported types: `logo`, `screenshot`, `headshot`.

### Modifying Styles
The project uses Tailwind CSS v4. Modify `src/index.css` or add Tailwind classes directly to components.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

