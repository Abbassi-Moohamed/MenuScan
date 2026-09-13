import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { toMenuItem } from "@/lib/adapters";
import { ApiClientError, getCoffeeBySlug, getItemsByCategoryId } from "@/lib/api";
import { resolvePublicCoffee } from "@/lib/public-coffee";
import { slugify } from "@/lib/utils";

interface CategoryPageProps {
  params: Promise<{ slug: string; categName: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, categName } = await params;
  try {
    const coffee = await getCoffeeBySlug(slug);
    const category = coffee.categories.find((c) => slugify(c.name) === slugify(categName));
    if (category) {
      return {
        title: `${category.name} — ${coffee.name}`,
        description: `Menu · ${coffee.name}`,
      };
    }
  } catch {
    // fall through to the neutral title below
  }
  return { title: "Menu" };
}

/**
 * Category items page — `/menuscan/:slug/:categName`. The category is resolved
 * strictly WITHIN the coffee returned by the backend (`slugify(name)` match),
 * so a category that belongs to another coffee can never leak its items here;
 * unknown coffees and unknown/mismatched categories are clean not-founds.
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, categName } = await params;
  const dict = getDictionary();

  const coffee = await resolvePublicCoffee(slug);
  const category = coffee.categories.find((c) => slugify(c.name) === slugify(categName));
  if (!category) {
    notFound();
  }

  let items;
  try {
    items = await getItemsByCategoryId(category.id);
  } catch (error) {
    if (error instanceof ApiClientError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }

  const menuItems = items.map(toMenuItem);

  return (
    <main id="main">
      <section className="category-page">
        <div className="container category-page__header">
          <Link className="category-page__back" href={`/menuscan/${slug}`} aria-label={dict.sheet.backLabel}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </Link>
          <div className="category-page__heading">
            <h1 className="category-page__title">{category.name}</h1>
            <p className="category-page__count">{dict.sheet.itemsCountLabel(menuItems.length)}</p>
          </div>
        </div>

        {menuItems.length > 0 ? (
          <div className="container">
            <ul className="sheet__list">
              {menuItems.map((item, index) => (
                <li key={item.id} className="sheet__item">
                  <MenuItemCard
                    item={item}
                    currency={siteConfig.currency}
                    locale={siteConfig.locale}
                    delay={index * 55}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="container">
            <div className="sheet-state">
              <p className="sheet-state__title">{dict.sheet.emptyTitle}</p>
              <p className="sheet-state__text">{dict.sheet.emptyMessage}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}