import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { getHistoryEntries, getHistoryWarning } from "../lib/storage";

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    setHistory(getHistoryEntries());
    setWarning(getHistoryWarning());
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          All analysis runs are stored locally in your browser and persist after refresh.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {warning ? (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {warning}
          </div>
        ) : null}
        {history.length === 0 ? (
          <p className="text-sm text-slate-600">No analysis history found yet.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((entry) => (
              <li key={entry.id}>
                <button
                  onClick={() => navigate(`/results?id=${entry.id}`)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-700">
                    {entry.company || "Company not set"} • {entry.role || "Role not set"}
                  </p>
                  <p className="text-xs font-medium text-[hsl(245,58%,51%)]">
                    Readiness Score: {entry.finalScore}/100
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}