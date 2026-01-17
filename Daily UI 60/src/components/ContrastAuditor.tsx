/**
 * Real-time WCAG contrast auditor component
 * Displays WCAG 2.1 pass/fail scorecard with visual preview
 */

import { useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Color } from '@/core/types';
import { generateContrastScorecard, formatContrastRatio } from '@/core/contrast';
import { colorToCSS } from '@/core/conversions';

interface ContrastAuditorProps {
  backgroundColor: Color;
}

export default function ContrastAuditor({ backgroundColor }: ContrastAuditorProps) {
  const scorecard = useMemo(
    () => generateContrastScorecard(backgroundColor),
    [backgroundColor]
  );
  
  const whiteBetter = scorecard.whiteOnColor.ratio > scorecard.blackOnColor.ratio;
  const bestResult = whiteBetter ? scorecard.whiteOnColor : scorecard.blackOnColor;
  
  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        WCAG 2.1 Contrast Scorecard
      </h3>
      
      {/* Visual Preview */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* White Text Preview */}
        <div
          className="p-4 rounded-lg shadow-sm border-2"
          style={{
            backgroundColor: colorToCSS(backgroundColor),
            borderColor: scorecard.whiteOnColor.ratio >= 4.5 ? '#10b981' : '#ef4444',
          }}
        >
          <p
            className="text-white font-semibold text-base mb-2"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            White Text
          </p>
          <p
            className="text-white text-sm mb-1"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            Normal Text (16pt)
          </p>
          <p
            className="text-white text-xl font-bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            Large Text (18pt+)
          </p>
        </div>
        
        {/* Black Text Preview */}
        <div
          className="p-4 rounded-lg shadow-sm border-2"
          style={{
            backgroundColor: colorToCSS(backgroundColor),
            borderColor: scorecard.blackOnColor.ratio >= 4.5 ? '#10b981' : '#ef4444',
          }}
        >
          <p
            className="text-black font-semibold text-base mb-2"
            style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}
          >
            Black Text
          </p>
          <p
            className="text-black text-sm mb-1"
            style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}
          >
            Normal Text (16pt)
          </p>
          <p
            className="text-black text-xl font-bold"
            style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}
          >
            Large Text (18pt+)
          </p>
        </div>
      </div>
      
      {/* White Text Contrast Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              White Text Contrast
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatContrastRatio(scorecard.whiteOnColor.ratio)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {scorecard.whiteOnColor.passesAAA ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">AAA</span>
              </span>
            ) : scorecard.whiteOnColor.passesAA ? (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">AA</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Fail</span>
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
            <span className="text-gray-600 dark:text-gray-400">Normal Text AA:</span>
            {scorecard.whiteOnColor.passesAA ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
            <span className="text-gray-600 dark:text-gray-400">Normal Text AAA:</span>
            {scorecard.whiteOnColor.passesAAA ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
            <span className="text-gray-600 dark:text-gray-400">Large Text AA:</span>
            {scorecard.whiteOnColor.passesAALarge ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
            <span className="text-gray-600 dark:text-gray-400">Large Text AAA:</span>
            {scorecard.whiteOnColor.passesAAALarge ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      </div>
      
      {/* Black Text Contrast Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Black Text Contrast
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatContrastRatio(scorecard.blackOnColor.ratio)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {scorecard.blackOnColor.passesAAA ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">AAA</span>
              </span>
            ) : scorecard.blackOnColor.passesAA ? (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">AA</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Fail</span>
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
            <span className="text-gray-600 dark:text-gray-400">Normal Text AA:</span>
            {scorecard.blackOnColor.passesAA ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
            <span className="text-gray-600 dark:text-gray-400">Normal Text AAA:</span>
            {scorecard.blackOnColor.passesAAA ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
            <span className="text-gray-600 dark:text-gray-400">Large Text AA:</span>
            {scorecard.blackOnColor.passesAALarge ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
            <span className="text-gray-600 dark:text-gray-400">Large Text AAA:</span>
            {scorecard.blackOnColor.passesAAALarge ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Recommendations
            </h4>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              {scorecard.recommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Best Option Highlight */}
      {bestResult.ratio >= 4.5 && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Best Option: Use {whiteBetter ? 'white' : 'black'} text for optimal contrast
              ({formatContrastRatio(bestResult.ratio)})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

