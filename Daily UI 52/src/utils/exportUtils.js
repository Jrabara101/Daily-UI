/**
 * Export SVG to downloadable file
 */
export function exportSVG(svgElement, filename = 'logo.svg') {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(svgUrl);
}

/**
 * Convert SVG to PNG using Canvas API
 */
export function exportPNG(svgElement, width, height, filename = 'logo.png', scale = 2) {
  return new Promise((resolve, reject) => {
    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      // Set canvas size with scale for high resolution
      canvas.width = width * scale;
      canvas.height = height * scale;

      img.onload = () => {
        // Draw scaled image
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = filename;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png');
      };

      img.onerror = reject;
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Export in multiple sizes
 */
export async function exportMultipleSizes(svgElement, sizes, format = 'png') {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
  const svgNode = svgDoc.documentElement;
  
  // Get original dimensions
  const viewBox = svgNode.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 200, 200];
  const originalWidth = viewBox[2] || 200;
  const originalHeight = viewBox[3] || 200;
  const aspectRatio = originalWidth / originalHeight;

  for (const size of sizes) {
    let width, height;
    if (typeof size === 'number') {
      width = size;
      height = size / aspectRatio;
    } else {
      width = size.width;
      height = size.height;
    }

    const filename = format === 'svg' 
      ? `logo-${width}x${height}.svg`
      : `logo-${width}x${height}.png`;

    if (format === 'svg') {
      // For SVG, create a new SVG with the target dimensions
      svgNode.setAttribute('width', width);
      svgNode.setAttribute('height', height);
      exportSVG(svgNode, filename);
    } else {
      // For PNG, use canvas
      await exportPNG(svgElement, width, height, filename, 2);
    }
  }
}






