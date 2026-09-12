"use client";

import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { useMemo } from "react";

import { bubbleGeometry } from "@/lib/blob";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/types/menu";

import { accentGradientStyle } from "./accentGradient";

interface CategoryBubbleProps {
  category: MenuCategory;
  /** Proportion of the row this bubble occupies (from the size meta). */
  weight: number;
  /** Width / height ratio used to size the bubble. */
  aspect: number;
  countLabel: string;
  onOpen: (event: ReactMouseEvent<HTMLButtonElement>, category: MenuCategory) => void;
  className?: string;
}

export function CategoryBubble({
  category,
  weight,
  aspect,
  countLabel,
  onOpen,
  className,
}: CategoryBubbleProps) {
  const geometry = useMemo(() => bubbleGeometry(category.slug), [category.slug]);

  const style = {
    flexGrow: weight,
    aspectRatio: aspect.toFixed(3),
    borderRadius: geometry.borderRadius,
    transform: `rotate(${geometry.tilt}deg) translateY(${geometry.translateY}px)`,
    ...accentGradientStyle(category.accent),
  } as CSSProperties;

  return (
    <button
      type="button"
      className={cn("bubble", className)}
      style={style}
      onClick={(event) => onOpen(event, category)}
      aria-haspopup="dialog"
      aria-label={`${category.name} — ${countLabel}`}
    >
      {category.icon ? (
        <span className="bubble__icon" aria-hidden="true">
          {category.icon}
        </span>
      ) : null}
      <span className="bubble__name">{category.name}</span>
      <span className="bubble__count">{countLabel}</span>
    </button>
  );
}