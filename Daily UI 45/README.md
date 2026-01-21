# Daily UI 45 - Info Card

A beautiful, responsive Info Card component with a glassmorphism effect, featuring a frosted glass background, soft rounded corners, and a subtle glowing border.

## Features

- ✨ Glassmorphism design with frosted glass effect
- 🎨 Vibrant mesh gradient background
- 📱 Fully responsive design
- 🖼️ Circular profile picture with gradient glow
- 🔗 Social media icons (GitHub, Twitter, LinkedIn)
- ⚡ Built with React and Tailwind CSS

## Component Props

The `InfoCard` component accepts the following props:

- `name` (string, required): The person's name
- `bio` (string, required): A short biography/description
- `image` (string, required): URL to the profile picture

## Usage

```jsx
import InfoCard from './components/InfoCard';

<InfoCard
  name="Alex Johnson"
  bio="Creative designer passionate about building beautiful user experiences."
  image="https://example.com/profile.jpg"
/>
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Design Details

- **Glassmorphism Effect**: Achieved using `backdrop-blur-xl` and semi-transparent white background
- **Gradient Background**: Vibrant mesh gradient with purple, pink, and orange tones
- **Border Glow**: Subtle gradient border with blur effect for depth
- **Social Icons**: Minimalist circular buttons with hover effects
- **Typography**: Clean sans-serif font with proper hierarchy

## Technologies

- React 19
- Tailwind CSS 4
- Vite
- Lucide React (for icons)
















