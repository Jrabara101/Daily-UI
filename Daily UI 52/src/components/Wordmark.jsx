/**
 * Dynamic Wordmark Component with adjustable kerning
 */
export default function Wordmark({
  text = 'BRAND NAME',
  fontSize = 32,
  fontWeight = 700,
  color = '#1a1a1a',
  kerning = 0,
  fontFamily = 'system-ui, -apple-system, sans-serif',
}) {
  // Calculate letter spacing from kerning value (-1 to 1 maps to -0.1em to 0.1em)
  const letterSpacing = `${kerning * 0.1}em`;

  return (
    <div
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        letterSpacing,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        transition: 'letter-spacing 0.2s ease, color 0.3s ease',
      }}
      className="wordmark"
    >
      {text}
    </div>
  );
}








