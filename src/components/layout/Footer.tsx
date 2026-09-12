import { menu } from "@/data/menu";
import type { Dictionary } from "@/i18n/dictionary";

interface FooterProps {
  dict: Dictionary;
}

export function Footer({ dict }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span className="site-footer__brand">{menu.branding.name}</span>
        <p className="site-footer__note">
          {dict.footer.note}
          <br />
          {dict.footer.noteCta}
          <strong>{dict.footer.noteCtaStrong}</strong>
        </p>
        <p className="site-footer__meta">{dict.footer.meta}</p>
      </div>
    </footer>
  );
}