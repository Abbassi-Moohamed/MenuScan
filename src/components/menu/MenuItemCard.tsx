import type { CSSProperties } from "react";

import type { CurrencyCode, MenuItem } from "@/types/menu";

import { ItemArt } from "./ItemArt";
import { PriceBadge } from "./PriceBadge";

interface MenuItemCardProps {
  item: MenuItem;
  currency: CurrencyCode;
  locale: string;
  /** Entrance animation delay (ms) for the sheet's staggered reveal. */
  delay?: number;
}

export function MenuItemCard({ item, currency, locale, delay = 0 }: MenuItemCardProps) {
  return (
    <article className="item-card" style={{ "--delay": `${delay}ms` } as CSSProperties}>
      <div className="item-card__art">
        <ItemArt item={item} className="item-card__art-img" sizes="(min-width: 42rem) 19rem, 92vw" />
      </div>
      <div className="item-card__body">
        <div className="item-card__row">
          <h3 className="item-card__name">{item.name}</h3>
          <PriceBadge className="item-card__price" price={item.price} currency={currency} locale={locale} />
        </div>
        <p className="item-card__description">{item.description}</p>
      </div>
    </article>
  );
}