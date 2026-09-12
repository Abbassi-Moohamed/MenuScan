"use client";

import type { MouseEvent as ReactMouseEvent } from "react";

import { categoryAspect, categoryWeight } from "@/lib/blob";
import type { MenuCategory } from "@/types/menu";

import { CategoryBubble } from "./CategoryBubble";

interface CategoryBubbleFieldProps {
  rows: MenuCategory[][];
  itemsCountLabel: (count: number) => string;
  categoriesAriaLabel: string;
  onOpen: (event: ReactMouseEvent<HTMLButtonElement>, category: MenuCategory) => void;
}

export function CategoryBubbleField({
  rows,
  itemsCountLabel,
  categoriesAriaLabel,
  onOpen,
}: CategoryBubbleFieldProps) {
  return (
    <nav className="bubble-field" aria-label={categoriesAriaLabel}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="bubble-row">
          {row.map((category) => (
            <CategoryBubble
              key={category.id}
              category={category}
              weight={categoryWeight(category)}
              aspect={categoryAspect(category)}
              countLabel={itemsCountLabel(category.items.length)}
              onOpen={onOpen}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}