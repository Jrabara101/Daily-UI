# Daily UI 35 - Blog Post

An elegant blog post design built with React and Vite, featuring a beautiful editorial layout with multiple post layouts, interactive comments, and smooth transitions.

## Features

- 🎨 **Multiple Layout Types** - Hero, Split, and Overlay post layouts
- 📝 **Full Article View** - Detailed single post view with rich typography
- 💬 **Interactive Comments** - Add and like comments
- ❤️ **Like System** - Like posts with visual feedback
- 📱 **Responsive Design** - Works beautifully on all screen sizes
- 🎭 **Elegant Typography** - Playfair Display for headings, Lato for body text
- 🎯 **Smooth Transitions** - Hover effects and page transitions

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Project Structure

```
Daily UI 35/
├── src/
│   ├── App.jsx          # Main app component with blog feed and post views
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles and Tailwind imports
├── index.html           # HTML template with Google Fonts
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md
```

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icon library
- **Google Fonts** - Playfair Display & Lato

## Features Breakdown

### Blog Feed
- **Hero Post** - Large featured post with overlay text
- **Split Posts** - Image and content side-by-side layouts
- **Overlay Posts** - Dark overlay with centered text
- Sticky header with menu and search
- Footer with social links and newsletter

### Single Post View
- Full-width hero image with article metadata
- Sticky sidebar with like and share buttons
- Rich typography with drop caps
- Blockquotes and images
- Author bio section
- Comments section with interactive form

## Build for Production

```bash
npm run build
```

## Customization

- Edit `POSTS` array in `App.jsx` to add/modify blog posts
- Modify colors in Tailwind classes throughout components
- Adjust typography by changing font families in `index.css`
- Add more post layouts by extending the layout types

