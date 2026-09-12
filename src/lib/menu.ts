import type { CurrencyCode, Menu, MenuItem } from "@/types/menu";

/**
 * Format a price stored in the smallest currency unit (e.g. cents or
 * millimes) as a human-readable string. Uses `Intl.NumberFormat` with the
 * menu locale and currency so formatting stays correct if the menu is served
 * in another region. Currencies such as the Tunisian dinar conventionally
 * use three fraction digits.
 */
export function formatPrice(value: number, currency: CurrencyCode, locale: string): string {
  const fractionDigits = currency === "TND" ? 3 : 2;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value / 100);
}

export function getAllMenuItems(menu: Menu): MenuItem[] {
  return menu.categories.flatMap((category) => category.items);
}