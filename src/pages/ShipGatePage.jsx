import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { getProjectStatusSummary } from "../lib/projectStatus";

export default function ShipGatePage() {
  const summary = getProjectStatusSummary();

  if (!summary.isShipped) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Locked</CardTitle>
            <CardDescription>
              Steps {summary.completedSteps}/{summary.totalSteps} • Tests {summary.checklistPassed}/
              {summary.checklistTotal}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Fix issues before shipping.
            </div>
            {!summary.stepsComplete ? (
              <p className="text-sm text-slate-700">- Complete all 8 implementation steps in `/prp/proof`.</p>
            ) : null}
            {!summary.checklistComplete ? (
              <p className="text-sm text-slate-700">- Complete all 10 tests in `/prp/07-test`.</p>
            ) : null}
            {!summary.proofLinksComplete ? (
              <p className="text-sm text-slate-700">- Provide valid Lovable, GitHub, and deployed links in `/prp/proof`.</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Link
                to="/prp/07-test"
                className="inline-flex rounded-lg bg-[hsl(245,58%,51%)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Go to Test Checklist
              </Link>
              <Link
                to="/prp/proof"
                className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                Go to Proof Page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ready to Ship</CardTitle>
          <CardDescription>All gate conditions are complete. Status is Shipped.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Ship gate passed. You can proceed confidently.
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
            <p>You built a real product.</p>
            <p>Not a tutorial. Not a clone.</p>
            <p>A structured tool that solves a real problem.</p>
            <p className="mt-2 font-semibold">This is your proof of work.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
