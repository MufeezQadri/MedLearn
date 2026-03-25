import { Link } from "react-router-dom";
import { ProgressRing } from "../components/progress-ring";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";

export const QuizSelectionPage = () => {
  const { user } = useAuth();
  const quizzes = mockApp.getQuizzes();
  const history = mockApp.getQuizHistory(user!.id);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="flex items-center justify-center">
          <ProgressRing value={mockApp.getProgress(user!.id).averageAccuracy} />
        </Card>
        <Card className="bg-surface-container-low">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Recent attempts</p>
          <div className="mt-4 space-y-3">
            {history.map((attempt) => (
              <div key={attempt.id} className="rounded-3xl bg-surface-container-lowest p-4">
                <p className="font-semibold">{mockApp.getQuiz(attempt.quizId).title}</p>
                <p className="text-sm text-on-surface-variant">
                  Accuracy {attempt.accuracy}% · {attempt.status}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="rounded-editorial">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{quiz.examTrack}</p>
            <h3 className="mt-3 font-headline text-2xl font-extrabold">{quiz.title}</h3>
            <p className="mt-2 text-on-surface-variant">{quiz.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {quiz.topicFocus.map((topic) => (
                <span key={topic} className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface-variant">
                  {topic}
                </span>
              ))}
            </div>
            <Link to={`/quizzes/${quiz.id}/attempt`} className="mt-6 block">
              <Button className="w-full">Start quiz</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
