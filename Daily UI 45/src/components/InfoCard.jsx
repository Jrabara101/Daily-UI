import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const InfoCard = ({ name, bio, image }) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glassmorphism Card */}
      <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
        {/* Subtle glowing border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 opacity-50 blur-xl"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-md opacity-50"></div>
              <img
                src={image}
                alt={name}
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
              />
            </div>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-white text-center mb-4 tracking-tight">
            {name}
          </h1>

          {/* Bio */}
          <p className="text-white/90 text-center text-base leading-relaxed mb-8 font-light">
            {bio}
          </p>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;













