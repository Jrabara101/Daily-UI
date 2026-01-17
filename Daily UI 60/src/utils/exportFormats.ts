/**
 * Export engine for multiple formats
 * Supports Tailwind Config, CSS Variables, JSON, and Adobe Swatch Exchange (.ase)
 */

import type { Color, ColorWithMetadata } from '@/core/types';
import { convertColor, colorToCSS } from '@/core/conversions';

export type ExportFormat = 'tailwind' | 'css' | 'json' | 'ase';

interface ExportOptions {
  format: ExportFormat;
  colors: Color[];
  paletteName?: string;
}

/**
 * Export colors as Tailwind Config
 */
export function exportTailwindConfig(
  colors: Color[],
  paletteName: string = 'custom'
): string {
  const colorEntries: string[] = [];
  
  colors.forEach((color, index) => {
    const hex = convertColor(color, 'hex');
    const name = `color-${index + 1}`;
    colorEntries.push(`    '${name}': '${hex.value}'`);
  });
  
  return `export default {
  theme: {
    extend: {
      colors: {
        ${paletteName}: {
${colorEntries.join(',\n')}
        },
      },
    },
  },
};`;
}

/**
 * Export colors as CSS Variables
 */
export function exportCSSVariables(
  colors: Color[],
  paletteName: string = 'custom'
): string {
  const cssVars: string[] = [];
  const cssClasses: string[] = [];
  
  cssVars.push(`:root {`);
  
  colors.forEach((color, index) => {
    const css = colorToCSS(color);
    const varName = `--${paletteName}-color-${index + 1}`;
    cssVars.push(`  ${varName}: ${css};`);
    cssClasses.push(`.${paletteName}-color-${index + 1} {`);
    cssClasses.push(`  color: var(${varName});`);
    cssClasses.push(`}`);
  });
  
  cssVars.push(`}`);
  
  return cssVars.join('\n') + '\n\n' + cssClasses.join('\n');
}

/**
 * Export colors as JSON
 */
export function exportJSON(
  colors: Color[],
  paletteName: string = 'custom'
): string {
  const data = {
    name: paletteName,
    colors: colors.map((color, index) => ({
      id: index + 1,
      hex: convertColor(color, 'hex').value,
      rgb: convertColor(color, 'rgb'),
      hsl: convertColor(color, 'hsl'),
      css: colorToCSS(color),
    })),
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Export colors as Adobe Swatch Exchange (.ase)
 * ASE is a binary format used by Adobe applications
 */
export function exportASE(
  colors: Color[],
  paletteName: string = 'custom'
): Blob {
  // ASE file format structure:
  // Header: 4 bytes (file signature "ASEF") + version (4 bytes)
  // Color count: 2 bytes
  // For each color:
  //   - Block type (2 bytes): 0x0001 for color entry
  //   - Block length (4 bytes)
  //   - Color name length (2 bytes) + color name (UTF-16BE)
  //   - Color model (4 bytes): "RGB ", "Gray", "CMYK", "LAB "
  //   - Color values (depends on model)
  
  const encoder = new TextEncoder();
  const buffer: number[] = [];
  
  // Helper to write bytes
  const writeBytes = (bytes: number[]) => {
    buffer.push(...bytes);
  };
  
  // Helper to write 16-bit big-endian
  const writeUInt16BE = (value: number) => {
    buffer.push((value >>> 8) & 0xff, value & 0xff);
  };
  
  // Helper to write 32-bit big-endian
  const writeUInt32BE = (value: number) => {
    buffer.push(
      (value >>> 24) & 0xff,
      (value >>> 16) & 0xff,
      (value >>> 8) & 0xff,
      value & 0xff
    );
  };
  
  // Helper to write UTF-16BE string
  const writeUTF16BE = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      writeUInt16BE(code);
    }
  };
  
  // Header: "ASEF"
  writeBytes([0x41, 0x53, 0x45, 0x46]); // "ASEF"
  
  // Version: 1.0 (0x00010000)
  writeUInt32BE(0x00010000);
  
  // Color count
  writeUInt16BE(colors.length);
  
  // Write each color
  colors.forEach((color, index) => {
    const rgb = convertColor(color, 'rgb');
    const colorName = `${paletteName}-${index + 1}`;
    
    // Block type: Color entry (0x0001)
    writeUInt16BE(0x0001);
    
    // Calculate block length
    // 2 (name length) + name length * 2 (UTF-16BE) + 4 (model) + 12 (RGB values) + 2 (color type)
    const nameLength = colorName.length;
    const blockLength = 2 + nameLength * 2 + 4 + 12 + 2;
    writeUInt32BE(blockLength);
    
    // Color name length and name
    writeUInt16BE(nameLength);
    writeUTF16BE(colorName);
    
    // Color model: "RGB " (4 bytes)
    writeBytes([0x52, 0x47, 0x42, 0x20]); // "RGB "
    
    // RGB values (32-bit float, big-endian)
    const writeFloat32BE = (value: number) => {
      const buf = new ArrayBuffer(4);
      const view = new DataView(buf);
      view.setFloat32(0, value, false); // false = big-endian
      const bytes = new Uint8Array(buf);
      buffer.push(...Array.from(bytes));
    };
    
    writeFloat32BE(rgb.r / 255); // Red (0-1)
    writeFloat32BE(rgb.g / 255); // Green (0-1)
    writeFloat32BE(rgb.b / 255); // Blue (0-1)
    
    // Color type: Global (0x0000) or Spot (0x0001) or Normal (0x0002)
    writeUInt16BE(0x0002); // Normal
  });
  
  // Convert buffer to Uint8Array and create Blob
  const uint8Array = new Uint8Array(buffer);
  return new Blob([uint8Array], { type: 'application/octet-stream' });
}

/**
 * Export colors in the specified format
 */
export function exportColors(options: ExportOptions): string | Blob {
  const { format, colors, paletteName = 'custom' } = options;
  
  switch (format) {
    case 'tailwind':
      return exportTailwindConfig(colors, paletteName);
    case 'css':
      return exportCSSVariables(colors, paletteName);
    case 'json':
      return exportJSON(colors, paletteName);
    case 'ase':
      return exportASE(colors, paletteName);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Download exported content
 */
export function downloadExport(
  content: string | Blob,
  filename: string,
  mimeType: string = 'text/plain'
) {
  const blob = typeof content === 'string'
    ? new Blob([content], { type: mimeType })
    : content;
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

