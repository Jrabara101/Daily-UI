/**
 * useColorHistory hook for undo/redo state management
 * Stack-based history with max 50 states (session-based, not persisted)
 */

import { useState, useCallback, useRef } from 'react';
import type { Color } from '@/core/types';

interface ColorHistoryState {
  past: Color[];
  present: Color;
  future: Color[];
}

const MAX_HISTORY_SIZE = 50;

export function useColorHistory(initialColor: Color) {
  const [state, setState] = useState<ColorHistoryState>({
    past: [],
    present: initialColor,
    future: [],
  });
  
  // Track if we're in a history operation to prevent infinite loops
  const isHistoryOperation = useRef(false);
  
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;
  
  const updateColor = useCallback((color: Color) => {
    // Don't add to history if we're in a history operation
    if (isHistoryOperation.current) {
      isHistoryOperation.current = false;
      setState((prev) => ({
        ...prev,
        present: color,
      }));
      return;
    }
    
    setState((prev) => {
      // Add current color to past
      const newPast = [...prev.past, prev.present];
      
      // Limit history size
      const trimmedPast = newPast.length > MAX_HISTORY_SIZE
        ? newPast.slice(-MAX_HISTORY_SIZE)
        : newPast;
      
      return {
        past: trimmedPast,
        present: color,
        future: [], // Clear future when new color is set
      };
    });
  }, []);
  
  const undo = useCallback(() => {
    if (!canUndo) return;
    
    isHistoryOperation.current = true;
    
    setState((prev) => {
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      const newFuture = [prev.present, ...prev.future];
      
      return {
        past: newPast,
        present: previous,
        future: newFuture,
      };
    });
  }, [canUndo]);
  
  const redo = useCallback(() => {
    if (!canRedo) return;
    
    isHistoryOperation.current = true;
    
    setState((prev) => {
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      const newPast = [...prev.past, prev.present];
      
      return {
        past: newPast,
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);
  
  const clearHistory = useCallback(() => {
    setState({
      past: [],
      present: state.present,
      future: [],
    });
  }, [state.present]);
  
  const reset = useCallback((color: Color) => {
    setState({
      past: [],
      present: color,
      future: [],
    });
  }, []);
  
  return {
    color: state.present,
    updateColor,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    reset,
    historySize: state.past.length,
  };
}

