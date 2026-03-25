import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  meta?: string;
  icon: ReactNode;
}

export const StatCard = ({ label, value, meta, icon }: StatCardProps) => (
  <div className="rounded-3xl bg-surface-container-low p-5">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-lowest text-primary shadow-sm">
      {icon}
    </div>
    <p className="text-sm text-on-surface-variant">{label}</p>
    <p className="font-headline text-3xl font-extrabold tracking-tight">{value}</p>
    {meta ? <p className="mt-1 text-xs font-medium text-tertiary">{meta}</p> : null}
  </div>
);
