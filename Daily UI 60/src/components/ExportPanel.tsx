/**
 * Export panel component
 * Allows users to export their palette in multiple formats
 */

import { useState } from 'react';
import { Download, FileText, Code, Database, Palette } from 'lucide-react';
import type { Color } from '@/core/types';
import type { ExportFormat } from '@/utils/exportFormats';
import { exportColors, downloadExport } from '@/utils/exportFormats';

interface ExportPanelProps {
  colors: Color[];
  paletteName?: string;
}

export default function ExportPanel({ colors, paletteName = 'custom' }: ExportPanelProps) {
  const [exportName, setExportName] = useState(paletteName);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = (format: ExportFormat) => {
    if (colors.length === 0) {
      alert('No colors to export');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const content = exportColors({
        format,
        colors,
        paletteName: exportName || 'custom',
      });
      
      let filename: string;
      let mimeType: string;
      
      switch (format) {
        case 'tailwind':
          filename = `${exportName || 'palette'}.config.js`;
          mimeType = 'application/javascript';
          break;
        case 'css':
          filename = `${exportName || 'palette'}.css`;
          mimeType = 'text/css';
          break;
        case 'json':
          filename = `${exportName || 'palette'}.json`;
          mimeType = 'application/json';
          break;
        case 'ase':
          filename = `${exportName || 'palette'}.ase`;
          mimeType = 'application/octet-stream';
          break;
      }
      
      downloadExport(content, filename, mimeType);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportFormats = [
    {
      key: 'tailwind' as ExportFormat,
      label: 'Tailwind Config',
      icon: Code,
      description: 'Export as Tailwind CSS configuration',
    },
    {
      key: 'css' as ExportFormat,
      label: 'CSS Variables',
      icon: FileText,
      description: 'Export as CSS custom properties',
    },
    {
      key: 'json' as ExportFormat,
      label: 'JSON',
      icon: Database,
      description: 'Export as JSON format',
    },
    {
      key: 'ase' as ExportFormat,
      label: 'Adobe Swatch',
      icon: Palette,
      description: 'Export as Adobe Swatch Exchange (.ase)',
    },
  ];
  
  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Export Palette
      </h3>
      
      {/* Palette Name Input */}
      <div className="space-y-2">
        <label
          htmlFor="palette-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Palette Name
        </label>
        <input
          id="palette-name"
          type="text"
          value={exportName}
          onChange={(e) => setExportName(e.target.value)}
          placeholder="Enter palette name"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {exportFormats.map((format) => {
          const Icon = format.icon;
          
          return (
            <button
              key={format.key}
              onClick={() => handleExport(format.key)}
              disabled={isExporting || colors.length === 0}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                ${isExporting || colors.length === 0
                  ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500 hover:shadow-md active:scale-95'
                }
              `}
              aria-label={`Export as ${format.label}`}
            >
              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {format.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {format.description}
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          );
        })}
      </div>
      
      {colors.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No colors to export. Select a color first.
        </p>
      )}
      
      {isExporting && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Exporting...
        </p>
      )}
    </div>
  );
}

