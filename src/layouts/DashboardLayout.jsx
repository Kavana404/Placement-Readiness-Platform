import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpenCheck,
  ClipboardCheck,
  Library,
  UserRound,
} from "lucide-react";
import { getProjectStatusSummary } from "../lib/projectStatus";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/practice", label: "Practice", icon: BookOpenCheck },
  { to: "/app/assessments", label: "Assessments", icon: ClipboardCheck },
  { to: "/app/resources", label: "Resources", icon: Library },
  { to: "/app/profile", label: "Profile", icon: UserRound },
];

function DashboardLayout() {
  const [status, setStatus] = useState(getProjectStatusSummary());

  useEffect(() => {
    const sync = () => setStatus(getProjectStatusSummary());
    window.addEventListener("prp-state-change", sync);
    return () => window.removeEventListener("prp-state-change", sync);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-6">
          <h2 className="mb-8 text-xl font-semibold text-[hsl(245,58%,51%)]">
            Placement Prep
          </h2>
          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/app"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[hsl(245,58%,51%)] text-white"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-[hsl(245,58%,51%)]"
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="grid items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:grid-cols-[1fr_auto_auto]">
            <h1 className="text-lg font-semibold text-slate-800">Placement Prep</h1>
            <div className="text-sm text-slate-600">
              Step {status.completedSteps} / {status.totalSteps}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  status.isShipped
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {status.isShipped ? "Shipped" : "In Progress"}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-[hsl(245,58%,51%)]">
                U
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
