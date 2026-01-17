/**
 * Palette generator display component
 * Shows generated palettes in a grid of color swatches
 */

import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { Color } from '@/core/types';
import { generateAllPalettes } from '@/core/palettes';
import { colorToCSS } from '@/core/conversions';

interface PaletteGeneratorProps {
  baseColor: Color;
  onColorSelect?: (color: Color) => void;
}

export default function PaletteGenerator({
  baseColor,
  onColorSelect,
}: PaletteGeneratorProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  
  const palettes = useMemo(
    () => generateAllPalettes(baseColor),
    [baseColor]
  );
  
  const paletteTypes = [
    { key: 'complementary' as const, label: 'Complementary' },
    { key: 'triadic' as const, label: 'Triadic' },
    { key: 'tetradic' as const, label: 'Tetradic' },
    { key: 'analogous' as const, label: 'Analogous' },
  ];
  
  const copyToClipboard = async (color: Color, paletteKey: string, colorIndex: number) => {
    const colorString = colorToCSS(color);
    const key = `${paletteKey}-${colorIndex}`;
    
    try {
      await navigator.clipboard.writeText(colorString);
      setCopiedIndex(key);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };
  
  const handleColorClick = (color: Color) => {
    if (onColorSelect) {
      onColorSelect(color);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Generated Palettes
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paletteTypes.map(({ key, label }) => {
          const palette = palettes.get(key);
          if (!palette) return null;
          
          return (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                {label}
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {palette.colors.map((color, index) => {
                  const colorString = colorToCSS(color);
                  const isBaseColor = index === 0;
                  const copyKey = `${key}-${index}`;
                  const isCopied = copiedIndex === copyKey;
                  
                  return (
                    <div
                      key={index}
                      className="group relative"
                    >
                      <button
                        onClick={() => handleColorClick(color)}
                        className="w-full aspect-square rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
                        style={{ backgroundColor: colorString }}
                        aria-label={`Select ${colorString} from ${label} palette`}
                      >
                        {isBaseColor && (
                          <div className="absolute top-1 left-1 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm">
                            Base
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
                      </button>
                      
                      {/* Copy Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(color, key, index);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        aria-label={`Copy ${colorString} to clipboard`}
                      >
                        {isCopied ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                      
                      {/* Color Value */}
                      <div className="mt-1 text-xs text-center text-gray-600 dark:text-gray-400 font-mono truncate">
                        {colorString}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Palette Description */}
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {key === 'complementary' && 'Colors opposite on the color wheel'}
                {key === 'triadic' && 'Three evenly spaced colors (120° apart)'}
                {key === 'tetradic' && 'Four evenly spaced colors (90° apart)'}
                {key === 'analogous' && 'Colors adjacent on the color wheel (±30°)'}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> Click on any color swatch to select it, or hover and click the copy icon to copy the color value to your clipboard.
        </p>
      </div>
    </div>
  );
}

