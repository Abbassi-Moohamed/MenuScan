import type { CSSProperties } from "react";
import Link from "next/link";

import { getDictionary } from "@/i18n";
import { bubbleGeometry, CATEGORY_ASPECT, CATEGORY_WEIGHT, layoutBubbleRows } from "@/lib/blob";
import { categoryAccent, categoryIcon } from "@/lib/adapters";
import { categoryHref } from "@/lib/utils";
import type { MenuCategory } from "@/types/menu";

import { accentGradientStyle } from "./accentGradient";

interface CategoryLinkProps {
  coffeeSlug: string;
  category: MenuCategory;
  sequenceIndex: number;
}

/**
 * One organic bubble, now a real `<a>` — the whole coffee menu is server
 * rendered and every bubble deep-links to `/menuscan/:slug/:categName`.
 */
function CategoryLink({ coffeeSlug, category, sequenceIndex }: CategoryLinkProps) {
  const geometry = bubbleGeometry(category.id);
  const style = {
    flexGrow: CATEGORY_WEIGHT,
    aspectRatio: CATEGORY_ASPECT.toFixed(3),
    borderRadius: geometry.borderRadius,
    "--bubble-tilt": `${geometry.tilt}deg`,
    "--bubble-drift": `${geometry.translateY}px`,
    "--bubble-drift-x": `${geometry.translateX}px`,
    "--bubble-duration": `${geometry.swimDuration}s`,
    "--bubble-delay": `${geometry.swimDelay}ms`,
    ...accentGradientStyle(categoryAccent(category.id, sequenceIndex)),
  } as CSSProperties;

  return (
    <Link
      href={categoryHref(coffeeSlug, category.name)}
      className={`bubble${category.image ? " bubble--with-image" : ""}`}
      style={style}
      aria-label={category.name}
    >
      {category.image ? (
        <span
          className="bubble__media"
          style={{ backgroundImage: `url("${category.image}")` }}
          aria-hidden="true"
        />
      ) : null}
      {!category.image ? (
        <span className="bubble__icon" aria-hidden="true">
          {categoryIcon(category.id, category.name)}
        </span>
      ) : null}
      <span className="bubble__name">{category.name}</span>
    </Link>
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
  let sequenceIndex = 0;

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
          {row.map((category) => (
            <CategoryLink
              key={category.id}
              coffeeSlug={coffeeSlug}
              category={category}
              sequenceIndex={sequenceIndex++}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}