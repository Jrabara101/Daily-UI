/**
 * Color Extraction Module
 * 
 * Analyzes the dominant color of the profile image and applies
 * a gradient aura behind the profile text for legibility.
 */

export class ColorExtraction {
    constructor(imageElement, profileTextElement) {
        this.image = imageElement;
        this.profileText = profileTextElement;
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        if (!this.image) {
            console.warn('ColorExtraction: Missing image element');
            return;
        }
        
        // Wait for image to load
        if (this.image.complete) {
            this.extractColor();
        } else {
            this.image.addEventListener('load', () => this.extractColor());
            this.image.addEventListener('error', () => {
                console.warn('ColorExtraction: Failed to load image');
            });
        }
    }
    
    /**
     * Extract dominant color from image
     */
    extractColor() {
        try {
            // Create canvas
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Set canvas size (smaller for performance)
            const sampleSize = 100;
            this.canvas.width = sampleSize;
            this.canvas.height = sampleSize;
            
            // Draw image to canvas
            this.ctx.drawImage(this.image, 0, 0, sampleSize, sampleSize);
            
            // Sample pixels (grid sampling for performance)
            const sampleStep = 10;
            const colors = [];
            
            for (let y = 0; y < sampleSize; y += sampleStep) {
                for (let x = 0; x < sampleSize; x += sampleStep) {
                    const pixelData = this.ctx.getImageData(x, y, 1, 1).data;
                    const r = pixelData[0];
                    const g = pixelData[1];
                    const b = pixelData[2];
                    
                    // Skip very light or very dark pixels (likely not dominant)
                    const brightness = (r + g + b) / 3;
                    if (brightness > 20 && brightness < 235) {
                        colors.push({ r, g, b });
                    }
                }
            }
            
            if (colors.length === 0) {
                // Fallback to default color
                this.applyColor('#1a1a2e');
                return;
            }
            
            // Calculate average color (simple method)
            // For more accuracy, could use k-means clustering
            const avgColor = this.calculateAverageColor(colors);
            
            // Apply the color
            this.applyColor(avgColor);
            
        } catch (error) {
            console.warn('ColorExtraction: Error extracting color', error);
            // Fallback to default
            this.applyColor('#1a1a2e');
        }
    }
    
    /**
     * Calculate average color from array of RGB values
     */
    calculateAverageColor(colors) {
        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        
        colors.forEach(color => {
            totalR += color.r;
            totalG += color.g;
            totalB += color.b;
        });
        
        const count = colors.length;
        const r = Math.round(totalR / count);
        const g = Math.round(totalG / count);
        const b = Math.round(totalB / count);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    /**
     * Apply extracted color as CSS custom property
     */
    applyColor(color) {
        // Convert RGB to hex if needed
        let hexColor = color;
        if (color.startsWith('rgb')) {
            hexColor = this.rgbToHex(color);
        }
        
        // Set CSS custom property
        document.documentElement.style.setProperty('--dominant-color', hexColor);
        
        // Create gradient aura
        const gradientAura = `linear-gradient(135deg, ${hexColor}80 0%, transparent 100%)`;
        document.documentElement.style.setProperty('--gradient-aura', gradientAura);
        
        // Apply background to profile text for legibility
        if (this.profileText) {
            // Create a blurred background effect
            const style = document.createElement('style');
            style.textContent = `
                .profile-name::after {
                    content: '';
                    position: absolute;
                    top: -20px;
                    left: -20px;
                    right: -20px;
                    bottom: -20px;
                    background: ${gradientAura};
                    filter: blur(30px);
                    opacity: 0.6;
                    z-index: -1;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Convert RGB string to hex
     */
    rgbToHex(rgb) {
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return '#1a1a2e';
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
}



