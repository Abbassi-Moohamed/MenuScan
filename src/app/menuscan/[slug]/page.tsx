import type { Metadata } from "next";

import { BrandIntro } from "@/components/menu/BrandIntro";
import { CategoryBubbles } from "@/components/menu/CategoryBubbles";
import { toMenuCategory } from "@/lib/adapters";
import { getCoffeeBySlug } from "@/lib/api";
import { resolvePublicCoffee } from "@/lib/public-coffee";

interface CoffeePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CoffeePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const coffee = await getCoffeeBySlug(slug);
    return { title: coffee.name, description: `Menu · ${coffee.name}` };
  } catch {
    return { title: "Menu" };
  }
}

/**
 * Coffee menu — `/menuscan/:slug`. The slug drives a single backend fetch:
 * the coffee (and its category names) are the source of truth; every bubble
 * links to its own `/menuscan/:slug/:categName` items page.
 */
export default async function CoffeePage({ params }: CoffeePageProps) {
  const { slug } = await params;
  const coffee = await resolvePublicCoffee(slug);

  return (
    <div id="top">
      <main id="main">
        <BrandIntro
          name={coffee.name}
          logo={coffee.logo}
          categoriesCount={coffee.categories.length}
        />
        <CategoryBubbles coffeeSlug={slug} categories={coffee.categories.map(toMenuCategory)} />
      </main>
    </div>
  );
}