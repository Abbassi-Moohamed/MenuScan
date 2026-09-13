/**
 * Public API base URL. Inferred from `NEXT_PUBLIC_API_URL` at build time so it
 * works both server-side (SSR coffee resolution) and client-side (menu sheet
 * item loading) without a second configuration path.
 */
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
} as const;