"use client";

import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import { useRef, useState } from "react";
import Link from "next/link";

import { getDictionary } from "@/i18n";
import { bubbleGeometry, CATEGORY_ASPECT, CATEGORY_WEIGHT, layoutBubbleRows } from "@/lib/blob";
import { categoryAccentAt, categoryIcon } from "@/lib/adapters";
import { categoryHref } from "@/lib/utils";
import type { MenuCategory } from "@/types/menu";

import { accentGradientStyle } from "./accentGradient";

interface CategoryLinkProps {
  coffeeSlug: string;
  category: MenuCategory;
  visualIndex: number;
  offset: { x: number; y: number };
  onDragStart: (event: PointerEvent<HTMLAnchorElement>) => void;
  onDragMove: (event: PointerEvent<HTMLAnchorElement>) => void;
  onDragEnd: (event: PointerEvent<HTMLAnchorElement>) => void;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  dragging: boolean;
}

/**
 * One organic bubble, now a real `<a>` — the whole coffee menu is server
 * rendered and every bubble deep-links to `/menuscan/:slug/:categName`.
 */
function CategoryLink({
  coffeeSlug,
  category,
  visualIndex,
  offset,
  onDragStart,
  onDragMove,
  onDragEnd,
  onClick,
  dragging,
}: CategoryLinkProps) {
  const geometry = bubbleGeometry(category.id);
  const style = {
    flexGrow: CATEGORY_WEIGHT,
    aspectRatio: CATEGORY_ASPECT.toFixed(3),
    borderRadius: geometry.borderRadius,
    "--bubble-tilt": `${geometry.tilt}deg`,
    "--bubble-drift": `${geometry.translateY}px`,
    "--bubble-drift-x": `${geometry.translateX}px`,
    "--bubble-duration": "5.2s",
    "--bubble-delay": `${visualIndex * -320}ms`,
    "--bubble-direction": visualIndex % 2 === 0 ? "1" : "-1",
    "--bubble-overlay": categoryAccentAt(visualIndex + 5),
    "--bubble-border": categoryAccentAt(visualIndex + 9),
    ...accentGradientStyle(categoryAccentAt(visualIndex)),
    ...(category.image
      ? {
          backgroundImage: `linear-gradient(180deg, rgb(24 16 10 / 0.08), rgb(24 16 10 / 0.72)), url("${category.image}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}),
  } as CSSProperties;

  return (
    <div
      className={`bubble-drag-layer${dragging ? " bubble-drag-layer--active" : ""}`}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
    >
      <Link
        href={categoryHref(coffeeSlug, category.name)}
        className="bubble"
        style={style}
        aria-label={`${category.name}. Faites glisser pour déplacer.`}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        onClick={onClick}
      >
      <span className="bubble__icon" aria-hidden="true">
        {category.image ? (
          // Remote category images are decorative; the category name remains the accessible label.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="bubble__image" src={category.image} alt="" />
        ) : (
          categoryIcon(category.id, category.name)
        )}
      </span>
      <span className="bubble__name">{category.name}</span>
      </Link>
    </div>
  );
}

interface CategoryBubblesProps {
  /** Public slug of the coffee the categories belong to. */
  coffeeSlug: string;
  categories: MenuCategory[];
}

/**
 * Server-rendered bubble field for a coffee menu. Categories are resolved
 * within the coffee (backend data), each bubble linking to its own items page.
 */
export function CategoryBubbles({ coffeeSlug, categories }: CategoryBubblesProps) {
  const dict = getDictionary();
  const rows = layoutBubbleRows(categories);
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const dragRef = useRef<{
    id: string;
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const getSceneRange = (event: PointerEvent<HTMLAnchorElement>) => {
    const scene = event.currentTarget.closest(".bubble-field");
    if (!scene || typeof window === "undefined") {
      return { x: 64, y: 48 };
    }

    const bounds = scene.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const maxX = isMobile ? 150 : 260;
    const maxY = isMobile ? 220 : 340;

    return {
      // Every bubble receives the same scene-wide range, independent of row.
      x: Math.max(48, Math.min(maxX, bounds.width / 2 - 16)),
      y: Math.max(48, Math.min(maxY, bounds.height / 2 - 32)),
    };
  };

  const handleDragStart = (id: string, event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const current = offsets[id] ?? { x: 0, y: 0 };
    dragRef.current = {
      id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
      moved: false,
    };
    setDraggingId(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.hypot(deltaX, deltaY) > 6) {
      drag.moved = true;
      suppressClickRef.current = true;
    }
    if (!drag.moved) return;
    const range = getSceneRange(event);
    setOffsets((current) => ({
      ...current,
      [drag.id]: {
        x: Math.max(-range.x, Math.min(range.x, drag.originX + deltaX)),
        y: Math.max(-range.y, Math.min(range.y, drag.originY + deltaY)),
      },
    }));
  };

  const handleDragEnd = (event: PointerEvent<HTMLAnchorElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setDraggingId(null);
    }
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      suppressClickRef.current = false;
    }
  };

  if (categories.length === 0) {
    return (
      <div className="bubble-field">
        <div className="sheet-state">
          <p className="sheet-state__title">{dict.explore.emptyTitle}</p>
          <p className="sheet-state__text">{dict.explore.emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <nav className="bubble-field" aria-label={dict.explore.categoriesAriaLabel}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={`bubble-row bubble-row--${row.length}`}>
        {row.map((category, categoryIndex) => (
          <CategoryLink
            key={category.id}
            coffeeSlug={coffeeSlug}
            category={category}
            visualIndex={rowIndex * 3 + categoryIndex}
            offset={offsets[category.id] ?? { x: 0, y: 0 }}
            onDragStart={(event) => handleDragStart(category.id, event)}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            dragging={draggingId === category.id}
          />
        ))}
        </div>
      ))}
    </nav>
  );
}