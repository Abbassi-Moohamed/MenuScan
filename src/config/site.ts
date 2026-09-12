export const siteConfig = {
  name: "CoffeScan",
  description:
    "Café de spécialité et douceurs de saison. Ouvrez le menu directement sur votre téléphone en scannant le code QR.",
  url: "https://coffescan.example.com",
  locale: "fr-TN",
} as const;

export type SiteConfig = typeof siteConfig;