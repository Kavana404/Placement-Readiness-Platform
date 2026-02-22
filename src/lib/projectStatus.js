import { getTestChecklistState, getTestChecklistSummary } from "./testChecklist";

const STEP_KEY = "prp_step_completion_v1";
const SUBMISSION_KEY = "prp_final_submission";

export const PRP_STEPS = [
  { id: "step_01", title: "Foundation + UI Shell" },
  { id: "step_02", title: "Landing + Dashboard Experience" },
  { id: "step_03", title: "Analysis Engine" },
  { id: "step_04", title: "Interactive Results" },
  { id: "step_05", title: "Company Intel + Round Mapping" },
  { id: "step_06", title: "History + Export Tools" },
  { id: "step_07", title: "Test Checklist" },
  { id: "step_08", title: "Proof + Final Submission" },
];

function normalizeStepState(raw) {
  const base = PRP_STEPS.reduce((acc, step) => {
    acc[step.id] = false;
    return acc;
  }, {});
  if (!raw || typeof raw !== "object") return base;
  PRP_STEPS.forEach((step) => {
    base[step.id] = Boolean(raw[step.id]);
  });
  return base;
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function getStepCompletionState() {
  try {
    const raw = localStorage.getItem(STEP_KEY);
    if (!raw) return normalizeStepState(null);
    return normalizeStepState(JSON.parse(raw));
  } catch {
    return normalizeStepState(null);
  }
}

export function saveStepCompletionState(nextState) {
  const normalized = normalizeStepState(nextState);
  localStorage.setItem(STEP_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("prp-state-change"));
  return normalized;
}

export function getSubmissionData() {
  try {
    const raw = localStorage.getItem(SUBMISSION_KEY);
    if (!raw) {
      return { lovableProjectLink: "", githubRepositoryLink: "", deployedUrl: "", updatedAt: "" };
    }
    const parsed = JSON.parse(raw);
    return {
      lovableProjectLink: typeof parsed.lovableProjectLink === "string" ? parsed.lovableProjectLink : "",
      githubRepositoryLink:
        typeof parsed.githubRepositoryLink === "string" ? parsed.githubRepositoryLink : "",
      deployedUrl: typeof parsed.deployedUrl === "string" ? parsed.deployedUrl : "",
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return { lovableProjectLink: "", githubRepositoryLink: "", deployedUrl: "", updatedAt: "" };
  }
}

export function saveSubmissionData(data) {
  const next = {
    lovableProjectLink: (data.lovableProjectLink || "").trim(),
    githubRepositoryLink: (data.githubRepositoryLink || "").trim(),
    deployedUrl: (data.deployedUrl || "").trim(),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(SUBMISSION_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("prp-state-change"));
  return next;
}

export function validateSubmissionLinks(data) {
  return {
    lovableProjectLink:
      !data.lovableProjectLink || !isHttpUrl(data.lovableProjectLink)
        ? "Enter a valid Lovable project URL."
        : "",
    githubRepositoryLink:
      !data.githubRepositoryLink || !isHttpUrl(data.githubRepositoryLink)
        ? "Enter a valid GitHub repository URL."
        : "",
    deployedUrl:
      !data.deployedUrl || !isHttpUrl(data.deployedUrl) ? "Enter a valid deployed app URL." : "",
  };
}

export function areSubmissionLinksValid(data) {
  const errors = validateSubmissionLinks(data);
  return !errors.lovableProjectLink && !errors.githubRepositoryLink && !errors.deployedUrl;
}

export function getProjectStatusSummary() {
  const stepState = getStepCompletionState();
  const checklistSummary = getTestChecklistSummary(getTestChecklistState());
  const submission = getSubmissionData();

  const completedSteps = Object.values(stepState).filter(Boolean).length;
  const stepsComplete = completedSteps === PRP_STEPS.length;
  const checklistComplete = checklistSummary.isComplete;
  const proofLinksComplete = areSubmissionLinksValid(submission);
  const isShipped = stepsComplete && checklistComplete && proofLinksComplete;

  return {
    completedSteps,
    totalSteps: PRP_STEPS.length,
    checklistPassed: checklistSummary.passed,
    checklistTotal: checklistSummary.total,
    stepsComplete,
    checklistComplete,
    proofLinksComplete,
    isShipped,
  };
}
