/**
 * Stacking Context Management Utility
 * 
 * Manages z-index values using a logical layering system
 * to avoid arbitrary high z-index values.
 */

export const STACKING_LAYERS = {
    // Base content layer: z-index 0-9
    BASE: {
        min: 0,
        max: 9,
        content: 1,
        profile: 2,
    },
    
    // Overlays layer: z-index 10-19
    OVERLAY: {
        min: 10,
        max: 19,
        buttons: 10,
        stickyNav: 15,
        postButton: 12,
    },
    
    // Modals/Context menus layer: z-index 20-29
    MODAL: {
        min: 20,
        max: 29,
        contextMenu: 25,
        modal: 20,
    },
};

/**
 * Creates a new stacking context using isolation
 * @param {HTMLElement} element - Element to create context on
 * @param {number} zIndex - Z-index value within the layer
 */
export function createStackingContext(element, zIndex) {
    if (!element) return;
    
    element.style.isolation = 'isolate';
    element.style.zIndex = zIndex;
}

/**
 * Gets a z-index value for a specific layer and component
 * @param {string} layer - Layer name ('BASE', 'OVERLAY', 'MODAL')
 * @param {string} component - Component name within the layer
 * @returns {number} Z-index value
 */
export function getZIndex(layer, component) {
    const layerData = STACKING_LAYERS[layer];
    if (!layerData) {
        console.warn(`Unknown layer: ${layer}`);
        return 0;
    }
    
    const zIndex = layerData[component];
    if (zIndex === undefined) {
        console.warn(`Unknown component ${component} in layer ${layer}`);
        return layerData.min;
    }
    
    return zIndex;
}

/**
 * Validates that a z-index is within the expected range
 * @param {number} zIndex - Z-index value to validate
 * @param {string} layer - Expected layer
 * @returns {boolean} True if valid
 */
export function validateZIndex(zIndex, layer) {
    const layerData = STACKING_LAYERS[layer];
    if (!layerData) return false;
    
    return zIndex >= layerData.min && zIndex <= layerData.max;
}

