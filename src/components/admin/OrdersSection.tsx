"use client";

import { useCallback, useEffect, useState } from "react";
import { getDictionary } from "@/i18n";
import { listOrders, updateOrderStatus } from "@/lib/orders";
import type { OrderDto, OrderStatus } from "@/types/backend";

export function OrdersSection({ token }: { token: string }) {
  const d = getDictionary().admin.orders;
  const [filter, setFilter] = useState<OrderStatus>("PENDING");
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => {
    void listOrders(token, filter).then((result) => setOrders(result.orders)).catch((e) => setError(e instanceof Error ? e.message : "Erreur"));
  }, [token, filter]);
  useEffect(load, [load]);
  const action = async (id: string, status: OrderStatus) => { await updateOrderStatus(token, id, status); load(); };
  return <section className="admin-section">
    <div className="admin-head"><div className="admin-head__text"><h2 className="admin-head__title">{d.title}</h2></div>
      <select className="admin-field__input" value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus)}>
        <option value="PENDING">{d.pending}</option><option value="CONFIRMED">{d.confirmed}</option><option value="REJECTED">{d.rejected}</option>
      </select>
    </div>
    {error ? <p className="admin-form__error">{error}</p> : orders.length === 0 ? <p className="sheet-state__text">{d.empty}</p> : orders.map((order) => (
      <article className="order-admin-card" key={order.id}><div><strong>#{order.id}</strong><span> · {d.tableNumber}: {order.tableNumber}</span><p>{order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</p></div><div><strong>{order.total.toFixed(3)} DT</strong><div className="admin-form__actions">{order.status === "PENDING" ? <><button className="admin-btn admin-btn--primary" type="button" onClick={() => void action(order.id, "CONFIRMED")}>{d.confirm}</button><button className="admin-btn admin-btn--danger" type="button" onClick={() => void action(order.id, "REJECTED")}>{d.reject}</button></> : null}</div></div></article>
    ))}
  </section>;
}
