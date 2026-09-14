import Image from "next/image";

import { getDictionary } from "@/i18n";

interface BrandIntroProps {
  /** Brand or coffee name shown as the hero title. */
  name: string;
  /** Optional remote logo (coffee pages); omitted on the brand landing. */
  logo?: string;
  cover?: string | null;
  /** Eyebrow pill text. Defaults to the menu eyebrow. */
  eyebrow?: string;
  /** Description line (used on the MENU SCAN landing page). */
  description?: string;
  /** Title of the menu strip, e.g. "Notre carte" (coffee pages). */
  menuTitle?: string;
  /** Number of categories, shown next to the menu title. */
  categoriesCount?: number;
  /** Number of items, shown next to the menu title when known. */
  itemsCount?: number;
}

export function BrandIntro({
  name,
  logo,
  cover,
  eyebrow,
  description,
  menuTitle,
  categoriesCount,
  itemsCount,
}: BrandIntroProps) {
  const dict = getDictionary();
  const resolvedMenuTitle = menuTitle ?? (categoriesCount != null ? dict.explore.title : undefined);
  const hasCounts = categoriesCount != null || itemsCount != null;

  return (
    <section className="brand-intro" style={cover ? { backgroundImage: `linear-gradient(rgb(34 24 18 / 0.58), rgb(34 24 18 / 0.72)), url("${cover}")` } : undefined}>
      <div className="container">
        {logo ? (
          <div className="brand-intro__logo">
            <Image src={logo} alt="" fill sizes="4.5rem" className="brand-intro__logo-img" />
          </div>
        ) : null}
        <p className="brand-intro__eyebrow">{eyebrow ?? dict.explore.eyebrow}</p>
        <h1 className="brand-intro__title">
          {name}
          <span className="brand-intro__title-accent">.</span>
        </h1>
        {description ? <p className="brand-intro__description">{description}</p> : null}
        {resolvedMenuTitle ? (
          <div className="brand-intro__menu">
            <h2 className="brand-intro__menu-title">{resolvedMenuTitle}</h2>
            {hasCounts ? (
              <p className="brand-intro__menu-meta" aria-label={dict.explore.menuSummaryAriaLabel}>
                {categoriesCount != null ? (
                  <span className="brand-intro__menu-meta-item">
                    {dict.explore.categoriesLabel(categoriesCount)}
                  </span>
                ) : null}
                {categoriesCount != null && itemsCount != null ? (
                  <span className="brand-intro__menu-dot" aria-hidden="true" />
                ) : null}
                {itemsCount != null ? (
                  <span className="brand-intro__menu-meta-item">{dict.explore.itemsLabel(itemsCount)}</span>
                ) : null}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}