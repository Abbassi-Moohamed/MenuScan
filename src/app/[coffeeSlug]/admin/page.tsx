import { permanentRedirect } from "next/navigation";

interface LegacyCoffeeAdminRedirectProps {
  params: Promise<{ coffeeSlug: string }>;
}

/** `/:coffeeSlug/admin` → `/menuscan/:coffeeSlug/admin` — legacy links. */
export default async function LegacyCoffeeAdminRedirect({ params }: LegacyCoffeeAdminRedirectProps) {
  const { coffeeSlug } = await params;
  permanentRedirect(`/menuscan/${coffeeSlug}/admin`);
}