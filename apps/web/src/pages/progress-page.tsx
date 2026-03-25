import { BarChart3, TrendingUp, Trophy } from "lucide-react";
import { Card } from "../components/ui/card";
import { StatCard } from "../components/stat-card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";

export const ProgressPage = () => {
  const { user } = useAuth();
  const progress = mockApp.getProgress(user!.id);
  const analytics = mockApp.getAnalytics();
  const history = mockApp.getQuizHistory(user!.id);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Completion" value={`${progress.completionPercent}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Average Accuracy" value={`${progress.averageAccuracy}%`} icon={<Trophy className="h-5 w-5" />} />
        <StatCard label="Quiz Count" value={`${history.length}`} icon={<BarChart3 className="h-5 w-5" />} />
      </section>
      <section className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
        <Card>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Weekly analytics</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {analytics.map((item) => (
              <div key={item.label} className="rounded-3xl bg-surface-container-low p-5">
                <p className="text-sm text-on-surface-variant">{item.label}</p>
                <p className="mt-2 font-headline text-3xl font-extrabold">{item.value}</p>
                <p className="mt-1 text-sm font-medium text-tertiary">{item.trend > 0 ? "+" : ""}{item.trend}% trend</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="bg-surface-container-low">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Weak vs strong</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-error">Weak</p>
              <div className="space-y-2">
                {progress.weakTopics.map((topic) => (
                  <div key={topic} className="rounded-2xl bg-error-container px-4 py-3 text-sm font-medium text-error">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">Strong</p>
              <div className="space-y-2">
                {progress.strongTopics.map((topic) => (
                  <div key={topic} className="rounded-2xl bg-secondary-container px-4 py-3 text-sm font-medium text-primary">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
