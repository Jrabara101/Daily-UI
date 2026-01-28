/**
 * Export Engine Module
 * One-click export to PNG or PDF
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Export dashboard as PNG
 * @param {HTMLElement} element - Dashboard container element
 * @param {string} filename - Output filename
 * @returns {Promise<void>}
 */
export const exportAsPNG = async (element, filename = 'omnisight-dashboard.png') => {
    try {
        // Show loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
        
        // Configure html2canvas options for high-resolution export
        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#f9fafb',
            width: element.scrollWidth,
            height: element.scrollHeight,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (blob) {
                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
            
            // Hide loading overlay
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }, 'image/png', 1.0);
        
    } catch (error) {
        console.error('Error exporting PNG:', error);
        alert('Failed to export dashboard as PNG. Please try again.');
        
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }
};

/**
 * Export dashboard as PDF
 * @param {HTMLElement} element - Dashboard container element
 * @param {string} filename - Output filename
 * @returns {Promise<void>}
 */
export const exportAsPDF = async (element, filename = 'omnisight-dashboard.pdf') => {
    try {
        // Show loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
        
        // Capture as canvas first
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#f9fafb',
            width: element.scrollWidth,
            height: element.scrollHeight
        });
        
        // Calculate PDF dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
        
        // Create PDF
        const pdf = new jsPDF({
            orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
        });
        
        // Add image to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Save PDF
        pdf.save(filename);
        
        // Hide loading overlay
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Failed to export dashboard as PDF. Please try again.');
        
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }
};

/**
 * Show export options menu
 * @param {HTMLElement} button - Export button element
 * @param {HTMLElement} dashboard - Dashboard container element
 */
export const showExportMenu = (button, dashboard) => {
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50';
    menu.innerHTML = `
        <div class="py-1">
            <button class="export-option w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-format="png">
                Export as PNG
            </button>
            <button class="export-option w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-format="pdf">
                Export as PDF
            </button>
        </div>
    `;
    
    // Position menu
    const buttonRect = button.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${buttonRect.bottom + 8}px`;
    menu.style.right = `${window.innerWidth - buttonRect.right}px`;
    
    document.body.appendChild(menu);
    
    // Handle clicks
    menu.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', async (e) => {
            const format = e.target.dataset.format;
            const timestamp = new Date().toISOString().split('T')[0];
            
            if (format === 'png') {
                await exportAsPNG(dashboard, `omnisight-dashboard-${timestamp}.png`);
            } else if (format === 'pdf') {
                await exportAsPDF(dashboard, `omnisight-dashboard-${timestamp}.pdf`);
            }
            
            // Remove menu
            document.body.removeChild(menu);
        });
    });
    
    // Close menu on outside click
    const closeMenu = (e) => {
        if (!menu.contains(e.target) && e.target !== button) {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 0);
};

