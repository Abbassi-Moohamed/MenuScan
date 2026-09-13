"use client";

import { useState } from "react";

import type { Dictionary } from "@/i18n/dictionary";
import { isHttpUrl } from "@/lib/validators";
import { cn } from "@/lib/utils";

export interface CoffeeFormValues {
  name: string;
  logo: string;
  slug?: string;
}

interface CoffeeFormProps {
  dict: Dictionary;
  mode: "create" | "edit";
  /** Initial values for edit mode. */
  initial?: CoffeeFormValues;
  title: string;
  busy: boolean;
  /** Server-side error (already translated), shown above the action row. */
  error?: string | null;
  /** Hide the cancel button (e.g. when the form fills a whole panel). */
  hideCancel?: boolean;
  onSubmit: (values: CoffeeFormValues) => Promise<void>;
  onCancel: () => void;
}

/**
 * Create/edit form for a coffee (name, logo and — in edit mode — slug).
 * Slug generation for new coffees is intentionally left to the backend.
 */
export function CoffeeForm({
  dict,
  mode,
  initial,
  title,
  busy,
  error,
  hideCancel,
  onSubmit,
  onCancel,
}: CoffeeFormProps) {
  const t = dict.admin.coffeeForm;
  const [name, setName] = useState(initial?.name ?? "");
  const [logo, setLogo] = useState(initial?.logo ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedLogo = logo.trim();
    const trimmedSlug = slug.trim();

    if (trimmedName.length === 0) {
      setFieldError(t.nameRequired);
      return;
    }
    if (trimmedLogo.length === 0 || !isHttpUrl(trimmedLogo)) {
      setFieldError(t.logoRequired);
      return;
    }
    if (mode === "edit" && trimmedSlug.length > 0 && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      setFieldError(t.slugInvalid);
      return;
    }

    setFieldError(null);
    void onSubmit({
      name: trimmedName,
      logo: trimmedLogo,
      slug: mode === "edit" && trimmedSlug.length > 0 ? trimmedSlug : undefined,
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
        <span className="admin-field__label">{t.logo}</span>
        <input
          className="admin-field__input"
          type="url"
          inputMode="url"
          value={logo}
          placeholder={t.logoPlaceholder}
          disabled={busy}
          onChange={(event) => setLogo(event.target.value)}
        />
      </label>

      {mode === "edit" ? (
        <label className="admin-field">
          <span className="admin-field__label">{t.slug}</span>
          <input
            className="admin-field__input"
            type="text"
            value={slug}
            placeholder={initial?.slug ?? ""}
            disabled={busy}
            onChange={(event) => setSlug(event.target.value)}
          />
          <span className="admin-field__hint">{t.slugHint}</span>
        </label>
      ) : null}

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
        {hideCancel ? null : (
          <button type="button" className="admin-btn admin-btn--ghost" disabled={busy} onClick={onCancel}>
            {t.cancel}
          </button>
        )}
        <button type="button" className="admin-btn admin-btn--primary" disabled={busy} onClick={handleSubmit}>
          {busy ? t.saving : t.save}
        </button>
      </div>
    </section>
  );
}