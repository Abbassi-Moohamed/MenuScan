export type CurrencyCode =
  | "AUD"
  | "CAD"
  | "CHF"
  | "DKK"
  | "EUR"
  | "GBP"
  | "JPY"
  | "NOK"
  | "NZD"
  | "SEK"
  | "TND"
  | "USD";

export type MenuLanguage = "fr";

export interface Price {
  /** Value in the smallest currency unit (e.g. cents) to avoid floating point drift. */
  value: number;
  /** ISO 4217 currency code. Falls back to the menu's default currency when omitted. */
  currency?: CurrencyCode;
}

export type MenuItemTagKind = "featured" | "new" | "popular" | "vegan" | "vegetarian" | "gluten-free" | "spicy";

export interface MenuItemTag {
  label: string;
  kind: MenuItemTagKind;
}

export interface MenuItemMetadata {
  /** Extra nutrition or serving details (calories, volume, allergens…). */
  [key: string]: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: Price;
  /** Remote image URL. Images are optional — a gradient placeholder is used when absent. */
  image?: string;
  /** Seed color used for the gradient placeholder and highlights. */
  accent?: string;
  /** Short badges shown on the card. */
  tags?: MenuItemTag[];
  /** Whether the item is promoted on the featured strip. */
  featured?: boolean;
  metadata?: MenuItemMetadata;
}

export type MenuCategorySize = "xl" | "lg" | "md" | "sm";

export interface MenuCategory {
  id: string;
  /** URL-safe identifier used for anchor links and navigation. */
  slug: string;
  name: string;
  description?: string;
  /** Small glyph (emoji) used in navigation chips. */
  icon?: string;
  /** Accent color used across the category's visuals. */
  accent: string;
  /** Relative size of the discovery bubble (larger items get bigger bubbles). */
  size?: MenuCategorySize;
  items: MenuItem[];
}

export interface MenuBranding {
  name: string;
  tagline: string;
  description?: string;
}

export interface Menu {
  id: string;
  /** URL-safe identifier for the shop; reserved for future multi-shop routing. */
  slug: string;
  branding: MenuBranding;
  /** Primary UI language used for chrome strings and the document. */
  language: MenuLanguage;
  /** IETF language tag passed to `Intl` for number/price formatting. */
  locale: string;
  currency: CurrencyCode;
  categories: MenuCategory[];
}