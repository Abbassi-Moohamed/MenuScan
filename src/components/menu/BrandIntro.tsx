import { menu } from "@/data/menu";
import { getDictionary } from "@/i18n";
import { getAllMenuItems } from "@/lib/menu";

export function BrandIntro() {
  const dict = getDictionary(menu.language);
  const itemCount = getAllMenuItems(menu).length;

  return (
    <section className="brand-intro">
      <div className="container">
        <p className="brand-intro__eyebrow">{dict.explore.eyebrow}</p>
        <h1 className="brand-intro__title">
          {menu.branding.name}
          <span className="brand-intro__title-accent">.</span>
        </h1>
        <div className="brand-intro__menu">
          <h2 className="brand-intro__menu-title">{dict.explore.title}</h2>
          <p className="brand-intro__menu-meta" aria-label={dict.explore.menuSummaryAriaLabel}>
            <span className="brand-intro__menu-meta-item">
              {dict.explore.categoriesLabel(menu.categories.length)}
            </span>
            <span className="brand-intro__menu-dot" aria-hidden="true" />
            <span className="brand-intro__menu-meta-item">{dict.explore.itemsLabel(itemCount)}</span>
          </p>
        </div>
      </div>
    </section>
  );
}