/**
 * EyeDropper API integration component
 * Allows users to pick colors from anywhere on their screen
 */

import { useState } from 'react';
import { Pipette } from 'lucide-react';
import type { Color, HexColor } from '@/core/types';
import { convertColor, hexToRGB } from '@/core/conversions';

interface EyeDropperProps {
  onColorPick: (color: Color) => void;
  disabled?: boolean;
}

// Check if EyeDropper API is supported
export const isEyeDropperSupported = (): boolean => {
  return typeof window !== 'undefined' && 'EyeDropper' in window;
};

export default function EyeDropper({ onColorPick, disabled = false }: EyeDropperProps) {
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleEyeDropperClick = async () => {
    if (!isEyeDropperSupported()) {
      setError('EyeDropper API is not supported in this browser');
      return;
    }
    
    if (disabled || isPicking) return;
    
    setIsPicking(true);
    setError(null);
    
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      
      // EyeDropper returns a hex color string (e.g., "#ff0000")
      const hexColor: HexColor = {
        type: 'hex',
        value: result.sRGBHex,
      };
      
      // Convert to RGB for consistency
      const rgbColor = hexToRGB(hexColor);
      
      onColorPick(rgbColor);
      setIsPicking(false);
    } catch (err: any) {
      // User cancelled or error occurred
      if (err.name !== 'AbortError') {
        setError('Failed to pick color. Please try again.');
        console.error('EyeDropper error:', err);
      }
      setIsPicking(false);
    }
  };
  
  if (!isEyeDropperSupported()) {
    return (
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ EyeDropper API is not supported in this browser. Please use Chrome 95+, Edge 95+, or Opera 81+.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <button
        onClick={handleEyeDropperClick}
        disabled={disabled || isPicking}
        className={`
          flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200
          ${isPicking
            ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-wait'
            : disabled
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md hover:shadow-lg active:scale-95'
          }
        `}
        aria-label="Pick color from screen"
        aria-busy={isPicking}
      >
        <Pipette className={`w-5 h-5 ${isPicking ? 'animate-pulse' : ''}`} />
        <span>{isPicking ? 'Picking color...' : 'Pick Color from Screen'}</span>
      </button>
      
      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      {isPicking && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Click anywhere on your screen to pick a color
        </p>
      )}
    </div>
  );
}

