import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  PRP_STEPS,
  areSubmissionLinksValid,
  getProjectStatusSummary,
  getStepCompletionState,
  getSubmissionData,
  saveStepCompletionState,
  saveSubmissionData,
  validateSubmissionLinks,
} from "../lib/projectStatus";

function toExportText(data) {
  return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${data.lovableProjectLink || ""}
GitHub Repository: ${data.githubRepositoryLink || ""}
Live Deployment: ${data.deployedUrl || ""}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;
}

export default function ProofPage() {
  const [stepState, setStepState] = useState(getStepCompletionState());
  const [submission, setSubmission] = useState(getSubmissionData());
  const [errors, setErrors] = useState({
    lovableProjectLink: "",
    githubRepositoryLink: "",
    deployedUrl: "",
  });
  const [saved, setSaved] = useState("");

  const summary = useMemo(() => getProjectStatusSummary(), [stepState, submission]);

  useEffect(() => {
    const onStateChange = () => {
      setStepState(getStepCompletionState());
      setSubmission(getSubmissionData());
    };
    window.addEventListener("prp-state-change", onStateChange);
    return () => window.removeEventListener("prp-state-change", onStateChange);
  }, []);

  const handleStepToggle = (stepId) => {
    const updated = saveStepCompletionState({ ...stepState, [stepId]: !stepState[stepId] });
    setStepState(updated);
  };

  const handleSaveSubmission = (event) => {
    event.preventDefault();
    const nextErrors = validateSubmissionLinks(submission);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    saveSubmissionData(submission);
    setSaved("Proof links saved.");
    setTimeout(() => setSaved(""), 1800);
  };

  const copyFinalSubmission = async () => {
    const text = toExportText(submission);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Proof + Submission</CardTitle>
          <CardDescription>
            Status: {summary.isShipped ? "Shipped" : "In Progress"} • Steps {summary.completedSteps}/
            {summary.totalSteps} • Tests {summary.checklistPassed}/{summary.checklistTotal}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step Completion Overview</CardTitle>
          <CardDescription>Mark each implementation step as completed or pending.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {PRP_STEPS.map((step) => (
              <li key={step.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <label className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(stepState[step.id])}
                      onChange={() => handleStepToggle(step.id)}
                      className="h-4 w-4 rounded border-slate-300 text-[hsl(245,58%,51%)] focus:ring-indigo-200"
                    />
                    <span className="text-sm font-medium text-slate-900">{step.title}</span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      stepState[step.id]
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {stepState[step.id] ? "Completed" : "Pending"}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artifact Inputs</CardTitle>
          <CardDescription>Required for final ship status. All links must be valid URLs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSaveSubmission}>
            <label className="block text-sm font-medium text-slate-700">
              Lovable Project Link
              <input
                type="url"
                required
                value={submission.lovableProjectLink}
                onChange={(e) => setSubmission((prev) => ({ ...prev, lovableProjectLink: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[hsl(245,58%,51%)] focus:ring-2 focus:ring-indigo-100"
                placeholder="https://..."
              />
              {errors.lovableProjectLink ? (
                <span className="mt-1 block text-xs text-red-600">{errors.lovableProjectLink}</span>
              ) : null}
            </label>

            <label className="block text-sm font-medium text-slate-700">
              GitHub Repository Link
              <input
                type="url"
                required
                value={submission.githubRepositoryLink}
                onChange={(e) =>
                  setSubmission((prev) => ({ ...prev, githubRepositoryLink: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[hsl(245,58%,51%)] focus:ring-2 focus:ring-indigo-100"
                placeholder="https://github.com/..."
              />
              {errors.githubRepositoryLink ? (
                <span className="mt-1 block text-xs text-red-600">{errors.githubRepositoryLink}</span>
              ) : null}
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Deployed URL
              <input
                type="url"
                required
                value={submission.deployedUrl}
                onChange={(e) => setSubmission((prev) => ({ ...prev, deployedUrl: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[hsl(245,58%,51%)] focus:ring-2 focus:ring-indigo-100"
                placeholder="https://your-app.com"
              />
              {errors.deployedUrl ? (
                <span className="mt-1 block text-xs text-red-600">{errors.deployedUrl}</span>
              ) : null}
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="rounded-lg bg-[hsl(245,58%,51%)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Save Proof Links
              </button>
              <button
                type="button"
                onClick={copyFinalSubmission}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                Copy Final Submission
              </button>
            </div>
            {saved ? <p className="text-xs text-emerald-700">{saved}</p> : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ship Readiness Rule</CardTitle>
          <CardDescription>
            Ship status turns on only when all 8 steps, all 10 tests, and all 3 proof links are complete.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p>Steps completed: {summary.completedSteps} / {summary.totalSteps}</p>
          <p>Checklist passed: {summary.checklistPassed} / {summary.checklistTotal}</p>
          <p>Proof links valid: {areSubmissionLinksValid(submission) ? "Yes" : "No"}</p>
          {summary.isShipped ? (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
              <p>You built a real product.</p>
              <p>Not a tutorial. Not a clone.</p>
              <p>A structured tool that solves a real problem.</p>
              <p className="mt-2 font-semibold">This is your proof of work.</p>
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-700">
              Status remains In Progress until all requirements are completed.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
