"use client";

import { useState } from "react";

import type { Dictionary } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
  dict: Dictionary;
  title: string;
  /** Existing name when editing. */
  initialName?: string;
  busy: boolean;
  /** Server-side error (already translated). */
  error?: string | null;
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({
  dict,
  title,
  initialName,
  busy,
  error,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const t = dict.admin.categories;
  const [name, setName] = useState(initialName ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setFieldError(t.nameRequired);
      return;
    }
    setFieldError(null);
    void onSubmit(trimmed);
  };

  return (
    <section className={cn("admin-form", busy && "admin-form--disabled")} aria-busy={busy}>
      <div className="admin-form__head">
        <h3 className="admin-form__title">{title}</h3>
      </div>

      <label className="admin-field">
        <span className="admin-field__label">{t.name}</span>
        <input
          className="admin-field__input"
          type="text"
          value={name}
          placeholder={t.namePlaceholder}
          disabled={busy}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      {fieldError ? (
        <p className="admin-form__error" role="alert">
          {fieldError}
        </p>
      ) : null}
      {error ? (
        <p className="admin-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-form__actions">
        <button type="button" className="admin-btn admin-btn--ghost" disabled={busy} onClick={onCancel}>
          {dict.admin.coffeeForm.cancel}
        </button>
        <button type="button" className="admin-btn admin-btn--primary" disabled={busy} onClick={handleSubmit}>
          {busy ? dict.admin.coffeeForm.saving : dict.admin.coffeeForm.save}
        </button>
      </div>
    </section>
  );
}