import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { menu } from "@/data/menu";
import { getDictionary } from "@/i18n";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dict = getDictionary(menu.language);

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Menu`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
};

export const viewport = {
  themeColor: "#fbf7ef",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={menu.language} className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link sr-only" href="#main">
          {dict.a11y.skipLink}
        </a>
        <Header dict={dict} />
        {children}
        <Footer dict={dict} />
        <BackToTop label={dict.backToTop.label} />
      </body>
    </html>
  );
}