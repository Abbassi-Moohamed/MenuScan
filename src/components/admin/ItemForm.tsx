"use client";

import { useState } from "react";

import type { Dictionary } from "@/i18n/dictionary";
import { isHttpUrl, isValidPrice } from "@/lib/validators";
import { cn } from "@/lib/utils";

export interface ItemFormValues {
  name: string;
  description?: string;
  price: number;
  image?: string;
}

interface ItemFormProps {
  dict: Dictionary;
  title: string;
  /** Existing values when editing (price is the backend decimal, e.g. `4.5`). */
  initial?: { name: string; description: string | null; price: number; image: string | null };
  busy: boolean;
  /** Server-side error (already translated). */
  error?: string | null;
  onSubmit: (values: ItemFormValues) => Promise<void>;
  onCancel: () => void;
}

export function ItemForm({ dict, title, initial, busy, error, onSubmit, onCancel }: ItemFormProps) {
  const t = dict.admin.items;
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (trimmedName.length === 0) {
      setFieldError(t.nameRequired);
      return;
    }
    if (!isValidPrice(price)) {
      setFieldError(t.priceInvalid);
      return;
    }
    if (trimmedImage.length > 0 && !isHttpUrl(trimmedImage)) {
      setFieldError(t.urlInvalid);
      return;
    }

    setFieldError(null);
    void onSubmit({
      name: trimmedName,
      description: description.trim().length > 0 ? description.trim() : undefined,
      price: Number(price),
      image: trimmedImage.length > 0 ? trimmedImage : undefined,
    });
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

      <label className="admin-field">
        <span className="admin-field__label">{t.description}</span>
        <textarea
          className="admin-field__input admin-field__textarea"
          rows={3}
          value={description}
          placeholder={t.descriptionPlaceholder}
          disabled={busy}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <label className="admin-field">
        <span className="admin-field__label">{t.price}</span>
        <input
          className="admin-field__input"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.001"
          value={price}
          placeholder={t.pricePlaceholder}
          disabled={busy}
          onChange={(event) => setPrice(event.target.value)}
        />
      </label>

      <label className="admin-field">
        <span className="admin-field__label">{t.image}</span>
        <input
          className="admin-field__input"
          type="url"
          inputMode="url"
          value={image}
          placeholder={t.imagePlaceholder}
          disabled={busy}
          onChange={(event) => setImage(event.target.value)}
        />
        <span className="admin-field__hint">{t.imageHint}</span>
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