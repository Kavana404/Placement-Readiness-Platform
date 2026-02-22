import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChartColumnBig, Code2, Video } from "lucide-react";

const features = [
  {
    title: "Practice Problems",
    description: "Sharpen your coding and aptitude skills with guided sets.",
    icon: Code2,
  },
  {
    title: "Mock Interviews",
    description: "Simulate real interview rounds and improve communication.",
    icon: Video,
  },
  {
    title: "Track Progress",
    description: "Measure readiness with a clear view of growth over time.",
    icon: ChartColumnBig,
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [warning, setWarning] = useState("");

  const handleQuickAnalyze = (event) => {
    event.preventDefault();
    if (!jdText.trim()) return;
    if (jdText.trim().length < 200) {
      setWarning("This JD is too short to analyze deeply. Paste full JD for better output.");
      return;
    }
    setWarning("");
    navigate("/app/practice", {
      state: {
        company,
        role,
        jdText,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section className="mb-16 text-center md:mb-20">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Ace Your Placement
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
            Practice, assess, and prepare for your dream job
          </p>
          <Link
            to="/app"
            className="inline-flex rounded-lg bg-[hsl(245,58%,51%)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </section>

        <section className="mb-16 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:mb-20">
          <h2 className="mb-2 text-xl font-semibold text-slate-900">Quick JD Validation</h2>
          <p className="mb-4 text-sm text-slate-600">
            Start with a full job description for better analysis quality.
          </p>
          <form className="space-y-4" onSubmit={handleQuickAnalyze}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Company (optional)
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[hsl(245,58%,51%)] focus:ring-2 focus:ring-indigo-100"
                  placeholder="e.g. Amazon"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Role (optional)
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[hsl(245,58%,51%)] focus:ring-2 focus:ring-indigo-100"
                  placeholder="e.g. SDE-1"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              JD Text
              <textarea
                required
                value={jdText}
                onChange={(event) => setJdText(event.target.value)}
                rows={6}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[hsl(245,58%,51%)] focus:ring-2 focus:ring-indigo-100"
                placeholder="Paste full job description here..."
              />
            </label>
            {warning ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                {warning}
              </div>
            ) : null}
            <button
              type="submit"
              className="rounded-lg bg-[hsl(245,58%,51%)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Continue to Analyze
            </button>
          </form>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-lg bg-indigo-50 p-3 text-[hsl(245,58%,51%)]">
                <Icon size={22} />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-600">{description}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        Copyright {new Date().getFullYear()} Placement Readiness Platform. All rights
        reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
