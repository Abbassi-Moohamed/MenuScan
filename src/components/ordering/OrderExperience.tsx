"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getDictionary } from "@/i18n";
import { createOrder } from "@/lib/orders";
import {
  cartCount,
  cartEventName,
  cartLinePrice,
  cartTotal,
  readCart,
  writeCart,
  type CartLine,
} from "@/lib/cart";
import type { MenuItem } from "@/types/menu";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { siteConfig } from "@/config/site";

interface OrderExperienceProps {
  coffeeSlug: string;
  items: MenuItem[];
}

export function OrderExperience({ coffeeSlug, items }: OrderExperienceProps) {
  const d = getDictionary();
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setLines(readCart(coffeeSlug));
    sync();
    window.addEventListener(cartEventName(), sync);
    return () => window.removeEventListener(cartEventName(), sync);
  }, [coffeeSlug]);

  const available = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const add = (item: MenuItem) => {
    if (!item.isAvailable) return;
    const next = lines.some((line) => line.item.id === item.id)
      ? lines.map((line) => (line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line))
      : [...lines, { item, quantity: 1 }];
    setLines(next);
    writeCart(coffeeSlug, next);
    setOpen(true);
  };
  const update = (id: string, quantity: number) => {
    const next = quantity <= 0 ? lines.filter((line) => line.item.id !== id) : lines.map((line) => line.item.id === id ? { ...line, quantity } : line);
    setLines(next);
    writeCart(coffeeSlug, next);
  };
  const submit = async () => {
    const table = tableNumber.trim();
    const validLines = lines.filter((line) => available.get(line.item.id)?.isAvailable);
    if (!table || validLines.length === 0) {
      setError(d.order.invalidCheckout);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const order = await createOrder({
        coffeeSlug,
        tableNumber: Number(table),
        items: validLines.map((line) => ({ itemId: line.item.id, quantity: line.quantity })),
      });
      writeCart(coffeeSlug, []);
      router.push(`/menuscan/${coffeeSlug}/order/${order.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : d.order.submitError);
    } finally {
      setBusy(false);
    }
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
                  {item.isAvailable ? d.order.addToCart : d.menuItem.unavailable}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {lines.length > 0 ? (
        <button className="cart-fab" type="button" onClick={() => setOpen(true)} aria-label={d.order.openCart}>
          🛒 <span>{cartCount(lines)}</span>
        </button>
      ) : null}

      {open ? (
        <div className="cart-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="cart-dialog__scrim" onClick={() => setOpen(false)} />
          <section className="cart-dialog__panel">
            <div className="admin-head">
              <h2 id="cart-title" className="admin-head__title">{d.order.cartTitle}</h2>
              <button className="sheet__back" type="button" onClick={() => setOpen(false)} aria-label={d.order.closeCart}>×</button>
            </div>
            {lines.length === 0 ? <p>{d.order.emptyCart}</p> : lines.map((line) => (
              <div className="cart-line" key={line.item.id}>
                <div><strong>{line.item.name}</strong><small>{(cartLinePrice(line)).toFixed(3)} DT</small></div>
                <div className="cart-line__controls">
                  <button type="button" onClick={() => update(line.item.id, line.quantity - 1)} aria-label={d.order.decrease}>−</button>
                  <span>{line.quantity}</span>
                  <button type="button" disabled={!available.get(line.item.id)?.isAvailable} onClick={() => update(line.item.id, line.quantity + 1)} aria-label={d.order.increase}>+</button>
                </div>
              </div>
            ))}
            <div className="cart-total"><strong>{d.order.total}</strong><strong>{cartTotal(lines).toFixed(3)} DT</strong></div>
            <label className="admin-field"><span className="admin-field__label">{d.order.tableNumber}</span><input className="admin-field__input" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} inputMode="numeric" placeholder={d.order.tablePlaceholder} /></label>
            {error ? <p className="admin-form__error">{error}</p> : null}
            <button className="admin-btn admin-btn--primary" type="button" disabled={busy || lines.length === 0} onClick={() => void submit()}>{busy ? d.order.submitting : d.order.submit}</button>
          </section>
        </div>
      ) : null}
    </>
  );
}
