/**
 * useLocalStorage hook for persistence
 * Saves and loads recent colors from localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import type { Color, ColorWithMetadata } from '@/core/types';
import { generateColorId } from '@/core/types';

const STORAGE_KEY = 'chroma-sync-recent-colors';
const MAX_RECENT_COLORS = 20;

export function useLocalStorage() {
  const [recentColors, setRecentColors] = useState<ColorWithMetadata[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentColors(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load recent colors from localStorage:', error);
    }
  }, []);
  
  // Save to localStorage
  const saveRecentColor = useCallback((color: Color, name?: string) => {
    try {
      const colorWithMetadata: ColorWithMetadata = {
        id: generateColorId(),
        color,
        name,
        createdAt: Date.now(),
      };
      
      setRecentColors((prev) => {
        // Remove duplicates (same color value)
        const filtered = prev.filter(
          (item) => JSON.stringify(item.color) !== JSON.stringify(color)
        );
        
        // Add new color to the beginning
        const updated = [colorWithMetadata, ...filtered];
        
        // Limit to max recent colors
        const trimmed = updated.slice(0, MAX_RECENT_COLORS);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        
        return trimmed;
      });
    } catch (error) {
      console.error('Failed to save recent color to localStorage:', error);
    }
  }, []);
  
  // Remove a color from recent
  const removeRecentColor = useCallback((id: string) => {
    setRecentColors((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  // Clear all recent colors
  const clearRecentColors = useCallback(() => {
    setRecentColors([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  
  return {
    recentColors,
    saveRecentColor,
    removeRecentColor,
    clearRecentColors,
  };
}

