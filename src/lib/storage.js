const HISTORY_KEY = "prp_analysis_history_v1";
const CORRUPTED_WARNING = "One saved entry couldn't be loaded. Create a new analysis.";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeExtractedSkills(raw) {
  const source = raw || {};
  const next = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [],
  };

  next.coreCS = asArray(source.coreCS || source["Core CS"]);
  next.languages = asArray(source.languages || source.Languages);
  next.web = asArray(source.web || source.Web);
  next.data = asArray(source.data || source.Data);
  next.cloud = asArray(source.cloud || source["Cloud/DevOps"]);
  next.testing = asArray(source.testing || source.Testing);
  next.other = asArray(source.other || source.General);

  return next;
}

function normalizeRoundMapping(raw) {
  return asArray(raw).map((item) => ({
    roundTitle: item.roundTitle || item.title || "",
    focusAreas: asArray(item.focusAreas),
    whyItMatters: item.whyItMatters || item.why || "",
  }));
}

function normalizeChecklist(raw) {
  return asArray(raw).map((item) => ({
    roundTitle: item.roundTitle || item.round || "",
    items: asArray(item.items),
  }));
}

function normalizePlan(raw) {
  return asArray(raw).map((item) => ({
    day: item.day || "",
    focus: item.focus || item.title || "",
    tasks: asArray(item.tasks).length > 0 ? asArray(item.tasks) : asArray(item.focus ? [item.focus] : []),
  }));
}

function normalizeSkillConfidenceMap(raw) {
  const map = raw || {};
  const normalized = {};
  Object.entries(map).forEach(([key, value]) => {
    normalized[key] = value === "know" ? "know" : "practice";
  });
  return normalized;
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const id = typeof entry.id === "string" && entry.id ? entry.id : null;
  const createdAt = typeof entry.createdAt === "string" && entry.createdAt ? entry.createdAt : null;
  const jdText = typeof entry.jdText === "string" ? entry.jdText : "";
  if (!id || !createdAt || !jdText) return null;

  const extractedSkills = normalizeExtractedSkills(entry.extractedSkills);
  const baseScore = Number.isFinite(entry.baseScore)
    ? entry.baseScore
    : Number.isFinite(entry.baseReadinessScore)
      ? entry.baseReadinessScore
      : Number.isFinite(entry.readinessScore)
        ? entry.readinessScore
        : 0;
  const finalScore = Number.isFinite(entry.finalScore)
    ? entry.finalScore
    : Number.isFinite(entry.readinessScore)
      ? entry.readinessScore
      : baseScore;

  return {
    id,
    createdAt,
    company: typeof entry.company === "string" ? entry.company : "",
    role: typeof entry.role === "string" ? entry.role : "",
    jdText,
    extractedSkills,
    roundMapping: normalizeRoundMapping(entry.roundMapping),
    checklist: normalizeChecklist(entry.checklist),
    plan7Days: normalizePlan(entry.plan7Days || entry.plan),
    questions: asArray(entry.questions).map((q) => String(q)),
    baseScore,
    skillConfidenceMap: normalizeSkillConfidenceMap(entry.skillConfidenceMap),
    finalScore,
    updatedAt: typeof entry.updatedAt === "string" && entry.updatedAt ? entry.updatedAt : createdAt,
    companyIntel: entry.companyIntel || null,
  };
}

function getHistoryState() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return { entries: [], warning: "" };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { entries: [], warning: CORRUPTED_WARNING };
    }
    let skipped = 0;
    const entries = parsed
      .map((item) => {
        const normalized = normalizeEntry(item);
        if (!normalized) skipped += 1;
        return normalized;
      })
      .filter(Boolean);
    return { entries, warning: skipped > 0 ? CORRUPTED_WARNING : "" };
  } catch {
    return { entries: [], warning: CORRUPTED_WARNING };
  }
}

export function getHistoryEntries() {
  return getHistoryState().entries;
}

export function getHistoryWarning() {
  return getHistoryState().warning;
}

export function saveHistoryEntry(entry) {
  const normalizedEntry = normalizeEntry(entry);
  if (!normalizedEntry) return getHistoryEntries();
  const history = getHistoryEntries().filter((item) => item.id !== normalizedEntry.id);
  const updated = [normalizedEntry, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function updateHistoryEntryById(id, patch) {
  const history = getHistoryEntries();
  const updated = history.map((entry) =>
    entry.id === id ? normalizeEntry({ ...entry, ...patch, updatedAt: new Date().toISOString() }) : entry
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated.find((entry) => entry.id === id) || null;
}

export function getHistoryEntryById(id) {
  return getHistoryEntries().find((entry) => entry.id === id) || null;
}

export function getLatestEntry() {
  return getHistoryEntries()[0] || null;
}
