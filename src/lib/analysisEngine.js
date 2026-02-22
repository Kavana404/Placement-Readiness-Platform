const SKILL_CATALOG = {
  coreCS: [
    { name: "DSA", pattern: /\bdsa\b/i },
    { name: "OOP", pattern: /\boop\b|object[\s-]?oriented/i },
    { name: "DBMS", pattern: /\bdbms\b/i },
    { name: "OS", pattern: /\bos\b|operating system/i },
    { name: "Networks", pattern: /\bnetworks?\b|computer networks?/i },
  ],
  languages: [
    { name: "Java", pattern: /\bjava\b/i },
    { name: "Python", pattern: /\bpython\b/i },
    { name: "JavaScript", pattern: /\bjavascript\b/i },
    { name: "TypeScript", pattern: /\btypescript\b/i },
    { name: "C", pattern: /(^|[^a-z0-9])c([^a-z0-9]|$)/i },
    { name: "C++", pattern: /(^|[^a-z0-9])c\+\+([^a-z0-9]|$)/i },
    { name: "C#", pattern: /(^|[^a-z0-9])c#([^a-z0-9]|$)/i },
    { name: "Go", pattern: /\bgo(lang)?\b/i },
  ],
  web: [
    { name: "React", pattern: /\breact\b/i },
    { name: "Next.js", pattern: /\bnext\.?js\b/i },
    { name: "Node.js", pattern: /\bnode\.?js\b/i },
    { name: "Express", pattern: /\bexpress\b/i },
    { name: "REST", pattern: /\brest\b|restful/i },
    { name: "GraphQL", pattern: /\bgraphql\b/i },
  ],
  data: [
    { name: "SQL", pattern: /\bsql\b/i },
    { name: "MongoDB", pattern: /\bmongodb\b/i },
    { name: "PostgreSQL", pattern: /\bpostgres(ql)?\b/i },
    { name: "MySQL", pattern: /\bmysql\b/i },
    { name: "Redis", pattern: /\bredis\b/i },
  ],
  cloud: [
    { name: "AWS", pattern: /\baws\b|amazon web services/i },
    { name: "Azure", pattern: /\bazure\b/i },
    { name: "GCP", pattern: /\bgcp\b|google cloud/i },
    { name: "Docker", pattern: /\bdocker\b/i },
    { name: "Kubernetes", pattern: /\bkubernetes\b|\bk8s\b/i },
    { name: "CI/CD", pattern: /\bci\/cd\b|continuous integration|continuous delivery/i },
    { name: "Linux", pattern: /\blinux\b/i },
  ],
  testing: [
    { name: "Selenium", pattern: /\bselenium\b/i },
    { name: "Cypress", pattern: /\bcypress\b/i },
    { name: "Playwright", pattern: /\bplaywright\b/i },
    { name: "JUnit", pattern: /\bjunit\b/i },
    { name: "PyTest", pattern: /\bpytest\b/i },
  ],
};

const DEFAULT_OTHER_SKILLS = ["Communication", "Problem solving", "Basic coding", "Projects"];

const QUESTION_BANK = {
  DSA: "How would you optimize search in sorted data, and when is binary search not enough?",
  OOP: "How do abstraction and polymorphism improve maintainability in a production codebase?",
  DBMS: "What trade-offs do you consider when choosing normalization vs denormalization?",
  OS: "What happens during a context switch and why can it become a bottleneck?",
  Networks: "How do DNS lookup, TLS handshake, and HTTP request flow together end-to-end?",
  Java: "How does the JVM memory model affect garbage collection tuning for backend services?",
  Python: "When would you prefer list comprehension over generator expressions in performance-sensitive code?",
  JavaScript:
    "How do closures and the event loop interact in asynchronous JavaScript execution?",
  TypeScript:
    "How do union types and type guards help prevent runtime bugs in large frontend apps?",
  C: "How do pointers and manual memory management impact reliability in systems programming?",
  "C++": "When would you use move semantics to reduce overhead in a C++ service?",
  "C#": "How do async/await patterns in C# affect thread utilization in web APIs?",
  Go: "Why are goroutines lightweight, and how do channels help avoid shared-state bugs?",
  React: "Explain state management options in React and how you choose between them.",
  "Next.js":
    "How do SSR, SSG, and client rendering differ in Next.js for performance and SEO?",
  "Node.js":
    "How does Node.js handle high concurrency with a single-threaded event loop?",
  Express: "How would you structure Express middleware for validation, auth, and error handling?",
  REST: "What makes a REST API predictable and easy for clients to integrate?",
  GraphQL:
    "How do you prevent over-fetching and resolver-level performance issues in GraphQL APIs?",
  SQL: "Explain indexing and when it helps.",
  MongoDB: "How do you model relationships in MongoDB without creating expensive queries?",
  PostgreSQL:
    "What PostgreSQL features would you use for transactional integrity and query performance?",
  MySQL: "How do query plans help diagnose slow MySQL endpoints?",
  Redis: "When would you use Redis as a cache vs as a primary data structure store?",
  AWS: "Which AWS services would you pick for a scalable app backend and why?",
  Azure: "How would you design deployment and monitoring workflow on Azure?",
  GCP: "How do you choose between managed GCP services and self-managed infrastructure?",
  Docker: "How do multi-stage Docker builds reduce image size and improve security?",
  Kubernetes: "How do readiness and liveness probes prevent production downtime?",
  "CI/CD": "What checks should be mandatory in CI/CD before deployment to production?",
  Linux: "Which Linux commands and diagnostics do you use first when a service is degraded?",
  Selenium: "When is Selenium still preferred over modern browser automation frameworks?",
  Cypress: "How do you make Cypress tests stable in a flaky UI environment?",
  Playwright: "How do Playwright fixtures improve test isolation and speed?",
  JUnit: "How do you structure JUnit tests to balance speed, coverage, and readability?",
  PyTest: "How do pytest fixtures help manage integration test setup cleanly?",
};

const ENTERPRISE_COMPANIES = [
  "amazon",
  "infosys",
  "tcs",
  "wipro",
  "accenture",
  "cognizant",
  "microsoft",
  "google",
  "meta",
  "ibm",
  "oracle",
];

function inferIndustry({ company, jdText }) {
  const text = `${company || ""} ${jdText || ""}`.toLowerCase();
  if (/\bfintech\b|bank|insurance|payments|nbfc/.test(text)) return "Financial Services";
  if (/\be-?commerce\b|retail|marketplace/.test(text)) return "E-commerce";
  if (/\bhealth\b|healthcare|medtech|hospital/.test(text)) return "Healthcare Technology";
  if (/\bedtech\b|education|learning/.test(text)) return "EdTech";
  if (/\bsaas\b|software|platform|cloud/.test(text)) return "Software / SaaS";
  return "Technology Services";
}

function inferSizeCategory(company) {
  const normalized = (company || "").trim().toLowerCase();
  if (!normalized) return "Startup (<200)";
  return ENTERPRISE_COMPANIES.some((name) => normalized.includes(name))
    ? "Enterprise (2000+)"
    : "Startup (<200)";
}

export function generateCompanyIntel({ company, jdText }) {
  const sizeCategory = inferSizeCategory(company);
  const typicalHiringFocus =
    sizeCategory === "Enterprise (2000+)"
      ? "Structured DSA screening with strong focus on core CS fundamentals and consistency under timed rounds."
      : "Practical problem solving with strong stack depth, product thinking, and implementation ownership.";

  return {
    companyName: company || "Not provided",
    industry: inferIndustry({ company, jdText }),
    sizeCategory,
    typicalHiringFocus,
    note: "Demo Mode: Company intel generated heuristically.",
  };
}

export function generateRoundMapping({ extractedSkills, companyIntel }) {
  const hasDSA = (extractedSkills.coreCS || []).includes("DSA");
  const hasWebStack =
    (extractedSkills.web || []).includes("React") || (extractedSkills.web || []).includes("Node.js");
  const isEnterprise = companyIntel?.sizeCategory === "Enterprise (2000+)";

  if (isEnterprise && hasDSA) {
    return [
      {
        roundTitle: "Round 1: Online Test (DSA + Aptitude)",
        focusAreas: ["DSA", "Aptitude"],
        whyItMatters:
          "Enterprise pipelines prioritize high-volume objective filtering for speed and consistency.",
      },
      {
        roundTitle: "Round 2: Technical (DSA + Core CS)",
        focusAreas: ["DSA", "Core CS"],
        whyItMatters:
          "Interviewers validate depth in data structures, algorithms, and computer science fundamentals.",
      },
      {
        roundTitle: "Round 3: Tech + Projects",
        focusAreas: ["Projects", "Stack depth"],
        whyItMatters:
          "Project discussions reveal practical ownership, debugging style, and design decisions.",
      },
      {
        roundTitle: "Round 4: HR",
        focusAreas: ["Communication", "Role fit"],
        whyItMatters:
          "Final fit checks ensure role alignment, communication clarity, and long-term intent.",
      },
    ];
  }

  if (!isEnterprise && hasWebStack) {
    return [
      {
        roundTitle: "Round 1: Practical Coding",
        focusAreas: ["Practical coding", "Stack depth"],
        whyItMatters:
          "Startups emphasize execution speed and code quality on real feature-like tasks.",
      },
      {
        roundTitle: "Round 2: System Discussion",
        focusAreas: ["Architecture", "Trade-offs"],
        whyItMatters:
          "Teams evaluate architecture judgment, trade-offs, and scalability awareness.",
      },
      {
        roundTitle: "Round 3: Culture Fit",
        focusAreas: ["Ownership", "Communication"],
        whyItMatters: "Small teams prioritize ownership mindset, communication, and adaptability.",
      },
    ];
  }

  return [
    {
      roundTitle: "Round 1: Screening + Basics",
      focusAreas: ["Aptitude", "Communication"],
      whyItMatters: "The first round filters for baseline aptitude and communication readiness.",
    },
    {
      roundTitle: "Round 2: Technical Evaluation",
      focusAreas: ["Technical depth", "Problem solving"],
      whyItMatters: "Core technical ability and problem-solving depth are validated here.",
    },
    {
      roundTitle: "Round 3: Project Deep Dive",
      focusAreas: ["Projects", "Execution"],
      whyItMatters: "Interviewers test practical delivery quality through your previous work.",
    },
    {
      roundTitle: "Round 4: Managerial / HR",
      focusAreas: ["Role fit", "Decision confidence"],
      whyItMatters: "Final conversation checks fit, expectations, and decision confidence.",
    },
  ];
}

function defaultChecklist(skillsByCategory) {
  const hasDSA = skillsByCategory.coreCS?.includes("DSA");
  const hasWeb = (skillsByCategory.web || []).length > 0;
  const hasData = (skillsByCategory.data || []).length > 0;
  const hasCloud = (skillsByCategory.cloud || []).length > 0;
  const hasTesting = (skillsByCategory.testing || []).length > 0;
  const hasOnlyFallback = Object.values(skillsByCategory).every((arr) => arr.length === 0) || (skillsByCategory.other || []).length > 0;
  const langs = skillsByCategory.languages || [];

  return [
    {
      roundTitle: "Round 1: Aptitude / Basics",
      items: [
        "Revise quantitative aptitude fundamentals and timed practice sets.",
        "Prepare concise introductions for academics, projects, and goals.",
        `Review ${langs[0] || "programming language"} syntax, control flow, and standard library basics.`,
        "Practice 20-minute problem solving under strict time limits.",
        "Build a one-page quick notes sheet for formulas and CS basics.",
      ],
    },
    {
      roundTitle: "Round 2: DSA + Core CS",
      items: [
        hasDSA
          ? "Solve arrays, strings, and binary search patterns with complexity analysis."
          : "Practice beginner-to-intermediate DSA patterns with clean dry-run explanations.",
        "Revise OOP, DBMS, OS, and Networks interview fundamentals.",
        hasData
          ? "Practice SQL joins, indexing, and query optimization drills."
          : "Prepare core DBMS concepts including normalization and transactions.",
        "Write edge-case focused solutions and explain trade-offs aloud.",
        hasOnlyFallback
          ? "Practice clear problem-solving communication for open-ended coding tasks."
          : "Practice whiteboard-style walkthroughs for one medium coding problem daily.",
      ],
    },
    {
      roundTitle: "Round 3: Tech interview (projects + stack)",
      items: [
        "Prepare one flagship project story: architecture, decisions, trade-offs, impact.",
        hasWeb
          ? "Map project modules to React/Node API flow and explain state + data contracts."
          : "Explain end-to-end project request flow and module boundaries.",
        hasCloud
          ? "Explain deployment strategy, observability, and rollback plan."
          : "Define deployment basics, logs, and error triage approach.",
        hasTesting
          ? "Show testing pyramid coverage with framework-specific examples."
          : "Prepare unit + integration testing examples from your project.",
        "Create a backlog of 10 technical follow-up questions and answers.",
      ],
    },
    {
      roundTitle: "Round 4: Managerial / HR",
      items: [
        "Prepare STAR-format stories for ownership, conflict resolution, and setbacks.",
        "Align your role motivation with company domain and growth trajectory.",
        "Prepare salary, relocation, and notice-period responses with clarity.",
        "Draft 5 thoughtful questions for interviewer about team and roadmap.",
        "Practice calm and concise responses for strengths, weaknesses, and goals.",
      ],
    },
  ];
}

function buildPlan(skillsByCategory) {
  const plan7Days = [
    {
      day: "Day 1",
      focus: "Basics + Core CS",
      tasks: ["Revise OOP, DBMS, OS, and Networks with short concept notes."],
    },
    {
      day: "Day 2",
      focus: "Basics + Core CS",
      tasks: ["Continue core CS revision and solve aptitude drills under time limits."],
    },
    {
      day: "Day 3",
      focus: "DSA + Coding Practice",
      tasks: ["Solve array/string/hashmap questions and explain time-space complexity."],
    },
    {
      day: "Day 4",
      focus: "DSA + Coding Practice",
      tasks: ["Practice recursion, trees, and sorting/searching patterns."],
    },
    {
      day: "Day 5",
      focus: "Project + Resume Alignment",
      tasks: ["Align resume bullets with measurable impact and project depth."],
    },
    {
      day: "Day 6",
      focus: "Mock Interview Questions",
      tasks: ["Run one technical mock and one HR mock with feedback notes."],
    },
    {
      day: "Day 7",
      focus: "Revision + Weak Areas",
      tasks: ["Revise weak topics and rehearse concise interview answers."],
    },
  ];

  if ((skillsByCategory.web || []).includes("React")) {
    plan7Days[4].tasks.push("Add frontend revision on React rendering, hooks, and state flow.");
  }
  if ((skillsByCategory.web || []).includes("Next.js")) {
    plan7Days[4].tasks.push("Include SSR/SSG revision for Next.js architecture discussions.");
  }
  if ((skillsByCategory.data || []).includes("SQL")) {
    plan7Days[3].tasks.push("Add SQL query practice with joins and indexing scenarios.");
  }
  if ((skillsByCategory.cloud || []).length > 0) {
    plan7Days[5].tasks.push("Include one deployment troubleshooting simulation.");
  }
  if ((skillsByCategory.other || []).length > 0) {
    plan7Days[0].tasks.push("Review communication, projects, and problem-solving fundamentals.");
    plan7Days[6].tasks.push("Prioritize confidence-building revision for interview basics.");
  }
  return plan7Days;
}

function buildQuestions(skillsByCategory) {
  const detectedSkills = Object.values(skillsByCategory).flat();
  const questions = [];
  const seen = new Set();

  detectedSkills.forEach((skill) => {
    if (questions.length < 10 && QUESTION_BANK[skill] && !seen.has(skill)) {
      questions.push(QUESTION_BANK[skill]);
      seen.add(skill);
    }
  });

  const fallbackQuestions = [
    QUESTION_BANK.DSA,
    QUESTION_BANK.OOP,
    QUESTION_BANK.DBMS,
    QUESTION_BANK.React,
    QUESTION_BANK.SQL,
    QUESTION_BANK["Node.js"],
    QUESTION_BANK["CI/CD"],
    "How do you prioritize bugs when multiple production issues occur at the same time?",
    "Describe a project failure and what exact change you made after that experience.",
    "How would you onboard quickly into an unfamiliar codebase in your first two weeks?",
  ];

  fallbackQuestions.forEach((question) => {
    if (questions.length < 10 && !questions.includes(question)) {
      questions.push(question);
    }
  });

  return questions.slice(0, 10);
}

export function extractSkillsFromJD(jdText) {
  const content = jdText || "";
  const result = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [],
  };

  Object.entries(SKILL_CATALOG).forEach(([category, skills]) => {
    const matched = skills.filter((skill) => skill.pattern.test(content)).map((skill) => skill.name);
    result[category] = matched;
  });

  const hasDetected = ["coreCS", "languages", "web", "data", "cloud", "testing"].some(
    (key) => result[key].length > 0
  );
  if (!hasDetected) {
    result.other = [...DEFAULT_OTHER_SKILLS];
  }
  return result;
}

export function computeReadinessScore({ company, role, jdText, extractedSkills }) {
  let score = 35;
  const categoryCount = Math.min(6, ["coreCS", "languages", "web", "data", "cloud", "testing"].filter(
    (key) => (extractedSkills[key] || []).length > 0
  ).length);
  score += categoryCount * 5;
  if ((company || "").trim()) score += 10;
  if ((role || "").trim()) score += 10;
  if ((jdText || "").length > 800) score += 10;
  return Math.min(100, score);
}

export function runAnalysis({ company, role, jdText }) {
  const extractedSkills = extractSkillsFromJD(jdText);
  const companyIntel = generateCompanyIntel({ company, jdText });
  const roundMapping = generateRoundMapping({ extractedSkills, companyIntel });
  const checklist = defaultChecklist(extractedSkills);
  const plan7Days = buildPlan(extractedSkills);
  const questions = buildQuestions(extractedSkills);
  const baseScore = computeReadinessScore({
    company,
    role,
    jdText,
    extractedSkills,
  });

  return {
    company: company || "",
    role: role || "",
    jdText: jdText || "",
    extractedSkills,
    companyIntel,
    roundMapping,
    plan7Days,
    checklist,
    questions,
    baseScore,
    finalScore: baseScore,
  };
}
