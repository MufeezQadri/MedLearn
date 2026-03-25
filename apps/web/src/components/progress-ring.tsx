interface ProgressRingProps {
  value: number;
}

export const ProgressRing = ({ value }: ProgressRingProps) => {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-44 w-44">
      <svg className="h-44 w-44 -rotate-90">
        <circle cx="88" cy="88" r={radius} strokeWidth="12" className="fill-none text-surface-container-high" stroke="currentColor" />
        <circle
          cx="88"
          cy="88"
          r={radius}
          strokeWidth="12"
          className="fill-none text-primary"
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline text-4xl font-extrabold tracking-tight">{value}</span>
        <span className="text-sm text-on-surface-variant">score</span>
      </div>
    </div>
  );
};
