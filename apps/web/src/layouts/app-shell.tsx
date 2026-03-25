import {
  BookOpenText,
  Bot,
  GraduationCap,
  LayoutDashboard,
  Target,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar";
import { Topbar } from "../components/topbar";
import { cn } from "../lib/utils";

const mobileItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/library", label: "Library", icon: BookOpenText },
  { to: "/quizzes", label: "Quizzes", icon: Target },
  { to: "/assistant", label: "AI", icon: Bot },
];

export const AppShell = () => (
  <div className="mx-auto flex min-h-screen max-w-[1500px] gap-6 p-4 md:p-6">
    <Sidebar />
    <div className="min-w-0 flex-1 pb-24 lg:pb-8">
      <Topbar />
      <Outlet />
    </div>
    <nav className="fixed inset-x-4 bottom-4 z-40 grid grid-cols-5 rounded-[1.75rem] bg-surface-container-lowest p-2 shadow-ambient lg:hidden">
      {mobileItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold text-on-surface-variant",
              isActive && "bg-secondary-container text-primary",
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  </div>
);
