import React from 'react';
import InfoCard from './components/InfoCard';

function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(120,119,198,0.3),_transparent_50%),_radial-gradient(circle_at_80%_80%,_rgba(255,119,198,0.3),_transparent_50%),_radial-gradient(circle_at_40%_20%,_rgba(255,200,87,0.3),_transparent_50%)] animate-pulse"></div>
      
      <InfoCard
        name="Alex Johnson"
        bio="Creative designer passionate about building beautiful user experiences. Love exploring new design trends and pushing boundaries."
        image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      />
    </div>
  );
}

export default App;



















