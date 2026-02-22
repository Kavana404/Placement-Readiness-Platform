import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  TEST_ITEMS,
  getTestChecklistState,
  getTestChecklistSummary,
  resetTestChecklistState,
  saveTestChecklistState,
} from "../lib/testChecklist";

export default function TestChecklistPage() {
  const [state, setState] = useState(getTestChecklistState());
  const summary = useMemo(() => getTestChecklistSummary(state), [state]);

  const handleToggle = (id) => {
    const updated = saveTestChecklistState({ ...state, [id]: !state[id] });
    setState(updated);
  };

  const handleReset = () => {
    setState(resetTestChecklistState());
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Built-in Test Checklist</CardTitle>
          <CardDescription>Tests Passed: {summary.passed} / {summary.total}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 pt-0">
          {!summary.isComplete ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Fix issues before shipping.
            </div>
          ) : (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              All tests passed. Shipping unlocked.
            </div>
          )}
          <button
            onClick={handleReset}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            Reset checklist
          </button>
          <Link
            to="/prp/08-ship"
            className="rounded-lg bg-[hsl(245,58%,51%)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Go to Ship Gate
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checklist Items</CardTitle>
          <CardDescription>Mark each test only after validating behavior in the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {TEST_ITEMS.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(state[item.id])}
                    onChange={() => handleToggle(item.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[hsl(245,58%,51%)] focus:ring-indigo-200"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                    <span className="mt-1 block text-xs text-slate-500">How to test: {item.hint}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
