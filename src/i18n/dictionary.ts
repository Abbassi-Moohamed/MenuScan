export interface Dictionary {
  header: {
    status: string;
    statusTitle: string;
  };
  explore: {
    eyebrow: string;
    title: string;
    menuSummaryAriaLabel: string;
    categoriesLabel: (count: number) => string;
    itemsLabel: (count: number) => string;
    categoriesAriaLabel: string;
  };
  sheet: {
    itemsCountLabel: (count: number) => string;
    tagsAriaLabel: (name: string) => string;
    backLabel: string;
    dialogAriaLabel: (name: string) => string;
  };
  backToTop: {
    label: string;
  };
  footer: {
    note: string;
    noteCta: string;
    noteCtaStrong: string;
    meta: string;
  };
  a11y: {
    skipLink: string;
  };
}