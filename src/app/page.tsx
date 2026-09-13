import { permanentRedirect } from "next/navigation";

/**
 * The MENU SCAN app lives under `/menuscan`; the bare root is kept only to
 * forward old landings to the canonical entry point.
 */
export default function RootRedirect() {
  permanentRedirect("/menuscan");
}