/**
 * Main application component
 * Coordinates all features: color picker, palettes, contrast, export, etc.
 */

import { useState, useMemo, useEffect } from 'react';
import { Undo2, Redo2, Moon, Sun } from 'lucide-react';
import type { Color, RGBColor } from '@/core/types';
import { convertColor } from '@/core/conversions';
import { generateAllPalettes } from '@/core/palettes';
import { useColorHistory } from '@/hooks/useColorHistory';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ColorPicker from '@/components/ColorPicker';
import ColorSliders from '@/components/ColorSliders';
import ContrastAuditor from '@/components/ContrastAuditor';
import PaletteGenerator from '@/components/PaletteGenerator';
import ColorBlindSimulator from '@/components/ColorBlindSimulator';
import EyeDropper from '@/components/EyeDropper';
import ExportPanel from '@/components/ExportPanel';

const INITIAL_COLOR: RGBColor = {
  type: 'rgb',
  r: 139,
  g: 69,
  b: 19,
};

export default function App() {
  const [colorSpace, setColorSpace] = useState<'oklch' | 'hsl' | 'rgb'>('oklch');
  const [darkMode, setDarkMode] = useState(false);
  
  const {
    color,
    updateColor,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useColorHistory(INITIAL_COLOR);
  
  const { saveRecentColor } = useLocalStorage();
  
  // Generate all palettes for the current color
  const palettes = useMemo(() => generateAllPalettes(color), [color]);
  
  // Collect all palette colors for export and simulation
  const allPaletteColors = useMemo(() => {
    const colors: Color[] = [color];
    palettes.forEach((palette) => {
      colors.push(...palette.colors);
    });
    return colors;
  }, [color, palettes]);
  
  const handleColorChange = (newColor: Color) => {
    updateColor(newColor);
    // Save to recent colors when user actively changes color
    saveRecentColor(newColor);
  };
  
  const handlePaletteColorSelect = (selectedColor: Color) => {
    handleColorChange(selectedColor);
  };
  
  // Initialize dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const stored = localStorage.getItem('dark-mode');
    const shouldBeDark = stored !== null ? stored === 'true' : prefersDark;
    setDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('dark-mode', String(newDarkMode));
    document.documentElement.classList.toggle('dark', newDarkMode);
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Chroma-Sync
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Professional Color Grading Engine
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Undo/Redo */}
              <div className="flex items-center gap-1">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                  aria-label="Undo"
                >
                  <Undo2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                  aria-label="Redo"
                >
                  <Redo2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                         transition-colors"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Color Picker & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Color Space Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Space
              </label>
              <div className="flex gap-2">
                {(['oklch', 'hsl', 'rgb'] as const).map((space) => (
                  <button
                    key={space}
                    onClick={() => setColorSpace(space)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      colorSpace === space
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {space.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Picker */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Color Picker
              </h2>
              <ColorPicker
                color={color}
                colorSpace={colorSpace}
                onChange={handleColorChange}
                size={300}
              />
            </div>
            
            {/* Color Sliders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Color Values
              </h2>
              <ColorSliders
                color={color}
                colorSpace={colorSpace}
                onChange={handleColorChange}
              />
            </div>
            
            {/* EyeDropper */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Pick from Screen
              </h2>
              <EyeDropper onColorPick={handleColorChange} />
            </div>
            
            {/* Palette Generator */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <PaletteGenerator
                baseColor={color}
                onColorSelect={handlePaletteColorSelect}
              />
            </div>
            
            {/* Color Blind Simulator */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <ColorBlindSimulator
                colors={Array.from(palettes.values()).flatMap(p => p.colors)}
                paletteName="Generated Palettes"
              />
            </div>
          </div>
          
          {/* Right Column: Contrast & Export */}
          <div className="space-y-6">
            {/* Contrast Auditor */}
            <ContrastAuditor backgroundColor={color} />
            
            {/* Export Panel */}
            <ExportPanel
              colors={allPaletteColors}
              paletteName="chroma-sync-palette"
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Chroma-Sync — Professional Color Grading Engine | Daily UI 60
          </p>
        </div>
      </footer>
    </div>
  );
}

