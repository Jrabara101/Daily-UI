/**
 * WCAG 2.1 contrast calculation engine
 * Implements WCAG 2.1 formulas for relative luminance and contrast ratio
 */

import type { Color, RGBColor } from './types';
import { convertColor, colorToCSS } from './conversions';
import { isRGBColor } from './types';

// WCAG 2.1 relative luminance calculation
function getRelativeLuminance(rgb: RGBColor): number {
  // Convert to linear RGB (normalize to 0-1)
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;
  
  // Apply gamma correction
  const r = rsRGB <= 0.04045 
    ? rsRGB / 12.92 
    : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.04045 
    ? gsRGB / 12.92 
    : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.04045 
    ? bsRGB / 12.92 
    : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 * Returns a value between 1 (same color) and 21 (white vs black)
 */
export function getContrastRatio(color1: Color, color2: Color): number {
  const rgb1 = isRGBColor(color1) ? color1 : convertColor(color1, 'rgb') as RGBColor;
  const rgb2 = isRGBColor(color2) ? color2 : convertColor(color2, 'rgb') as RGBColor;
  
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  
  // Ensure lighter color is numerator
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  // Contrast ratio formula: (L1 + 0.05) / (L2 + 0.05)
  return (lighter + 0.05) / (darker + 0.05);
}

export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAALarge: boolean;
  passesAAA: boolean;
  passesAAALarge: boolean;
  level: 'AAA' | 'AA' | 'Fail';
  levelLarge: 'AAA' | 'AA' | 'Fail';
}

/**
 * Check contrast compliance against WCAG 2.1 standards
 * - AA (normal text): 4.5:1
 * - AA (large text): 3:1
 * - AAA (normal text): 7:1
 * - AAA (large text): 4.5:1
 */
export function checkContrast(
  foreground: Color,
  background: Color
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);
  
  // WCAG 2.1 thresholds
  const AA_NORMAL = 4.5;
  const AA_LARGE = 3.0;
  const AAA_NORMAL = 7.0;
  const AAA_LARGE = 4.5;
  
  const passesAA = ratio >= AA_NORMAL;
  const passesAALarge = ratio >= AA_LARGE;
  const passesAAA = ratio >= AAA_NORMAL;
  const passesAAALarge = ratio >= AAA_LARGE;
  
  let level: 'AAA' | 'AA' | 'Fail';
  if (ratio >= AAA_NORMAL) {
    level = 'AAA';
  } else if (ratio >= AA_NORMAL) {
    level = 'AA';
  } else {
    level = 'Fail';
  }
  
  let levelLarge: 'AAA' | 'AA' | 'Fail';
  if (ratio >= AAA_LARGE) {
    levelLarge = 'AAA';
  } else if (ratio >= AA_LARGE) {
    levelLarge = 'AA';
  } else {
    levelLarge = 'Fail';
  }
  
  return {
    ratio,
    passesAA,
    passesAALarge,
    passesAAA,
    passesAAALarge,
    level,
    levelLarge,
  };
}

export interface ContrastScorecard {
  whiteOnColor: ContrastResult;
  blackOnColor: ContrastResult;
  recommendations: string[];
}

/**
 * Generate a comprehensive contrast scorecard for a background color
 * Tests both white and black text on the background
 */
export function generateContrastScorecard(backgroundColor: Color): ContrastScorecard {
  const whiteColor: RGBColor = { type: 'rgb', r: 255, g: 255, b: 255 };
  const blackColor: RGBColor = { type: 'rgb', r: 0, g: 0, b: 0 };
  
  const whiteOnColor = checkContrast(whiteColor, backgroundColor);
  const blackOnColor = checkContrast(blackColor, backgroundColor);
  
  const recommendations: string[] = [];
  
  // Determine best text color
  const whiteBetter = whiteOnColor.ratio > blackOnColor.ratio;
  const bestContrast = whiteBetter ? whiteOnColor : blackOnColor;
  
  if (bestContrast.ratio < 3.0) {
    recommendations.push('⚠️ Very low contrast. Text will be difficult to read.');
  } else if (bestContrast.ratio < 4.5) {
    recommendations.push('⚠️ Use large text (18pt+) or larger bold text (14pt+) for minimum readability.');
  } else if (bestContrast.ratio < 7.0) {
    recommendations.push('✓ Meets AA standards. Use normal text size.');
  } else {
    recommendations.push('✓✓ Meets AAA standards. Excellent contrast!');
  }
  
  if (whiteBetter) {
    recommendations.push('Use white/light text on this background.');
  } else {
    recommendations.push('Use black/dark text on this background.');
  }
  
  return {
    whiteOnColor,
    blackOnColor,
    recommendations,
  };
}

// Helper to format contrast ratio
export function formatContrastRatio(ratio: number): string {
  return ratio.toFixed(2) + ':1';
}

