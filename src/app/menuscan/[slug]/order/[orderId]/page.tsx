"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getDictionary } from "@/i18n";
import { getOrder } from "@/lib/orders";
import type { OrderDto } from "@/types/backend";

export default function OrderStatusPage({ params }: { params: Promise<{ slug: string; orderId: string }> }) {
  const d = getDictionary();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [error, setError] = useState(false);
  const [slug, setSlug] = useState("");
  const [orderId, setOrderId] = useState("");
  useEffect(() => {
    let active = true;
    void params.then(({ slug: nextSlug, orderId: nextId }) => {
      setSlug(nextSlug); setOrderId(nextId);
      return getOrder(nextId).then((value) => { if (active) setOrder(value); }).catch(() => { if (active) setError(true); });
    });
    return () => { active = false; };
  }, [params]);
  const refresh = () => { if (orderId) void getOrder(orderId).then(setOrder).catch(() => setError(true)); };
  const label = order?.status === "CONFIRMED" ? d.order.statusConfirmed
    : order?.status === "REJECTED" ? d.order.statusRejected
      : d.order.statusPending;
  return (
    <main id="main"><section className="order-status container">
      <p className="explore__eyebrow">{d.order.status}</p>
      <h1>{order ? d.order.confirmationTitle : d.order.status}</h1>
      {error ? <p className="admin-form__error">{d.order.orderNotFound}</p> : order ? <>
        <p>{d.order.confirmationMessage}</p><p className="order-status__badge">{label}</p>
        <p>#{order.id} · {d.order.tableNumber}: {order.tableNumber}</p>
        <button className="admin-btn admin-btn--primary" type="button" onClick={refresh}>{d.order.refresh}</button>
      </> : <p>…</p>}
      {slug ? <Link className="admin-btn admin-btn--ghost" href={`/menuscan/${slug}`}>{d.notFound.cta}</Link> : null}
    </section></main>
  );
}
