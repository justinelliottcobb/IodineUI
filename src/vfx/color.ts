/**
 * Convert a hex color string to a vec3 (RGB, 0-1 range).
 * Supports #RGB, #RRGGBB, #RRGGBBAA formats.
 */
export function hexToVec3(hex: string): [number, number, number] {
  let h = hex.replace('#', '')

  if (h.length === 3 || h.length === 4) {
    h = h
      .slice(0, 3)
      .split('')
      .map((c) => c + c)
      .join('')
  }

  if (h.length === 8) {
    h = h.slice(0, 6)
  }

  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255

  return [r, g, b]
}

/**
 * Convert a vec3 (0-1 range) to an rgba CSS string.
 */
export function vec3ToRgba(rgb: [number, number, number], alpha = 1.0): string {
  const [r, g, b] = rgb.map((v) => Math.round(v * 255))
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
