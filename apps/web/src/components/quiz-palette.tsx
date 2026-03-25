import type { QuizAnswer } from "@medlearn/shared";
import { cn } from "../lib/utils";

interface QuizPaletteProps {
  answers: QuizAnswer[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const QuizPalette = ({ answers, currentIndex, onSelect }: QuizPaletteProps) => (
  <div className="soft-card">
    <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">Question Palette</p>
    <div className="grid grid-cols-5 gap-2">
      {answers.map((answer, index) => {
        const state =
          currentIndex === index
            ? "current"
            : answer.markedForReview
              ? "review"
              : answer.optionId
                ? "answered"
                : "default";

        return (
          <button
            key={answer.questionId}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              "h-10 rounded-xl text-sm font-bold",
              state === "answered" && "bg-tertiary text-white",
              state === "current" && "bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-background",
              state === "review" && "bg-error-container text-error",
              state === "default" && "bg-surface-container-lowest text-on-surface-variant",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        );
      })}
    </div>
    <div className="mt-5 space-y-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-tertiary" /> Answered
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary" /> Current
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-error-container" /> For review
      </div>
    </div>
  </div>
);
