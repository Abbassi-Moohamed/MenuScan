"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";

interface AdminLayoutProps {
  dict: Dictionary;
  /** Title shown next to the brand mark (e.g. the coffee name). */
  title: string;
  /** Optional label under the title (role). */
  subtitle?: string;
  /** Optional current coffee logo. App-admin keeps the MENU SCAN mark. */
  logo?: string | null;
  /** Optional public menu link (coffee admin). */
  publicMenuHref?: string;
  onLogout: () => void;
  children: React.ReactNode;
}

/**
 * Functional shell used across the backoffice: a minimal top bar (brand,
 * current context, public-menu link, logout) over the page content.
 */
export function AdminLayout({
  dict,
  title,
  subtitle,
  logo,
  publicMenuHref,
  onLogout,
  children,
}: AdminLayoutProps) {
  return (
    <div className="admin">
      <header className="admin-bar">
        <div className="admin-bar__inner">
          <div className="admin-bar__brand">
            {logo ? (
              // The coffee logo identifies the active backoffice context.
              // eslint-disable-next-line @next/next/no-img-element
              <img className="admin-bar__logo" src={logo} alt="" />
            ) : (
              <span className="brand-mark" aria-hidden="true">
                {siteConfig.name.charAt(0)}
              </span>
            )}
            <span className="admin-bar__text">
              <span className="admin-bar__title">{title}</span>
              {subtitle ? <span className="admin-bar__subtitle">{subtitle}</span> : null}
            </span>
          </div>
          <div className="admin-bar__actions">
            {publicMenuHref ? (
              <Link className="admin-bar__link" href={publicMenuHref}>
                {dict.admin.chrome.viewPublicMenu}
              </Link>
            ) : null}
            <button type="button" className="admin-bar__link admin-bar__link--logout" onClick={onLogout}>
              {dict.admin.chrome.logout}
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="admin-main">
        <div className="admin-container">{children}</div>
      </main>
    </div>
  );
}