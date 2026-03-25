import { Stethoscope } from "lucide-react";

export const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="rounded-2xl bg-primary-fixed p-2 text-primary">
      <Stethoscope className="h-5 w-5" />
    </div>
    <div>
      <p className="font-headline text-lg font-extrabold tracking-tight text-primary">MedLearn AI</p>
      <p className="text-xs text-on-surface-variant">Clinical Intelligence Framework</p>
    </div>
  </div>
);
