# OmniSight — High-Fidelity Analytics Engine

Enterprise-grade Statistics Dashboard with real-time data streaming, multi-dimensional filtering, and high-performance charting.

## Features

### UI/UX & Information Architecture
- **Contextual Drill-Down**: Click data points on the main chart to filter sidebar data (Efficiency gauges and Completed Tasks) to that specific day
- **Adaptive Chart Density**: Smooth GSAP transitions when switching between Daily, Monthly, and Yearly views
- **KPI Highlight Cards**: Total Sales card with vibrant blue gradient as visual anchor
- **Predictive Ghost Lines**: Faint dashed lines showing previous period data for instant comparison

### Front-end Engineering
- **Real-time WebSocket Ingestion**: Simulated live data stream with hook-like pattern for state management
- **Canvas-Accelerated Rendering**: D3.js charts automatically switch to Canvas backend when dataset exceeds 5,000 points for 60fps performance
- **Custom Tooltip Portal**: Floating UI tooltips that remain visible at viewport edges
- **Activity Heatmap**: Weekly activity grid with color interpolation for peak productivity visualization

### Accessibility
- **Color Blindness Support**: Line charts use distinct patterns (solid, dashed, dotted) in addition to colors
- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard support with Tab navigation and Enter/Space activation
- **Screen Reader Support**: Live region announcements for chart updates and filter changes

## Getting Started

### Installation

```bash
cd "Daily UI 66"
npm install
```

### Development

```bash
npm run dev
```

The dashboard will open at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
Daily UI 66/
├── index.html          # Main HTML structure
├── styles.css          # Custom CSS (skeleton animations, gauge styles)
├── script.js           # Main application logic
├── modules/
│   ├── websocket.js    # WebSocket simulation & hook-like pattern
│   ├── chart.js        # D3.js multi-line chart with Canvas fallback
│   ├── gauge.js        # Efficiency gauge component
│   ├── heatmap.js      # Activity grid heatmap
│   ├── tooltip.js      # Floating UI tooltip portal
│   ├── export.js       # html2canvas export functionality
│   └── data.js         # Mock data generation & normalization
└── package.json        # Dependencies
```

## Usage

### Interacting with the Dashboard

1. **Time Period Filters**: Click "Today", "Weekly", "Monthly", or "Yearly" to change the chart view
2. **Chart Drill-Down**: Click any data point on the main chart to filter sidebar data to that date
3. **Heatmap Filters**: Use "50>", "100>", "200>" buttons to filter activity levels
4. **Export**: Click "Export Dashboard" to save as PNG or PDF

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and chart points
- **Escape**: Clear date filter and reset dashboard

## Dependencies

- **d3**: ^7.8.5 - Data visualization
- **gsap**: ^3.12.5 - Animation library
- **@floating-ui/dom**: ^1.6.0 - Tooltip positioning
- **html2canvas**: ^1.4.1 - Dashboard export
- **jspdf**: ^2.5.1 - PDF generation
- **tailwindcss**: ^3.4.1 - Utility-first CSS

## Performance

- Canvas rendering automatically activates for datasets > 5,000 points
- WebSocket updates throttled to 60fps using requestAnimationFrame
- All animations use GSAP for smooth 60fps performance
- Skeleton loading states reduce perceived latency

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

