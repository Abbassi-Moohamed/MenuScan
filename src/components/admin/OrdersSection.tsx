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
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <select className="admin-field__input" value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus)}>
          <option value="PENDING">{d.pending}</option><option value="CONFIRMED">{d.confirmed}</option><option value="REJECTED">{d.rejected}</option>
        </select>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          aria-label={d.refresh}
          title={d.refresh}
          onClick={() => load()}
          style={{ minWidth: "2.5rem", padding: "0.45rem 0.7rem" }}
        >
          ↻
        </button>
      </div>
    </div>
    {error ? <p className="admin-form__error">{error}</p> : orders.length === 0 ? <p className="sheet-state__text">{d.empty}</p> : orders.map((order) => (
      <article className="order-admin-card" key={order.id}>
        <div className="order-admin-card__main">
          <div className="order-admin-card__meta"><strong className="order-admin-card__table"><span>{d.tableNumber}</span>{order.tableNumber}</strong><span className={`admin-status admin-status--${order.status.toLowerCase()}`}>{order.status === "PENDING" ? d.pending : order.status === "CONFIRMED" ? d.confirmed : d.rejected}</span></div>
          <div className="order-admin-card__items">
            {order.items.map((item) => <div className="order-admin-card__item" key={item.itemId}><strong>{item.quantity}×</strong><span>{item.name}</span></div>)}
          </div>
        </div>
        <div className="order-admin-card__side"><strong>{order.total.toFixed(3)} DT</strong>{order.status === "PENDING" ? <div className="admin-form__actions"><button className="admin-btn admin-btn--primary" type="button" onClick={() => void action(order.id, "CONFIRMED")}>{d.confirm}</button><button className="admin-btn admin-btn--danger" type="button" onClick={() => void action(order.id, "REJECTED")}>{d.reject}</button></div> : null}</div>
      </article>
    ))}
  </section>;
}
