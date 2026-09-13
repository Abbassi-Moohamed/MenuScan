export const siteConfig = {
  name: "MenuScan",
  description:
    "Café de spécialité et douceurs de saison. Ouvrez le menu directement sur votre téléphone en scannant le code QR.",
  url: "https://menuscan.vercel.app",
  locale: "fr-TN",
  /** Presentation default used to render backend prices (backend sends decimals only). */
  currency: "TND",
} as const;

export type SiteConfig = typeof siteConfig;