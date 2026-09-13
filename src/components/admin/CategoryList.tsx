"use client";

import type { Dictionary } from "@/i18n/dictionary";
import type { AdminCategoryDto } from "@/types/backend";
import { cn } from "@/lib/utils";

import { AdminNotice } from "./AdminNotice";

interface CategoryListProps {
  dict: Dictionary;
  categories: AdminCategoryDto[];
  /** Known per-category item counts (filled lazily as items load). */
  itemCounts: Record<string, number>;
  selectedId: string | null;
  loading: boolean;
  error?: string | null;
  onRetry: () => void;
  onAdd: () => void;
  onSelect: (category: AdminCategoryDto) => void;
  onEdit: (category: AdminCategoryDto) => void;
  onDelete: (category: AdminCategoryDto) => void;
}

export function CategoryList({
  dict,
  categories,
  itemCounts,
  selectedId,
  loading,
  error,
  onRetry,
  onAdd,
  onSelect,
  onEdit,
  onDelete,
}: CategoryListProps) {
  const d = dict.admin;

  if (loading) {
    return (
      <div aria-busy="true">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="category-row">
            <span className="skeleton skeleton--card-title" />
            <span className="category-row__chevron skeleton skeleton--chip" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <AdminNotice
        title={d.categories.loadError}
        message={error}
        actionLabel={d.errors.retry}
        onAction={onRetry}
      />
    );
  }

  if (categories.length === 0) {
    return (
      <AdminNotice
        title={d.categories.emptyTitle}
        message={d.categories.emptyMessage}
        actionLabel={d.categories.add}
        onAction={onAdd}
      />
    );
  }

  return (
    <ul className="category-list">
      {categories.map((category) => {
        const count = itemCounts[category.id];
        return (
          <li key={category.id} className="category-row">
            <button
              type="button"
              className={cn("category-row__main", selectedId === category.id && "category-row__main--active")}
              onClick={() => onSelect(category)}
              aria-label={`${category.name} — ${d.categories.itemCount(count ?? 0)}`}
            >
              <span className="category-row__name">{category.name}</span>
              <span className="category-row__count">
                {count === undefined ? "·" : d.categories.itemCount(count)}
              </span>
            </button>
            <div className="category-row__actions">
              <button type="button" className="row-action" onClick={() => onEdit(category)}>
                {d.categories.edit}
              </button>
              <button
                type="button"
                className="row-action row-action--danger"
                onClick={() => onDelete(category)}
              >
                {d.delete.confirm}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}