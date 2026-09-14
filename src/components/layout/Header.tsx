import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";

interface HeaderProps {
  dict: Dictionary;
}

export function Header({ dict }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#top" aria-label={siteConfig.name}>
          <span className="menu-card" aria-hidden="true">
            <span className="menu-card__title">Menu Digitale</span>
          </span>
        </a>
        <span className="site-header__spacer" aria-hidden="true" />
        <span className="status-chip" title={dict.header.statusTitle}>
          <span className="status-chip__dot" aria-hidden="true" />
          {dict.header.status}
        </span>
      </div>
    </header>
  );
}