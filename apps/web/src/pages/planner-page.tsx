import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";

export const PlannerPage = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledFor: new Date().toISOString().slice(0, 16),
    category: "revision" as const,
  });
  const tasks = useMemo(() => mockApp.getPlanner(user!.id), [refreshKey, user]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-primary-fixed p-3 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-headline text-2xl font-extrabold">Daily schedule</h2>
            <p className="text-sm text-on-surface-variant">Calendar-based planning with AI-generated study blocks.</p>
          </div>
        </div>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start justify-between gap-4 rounded-3xl bg-surface-container-low p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                  {new Date(task.scheduledFor).toLocaleString()}
                </p>
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-on-surface-variant">{task.description}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  mockApp.removeTask(user!.id, task.id);
                  setRefreshKey((current) => current + 1);
                }}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-surface-container-low">
        <h3 className="font-headline text-2xl font-extrabold">Add task</h3>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mockApp.addTask(user!.id, {
              title: form.title,
              description: form.description,
              scheduledFor: new Date(form.scheduledFor).toISOString(),
              category: form.category,
            });
            setForm({
              title: "",
              description: "",
              scheduledFor: new Date().toISOString().slice(0, 16),
              category: "revision",
            });
            setRefreshKey((current) => current + 1);
          }}
        >
          <input
            className="w-full rounded-3xl bg-surface-container-lowest px-4 py-3 outline-none"
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          />
          <textarea
            className="h-28 w-full rounded-3xl bg-surface-container-lowest px-4 py-3 outline-none"
            placeholder="Task description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
          <input
            type="datetime-local"
            className="w-full rounded-3xl bg-surface-container-lowest px-4 py-3 outline-none"
            value={form.scheduledFor}
            onChange={(event) => setForm((current) => ({ ...current, scheduledFor: event.target.value }))}
          />
          <select
            className="w-full rounded-3xl bg-surface-container-lowest px-4 py-3 outline-none"
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as typeof current.category }))}
          >
            <option value="course">Course</option>
            <option value="quiz">Quiz</option>
            <option value="revision">Revision</option>
            <option value="ai">AI</option>
          </select>
          <Button className="w-full">Create planner task</Button>
        </form>
      </Card>
    </div>
  );
};
