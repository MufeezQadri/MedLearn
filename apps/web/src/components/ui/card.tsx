import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

export const Card = ({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={cn("rounded-editorial bg-surface-container-lowest p-6 shadow-ambient", className)} {...props}>
    {children}
  </div>
);
