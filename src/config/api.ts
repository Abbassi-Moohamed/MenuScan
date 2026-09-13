/**
 * API base URL, context-aware because the backend is reached differently on
 * the client and the server:
 *
 *  - Browser: the backend is proxied by the Next.js `/api/v1/*` rewrite, so
 *    requests stay same-origin (no CORS, no public backend URL in the bundle).
 *  - Server (SSR/ISR): `fetch` needs an absolute origin — `BACKEND_API_URL`
 *    (falls back to the local dev backend).
 */
export const apiConfig = {
  baseUrl:
    typeof window === "undefined"
      ? (process.env.BACKEND_API_URL ?? "http://localhost:4000")
      : "",
} as const;