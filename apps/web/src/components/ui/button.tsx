import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = ({
  className,
  variant = "primary",
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98]",
      variant === "primary" && "bg-signature text-white shadow-lg shadow-primary/20",
      variant === "secondary" && "bg-secondary-container text-primary",
      variant === "ghost" && "bg-transparent text-on-surface-variant hover:bg-surface-container-low",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
