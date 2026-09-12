import { BrandIntro } from "@/components/menu/BrandIntro";
import { MenuExplorer } from "@/components/menu/MenuExplorer";

export default function HomePage() {
  return (
    <div id="top">
      <main id="main">
        <BrandIntro />
        <MenuExplorer />
      </main>
    </div>
  );
}