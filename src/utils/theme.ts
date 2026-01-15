import chroma from 'chroma-js';

/**
 * Converts a Hex color to a space-separated HSL string for Tailwind/NativeWind CSS variables.
 * Format: "H S% L%" (e.g. "15 54% 50%")
 */
export function getHslString(hex: string): string {
  try {
    const [h, s, l] = chroma(hex).hsl();
    // Handle achromatic colors where h is NaN
    const hue = isNaN(h) ? 0 : h;
    return `${hue} ${s * 100}% ${l * 100}%`;
  } catch (e) {
    console.error('Failed to convert hex to HSL:', hex, e);
    return '0 0% 0%';
  }
}
