import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Logo } from "../components/logo";
import { useAuth } from "../context/auth-context";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTarget = (location.state as { from?: string } | null)?.from ?? "/";
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "sarah@medlearn.ai",
    password: "Password@123",
    examTrack: "NEET_PG" as const,
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup({
          fullName: form.fullName || "Dr. New Learner",
          email: form.email,
          examTrack: form.examTrack,
        });
      }

      navigate(redirectTarget);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to continue");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(183,234,255,0.55),_transparent_30%),linear-gradient(180deg,_#f7f9fb_0%,_#eef3f6_100%)] px-4 py-8">
      <div className="mx-auto grid min-h-[92vh] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <Logo />
          <Badge>AI-powered medical learning platform</Badge>
          <div>
            <h1 className="max-w-xl font-headline text-5xl font-extrabold tracking-tight text-on-surface">
              Learn medicine with courses, quizzes, books, and a study planner that adapts with you.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-on-surface-variant">
              Built for MBBS, NEET PG, and USMLE prep with a quiz-first workflow and editorial, calm UI inspired by your Stitch screens.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="rounded-3xl bg-primary text-white shadow-glass">
              <p className="text-sm uppercase tracking-[0.18em] text-primary-fixed">Quiz Engine</p>
              <p className="mt-3 text-3xl font-extrabold">MCQ + Timer</p>
            </Card>
            <Card className="rounded-3xl">
              <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">AI Layer</p>
              <p className="mt-3 text-3xl font-extrabold">Recommendations</p>
            </Card>
            <Card className="rounded-3xl">
              <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">Planner</p>
              <p className="mt-3 text-3xl font-extrabold">Daily schedule</p>
            </Card>
          </div>
        </section>

        <Card className="rounded-[2rem] border border-white/60 bg-white/85 p-8 backdrop-blur-xl">
          <div className="mb-6 flex gap-2 rounded-full bg-surface-container-low p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${mode === "login" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${mode === "signup" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"}`}
            >
              Signup
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface-variant">Full name</span>
                <input
                  className="w-full rounded-2xl bg-surface-container-low px-4 py-3 outline-none ring-0"
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                />
              </label>
            ) : null}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-on-surface-variant">Email</span>
              <input
                className="w-full rounded-2xl bg-surface-container-low px-4 py-3 outline-none ring-0"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-on-surface-variant">Password</span>
              <input
                type="password"
                className="w-full rounded-2xl bg-surface-container-low px-4 py-3 outline-none ring-0"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
            </label>
            {mode === "signup" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface-variant">Exam track</span>
                <select
                  className="w-full rounded-2xl bg-surface-container-low px-4 py-3 outline-none ring-0"
                  value={form.examTrack}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      examTrack: event.target.value as typeof current.examTrack,
                    }))
                  }
                >
                  <option value="MBBS">MBBS</option>
                  <option value="NEET_PG">NEET PG</option>
                  <option value="USMLE">USMLE</option>
                </select>
              </label>
            ) : null}
            {error ? <p className="text-sm font-medium text-error">{error}</p> : null}
            <Button className="w-full">{mode === "login" ? "Enter workspace" : "Create account"}</Button>
          </form>

          <div className="mt-6 rounded-3xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
            Demo credentials:
            <div className="mt-2 space-y-1 font-medium text-on-surface">
              <p>`sarah@medlearn.ai` / `Password@123`</p>
              <p>`admin@medlearn.ai` / `Admin@123`</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
