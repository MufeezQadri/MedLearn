import { CheckCircle2, RefreshCcw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ProgressRing } from "../components/progress-ring";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";

export const QuizResultPage = () => {
  const { attemptId = "" } = useParams();
  const { user } = useAuth();
  const result = mockApp.getQuizResult(user!.id, attemptId);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="flex items-center justify-center">
          <ProgressRing value={result.attempt.score} />
        </Card>
        <Card className="bg-surface-container-low">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Performance summary</p>
          <h2 className="mt-3 font-headline text-4xl font-extrabold tracking-tight">{result.quiz.title}</h2>
          <p className="mt-3 text-lg text-on-surface-variant">
            Accuracy {result.attempt.accuracy}% with {result.strongTopics.length} strong topics and {result.weakTopics.length} remediation targets.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/quizzes/${result.quiz.id}/attempt`}>
              <Button>
                <span className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Retry quiz
                </span>
              </Button>
            </Link>
            <Link to="/progress">
              <Button variant="secondary">Open analytics</Button>
            </Link>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Strong topics</p>
          <div className="mt-4 space-y-3">
            {result.strongTopics.map((topic) => (
              <div key={topic} className="flex items-center gap-3 rounded-3xl bg-surface-container-low p-4">
                <CheckCircle2 className="h-5 w-5 text-tertiary" />
                <span className="font-medium">{topic}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Review next</p>
          <div className="mt-4 space-y-3">
            {result.weakTopics.map((topic) => (
              <div key={topic} className="rounded-3xl bg-error-container p-4 text-error">
                <p className="font-semibold">{topic}</p>
                <p className="mt-1 text-sm">Schedule a targeted revision block and retry incorrects.</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
