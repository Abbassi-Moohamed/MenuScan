"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

import type { Dictionary } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import type { CurrencyCode, MenuCategory } from "@/types/menu";

import { MenuItemCard } from "./MenuItemCard";

export interface BubbleOrigin {
  x: number;
  y: number;
  width: number;
  height: number;
}

type SheetStyle = CSSProperties & { "--sheet-origin"?: string };

interface CategorySheetProps {
  category: MenuCategory;
  currency: CurrencyCode;
  locale: string;
  dict: Dictionary;
  closing: boolean;
  origin: BubbleOrigin | null;
  onClose: () => void;
}

export function CategorySheet({
  category,
  currency,
  locale,
  dict,
  closing,
  origin,
  onClose,
}: CategorySheetProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!closing) {
      titleRef.current?.focus();
    }
  }, [closing]);

  const originStyle: SheetStyle = origin
    ? {
        "--sheet-origin": `${origin.x + origin.width / 2}px ${origin.y + origin.height / 2}px`,
      }
    : {};

  return (
    <div
      className={cn("sheet-overlay", closing ? "sheet-overlay--closing" : "sheet-overlay--open")}
      style={originStyle}
      role="dialog"
      aria-modal="true"
      aria-label={dict.sheet.dialogAriaLabel(category.name)}
    >
      <div className="sheet-overlay__scrim" onClick={onClose} aria-hidden="true" />
      <div className="sheet">
        <header className="sheet__header">
          <button type="button" className="sheet__back" onClick={onClose} aria-label={dict.sheet.backLabel}>
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
          </button>
          <div className="sheet__heading">
            <h2 className="sheet__title" tabIndex={-1} ref={titleRef}>
              {category.name}
            </h2>
            <p className="sheet__count">{dict.sheet.itemsCountLabel(category.items.length)}</p>
          </div>
        </header>
        <div className="sheet__body">
          <div className="container">
            <ul className="sheet__list">
              {category.items.map((item, index) => (
                <li key={item.id} className="sheet__item">
                  <MenuItemCard
                    item={item}
                    currency={currency}
                    locale={locale}
                    tagsAriaLabel={dict.sheet.tagsAriaLabel}
                    delay={index * 55}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}