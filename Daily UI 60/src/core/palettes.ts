/**
 * Palette generation algorithms
 * Generates color harmony palettes using OKLCH color space for perceptual uniformity
 */

import type { Color, OKLCHColor } from './types';
import { convertColor, rgbToOKLCH, oklchToRGB } from './conversions';

export type PaletteType = 'complementary' | 'triadic' | 'tetradic' | 'analogous';

export interface GeneratedPalette {
  type: PaletteType;
  colors: Color[];
}

/**
 * Generate complementary palette (180° hue offset)
 * Creates colors opposite on the color wheel
 */
export function generateComplementary(baseColor: Color): GeneratedPalette {
  const oklch = convertColor(baseColor, 'oklch') as OKLCHColor;
  const hue = isNaN(oklch.h) ? 0 : oklch.h;
  
  // Complementary: 180° offset
  const complementaryHue = (hue + 180) % 360;
  
  const complementary: OKLCHColor = {
    type: 'oklch',
    l: oklch.l,
    c: oklch.c,
    h: complementaryHue,
    alpha: oklch.alpha,
  };
  
  return {
    type: 'complementary',
    colors: [baseColor, oklchToRGB(complementary)],
  };
}

/**
 * Generate triadic palette (120° hue offsets)
 * Creates three evenly spaced colors on the color wheel
 */
export function generateTriadic(baseColor: Color): GeneratedPalette {
  const oklch = convertColor(baseColor, 'oklch') as OKLCHColor;
  const hue = isNaN(oklch.h) ? 0 : oklch.h;
  
  // Triadic: 120° offsets
  const hue1 = (hue + 120) % 360;
  const hue2 = (hue + 240) % 360;
  
  const color1: OKLCHColor = {
    type: 'oklch',
    l: oklch.l,
    c: oklch.c,
    h: hue1,
    alpha: oklch.alpha,
  };
  
  const color2: OKLCHColor = {
    type: 'oklch',
    l: oklch.l,
    c: oklch.c,
    h: hue2,
    alpha: oklch.alpha,
  };
  
  return {
    type: 'triadic',
    colors: [
      baseColor,
      oklchToRGB(color1),
      oklchToRGB(color2),
    ],
  };
}

/**
 * Generate tetradic palette (90° hue offsets, double-complement)
 * Creates four evenly spaced colors forming a rectangle on the color wheel
 */
export function generateTetradic(baseColor: Color): GeneratedPalette {
  const oklch = convertColor(baseColor, 'oklch') as OKLCHColor;
  const hue = isNaN(oklch.h) ? 0 : oklch.h;
  
  // Tetradic: 90° offsets
  const hue1 = (hue + 90) % 360;
  const hue2 = (hue + 180) % 360;
  const hue3 = (hue + 270) % 360;
  
  const color1: OKLCHColor = {
    type: 'oklch',
    l: oklch.l,
    c: oklch.c,
    h: hue1,
    alpha: oklch.alpha,
  };
  
  const color2: OKLCHColor = {
    type: 'oklch',
    l: oklch.l,
    c: oklch.c,
    h: hue2,
    alpha: oklch.alpha,
  };
  
  const color3: OKLCHColor = {
    type: 'oklch',
    l: oklch.l,
    c: oklch.c,
    h: hue3,
    alpha: oklch.alpha,
  };
  
  return {
    type: 'tetradic',
    colors: [
      baseColor,
      oklchToRGB(color1),
      oklchToRGB(color2),
      oklchToRGB(color3),
    ],
  };
}

/**
 * Generate analogous palette (±30° hue offsets)
 * Creates colors adjacent on the color wheel
 */
export function generateAnalogous(baseColor: Color): GeneratedPalette {
  const oklch = convertColor(baseColor, 'oklch') as OKLCHColor;
  const hue = isNaN(oklch.h) ? 0 : oklch.h;
  
  // Analogous: ±30° offsets
  const hue1 = (hue - 30 + 360) % 360;
  const hue2 = (hue + 30) % 360;
  
  const color1: OKLCHColor = {
    type: 'oklch',
    l: oklch.l,
    c: oklch.c,
    h: hue1,
    alpha: oklch.alpha,
  };
  
  const color2: OKLCHColor = {
    type: 'oklch',
    l: oklch.l,
    c: oklch.c,
    h: hue2,
    alpha: oklch.alpha,
  };
  
  return {
    type: 'analogous',
    colors: [
      oklchToRGB(color1),
      baseColor,
      oklchToRGB(color2),
    ],
  };
}

/**
 * Generate all palette types for a base color
 */
export function generateAllPalettes(baseColor: Color): Map<PaletteType, GeneratedPalette> {
  const palettes = new Map<PaletteType, GeneratedPalette>();
  
  palettes.set('complementary', generateComplementary(baseColor));
  palettes.set('triadic', generateTriadic(baseColor));
  palettes.set('tetradic', generateTetradic(baseColor));
  palettes.set('analogous', generateAnalogous(baseColor));
  
  return palettes;
}

/**
 * Generate palette with variations in lightness/chroma
 * Creates a more nuanced palette with multiple shades
 */
export function generatePaletteWithVariations(
  baseColor: Color,
  paletteType: PaletteType,
  variations: number = 2
): GeneratedPalette {
  const oklch = convertColor(baseColor, 'oklch') as OKLCHColor;
  const colors: Color[] = [baseColor];
  
  let palette: GeneratedPalette;
  
  switch (paletteType) {
    case 'complementary':
      palette = generateComplementary(baseColor);
      break;
    case 'triadic':
      palette = generateTriadic(baseColor);
      break;
    case 'tetradic':
      palette = generateTetradic(baseColor);
      break;
    case 'analogous':
      palette = generateAnalogous(baseColor);
      break;
  }
  
  // Generate variations for each color in the palette
  palette.colors.forEach((color) => {
    const colorOKLCH = convertColor(color, 'oklch') as OKLCHColor;
    
    // Create lighter and darker variations
    for (let i = 1; i <= variations; i++) {
      const lighterVariation: OKLCHColor = {
        type: 'oklch',
        l: Math.min(1, colorOKLCH.l + 0.1 * i),
        c: Math.max(0, colorOKLCH.c - 0.02 * i),
        h: colorOKLCH.h,
        alpha: colorOKLCH.alpha,
      };
      
      const darkerVariation: OKLCHColor = {
        type: 'oklch',
        l: Math.max(0, colorOKLCH.l - 0.1 * i),
        c: Math.max(0, colorOKLCH.c - 0.02 * i),
        h: colorOKLCH.h,
        alpha: colorOKLCH.alpha,
      };
      
      colors.push(oklchToRGB(lighterVariation));
      colors.push(oklchToRGB(darkerVariation));
    }
  });
  
  return {
    type: paletteType,
    colors,
  };
}

