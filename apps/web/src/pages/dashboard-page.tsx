import { Brain, CalendarClock, Clock3, Sparkles, Trophy } from "lucide-react";
import { courses as sharedCourses } from "@medlearn/shared";
import { CourseCard } from "../components/course-card";
import { StatCard } from "../components/stat-card";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";

export const DashboardPage = () => {
  const { user } = useAuth();
  const progress = mockApp.getProgress(user!.id);
  const recommendations = mockApp.getRecommendations(user!.id);
  const planner = mockApp.getPlanner(user!.id);
  const notifications = mockApp.getNotifications(user!.id);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(183,234,255,0.45),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f7f9fb_100%)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">Daily command center</p>
              <h2 className="mt-3 font-headline text-4xl font-extrabold tracking-tight">
                Ready to master your clinical rotations today?
              </h2>
              <p className="mt-4 text-lg text-on-surface-variant">
                Your weakest areas are {progress.weakTopics.slice(0, 2).join(" and ")}. The planner below is tuned to fix that without losing momentum in your strong subjects.
              </p>
            </div>
            <div className="glass-panel rounded-3xl p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">Next exam</p>
              <p className="mt-2 font-headline text-2xl font-extrabold">Mock NEET PG</p>
              <p className="text-sm text-on-surface-variant">Saturday · 9:00 AM · 200 questions</p>
            </div>
          </div>
        </Card>

        <Card className="bg-signature text-white">
          <p className="text-sm uppercase tracking-[0.18em] text-primary-fixed">AI Recommendations</p>
          <div className="mt-4 space-y-4">
            {recommendations.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-3xl bg-white/10 p-4">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-primary-fixed">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Average Accuracy" value={`${progress.averageAccuracy}%`} icon={<Trophy className="h-5 w-5" />} />
        <StatCard label="Hours Learned" value={`${progress.hoursLearned}`} icon={<Clock3 className="h-5 w-5" />} />
        <StatCard label="Quizzes Taken" value={`${progress.quizzesTaken}`} icon={<Brain className="h-5 w-5" />} />
        <StatCard label="Completion" value={`${progress.completionPercent}%`} meta="+6 this week" icon={<Sparkles className="h-5 w-5" />} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">AI study plan</p>
              <h3 className="font-headline text-2xl font-extrabold">Today’s tasks</h3>
            </div>
            <Button variant="secondary">Refine plan</Button>
          </div>
          <div className="space-y-4">
            {planner.map((task) => (
              <div key={task.id} className="flex items-start gap-4 rounded-3xl bg-surface-container-low p-4">
                <div className="mt-1 rounded-2xl bg-surface-container-lowest p-3 text-primary shadow-sm">
                  <CalendarClock className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">{new Date(task.scheduledFor).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-on-surface-variant">{task.description}</p>
                </div>
                <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold capitalize text-primary">{task.status.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-surface-container-low">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Inbox</p>
          <div className="mt-4 space-y-4">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-3xl bg-surface-container-lowest p-4">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{item.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Continue learning</p>
            <h3 className="font-headline text-2xl font-extrabold">Recommended next</h3>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          {sharedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
};
