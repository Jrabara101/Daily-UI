import { useMemo } from 'react'

/**
 * Generative SVG Logo Component
 * Creates a hexagonal logo with dynamic path manipulation
 */
export default function SVGLogo({
  color1 = '#06b6d4',
  color2 = '#ec4899',
  color3 = '#10b981',
  strokeWeight = 2,
  spacing = 10,
  size = 200,
  viewBoxSize = 200,
}) {
  // Calculate hexagon points dynamically
  const hexPoints = useMemo(() => {
    const centerX = viewBoxSize / 2;
    const centerY = viewBoxSize / 2;
    const radius = (viewBoxSize / 2) - spacing;
    const points = [];

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y });
    }

    return points;
  }, [viewBoxSize, spacing]);

  // Generate path data for interconnected hexagonal segments
  // Creates overlapping segments that form an interconnected hexagon pattern
  const paths = useMemo(() => {
    const centerX = viewBoxSize / 2;
    const centerY = viewBoxSize / 2;
    const radius = (viewBoxSize / 2) - spacing;
    
    // Create three overlapping segments that form an interconnected pattern
    // Each segment covers two opposite sides of the hexagon
    const path1 = `M ${centerX} ${centerY} L ${hexPoints[0].x} ${hexPoints[0].y} L ${hexPoints[1].x} ${hexPoints[1].y} L ${hexPoints[2].x} ${hexPoints[2].y} Z`;
    const path2 = `M ${centerX} ${centerY} L ${hexPoints[2].x} ${hexPoints[2].y} L ${hexPoints[3].x} ${hexPoints[3].y} L ${hexPoints[4].x} ${hexPoints[4].y} Z`;
    const path3 = `M ${centerX} ${centerY} L ${hexPoints[4].x} ${hexPoints[4].y} L ${hexPoints[5].x} ${hexPoints[5].y} L ${hexPoints[0].x} ${hexPoints[0].y} Z`;
    
    return [
      { d: path1, fill: color1, opacity: 0.85 },
      { d: path2, fill: color2, opacity: 0.85 },
      { d: path3, fill: color3, opacity: 0.85 },
    ];
  }, [hexPoints, color1, color2, color3, viewBoxSize, spacing]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        display: 'block',
        '--logo-color-1': color1,
        '--logo-color-2': color2,
        '--logo-color-3': color3,
        '--logo-stroke-weight': `${strokeWeight}px`,
      }}
      className="svg-logo"
    >
      <defs>
        <style>{`
          .svg-logo path {
            stroke: rgba(255, 255, 255, 0.2);
            stroke-width: var(--logo-stroke-weight);
            transition: fill 0.3s ease, opacity 0.3s ease;
          }
        `}</style>
      </defs>
      {paths.map((path, index) => (
        <path
          key={index}
          d={path.d}
          fill={path.fill}
          opacity={path.opacity}
        />
      ))}
    </svg>
  );
}

