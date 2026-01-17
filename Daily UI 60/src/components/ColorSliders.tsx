/**
 * Custom gradient sliders with dynamic CSS variable updates
 * Shows gradients based on other slider positions for OKLCH/RGB/HSL
 */

import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import type { Color, OKLCHColor, RGBColor, HSLColor } from '@/core/types';
import { convertColor, oklchToRGB, rgbToOKLCH, hslToRGB, rgbToHSL, colorToCSS } from '@/core/conversions';

interface ColorSlidersProps {
  color: Color;
  colorSpace?: 'oklch' | 'rgb' | 'hsl';
  onChange: (color: Color) => void;
}

interface SliderConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  getGradient: (value: number) => string;
  formatValue: (value: number) => string;
}

export default function ColorSliders({
  color,
  colorSpace = 'oklch',
  onChange,
}: ColorSlidersProps) {
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>({});
  const [isDragging, setIsDragging] = useState<string | null>(null);
  
  // Convert color to current color space
  const colorInSpace = convertColor(color, colorSpace) as OKLCHColor | RGBColor | HSLColor;
  
  // Update slider values when color changes
  useEffect(() => {
    if (colorSpace === 'oklch') {
      const oklch = colorInSpace as OKLCHColor;
      setSliderValues({
        l: oklch.l,
        c: oklch.c,
        h: isNaN(oklch.h) ? 0 : oklch.h,
      });
    } else if (colorSpace === 'rgb') {
      const rgb = colorInSpace as RGBColor;
      setSliderValues({
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
      });
    } else if (colorSpace === 'hsl') {
      const hsl = colorInSpace as HSLColor;
      setSliderValues({
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
      });
    }
  }, [color, colorSpace]);
  
  // Generate gradients for sliders
  const getOKLCHGradient = useCallback((channel: 'l' | 'c' | 'h', value: number): string => {
    const current = sliderValues;
    let colors: string[] = [];
    
    if (channel === 'l') {
      // Lightness gradient: vary lightness, keep chroma and hue constant
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const l = i / steps;
        const oklch: OKLCHColor = {
          type: 'oklch',
          l,
          c: current.c ?? 0.1,
          h: current.h ?? 0,
        };
        colors.push(colorToCSS(oklchToRGB(oklch)));
      }
    } else if (channel === 'c') {
      // Chroma gradient: vary chroma, keep lightness and hue constant
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const c = (i / steps) * 0.4;
        const oklch: OKLCHColor = {
          type: 'oklch',
          l: current.l ?? 0.5,
          c,
          h: current.h ?? 0,
        };
        colors.push(colorToCSS(oklchToRGB(oklch)));
      }
    } else if (channel === 'h') {
      // Hue gradient: vary hue, keep lightness and chroma constant
      const steps = 12;
      for (let i = 0; i <= steps; i++) {
        const h = (i / steps) * 360;
        const oklch: OKLCHColor = {
          type: 'oklch',
          l: current.l ?? 0.5,
          c: current.c ?? 0.1,
          h,
        };
        colors.push(colorToCSS(oklchToRGB(oklch)));
      }
    }
    
    return `linear-gradient(to right, ${colors.join(', ')})`;
  }, [sliderValues]);
  
  const getRGBGradient = useCallback((channel: 'r' | 'g' | 'b', value: number): string => {
    const current = sliderValues;
    let colors: string[] = [];
    
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const v = (i / steps) * 255;
      const rgb: RGBColor = {
        type: 'rgb',
        r: channel === 'r' ? v : (current.r ?? 128),
        g: channel === 'g' ? v : (current.g ?? 128),
        b: channel === 'b' ? v : (current.b ?? 128),
      };
      colors.push(colorToCSS(rgb));
    }
    
    return `linear-gradient(to right, ${colors.join(', ')})`;
  }, [sliderValues]);
  
  const getHSLGradient = useCallback((channel: 'h' | 's' | 'l', value: number): string => {
    const current = sliderValues;
    let colors: string[] = [];
    
    if (channel === 'h') {
      const steps = 12;
      for (let i = 0; i <= steps; i++) {
        const h = (i / steps) * 360;
        const hsl: HSLColor = {
          type: 'hsl',
          h,
          s: current.s ?? 50,
          l: current.l ?? 50,
        };
        colors.push(colorToCSS(hslToRGB(hsl)));
      }
    } else {
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const v = (i / steps) * 100;
        const hsl: HSLColor = {
          type: 'hsl',
          h: current.h ?? 0,
          s: channel === 's' ? v : (current.s ?? 50),
          l: channel === 'l' ? v : (current.l ?? 50),
        };
        colors.push(colorToCSS(hslToRGB(hsl)));
      }
    }
    
    return `linear-gradient(to right, ${colors.join(', ')})`;
  }, [sliderValues]);
  
  // Generate slider configurations
  const sliders = useMemo<SliderConfig[]>(() => {
    if (colorSpace === 'oklch') {
      const oklch = colorInSpace as OKLCHColor;
      return [
        {
          label: 'Lightness',
          min: 0,
          max: 1,
          step: 0.01,
          value: sliderValues.l ?? oklch.l,
          getGradient: (value: number) => getOKLCHGradient('l', value),
          formatValue: (v) => `${Math.round(v * 100)}%`,
        },
        {
          label: 'Chroma',
          min: 0,
          max: 0.4,
          step: 0.001,
          value: sliderValues.c ?? oklch.c,
          getGradient: (value: number) => getOKLCHGradient('c', value),
          formatValue: (v) => v.toFixed(2),
        },
        {
          label: 'Hue',
          min: 0,
          max: 360,
          step: 1,
          value: sliderValues.h ?? (isNaN(oklch.h) ? 0 : oklch.h),
          getGradient: (value: number) => getOKLCHGradient('h', value),
          formatValue: (v) => `${Math.round(v)}°`,
        },
      ];
    } else if (colorSpace === 'rgb') {
      const rgb = colorInSpace as RGBColor;
      return [
        {
          label: 'Red',
          min: 0,
          max: 255,
          step: 1,
          value: sliderValues.r ?? rgb.r,
          getGradient: (value: number) => getRGBGradient('r', value),
          formatValue: (v) => Math.round(v).toString(),
        },
        {
          label: 'Green',
          min: 0,
          max: 255,
          step: 1,
          value: sliderValues.g ?? rgb.g,
          getGradient: (value: number) => getRGBGradient('g', value),
          formatValue: (v) => Math.round(v).toString(),
        },
        {
          label: 'Blue',
          min: 0,
          max: 255,
          step: 1,
          value: sliderValues.b ?? rgb.b,
          getGradient: (value: number) => getRGBGradient('b', value),
          formatValue: (v) => Math.round(v).toString(),
        },
      ];
    } else {
      const hsl = colorInSpace as HSLColor;
      return [
        {
          label: 'Hue',
          min: 0,
          max: 360,
          step: 1,
          value: sliderValues.h ?? hsl.h,
          getGradient: (value: number) => getHSLGradient('h', value),
          formatValue: (v) => `${Math.round(v)}°`,
        },
        {
          label: 'Saturation',
          min: 0,
          max: 100,
          step: 1,
          value: sliderValues.s ?? hsl.s,
          getGradient: (value: number) => getHSLGradient('s', value),
          formatValue: (v) => `${Math.round(v)}%`,
        },
        {
          label: 'Lightness',
          min: 0,
          max: 100,
          step: 1,
          value: sliderValues.l ?? hsl.l,
          getGradient: (value: number) => getHSLGradient('l', value),
          formatValue: (v) => `${Math.round(v)}%`,
        },
      ];
    }
  }, [colorSpace, colorInSpace, sliderValues, getOKLCHGradient, getRGBGradient, getHSLGradient]);
  
  // Handle slider change
  const handleSliderChange = useCallback((index: number, newValue: number) => {
    const newSliderValues = { ...sliderValues };
    const slider = sliders[index];
    
    if (colorSpace === 'oklch') {
      if (slider.label === 'Lightness') newSliderValues.l = newValue;
      else if (slider.label === 'Chroma') newSliderValues.c = newValue;
      else if (slider.label === 'Hue') newSliderValues.h = newValue;
      
      const oklch: OKLCHColor = {
        type: 'oklch',
        l: newSliderValues.l ?? 0.5,
        c: newSliderValues.c ?? 0.1,
        h: newSliderValues.h ?? 0,
      };
      onChange(oklch);
    } else if (colorSpace === 'rgb') {
      if (slider.label === 'Red') newSliderValues.r = newValue;
      else if (slider.label === 'Green') newSliderValues.g = newValue;
      else if (slider.label === 'Blue') newSliderValues.b = newValue;
      
      const rgb: RGBColor = {
        type: 'rgb',
        r: newSliderValues.r ?? 128,
        g: newSliderValues.g ?? 128,
        b: newSliderValues.b ?? 128,
      };
      onChange(rgb);
    } else if (colorSpace === 'hsl') {
      if (slider.label === 'Hue') newSliderValues.h = newValue;
      else if (slider.label === 'Saturation') newSliderValues.s = newValue;
      else if (slider.label === 'Lightness') newSliderValues.l = newValue;
      
      const hsl: HSLColor = {
        type: 'hsl',
        h: newSliderValues.h ?? 0,
        s: newSliderValues.s ?? 50,
        l: newSliderValues.l ?? 50,
      };
      onChange(hsl);
    }
    
    setSliderValues(newSliderValues);
  }, [sliderValues, sliders, colorSpace, onChange]);
  
  return (
    <div className="space-y-4">
      {sliders.map((slider, index) => {
        const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        const sliderKey = slider.label.toLowerCase();
        
        return (
          <div key={slider.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {slider.label}
              </label>
              <input
                type="number"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={slider.value}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    handleSliderChange(index, Math.max(slider.min, Math.min(slider.max, value)));
                  }
                }}
                className="w-20 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[3rem] text-right">
                {slider.formatValue(slider.value)}
              </span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={slider.value}
                onChange={(e) => handleSliderChange(index, parseFloat(e.target.value))}
                onMouseDown={() => setIsDragging(sliderKey)}
                onMouseUp={() => setIsDragging(null)}
                onTouchStart={() => setIsDragging(sliderKey)}
                onTouchEnd={() => setIsDragging(null)}
                className="w-full h-8 appearance-none cursor-pointer rounded-lg"
                style={{
                  background: slider.getGradient(slider.value),
                  backgroundSize: '100% 100%',
                }}
              />
              
              {/* Custom thumb indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${percentage}%`,
                  transform: 'translateX(-50%) translateY(-50%)',
                }}
              >
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-400 shadow-md" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

