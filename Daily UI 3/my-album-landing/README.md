# Echoes of Silence - Dionela Album Landing Page 🎵

A beautifully designed, interactive album landing page built for **Daily UI #3**. The page serves as a promotional site for Dionela's music, featuring a customized visual aesthetic and a fully functional embedded music player.

## 🚀 Features

- **Integrated Music Player:** Streams true-to-life Dionela tracks directly from YouTube using `react-player` under the hood.
- **Dynamic Tracklist:** A comprehensive and interactive list of songs fetched dynamically from a PHP backend API.
- **Hero & Tour Dates:** Detailed promotional sections tailored to highlight upcoming events and album art aesthetics.
- **Seamless Playback UI:** Custom floating playback controls that allow users to play/pause, skip, and preview songs without leaving the page.

## 🛠️ Technologies Used

- **Frontend:** React 18, Vite, standard CSS for rich, polished visual styling.
- **Backend:** PHP (Provides an API proxy serving track data and YouTube streams).
- **Icons:** `lucide-react`.
- **Media:** `react-player`.

## 📦 Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed, as well as a local PHP server environment configured (such as XAMPP, Laragon, or built-in PHP server) if you wish to run the backend API natively.

### Installation

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Start the Vite React development server:
   ```bash
   npm run dev
   ```

3. Ensure your PHP setup can serve `backend/api.php` so the frontend can successfully retrieve track data.

## 🎨 Design Philosophy

This project prioritizes top-tier visual aesthetics. The design focuses on robust typography, soft dynamic transitions using CSS, and ensuring the music player integrates cleanly without visually conflicting with the elegant landing page identity.
