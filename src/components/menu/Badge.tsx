import { cn } from "@/lib/utils";
import type { MenuItemTag } from "@/types/menu";

interface BadgeProps {
  tag: MenuItemTag;
  className?: string;
}

export function Badge({ tag, className }: BadgeProps) {
  return <span className={cn("badge", `badge--${tag.kind}`, className)}>{tag.label}</span>;
}