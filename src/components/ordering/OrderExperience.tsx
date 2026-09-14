"use client";

import { useEffect, useState } from "react";

import { getDictionary } from "@/i18n";
import { cartEventName, readCart, writeCart, type CartLine } from "@/lib/cart";
import type { MenuItem } from "@/types/menu";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { OrderCenter } from "./OrderCenter";
import { siteConfig } from "@/config/site";

interface OrderExperienceProps {
  coffeeSlug: string;
  items: MenuItem[];
}

export function OrderExperience({ coffeeSlug, items }: OrderExperienceProps) {
  const d = getDictionary();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setLines(readCart(coffeeSlug));
    sync();
    window.addEventListener(cartEventName(), sync);
    return () => window.removeEventListener(cartEventName(), sync);
  }, [coffeeSlug]);

  const add = (item: MenuItem) => {
    if (!item.isAvailable) return;
    const next = lines.some((line) => line.item.id === item.id)
      ? lines.map((line) => (line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line))
      : [...lines, { item, quantity: 1 }];
    setLines(next);
    writeCart(coffeeSlug, next);
    setAddedId(item.id);
    window.setTimeout(() => setAddedId((current) => current === item.id ? null : current), 1400);
  };
  return (
    <>
      <div className="container order-menu-list">
        <ul className="sheet__list">
          {items.map((item, index) => (
            <li key={item.id} className="sheet__item">
              <div className="order-item">
                <MenuItemCard item={item} currency={siteConfig.currency} locale={siteConfig.locale} delay={index * 55} />
                <button className="admin-btn admin-btn--primary order-item__add" type="button" disabled={!item.isAvailable} onClick={() => add(item)}>
                  {item.isAvailable ? (addedId === item.id ? d.order.addedToCart : d.order.addToCart) : d.menuItem.unavailable}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <OrderCenter coffeeSlug={coffeeSlug} items={items} />
    </>
  );
}
