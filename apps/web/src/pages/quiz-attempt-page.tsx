import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Flag, Sparkles } from "lucide-react";
import type { QuizAnswer } from "@medlearn/shared";
import { useNavigate, useParams } from "react-router-dom";
import { QuizPalette } from "../components/quiz-palette";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";
import { formatSeconds } from "../lib/utils";

export const QuizAttemptPage = () => {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const quiz = mockApp.getQuiz(id);
  const [attempt] = useState(() => mockApp.startQuiz(user!.id, id));
  const [answers, setAnswers] = useState<QuizAnswer[]>(attempt.answers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quiz.durationMinutes * 60);
  const question = useMemo(() => quiz.questions[currentIndex], [currentIndex, quiz.questions]);
  const answer = answers[currentIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeRemaining((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeRemaining === 0) {
      const result = mockApp.submitQuiz(user!.id, attempt.id, answers, quiz.durationMinutes * 60);
      navigate(`/quizzes/result/${result.attempt.id}`);
    }
  }, [answers, attempt.id, navigate, quiz.durationMinutes, timeRemaining, user]);

  const updateAnswer = (next: Partial<QuizAnswer>) => {
    setAnswers((current) =>
      current.map((item, index) => (index === currentIndex ? { ...item, ...next } : item)),
    );
  };

  const onSubmit = () => {
    const result = mockApp.submitQuiz(user!.id, attempt.id, answers, quiz.durationMinutes * 60 - timeRemaining);
    navigate(`/quizzes/result/${result.attempt.id}`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">
      <div className="space-y-4">
        <QuizPalette answers={answers} currentIndex={currentIndex} onSelect={setCurrentIndex} />
        <div className="glass-panel rounded-editorial p-5">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-extrabold uppercase tracking-[0.2em]">AI Guidance</p>
          </div>
          <p className="text-sm italic text-on-surface-variant">
            Focus on mechanism and the patient’s clinical setting. The trap here is jumping to the atypical organism without ruling out the classic presentation first.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-3xl bg-surface-container-low px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">Session timer</p>
            <p className="font-headline text-2xl font-extrabold tracking-tight text-primary">{formatSeconds(timeRemaining)}</p>
          </div>
          <Button variant="secondary" onClick={() => updateAnswer({ markedForReview: !answer.markedForReview })}>
            <span className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              {answer.markedForReview ? "Unmark review" : "Mark for review"}
            </span>
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {question.subject} · {question.topic}
            </span>
          </div>
          <h2 className="max-w-3xl font-headline text-4xl font-extrabold tracking-tight">{question.prompt}</h2>
          <div className="mt-8 space-y-4">
            {question.options
              .filter((option) => !answer.eliminatedOptionIds.includes(option.id))
              .map((option) => {
                const selected = answer.optionId === option.id;

                return (
                  <div
                    key={option.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => updateAnswer({ optionId: option.id })}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        updateAnswer({ optionId: option.id });
                      }
                    }}
                    className={`flex w-full items-center gap-4 rounded-3xl p-5 text-left transition ${selected ? "bg-secondary-container ring-2 ring-primary" : "bg-surface-container-low hover:bg-surface-container-high"}`}
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-2xl font-headline font-extrabold ${selected ? "bg-primary text-white" : "bg-surface-container-lowest text-on-surface-variant"}`}>
                      {option.label}
                    </span>
                    <span className={`text-lg ${selected ? "font-bold text-primary" : "text-on-surface"}`}>{option.text}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="ml-auto rounded-full bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-on-surface-variant"
                      onClick={(event) => {
                        event.stopPropagation();
                        updateAnswer({
                          eliminatedOptionIds: [...answer.eliminatedOptionIds, option.id],
                        });
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          updateAnswer({
                            eliminatedOptionIds: [...answer.eliminatedOptionIds, option.id],
                          });
                        }
                      }}
                    >
                      Eliminate
                    </span>
                  </div>
                );
              })}
          </div>
        </Card>

        <div className="flex flex-wrap justify-between gap-3">
          <Button variant="ghost" onClick={() => setCurrentIndex((current) => Math.max(current - 1, 0))}>
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Previous
            </span>
          </Button>
          <div className="flex gap-3">
            {currentIndex < quiz.questions.length - 1 ? (
              <Button onClick={() => setCurrentIndex((current) => Math.min(current + 1, quiz.questions.length - 1))}>
                <span className="flex items-center gap-2">
                  Next <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            ) : (
              <Button onClick={onSubmit}>Submit quiz</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
