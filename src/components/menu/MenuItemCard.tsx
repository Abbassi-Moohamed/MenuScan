import type { CSSProperties } from "react";

import type { CurrencyCode, MenuItem } from "@/types/menu";

import { Badge } from "./Badge";
import { ItemArt } from "./ItemArt";
import { PriceBadge } from "./PriceBadge";

interface MenuItemCardProps {
  item: MenuItem;
  currency: CurrencyCode;
  locale: string;
  tagsAriaLabel: (name: string) => string;
  /** Entrance animation delay (ms) for the sheet's staggered reveal. */
  delay?: number;
}

export function MenuItemCard({ item, currency, locale, tagsAriaLabel, delay = 0 }: MenuItemCardProps) {
  const tags = item.tags ?? [];
  const heroBadge =
    tags.find((tag) => tag.kind === "popular" || tag.kind === "new" || tag.kind === "featured") ?? tags[0];

  return (
    <article className="item-card" style={{ "--delay": `${delay}ms` } as CSSProperties}>
      <div className="item-card__art">
        <ItemArt item={item} className="item-card__art-img" sizes="(min-width: 42rem) 19rem, 92vw" />
        {heroBadge ? <Badge tag={heroBadge} className="item-card__badge" /> : null}
      </div>
      <div className="item-card__body">
        <div className="item-card__row">
          <h3 className="item-card__name">{item.name}</h3>
          <PriceBadge
            className="item-card__price"
            price={item.price}
            currency={currency}
            locale={locale}
            highlight={item.featured ?? false}
          />
        </div>
        <p className="item-card__description">{item.description}</p>
        {tags.length > 0 ? (
          <p className="item-card__tags" aria-label={tagsAriaLabel(item.name)}>
            {tags.map((tag) => (
              <Badge key={tag.label} tag={tag} />
            ))}
          </p>
        ) : null}
      </div>
    </article>
  );
}