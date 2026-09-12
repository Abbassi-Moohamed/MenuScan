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
  /** Vertical drift in px to stagger rows of bubbles. */
  translateY: number;
}

const HORIZONTAL_MIN = 0.34;
const HORIZONTAL_MAX = 0.68;
const VERTICAL_MIN = 0.42;
const VERTICAL_MAX = 0.72;
const TILT_MIN = -3.5;
const TILT_MAX = 3.5;
const DRIFT_MIN = -2;
const DRIFT_MAX = 8;

/**
 * Generate a stable organic silhouette for a given seed key
 * (typically the category slug, e.g. `coffee`).
 */
export function bubbleGeometry(seedKey: string): BubbleGeometry {
  const random = mulberry32(fnv1a(`bubble:${seedKey}`));
  const range = (min: number, max: number) => min + random() * (max - min);
  const percent = (min: number, max: number) => `${(range(min, max) * 100).toFixed(2)}%`;

  const corners = Array.from({ length: 4 }, () => percent(HORIZONTAL_MIN, HORIZONTAL_MAX));
  const verticals = Array.from({ length: 4 }, () => percent(VERTICAL_MIN, VERTICAL_MAX));

  return {
    borderRadius: `${corners.join(" ")} / ${verticals.join(" ")}`,
    tilt: Number(range(TILT_MIN, TILT_MAX).toFixed(2)),
    translateY: Number(range(DRIFT_MIN, DRIFT_MAX).toFixed(1)),
  };
}

export type MenuCategorySize = "xl" | "lg" | "md" | "sm";

export interface SizeMeta {
  /** Relative width per unit weight in a row (1.0 ≈ average). */
  weight: number;
  /** Width / height ratio — larger means a wider, shallower bubble. */
  aspect: number;
}

const SIZE_META: Record<MenuCategorySize, SizeMeta> = {
  xl: { weight: 1.45, aspect: 1.5 },
  lg: { weight: 1.1, aspect: 1.28 },
  md: { weight: 1.0, aspect: 1.12 },
  sm: { weight: 0.78, aspect: 1.02 },
};

/** Maximum combined weight per row before wrapping to a new row. */
const MAX_ROW_WEIGHT = 3.1;

export function categorySize(category: MenuCategory): MenuCategorySize {
  return category.size ?? "md";
}

export function categoryWeight(category: MenuCategory): number {
  return SIZE_META[categorySize(category)].weight;
}

export function categoryAspect(category: MenuCategory): number {
  return SIZE_META[categorySize(category)].aspect;
}

/**
 * Greedy "float" layout: pack categories into rows while each row's total
 * weight stays below `MAX_ROW_WEIGHT`, so rows fill with 2–3 varied bubbles.
 */
export function layoutBubbleRows(categories: MenuCategory[]): MenuCategory[][] {
  const rows: MenuCategory[][] = [];
  let current: MenuCategory[] = [];
  let weight = 0;

  for (const category of categories) {
    const nextWeight = categoryWeight(category);
    if (current.length > 0 && weight + nextWeight > MAX_ROW_WEIGHT) {
      rows.push(current);
      current = [];
      weight = 0;
    }
    current.push(category);
    weight += nextWeight;
  }

  if (current.length > 0) {
    rows.push(current);
  }

  return rows;
}