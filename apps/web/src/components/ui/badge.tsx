import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

export const Badge = ({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary",
      className,
    )}
    {...props}
  >
    {children}
  </span>
);
