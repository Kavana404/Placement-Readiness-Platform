import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { runAnalysis } from "../lib/analysisEngine";
import { saveHistoryEntry } from "../lib/storage";

export default function PracticePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (!location.state) return;
    if (typeof location.state.company === "string") setCompany(location.state.company);
    if (typeof location.state.role === "string") setRole(location.state.role);
    if (typeof location.state.jdText === "string") setJdText(location.state.jdText);
  }, [location.state]);

  const handleAnalyze = (event) => {
    event.preventDefault();
    if (!jdText.trim()) {
      setError("Paste a job description to run analysis.");
      return;
    }
    setError("");
    setWarning(
      jdText.trim().length < 200
        ? "This JD is too short to analyze deeply. Paste full JD for better output."
        : ""
    );

    const analysis = runAnalysis({ company, role, jdText });
    const entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      company: company.trim(),
      role: role.trim(),
      jdText,
      extractedSkills: analysis.extractedSkills,
      companyIntel: analysis.companyIntel,
      roundMapping: analysis.roundMapping,
      plan7Days: analysis.plan7Days,
      checklist: analysis.checklist,
      questions: analysis.questions,
      baseScore: analysis.baseScore,
      skillConfidenceMap: {},
      finalScore: analysis.finalScore,
      updatedAt: new Date().toISOString(),
    };

    saveHistoryEntry(entry);
    navigate(`/results?id=${entry.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>JD Analysis Workspace</CardTitle>
        <CardDescription>
          Paste a job description to generate skills, checklist, weekly plan, and likely interview
          questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleAnalyze}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Company Name
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[hsl(245,58%,51%)] focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g. Infosys"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Role
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[hsl(245,58%,51%)] focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g. Software Engineer Intern"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Job Description
            <textarea
              value={jdText}
              onChange={(event) => setJdText(event.target.value)}
              rows={12}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[hsl(245,58%,51%)] focus:ring-2 focus:ring-indigo-100"
              placeholder="Paste the full JD here..."
            />
          </label>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {warning ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              {warning}
            </div>
          ) : null}

          <button
            type="submit"
            className="rounded-lg bg-[hsl(245,58%,51%)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Analyze JD
          </button>
        </form>
      </CardContent>
    </Card>
  );
}