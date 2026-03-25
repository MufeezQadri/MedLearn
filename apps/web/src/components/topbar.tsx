import { Bell, Flame, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../context/auth-context";
import { Button } from "./ui/button";

export const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-panel sticky top-4 z-30 mb-6 flex items-center justify-between rounded-[1.75rem] px-4 py-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          {format(new Date(), "EEEE, do MMMM")}
        </p>
        <h1 className="font-headline text-2xl font-extrabold tracking-tight">Welcome, {user?.fullName.split(" ")[1] ?? "Doctor"}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-bold text-orange-600 sm:flex">
          <Flame className="h-4 w-4" />
          {user?.streakDays ?? 0} day streak
        </div>
        <button type="button" className="rounded-full bg-surface-container-low p-3 text-on-surface-variant">
          <Bell className="h-4 w-4" />
        </button>
        <Button variant="ghost" onClick={logout} className="hidden sm:inline-flex">
          <span className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </span>
        </Button>
      </div>
    </header>
  );
};
