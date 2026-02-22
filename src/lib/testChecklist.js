const TEST_CHECKLIST_KEY = "prp_test_checklist_v1";

export const TEST_ITEMS = [
  {
    id: "jd_required",
    label: "JD required validation works",
    hint: "Try submitting Home Quick JD form with empty textarea.",
  },
  {
    id: "short_jd_warning",
    label: "Short JD warning shows for <200 chars",
    hint: "Paste a short JD and verify calm warning appears.",
  },
  {
    id: "skills_grouping",
    label: "Skills extraction groups correctly",
    hint: "Check grouped tags in Results under all categories.",
  },
  {
    id: "round_mapping_dynamic",
    label: "Round mapping changes based on company + skills",
    hint: "Compare Amazon + DSA vs unknown startup + React/Node.",
  },
  {
    id: "score_deterministic",
    label: "Score calculation is deterministic",
    hint: "Run same analysis twice and compare base score.",
  },
  {
    id: "toggle_live_score",
    label: "Skill toggles update score live",
    hint: "Toggle a skill and observe score change instantly.",
  },
  {
    id: "persist_after_refresh",
    label: "Changes persist after refresh",
    hint: "Refresh Results and confirm toggles and score stay.",
  },
  {
    id: "history_save_load",
    label: "History saves and loads correctly",
    hint: "Open History and load a saved entry into Results.",
  },
  {
    id: "export_content",
    label: "Export buttons copy the correct content",
    hint: "Use copy buttons and verify text sections in clipboard.",
  },
  {
    id: "no_console_errors",
    label: "No console errors on core pages",
    hint: "Visit Home, Practice, Results, History and inspect console.",
  },
];

function getDefaultState() {
  return TEST_ITEMS.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});
}

function normalizeState(raw) {
  const base = getDefaultState();
  if (!raw || typeof raw !== "object") return base;
  TEST_ITEMS.forEach((item) => {
    base[item.id] = Boolean(raw[item.id]);
  });
  return base;
}

export function getTestChecklistState() {
  try {
    const raw = localStorage.getItem(TEST_CHECKLIST_KEY);
    if (!raw) return getDefaultState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return getDefaultState();
  }
}

export function saveTestChecklistState(nextState) {
  const normalized = normalizeState(nextState);
  localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("prp-state-change"));
  return normalized;
}

export function resetTestChecklistState() {
  const base = getDefaultState();
  localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(base));
  window.dispatchEvent(new Event("prp-state-change"));
  return base;
}

export function getTestChecklistSummary(state) {
  const passed = Object.values(state).filter(Boolean).length;
  return { passed, total: TEST_ITEMS.length, isComplete: passed === TEST_ITEMS.length };
}
