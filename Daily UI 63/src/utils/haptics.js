/**
 * Haptics Utility
 * 
 * Provides haptic feedback for supported devices
 */

/**
 * Check if haptic feedback is supported
 * @returns {boolean} True if navigator.vibrate is available
 */
export function isHapticsSupported() {
    return 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 * @param {number|number[]} pattern - Vibration pattern (ms or array of ms)
 * @returns {boolean} True if vibration was triggered
 */
export function vibrate(pattern = 50) {
    if (!isHapticsSupported()) {
        return false;
    }
    
    try {
        return navigator.vibrate(pattern);
    } catch (error) {
        console.warn('Haptic feedback failed:', error);
        return false;
    }
}

/**
 * Short vibration pattern (single tap)
 */
export function vibrateShort() {
    return vibrate(50);
}

/**
 * Medium vibration pattern (double tap)
 */
export function vibrateMedium() {
    return vibrate([50, 30, 50]);
}

/**
 * Long vibration pattern (error/alert)
 */
export function vibrateLong() {
    return vibrate([100, 50, 100, 50, 100]);
}

