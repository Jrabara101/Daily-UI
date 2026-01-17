/**
 * Core color type system with strongly typed interfaces and type guards
 * Supports multiple color spaces: HEX, RGB, HSL, CMYK, OKLCH
 */

export type ColorSpace = 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'oklch';

export interface HexColor {
  type: 'hex';
  value: string; // e.g., "#ff0000" or "#f00"
  alpha?: number; // 0-1, optional for hex
}

export interface RGBColor {
  type: 'rgb';
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  alpha?: number; // 0-1
}

export interface HSLColor {
  type: 'hsl';
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  alpha?: number; // 0-1
}

export interface CMYKColor {
  type: 'cmyk';
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
  alpha?: number; // 0-1
}

export interface OKLCHColor {
  type: 'oklch';
  l: number; // 0-1 (lightness)
  c: number; // 0-0.4 (chroma)
  h: number; // 0-360 (hue, NaN for grayscale)
  alpha?: number; // 0-1
}

export type Color = HexColor | RGBColor | HSLColor | CMYKColor | OKLCHColor;

export interface ColorMetadata {
  id: string;
  name?: string;
  createdAt: number;
}

export interface ColorWithMetadata extends ColorMetadata {
  color: Color;
}

// Type guards
export function isHexColor(color: Color): color is HexColor {
  return color.type === 'hex';
}

export function isRGBColor(color: Color): color is RGBColor {
  return color.type === 'rgb';
}

export function isHSLColor(color: Color): color is HSLColor {
  return color.type === 'hsl';
}

export function isCMYKColor(color: Color): color is CMYKColor {
  return color.type === 'cmyk';
}

export function isOKLCHColor(color: Color): color is OKLCHColor {
  return color.type === 'oklch';
}

// Validation functions
export function validateHex(hex: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
}

export function validateRGB(r: number, g: number, b: number): boolean {
  return (
    r >= 0 && r <= 255 &&
    g >= 0 && g <= 255 &&
    b >= 0 && b <= 255
  );
}

export function validateHSL(h: number, s: number, l: number): boolean {
  return (
    h >= 0 && h <= 360 &&
    s >= 0 && s <= 100 &&
    l >= 0 && l <= 100
  );
}

export function validateCMYK(c: number, m: number, y: number, k: number): boolean {
  return (
    c >= 0 && c <= 100 &&
    m >= 0 && m <= 100 &&
    y >= 0 && y <= 100 &&
    k >= 0 && k <= 100
  );
}

export function validateOKLCH(l: number, c: number, h: number): boolean {
  return (
    l >= 0 && l <= 1 &&
    c >= 0 && c <= 0.4 &&
    (h >= 0 && h <= 360 || isNaN(h))
  );
}

export function validateAlpha(alpha?: number): boolean {
  if (alpha === undefined) return true;
  return alpha >= 0 && alpha <= 1;
}

// Helper to create color IDs
export function generateColorId(): string {
  return `color-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

