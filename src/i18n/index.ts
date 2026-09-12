import type { MenuLanguage } from "@/types/menu";

import type { Dictionary } from "./dictionary";
import { fr } from "./fr";

const dictionaries: Partial<Record<MenuLanguage, Dictionary>> = {
  fr,
};

export function getDictionary(language: MenuLanguage): Dictionary {
  return dictionaries[language] ?? fr;
}

export type { Dictionary };