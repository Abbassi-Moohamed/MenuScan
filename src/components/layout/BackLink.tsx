import Link from "next/link";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  href: string;
  label: string;
  className?: string;
}

/** Consistent, accessible back navigation for public pages. */
export function BackLink({ href, label, className }: BackLinkProps) {
  return (
    <Link className={cn("navigation-back", className)} href={href} aria-label={label} title={label}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
    </Link>
  );
}
