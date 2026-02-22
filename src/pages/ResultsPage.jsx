import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { getHistoryEntryById, getLatestEntry, updateHistoryEntryById } from "../lib/storage";
import { generateCompanyIntel, generateRoundMapping } from "../lib/analysisEngine";

function SectionTitle({ children }) {
  return <h3 className="mb-3 text-base font-semibold text-slate-900">{children}</h3>;
}

const SKILL_LABELS = {
  coreCS: "Core CS",
  languages: "Languages",
  web: "Web",
  data: "Data",
  cloud: "Cloud/DevOps",
  testing: "Testing",
  other: "Other",
};

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [entry, setEntry] = useState((id && getHistoryEntryById(id)) || getLatestEntry());

  useEffect(() => {
    setEntry((id && getHistoryEntryById(id)) || getLatestEntry());
  }, [id]);

  if (!entry) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>No analysis found</CardTitle>
            <CardDescription>
              Run your first JD analysis to generate skills, plan, and interview questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/app/practice"
              className="rounded-lg bg-[hsl(245,58%,51%)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Go to Analyze
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const companyIntel = useMemo(
    () =>
      entry.companyIntel ||
      generateCompanyIntel({
        company: entry.company,
        jdText: entry.jdText,
      }),
    [entry.company, entry.companyIntel, entry.jdText]
  );

  const roundMapping = useMemo(
    () =>
      (entry.roundMapping || []).length > 0
        ? entry.roundMapping
        : generateRoundMapping({
            extractedSkills: entry.extractedSkills || {},
            companyIntel,
          }),
    [companyIntel, entry.extractedSkills, entry.roundMapping]
  );

  const allSkills = useMemo(
    () => Object.values(entry.extractedSkills || {}).flat(),
    [entry.extractedSkills]
  );

  const skillConfidenceMap = useMemo(() => {
    const existing = entry.skillConfidenceMap || {};
    const merged = { ...existing };
    allSkills.forEach((skill) => {
      if (!merged[skill]) merged[skill] = "practice";
    });
    return merged;
  }, [allSkills, entry.skillConfidenceMap]);

  const baseScore = entry.baseScore ?? 0;
  const knowCount = Object.values(skillConfidenceMap).filter((value) => value === "know").length;
  const practiceCount = Object.values(skillConfidenceMap).filter((value) => value === "practice").length;
  const finalScore = Math.max(0, Math.min(100, baseScore + knowCount * 2 - practiceCount * 2));

  useEffect(() => {
    if (!entry.id) return;
    const needsSync =
      JSON.stringify(entry.skillConfidenceMap || {}) !== JSON.stringify(skillConfidenceMap) ||
      entry.finalScore !== finalScore ||
      JSON.stringify(entry.roundMapping || []) !== JSON.stringify(roundMapping) ||
      JSON.stringify(entry.companyIntel || {}) !== JSON.stringify(companyIntel);

    if (!needsSync) return;
    const updated = updateHistoryEntryById(entry.id, {
      skillConfidenceMap,
      finalScore,
      baseScore,
      roundMapping,
      companyIntel,
      updatedAt: new Date().toISOString(),
    });
    if (updated) setEntry(updated);
  }, [baseScore, companyIntel, entry, finalScore, roundMapping, skillConfidenceMap]);

  const handleSkillConfidence = (skill, mode) => {
    const nextMap = { ...skillConfidenceMap, [skill]: mode };
    const know = Object.values(nextMap).filter((value) => value === "know").length;
    const practice = Object.values(nextMap).filter((value) => value === "practice").length;
    const nextScore = Math.max(0, Math.min(100, baseScore + know * 2 - practice * 2));
    const updated = updateHistoryEntryById(entry.id, {
      skillConfidenceMap: nextMap,
      finalScore: nextScore,
      baseScore,
      roundMapping,
      companyIntel,
      updatedAt: new Date().toISOString(),
    });
    if (updated) setEntry(updated);
  };

  const planText = entry.plan7Days
    .map((item) => `${item.day}: ${item.focus}\n${item.tasks.map((task) => `- ${task}`).join("\n")}`)
    .join("\n\n");
  const checklistText = entry.checklist
    .map((round) => `${round.roundTitle}\n${round.items.map((item) => `- ${item}`).join("\n")}`)
    .join("\n\n");
  const questionsText = entry.questions.map((question, idx) => `${idx + 1}. ${question}`).join("\n");

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const downloadTxt = () => {
    const combined = [
      "Placement Readiness Analysis",
      `${entry.company || "Company not set"} | ${entry.role || "Role not set"} | Score ${finalScore}/100`,
      "",
      "Key Skills Extracted",
      ...Object.entries(entry.extractedSkills).flatMap(([category, skills]) => [
        `${SKILL_LABELS[category] || category}: ${skills.join(", ")}`,
      ]),
      "",
      "Company Intel",
      `Company: ${companyIntel.companyName}`,
      `Industry: ${companyIntel.industry}`,
      `Estimated Size: ${companyIntel.sizeCategory}`,
      `Typical Hiring Focus: ${companyIntel.typicalHiringFocus}`,
      companyIntel.note,
      "",
      "Round Mapping",
      ...roundMapping.map(
        (round) =>
          `${round.roundTitle}\nFocus Areas: ${round.focusAreas.join(", ")}\nWhy this round matters: ${round.whyItMatters}`
      ),
      "",
      "Round-wise Preparation Checklist",
      checklistText,
      "",
      "7-Day Plan",
      planText,
      "",
      "10 Likely Interview Questions",
      questionsText,
    ].join("\n");

    const blob = new Blob([combined], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis-${entry.id || "latest"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const weakSkills = Object.entries(skillConfidenceMap)
    .filter(([, status]) => status === "practice")
    .map(([skill]) => skill)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            {entry.company || "Company not set"} • {entry.role || "Role not set"} • Score {finalScore}/100
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-0">
          <button
            onClick={() => copyText(planText)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            Copy 7-day plan
          </button>
          <button
            onClick={() => copyText(checklistText)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            Copy round checklist
          </button>
          <button
            onClick={() => copyText(questionsText)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            Copy 10 questions
          </button>
          <button
            onClick={downloadTxt}
            className="rounded-lg bg-[hsl(245,58%,51%)] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
          >
            Download as TXT
          </button>
        </CardContent>
      </Card>

      {(entry.company || "").trim() ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Company Intel</CardTitle>
              <CardDescription>{companyIntel.note}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Company:</span> {companyIntel.companyName}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Industry:</span> {companyIntel.industry}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Estimated Size:</span> {companyIntel.sizeCategory}
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Typical Hiring Focus
                </p>
                <p className="mt-1">{companyIntel.typicalHiringFocus}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Round Mapping</CardTitle>
              <CardDescription>Interview flow generated using company profile and detected skills.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roundMapping.map((round, index) => (
                  <div key={round.roundTitle} className="relative pl-6">
                    {index !== roundMapping.length - 1 ? (
                      <span className="absolute left-[11px] top-5 h-[calc(100%+8px)] w-px bg-slate-300" />
                    ) : null}
                    <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[hsl(245,58%,51%)]" />
                    <p className="text-sm font-semibold text-slate-900">{round.roundTitle}</p>
                    <p className="mt-1 text-xs text-slate-500">Focus Areas: {round.focusAreas.join(", ")}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-medium text-slate-700">Why this round matters:</span>{" "}
                      {round.whyItMatters}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Skills Extracted</CardTitle>
            <CardDescription>Detected directly from the pasted JD text.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(entry.extractedSkills).map(([category, skills]) => (
              <div key={category}>
                <SectionTitle>{SKILL_LABELS[category] || category}</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={`${category}-${skill}`}
                      className="flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs text-[hsl(245,58%,51%)]"
                    >
                      <span className="font-semibold">{skill}</span>
                      <button
                        onClick={() => handleSkillConfidence(skill, "know")}
                        className={`rounded-full px-2 py-0.5 transition ${
                          skillConfidenceMap[skill] === "know"
                            ? "bg-[hsl(245,58%,51%)] text-white"
                            : "bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        I know this
                      </button>
                      <button
                        onClick={() => handleSkillConfidence(skill, "practice")}
                        className={`rounded-full px-2 py-0.5 transition ${
                          skillConfidenceMap[skill] === "practice"
                            ? "bg-slate-700 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Need practice
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Round-wise Preparation Checklist</CardTitle>
            <CardDescription>Template adapted using detected skills.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {entry.checklist.map((round) => (
              <div key={round.roundTitle}>
                <SectionTitle>{round.roundTitle}</SectionTitle>
                <ul className="space-y-2">
                  {round.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-[2px] text-[hsl(245,58%,51%)]">□</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>7-Day Plan</CardTitle>
            <CardDescription>Structured schedule based on target role and stack.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {entry.plan7Days.map((dayPlan) => (
                <li key={dayPlan.day} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {dayPlan.day}: {dayPlan.focus}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {dayPlan.tasks.map((task) => (
                      <li key={`${dayPlan.day}-${task}`} className="text-sm text-slate-700">
                        - {task}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10 Likely Interview Questions</CardTitle>
            <CardDescription>Generated from extracted technologies and topics.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 pl-5 text-sm text-slate-700">
              {entry.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Action Next</CardTitle>
          <CardDescription>Focus on the most important weak areas first.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {weakSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {weakSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No weak skills marked yet.</p>
          )}
          <p className="text-sm font-medium text-slate-800">Start Day 1 plan now.</p>
        </CardContent>
      </Card>
    </div>
  );
}
