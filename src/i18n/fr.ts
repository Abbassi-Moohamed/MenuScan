import type { Dictionary } from "./dictionary";

export const fr: Dictionary = {
  header: {
    status: "Ouvert maintenant",
    statusTitle: "Ouvert aujourd'hui jusqu'à 18\u00A0h",
  },
  explore: {
    eyebrow: "Menu Numérique",
    title: "Notre carte",
    menuSummaryAriaLabel: "Résumé du menu",
    categoriesLabel: (count) => `${count} catégorie${count > 1 ? "s" : ""}`,
    itemsLabel: (count) => `${count} article${count > 1 ? "s" : ""} frais`,
    categoriesAriaLabel: "Catégories du menu",
  },
  sheet: {
    itemsCountLabel: (count) => `${count} article${count > 1 ? "s" : ""}`,
    tagsAriaLabel: (name) => `Étiquettes pour ${name}`,
    backLabel: "Retour aux catégories",
    dialogAriaLabel: (name) => `Carte « ${name} »`,
  },
  backToTop: {
    label: "Revenir en haut du menu",
  },
  footer: {
    note: "Les prix et les menus varient selon la saison.",
    noteCta: "Une question\u00A0? Passez simplement voir le barista — ",
    noteCtaStrong: "avec plaisir.",
    meta: "Scannez à nouveau le code QR à tout moment pour rouvrir ce menu.",
  },
  a11y: {
    skipLink: "Aller au menu",
  },
};