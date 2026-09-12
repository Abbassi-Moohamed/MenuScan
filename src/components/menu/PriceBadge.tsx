import { formatPrice } from "@/lib/menu";
import { cn } from "@/lib/utils";
import type { CurrencyCode, Price } from "@/types/menu";

interface PriceBadgeProps {
  price: Price;
  currency: CurrencyCode;
  locale: string;
  highlight?: boolean;
  className?: string;
}

export function PriceBadge({ price, currency, locale, highlight = false, className }: PriceBadgeProps) {
  return (
    <span className={cn("menu-card__price", highlight && "menu-card__price--highlight", className)}>
      {formatPrice(price.value, price.currency ?? currency, locale)}
    </span>
  );
}