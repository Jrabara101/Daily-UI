/**
 * Color blindness simulator component
 * Uses SVG filters to simulate Protanopia, Deuteranopia, and Tritanopia
 */

import { useState, useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { Color } from '@/core/types';
import { colorToCSS } from '@/core/conversions';

interface ColorBlindSimulatorProps {
  colors: Color[];
  paletteName?: string;
}

type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | null;

// Color transformation matrices for color blindness simulation
// Based on the Brettel et al. (1997) algorithm
const COLOR_BLIND_MATRICES: Record<string, number[]> = {
  protanopia: [
    0.56667, 0.43333, 0, 0, 0,
    0.55833, 0.44167, 0, 0, 0,
    0, 0.24167, 0.75833, 0, 0,
    0, 0, 0, 1, 0,
  ],
  deuteranopia: [
    0.625, 0.375, 0, 0, 0,
    0.7, 0.3, 0, 0, 0,
    0, 0.3, 0.7, 0, 0,
    0, 0, 0, 1, 0,
  ],
  tritanopia: [
    0.95, 0.05, 0, 0, 0,
    0, 0.43333, 0.56667, 0, 0,
    0, 0.475, 0.525, 0, 0,
    0, 0, 0, 1, 0,
  ],
};

export default function ColorBlindSimulator({
  colors,
  paletteName = 'Palette',
}: ColorBlindSimulatorProps) {
  const [simulationType, setSimulationType] = useState<ColorBlindnessType>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  
  // Generate unique filter ID for each instance
  const filterId = useMemo(() => {
    return `colorblind-filter-${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  
  const getFilterMatrix = (type: ColorBlindnessType): string => {
    if (!type) return '';
    const matrix = COLOR_BLIND_MATRICES[type];
    return `matrix(${matrix.join(' ')})`;
  };
  
  const getSimulationLabel = (type: ColorBlindnessType): string => {
    switch (type) {
      case 'protanopia':
        return 'Protanopia (Red-blind)';
      case 'deuteranopia':
        return 'Deuteranopia (Green-blind)';
      case 'tritanopia':
        return 'Tritanopia (Blue-blind)';
      default:
        return 'Normal Vision';
    }
  };
  
  const handleSimulationChange = (type: ColorBlindnessType) => {
    setSimulationType(type);
    setShowSimulation(type !== null);
  };
  
  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Color Blindness Simulator
        </h3>
        
        <button
          onClick={() => setShowSimulation(!showSimulation)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label={showSimulation ? 'Hide simulation' : 'Show simulation'}
        >
          {showSimulation ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Simulation
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Simulation
            </>
          )}
        </button>
      </div>
      
      {/* SVG Filters Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values={simulationType ? COLOR_BLIND_MATRICES[simulationType].join(' ') : '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'}
            />
          </filter>
        </defs>
      </svg>
      
      {/* Simulation Type Selector */}
      {showSimulation && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleSimulationChange(null)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              simulationType === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => handleSimulationChange('protanopia')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              simulationType === 'protanopia'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Protanopia
          </button>
          <button
            onClick={() => handleSimulationChange('deuteranopia')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              simulationType === 'deuteranopia'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Deuteranopia
          </button>
          <button
            onClick={() => handleSimulationChange('tritanopia')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              simulationType === 'tritanopia'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Tritanopia
          </button>
        </div>
      )}
      
      {/* Color Swatches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {paletteName}
          </p>
          {showSimulation && simulationType && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {getSimulationLabel(simulationType)}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {colors.map((color, index) => {
            const colorString = colorToCSS(color);
            
            return (
              <div key={index} className="space-y-2">
                {/* Normal View */}
                {!showSimulation && (
                  <div
                    className="w-full aspect-square rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: colorString }}
                    aria-label={`Color ${index + 1}: ${colorString}`}
                  />
                )}
                
                {/* Simulated View */}
                {showSimulation && (
                  <div
                    className="w-full aspect-square rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700"
                    style={{
                      backgroundColor: colorString,
                      filter: simulationType ? `url(#${filterId})` : 'none',
                    }}
                    aria-label={`Color ${index + 1} as ${simulationType || 'normal'}: ${colorString}`}
                  />
                )}
                
                <div className="text-xs text-center font-mono text-gray-600 dark:text-gray-400 truncate">
                  {colorString}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Side-by-Side Comparison */}
      {showSimulation && simulationType && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Side-by-Side Comparison
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Normal Vision */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                Normal Vision
              </p>
              <div className="flex gap-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 aspect-square rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: colorToCSS(color) }}
                  />
                ))}
              </div>
            </div>
            
            {/* Simulated Vision */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                {getSimulationLabel(simulationType)}
              </p>
              <div className="flex gap-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 aspect-square rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    style={{
                      backgroundColor: colorToCSS(color),
                      filter: `url(#${filterId})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Information */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>About Color Blindness:</strong> Protanopia affects red-green color perception,
          Deuteranopia also affects red-green but differently, and Tritanopia affects blue-yellow
          perception. Use this simulator to ensure your color palette is accessible to users with
          color vision deficiencies.
        </p>
      </div>
    </div>
  );
}

