import type { MenuCategory } from "@/types/menu";

/**
 * Deterministic seeded pseudo-random utilities used to shape the organic
 * category bubbles. The same seed always yields the same silhouette, so the
 * layout is stable across renders, viewports and deployments.
 */

/** FNV-1a 32-bit string hash → unsigned seed. */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32 PRNG. Returns a function yielding floats in [0, 1). */
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface BubbleGeometry {
  /** Eight-token border-radius: `h1 h2 h3 h4 / v1 v2 v3 v4`. */
  borderRadius: string;
  /** Slight rotation in degrees to break the grid. */
  tilt: number;
}

const TILT_MIN = -3.5;
const TILT_MAX = 3.5;

const ORGANIC_RADIUS_PRESETS = [
  "42% 58% 52% 48% / 48% 42% 58% 52%",
  "54% 46% 62% 38% / 44% 58% 42% 56%",
  "46% 54% 38% 62% / 58% 44% 56% 42%",
  "58% 42% 48% 52% / 52% 62% 38% 48%",
  "50% 50% 60% 40% / 40% 56% 44% 60%",
  "44% 56% 50% 50% / 60% 46% 54% 40%",
] as const;

/**
 * Generate a stable organic silhouette for a given seed key
 * (typically the category id, e.g. `6656e3bf…`).
 */
export function bubbleGeometry(seedKey: string): BubbleGeometry {
  const random = mulberry32(fnv1a(`bubble:${seedKey}`));
  const range = (min: number, max: number) => min + random() * (max - min);
  const presetIndex = Math.floor(random() * ORGANIC_RADIUS_PRESETS.length);

  // Use restrained, curated silhouettes instead of independent corner values.
  // This keeps the deformation organic without creating sharp or lopsided blobs.
  const borderRadius = ORGANIC_RADIUS_PRESETS[presetIndex];

  return {
    borderRadius,
    tilt: Number(range(TILT_MIN, TILT_MAX).toFixed(2)),
  };
}

/** Uniform bubble size: every category contributes the same row weight. */
export const CATEGORY_WEIGHT = 1.0;
export const CATEGORY_ASPECT = 1.12;

/**
 * Distribute categories into balanced rows of at most three bubbles. This
 * avoids a visually dominant final bubble, for example `2 + 2` instead of
 * `3 + 1` for four categories.
 */
export function layoutBubbleRows(categories: MenuCategory[]): MenuCategory[][] {
  if (categories.length === 0) {
    return [];
  }

  const rowCount = Math.ceil(categories.length / 3);
  const baseRowSize = Math.floor(categories.length / rowCount);
  const largerRowCount = categories.length % rowCount;
  const rows: MenuCategory[][] = [];
  let offset = 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const rowSize = baseRowSize + (rowIndex < largerRowCount ? 1 : 0);
    rows.push(categories.slice(offset, offset + rowSize));
    offset += rowSize;
  }

  return rows;
}