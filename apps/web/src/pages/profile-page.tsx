import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";

export const ProfilePage = () => {
  const { user } = useAuth();
  const progress = mockApp.getProgress(user!.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">
      <Card className="bg-signature text-white">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-fixed">Profile</p>
        <h2 className="mt-3 font-headline text-4xl font-extrabold">{user?.fullName}</h2>
        <p className="mt-3 text-primary-fixed">{user?.email}</p>
        <p className="mt-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]">{user?.examTrack}</p>
      </Card>
      <Card>
        <h3 className="font-headline text-2xl font-extrabold">Learning summary</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-surface-container-low p-5">
            <p className="text-sm text-on-surface-variant">Hours learned</p>
            <p className="mt-2 font-headline text-3xl font-extrabold">{progress.hoursLearned}</p>
          </div>
          <div className="rounded-3xl bg-surface-container-low p-5">
            <p className="text-sm text-on-surface-variant">Quiz accuracy</p>
            <p className="mt-2 font-headline text-3xl font-extrabold">{progress.averageAccuracy}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
