"use client";

import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import { formatPrice } from "@/lib/menu";
import type { AdminItemDto } from "@/types/backend";

import { AdminNotice } from "./AdminNotice";

interface ItemListProps {
  dict: Dictionary;
  items: AdminItemDto[];
  loading: boolean;
  error?: string | null;
  onRetry: () => void;
  onEdit: (item: AdminItemDto) => void;
  onDelete: (item: AdminItemDto) => void;
  onToggleAvailability: (item: AdminItemDto) => void;
  availabilityBusyId?: string | null;
}

export function ItemList({ dict, items, loading, error, onRetry, onEdit, onDelete, onToggleAvailability, availabilityBusyId }: ItemListProps) {
  const d = dict.admin;

  if (loading) {
    return (
      <div className="item-list" aria-busy="true">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="item-row">
            <span className="skeleton skeleton--thumb" />
            <div className="item-row__body">
              <span className="skeleton skeleton--card-title" />
              <span className="skeleton skeleton--card-line skeleton--card-line--short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <AdminNotice
        title={d.items.loadError}
        message={error}
        actionLabel={d.errors.retry}
        onAction={onRetry}
      />
    );
  }

  if (items.length === 0) {
    return <AdminNotice title={d.items.emptyTitle} message={d.items.emptyMessage} />;
  }

  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id} className="item-row">
          <span className="item-row__body">
            <span className="item-row__name">{item.name}</span>
            <span className="item-row__price">
              {item.promotion != null ? (
                <>
                  <s>{formatPrice(item.price, siteConfig.currency, siteConfig.locale)}</s>{" "}
                  {formatPrice(item.promotion, siteConfig.currency, siteConfig.locale)}
                </>
              ) : (
                formatPrice(item.price, siteConfig.currency, siteConfig.locale)
              )}
            </span>
            <button type="button" className="row-action" disabled={availabilityBusyId === item.id} aria-busy={availabilityBusyId === item.id} onClick={() => onToggleAvailability(item)}>
              {item.isAvailable ? d.items.available : d.items.unavailable}
            </button>
          </span>
          <div className="item-row__actions">
            <button type="button" className="row-action" onClick={() => onEdit(item)}>
              {d.items.edit}
            </button>
            <button type="button" className="row-action row-action--danger" onClick={() => onDelete(item)}>
              {d.delete.confirm}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}