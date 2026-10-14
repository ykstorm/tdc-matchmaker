// Shared shapes for turning a raw difference into a 0..1 score.

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

// Full marks inside [min, max], losing `falloff` per unit outside it.
export function bandScore(value: number, min: number, max: number, falloff: number) {
  if (value < min) return clamp01(1 - (min - value) * falloff);
  if (value > max) return clamp01(1 - (value - max) * falloff);
  return 1;
}

export function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
