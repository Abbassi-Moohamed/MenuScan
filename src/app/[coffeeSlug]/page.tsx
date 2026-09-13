import { permanentRedirect } from "next/navigation";

interface LegacyCoffeeRedirectProps {
  params: Promise<{ coffeeSlug: string }>;
}

/** `/:coffeeSlug` → `/menuscan/:coffeeSlug` — legacy QR codes and links. */
export default async function LegacyCoffeeRedirect({ params }: LegacyCoffeeRedirectProps) {
  const { coffeeSlug } = await params;
  permanentRedirect(`/menuscan/${coffeeSlug}`);
}