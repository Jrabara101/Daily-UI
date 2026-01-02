/**
 * Keyboard Navigation Utilities
 * Supports arrow keys and vim-style navigation
 */

export const KEYBOARD_KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  // Vim-style
  K: 'k',
  J: 'j',
  H: 'h',
  L: 'l',
}

export function isNavigationKey(key) {
  return [
    KEYBOARD_KEYS.ARROW_UP,
    KEYBOARD_KEYS.ARROW_DOWN,
    KEYBOARD_KEYS.ARROW_LEFT,
    KEYBOARD_KEYS.ARROW_RIGHT,
    KEYBOARD_KEYS.K,
    KEYBOARD_KEYS.J,
    KEYBOARD_KEYS.H,
    KEYBOARD_KEYS.L,
  ].includes(key)
}

export function getNavigationDirection(key, isVimMode = false) {
  if (isVimMode) {
    switch (key) {
      case KEYBOARD_KEYS.K:
        return 'up'
      case KEYBOARD_KEYS.J:
        return 'down'
      case KEYBOARD_KEYS.H:
        return 'left'
      case KEYBOARD_KEYS.L:
        return 'right'
      default:
        return null
    }
  } else {
    switch (key) {
      case KEYBOARD_KEYS.ARROW_UP:
        return 'up'
      case KEYBOARD_KEYS.ARROW_DOWN:
        return 'down'
      case KEYBOARD_KEYS.ARROW_LEFT:
        return 'left'
      case KEYBOARD_KEYS.ARROW_RIGHT:
        return 'right'
      default:
        return null
    }
  }
}

export function trapFocus(element) {
  if (!element) return

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

