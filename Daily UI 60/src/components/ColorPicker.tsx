/**
 * GPU-accelerated Canvas color picker component
 * Renders a 2D saturation/brightness square and hue ring at 60fps
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { Color, HSLColor, OKLCHColor } from '@/core/types';
import { convertColor, rgbToHSL, hslToRGB, rgbToOKLCH, oklchToRGB, colorToCSS } from '@/core/conversions';

interface ColorPickerProps {
  color: Color;
  colorSpace?: 'hsl' | 'oklch';
  onChange: (color: Color) => void;
  size?: number;
}

interface PickerPosition {
  x: number;
  y: number;
  hue: number;
}

export default function ColorPicker({
  color,
  colorSpace = 'oklch',
  onChange,
  size = 300,
}: ColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [position, setPosition] = useState<PickerPosition>({ x: 0, y: 0, hue: 0 });
  
  // Convert color to HSL/OKLCH for picker
  const colorInSpace = convertColor(color, colorSpace === 'oklch' ? 'oklch' : 'hsl') as HSLColor | OKLCHColor;
  
  // Initialize position from color
  useEffect(() => {
    if (colorSpace === 'hsl') {
      const hsl = colorInSpace as HSLColor;
      setPosition({
        x: hsl.s / 100,
        y: 1 - hsl.l / 100,
        hue: hsl.h / 360,
      });
    } else {
      const oklch = colorInSpace as OKLCHColor;
      const hue = isNaN(oklch.h) ? 0 : oklch.h / 360;
      setPosition({
        x: oklch.c / 0.4, // Chroma normalized to 0-1
        y: 1 - oklch.l, // Lightness inverted for y-axis
        hue,
      });
    }
  }, [color, colorSpace]);
  
  // Draw saturation/brightness square
  const drawColorSquare = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const hueValue = position.hue * 360;
    
    // Create gradient data
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const s = x / width;
        const v = 1 - y / height;
        
        let r = 0, g = 0, b = 0;
        
        if (colorSpace === 'hsl') {
          const hsl: HSLColor = {
            type: 'hsl',
            h: hueValue,
            s: s * 100,
            l: v * 100,
          };
          const rgb = hslToRGB(hsl);
          r = rgb.r;
          g = rgb.g;
          b = rgb.b;
        } else {
          const oklch: OKLCHColor = {
            type: 'oklch',
            l: v,
            c: s * 0.4,
            h: isNaN(hueValue) ? 0 : hueValue,
          };
          const rgb = oklchToRGB(oklch);
          r = rgb.r;
          g = rgb.g;
          b = rgb.b;
        }
        
        const index = (y * width + x) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Draw picker indicator
    const pickerX = position.x * width;
    const pickerY = position.y * height;
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pickerX, pickerY, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pickerX, pickerY, 9, 0, Math.PI * 2);
    ctx.stroke();
  }, [position, colorSpace]);
  
  // Draw hue ring
  const drawHueRing = useCallback(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    const innerRadius = radius - 30;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw hue gradient
    const angleStep = (2 * Math.PI) / 360;
    
    for (let angle = 0; angle < Math.PI * 2; angle += angleStep) {
      const hue = (angle * 180) / Math.PI;
      
      const hsl: HSLColor = {
        type: 'hsl',
        h: hue,
        s: 100,
        l: 50,
      };
      const rgb = hslToRGB(hsl);
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + innerRadius * Math.cos(angle),
        centerY + innerRadius * Math.sin(angle)
      );
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw hue indicator
    const currentAngle = position.hue * Math.PI * 2;
    const indicatorRadius = (radius + innerRadius) / 2;
    const indicatorX = centerX + indicatorRadius * Math.cos(currentAngle);
    const indicatorY = centerY + indicatorRadius * Math.sin(currentAngle);
    
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [position.hue]);
  
  // Render loop
  useEffect(() => {
    let animationFrame: number;
    
    const render = () => {
      drawColorSquare();
      drawHueRing();
      animationFrame = requestAnimationFrame(render);
    };
    
    if (isDragging || isDraggingHue) {
      animationFrame = requestAnimationFrame(render);
    } else {
      drawColorSquare();
      drawHueRing();
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isDragging, isDraggingHue, drawColorSquare, drawHueRing]);
  
  // Get color from position
  const getColorFromPosition = useCallback((x: number, y: number, hue: number): Color => {
    if (colorSpace === 'hsl') {
      const hsl: HSLColor = {
        type: 'hsl',
        h: hue * 360,
        s: x * 100,
        l: (1 - y) * 100,
      };
      return hsl;
    } else {
      const oklch: OKLCHColor = {
        type: 'oklch',
        l: 1 - y,
        c: x * 0.4,
        h: hue * 360,
      };
      return oklch;
    }
  }, [colorSpace]);
  
  // Handle mouse/touch events
  const handleSquareInteraction = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    
    const newPosition = { ...position, x, y };
    setPosition(newPosition);
    
    const newColor = getColorFromPosition(x, y, position.hue);
    onChange(newColor);
  }, [position, getColorFromPosition, onChange]);
  
  const handleHueInteraction = useCallback((clientX: number, clientY: number) => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const angle = Math.atan2(dy, dx);
    let hue = (angle + Math.PI * 2) % (Math.PI * 2);
    if (hue < 0) hue += Math.PI * 2;
    hue = hue / (Math.PI * 2);
    
    const newPosition = { ...position, hue };
    setPosition(newPosition);
    
    const newColor = getColorFromPosition(position.x, position.y, hue);
    onChange(newColor);
  }, [position, getColorFromPosition, onChange]);
  
  const handleMouseDown = (e: React.MouseEvent, isHue: boolean) => {
    e.preventDefault();
    if (isHue) {
      setIsDraggingHue(true);
      handleHueInteraction(e.clientX, e.clientY);
    } else {
      setIsDragging(true);
      handleSquareInteraction(e.clientX, e.clientY);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSquareInteraction(e.clientX, e.clientY);
    } else if (isDraggingHue) {
      handleHueInteraction(e.clientX, e.clientY);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingHue(false);
  };
  
  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent, isHue: boolean) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (isHue) {
      setIsDraggingHue(true);
      handleHueInteraction(touch.clientX, touch.clientY);
    } else {
      setIsDragging(true);
      handleSquareInteraction(touch.clientX, touch.clientY);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (isDragging) {
      handleSquareInteraction(touch.clientX, touch.clientY);
    } else if (isDraggingHue) {
      handleHueInteraction(touch.clientX, touch.clientY);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsDraggingHue(false);
  };
  
  // Global mouse/touch handlers
  useEffect(() => {
    if (isDragging || isDraggingHue) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          handleSquareInteraction(e.clientX, e.clientY);
        } else if (isDraggingHue) {
          handleHueInteraction(e.clientX, e.clientY);
        }
      };
      
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setIsDraggingHue(false);
      };
      
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, isDraggingHue, handleSquareInteraction, handleHueInteraction]);
  
  return (
    <div ref={containerRef} className="relative inline-block">
      <div className="flex gap-4 items-center">
        {/* Color Square */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="cursor-crosshair rounded-lg shadow-lg"
            onMouseDown={(e) => handleMouseDown(e, false)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={(e) => handleTouchStart(e, false)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ width: size, height: size }}
          />
        </div>
        
        {/* Hue Ring */}
        <div className="relative">
          <canvas
            ref={hueCanvasRef}
            width={80}
            height={size}
            className="cursor-pointer rounded-lg shadow-lg"
            onMouseDown={(e) => handleMouseDown(e, true)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={(e) => handleTouchStart(e, true)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ width: 80, height: size }}
          />
        </div>
      </div>
      
      {/* Current Color Preview */}
      <div
        className="mt-4 w-full h-16 rounded-lg shadow-md border-2 border-gray-300 dark:border-gray-600"
        style={{ backgroundColor: colorToCSS(color) }}
      />
    </div>
  );
}

