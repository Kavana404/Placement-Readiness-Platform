import { useEffect, useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function DashboardPage() {
  const maxScore = 100;
  const readinessScore = 72;
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const readinessRatio = readinessScore / maxScore;
  const targetDashLength = circumference * readinessRatio;
  const [animateRing, setAnimateRing] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setAnimateRing(true), 80);
    return () => clearTimeout(id);
  }, []);

  const skillData = useMemo(
    () => [
      { skill: "DSA", score: 75 },
      { skill: "System Design", score: 60 },
      { skill: "Communication", score: 80 },
      { skill: "Resume", score: 85 },
      { skill: "Aptitude", score: 70 },
    ],
    []
  );

  const weeklyActivity = [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: false },
    { day: "Thu", active: true },
    { day: "Fri", active: true },
    { day: "Sat", active: false },
    { day: "Sun", active: true },
  ];

  const practiceDone = 3;
  const practiceTotal = 10;
  const practicePercent = (practiceDone / practiceTotal) * 100;

  const weeklySolved = 12;
  const weeklyGoal = 20;
  const weeklyPercent = (weeklySolved / weeklyGoal) * 100;

  const assessments = [
    { title: "DSA Mock Test", schedule: "Tomorrow, 10:00 AM" },
    { title: "System Design Review", schedule: "Wed, 2:00 PM" },
    { title: "HR Interview Prep", schedule: "Friday, 11:00 AM" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Overall Readiness</CardTitle>
          <CardDescription>Your current placement readiness index.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center pb-8">
          <div className="relative h-56 w-56">
            <svg viewBox="0 0 220 220" className="h-full w-full">
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="14"
              />
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="hsl(245, 58%, 51%)"
                strokeWidth="14"
                strokeLinecap="round"
                transform="rotate(-90 110 110)"
                strokeDasharray={`${animateRing ? targetDashLength : 0} ${circumference}`}
                style={{ transition: "stroke-dasharray 900ms ease-in-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold text-slate-900">
                {readinessScore}
                <span className="text-lg text-slate-500">/100</span>
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">Readiness Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill Breakdown</CardTitle>
          <CardDescription>Current strengths across key preparation areas.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={skillData}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "#475569", fontSize: 12 }} />
              <Radar
                dataKey="score"
                stroke="hsl(245, 58%, 51%)"
                fill="hsl(245, 58%, 51%)"
                fillOpacity={0.24}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Continue Practice</CardTitle>
          <CardDescription>Pick up exactly where you left off.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Last topic</p>
            <p className="text-xl font-semibold text-slate-900">Dynamic Programming</p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Progress</span>
              <span>
                {practiceDone}/{practiceTotal} completed
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200">
              <div
                className="h-2.5 rounded-full bg-[hsl(245,58%,51%)] transition-all duration-500 ease-in-out"
                style={{ width: `${practicePercent}%` }}
              />
            </div>
          </div>

          <button className="rounded-lg bg-[hsl(245,58%,51%)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Continue
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Goals</CardTitle>
          <CardDescription>Stay consistent through the week.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="mb-2 text-sm text-slate-700">
              Problems Solved: {weeklySolved}/{weeklyGoal} this week
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200">
              <div
                className="h-2.5 rounded-full bg-[hsl(245,58%,51%)] transition-all duration-500 ease-in-out"
                style={{ width: `${weeklyPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {weeklyActivity.map(({ day, active }) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div
                  className={`h-8 w-8 rounded-full border ${
                    active
                      ? "border-[hsl(245,58%,51%)] bg-[hsl(245,58%,51%)]"
                      : "border-slate-300 bg-slate-100"
                  }`}
                  aria-label={`${day} activity ${active ? "done" : "not done"}`}
                />
                <span className="text-xs text-slate-500">{day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Assessments</CardTitle>
          <CardDescription>Planned sessions for the next few days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {assessments.map((assessment) => (
              <li
                key={assessment.title}
                className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 md:flex-row md:items-center"
              >
                <span className="font-medium text-slate-900">{assessment.title}</span>
                <span className="text-sm text-slate-600">{assessment.schedule}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}