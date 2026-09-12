"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { menu } from "@/data/menu";
import { getDictionary } from "@/i18n";
import { layoutBubbleRows } from "@/lib/blob";
import type { MenuCategory } from "@/types/menu";

import { CategoryBubbleField } from "./CategoryBubbleField";
import type { BubbleOrigin } from "./CategorySheet";
import { CategorySheet } from "./CategorySheet";

const CLOSE_MS = 220;

function slugFromHash(): string | null {
  const match = window.location.hash.match(/^#c-([\w-]+)$/);
  return match ? match[1] : null;
}

export function MenuExplorer() {
  const dict = getDictionary(menu.language);
  const categories = menu.categories;
  const rows = useMemo(() => layoutBubbleRows(categories), [categories]);

  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const [origin, setOrigin] = useState<BubbleOrigin | null>(null);

  const openSlugRef = useRef<string | null>(null);
  const closingRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    openSlugRef.current = openSlug;
  }, [openSlug]);

  const closeAnimated = useCallback(() => {
    if (closingRef.current || openSlugRef.current === null) {
      return;
    }
    closingRef.current = true;
    setClosing(true);
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      closingRef.current = false;
      setClosing(false);
      setOpenSlug(null);
      setOrigin(null);
      triggerRef.current?.focus();
    }, CLOSE_MS);
  }, []);

  const closeSheet = useCallback(() => {
    closeAnimated();
    if (window.location.hash) {
      window.history.pushState(null, document.title, window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, [closeAnimated]);

  const applyHash = useCallback(() => {
    if (closingRef.current) {
      return;
    }
    const slug = slugFromHash();

    if (slug !== null && categories.some((category) => category.slug === slug)) {
      setClosing(false);
      if (openSlugRef.current !== slug) {
        setOrigin(null);
      }
      setOpenSlug(slug);
    } else if (openSlugRef.current !== null) {
      closeAnimated();
    }
  }, [categories, closeAnimated]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(applyHash, 0);
    window.addEventListener("hashchange", applyHash);
    return () => {
      window.clearTimeout(restoreTimer);
      window.removeEventListener("hashchange", applyHash);
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [applyHash]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openSlugRef.current !== null && !closingRef.current) {
        closeSheet();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSheet]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (openSlug !== null) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previous;
    };
  }, [openSlug]);

  const openCategory = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>, category: MenuCategory) => {
      const rect = event.currentTarget.getBoundingClientRect();
      triggerRef.current = event.currentTarget;
      closingRef.current = false;
      setClosing(false);
      setOrigin({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
      openSlugRef.current = category.slug;
      setOpenSlug(category.slug);
      if (slugFromHash() !== category.slug) {
        window.location.hash = `c-${category.slug}`;
      }
    },
    [],
  );

  const active =
    openSlug !== null ? (categories.find((category) => category.slug === openSlug) ?? null) : null;

  return (
    <>
      <CategoryBubbleField
        rows={rows}
        itemsCountLabel={dict.sheet.itemsCountLabel}
        categoriesAriaLabel={dict.explore.categoriesAriaLabel}
        onOpen={openCategory}
      />
      {active ? (
        <CategorySheet
          category={active}
          currency={menu.currency}
          locale={menu.locale}
          dict={dict}
          closing={closing}
          origin={origin}
          onClose={closeSheet}
        />
      ) : null}
    </>
  );
}