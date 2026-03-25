import {
  Bot,
  BookOpenText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Shield,
  Target,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";
import { Logo } from "./logo";

const items: Array<{ to: string; label: string; icon: LucideIcon }> = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/library", label: "Library", icon: BookOpenText },
  { to: "/quizzes", label: "Quizzes", icon: Target },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/progress", label: "Progress", icon: Gauge },
  { to: "/planner", label: "Planner", icon: Target },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/admin", label: "Admin", icon: Shield },
];

export const Sidebar = () => (
  <aside className="hidden w-72 shrink-0 rounded-[2rem] bg-surface-container-low p-5 lg:block">
    <Logo />
    <nav className="mt-8 space-y-2">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-on-surface-variant transition",
              isActive && "bg-surface-container-lowest text-primary shadow-sm",
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
