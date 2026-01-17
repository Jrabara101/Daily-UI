/**
 * Color space conversion utilities
 * Supports bidirectional conversions between HEX, RGB, HSL, CMYK, OKLCH
 */

import type {
  Color,
  HexColor,
  RGBColor,
  HSLColor,
  CMYKColor,
  OKLCHColor,
} from './types';

// ===== RGB Conversions =====

export function hexToRGB(hex: HexColor): RGBColor {
  let hexValue = hex.value.replace('#', '');
  
  // Handle shorthand hex (#f00 -> #ff0000)
  if (hexValue.length === 3) {
    hexValue = hexValue
      .split('')
      .map(char => char + char)
      .join('');
  }
  
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);
  
  return {
    type: 'rgb',
    r,
    g,
    b,
    alpha: hex.alpha,
  };
}

export function rgbToHex(rgb: RGBColor): HexColor {
  const r = Math.round(rgb.r).toString(16).padStart(2, '0');
  const g = Math.round(rgb.g).toString(16).padStart(2, '0');
  const b = Math.round(rgb.b).toString(16).padStart(2, '0');
  
  return {
    type: 'hex',
    value: `#${r}${g}${b}`,
    alpha: rgb.alpha,
  };
}

export function hslToRGB(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  
  let r: number, g: number, b: number;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    type: 'rgb',
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    alpha: hsl.alpha,
  };
}

export function rgbToHSL(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    type: 'hsl',
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    alpha: rgb.alpha,
  };
}

export function cmykToRGB(cmyk: CMYKColor): RGBColor {
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;
  
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  
  return {
    type: 'rgb',
    r,
    g,
    b,
    alpha: cmyk.alpha,
  };
}

export function rgbToCMYK(rgb: RGBColor): CMYKColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const k = 1 - Math.max(r, g, b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
  
  return {
    type: 'cmyk',
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
    alpha: rgb.alpha,
  };
}

// ===== OKLCH Conversions =====
// OKLCH → Lab → XYZ → RGB

// Linear RGB to sRGB (gamma correction)
function linearToSRGB(value: number): number {
  if (value <= 0.0031308) {
    return 12.92 * value;
  }
  return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

// sRGB to Linear RGB (inverse gamma correction)
function sRGBToLinear(value: number): number {
  if (value <= 0.04045) {
    return value / 12.92;
  }
  return Math.pow((value + 0.055) / 1.055, 2.4);
}

// XYZ to Linear RGB
function xyzToLinearRGB(x: number, y: number, z: number): [number, number, number] {
  const r = x *  3.2404542 + y * -1.5371385 + z * -0.4985314;
  const g = x * -0.9692660 + y *  1.8760108 + z *  0.0415560;
  const b = x *  0.0556434 + y * -0.2040259 + z *  1.0572252;
  return [r, g, b];
}

// Linear RGB to XYZ
function linearRGBToXYZ(r: number, g: number, b: number): [number, number, number] {
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;
  return [x, y, z];
}

// Lab to XYZ (D65 white point)
function labToXYZ(l: number, a: number, b: number): [number, number, number] {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  
  const xr = fx > 0.206897 ? fx * fx * fx : (fx - 16 / 116) / 7.787;
  const yr = fy > 0.206897 ? fy * fy * fy : (fy - 16 / 116) / 7.787;
  const zr = fz > 0.206897 ? fz * fz * fz : (fz - 16 / 116) / 7.787;
  
  // D65 white point
  const xn = 0.95047;
  const yn = 1.00000;
  const zn = 1.08883;
  
  return [xr * xn, yr * yn, zr * zn];
}

// XYZ to Lab (D65 white point)
function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // D65 white point
  const xn = 0.95047;
  const yn = 1.00000;
  const zn = 1.08883;
  
  const xr = x / xn;
  const yr = y / yn;
  const zr = z / zn;
  
  const fx = xr > 0.008856 ? Math.cbrt(xr) : (7.787 * xr + 16 / 116);
  const fy = yr > 0.008856 ? Math.cbrt(yr) : (7.787 * yr + 16 / 116);
  const fz = zr > 0.008856 ? Math.cbrt(zr) : (7.787 * zr + 16 / 116);
  
  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);
  
  return [l, a, b];
}

// OKLab to Lab
function oklabToLab(l: number, a: number, b: number): [number, number, number] {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
  
  const l_l = l_ * l_ * l_;
  const m_l = m_ * m_ * m_;
  const s_l = s_ * s_ * s_;
  
  return [
    0.9999999984505198 * l_l + 0.3963377921737679 * m_l + 0.2158037580607588 * s_l,
    1.0000000088817609 * l_l + 0.7250124936433909 * m_l - 0.2042635579860374 * s_l,
    1.0000000546724109 * l_l - 0.1360464972868083 * m_l - 0.8640677617574592 * s_l,
  ];
}

// Lab to OKLab
function labToOKLab(l: number, a: number, b: number): [number, number, number] {
  const l_l = Math.cbrt(l);
  const m_l = Math.cbrt(a);
  const s_l = Math.cbrt(b);
  
  return [
    0.2104542553 * l_l + 0.7936177850 * m_l - 0.0040720468 * s_l,
    1.9779984951 * l_l - 2.4285922050 * m_l + 0.4505937099 * s_l,
    0.0259040371 * l_l + 0.7827717662 * m_l - 0.8086757660 * s_l,
  ];
}

// LCH to Lab
function lchToLab(l: number, c: number, h: number): [number, number, number] {
  if (isNaN(h)) {
    return [l, 0, 0];
  }
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  return [l, a, b];
}

// Lab to LCH
function labToLCH(l: number, a: number, b: number): [number, number, number] {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  if (c < 0.0001) h = NaN;
  return [l, c, h];
}

export function oklchToRGB(oklch: OKLCHColor): RGBColor {
  const [l, a, bVal] = lchToLab(oklch.l, oklch.c, oklch.h);
  const [labL, labA, labB] = oklabToLab(l, a, bVal);
  const [x, y, z] = labToXYZ(labL, labA, labB);
  const [rLin, gLin, bLin] = xyzToLinearRGB(x, y, z);
  
  const r = Math.max(0, Math.min(255, Math.round(linearToSRGB(rLin) * 255)));
  const g = Math.max(0, Math.min(255, Math.round(linearToSRGB(gLin) * 255)));
  const b = Math.max(0, Math.min(255, Math.round(linearToSRGB(bLin) * 255)));
  
  return {
    type: 'rgb',
    r,
    g,
    b,
    alpha: oklch.alpha,
  };
}

export function rgbToOKLCH(rgb: RGBColor): OKLCHColor {
  const rLin = sRGBToLinear(rgb.r / 255);
  const gLin = sRGBToLinear(rgb.g / 255);
  const bLin = sRGBToLinear(rgb.b / 255);
  
  const [x, y, z] = linearRGBToXYZ(rLin, gLin, bLin);
  const [labL, labA, labB] = xyzToLab(x, y, z);
  const [okL, okA, okB] = labToOKLab(labL, labA, labB);
  const [l, c, h] = labToLCH(okL, okA, okB);
  
  return {
    type: 'oklch',
    l: Math.max(0, Math.min(1, l)),
    c: Math.max(0, Math.min(0.4, c)),
    h: isNaN(h) ? 0 : h,
    alpha: rgb.alpha,
  };
}

// ===== Universal Conversion =====

export function convertColor(color: Color, targetType: Color['type']): Color {
  if (color.type === targetType) {
    return color;
  }
  
  // Convert to RGB first (common intermediate)
  let rgb: RGBColor;
  
  switch (color.type) {
    case 'hex':
      rgb = hexToRGB(color);
      break;
    case 'rgb':
      rgb = color;
      break;
    case 'hsl':
      rgb = hslToRGB(color);
      break;
    case 'cmyk':
      rgb = cmykToRGB(color);
      break;
    case 'oklch':
      rgb = oklchToRGB(color);
      break;
  }
  
  // Convert from RGB to target
  switch (targetType) {
    case 'hex':
      return rgbToHex(rgb);
    case 'rgb':
      return rgb;
    case 'hsl':
      return rgbToHSL(rgb);
    case 'cmyk':
      return rgbToCMYK(rgb);
    case 'oklch':
      return rgbToOKLCH(rgb);
  }
}

// Helper to get CSS color string
export function colorToCSS(color: Color): string {
  switch (color.type) {
    case 'hex':
      return color.alpha !== undefined && color.alpha < 1
        ? `rgba(${hexToRGB(color).r}, ${hexToRGB(color).g}, ${hexToRGB(color).b}, ${color.alpha})`
        : color.value;
    case 'rgb':
      return color.alpha !== undefined && color.alpha < 1
        ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.alpha})`
        : `rgb(${color.r}, ${color.g}, ${color.b})`;
    case 'hsl':
      return color.alpha !== undefined && color.alpha < 1
        ? `hsla(${color.h}, ${color.s}%, ${color.l}%, ${color.alpha})`
        : `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    case 'cmyk':
      const rgb = cmykToRGB(color);
      return color.alpha !== undefined && color.alpha < 1
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${color.alpha})`
        : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case 'oklch':
      const rgb2 = oklchToRGB(color);
      return color.alpha !== undefined && color.alpha < 1
        ? `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, ${color.alpha})`
        : `rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b})`;
  }
}

