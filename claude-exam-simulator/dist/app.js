const QUESTIONS = window.QUESTION_BANK || [];
const PRACTICE_SETS = window.PRACTICE_SETS || [];
const BONUS1_KEY = "BADBCCBDCBCBBBABADBDCAADBBDDADCDCDDCCADDDADDBBCBDCCAAADCDCDDBADDDDDBBD";
const BONUS2_KEY = [
  "C","C","A","B","B","B","B","B","B","B",
  "B","A","A","B","B","B","B","B","B","B",
  "B","C","B","B","B","A","B","B","A","B",
  "B","B","B","B","B","B","B","B","B","B",
  "B","B","A","B","B","B","A","A","B","B",
  "B","A","B","B","B","A","A","A","B","B",
  "C","C","C","C","C","B","A","D","A","D"
].join("");
const BONUS1_SET = PRACTICE_SETS.find((set) => set.id === "bonus-1");
if (BONUS1_SET?.questions.length === BONUS1_KEY.length) {
  BONUS1_SET.questions.forEach((question, index) => {
    question.correct = [BONUS1_KEY.charCodeAt(index) - 65];
    question.verificationStatus = "udemy-key-verified";
    question.rationale = "Answer verified against the completed Udemy practice result. Focus on the exact decision boundary, not on the option that merely sounds broadly helpful.";
  });
}
const BONUS2_SET = PRACTICE_SETS.find((set) => set.id === "bonus-2");
if (BONUS2_SET?.questions.length === BONUS2_KEY.length) {
  const legacyNotes = {
    9: "This item uses imprecise hook wording. B is the intended choice because a PostToolUse check is the only option that creates a systematic feedback signal after execution.",
    15: "This course item reflects older Claude Code terminology. B is the intended course answer; in current Claude Code, protect sensitive paths with permission deny rules and sandboxing.",
    34: "This course item uses the legacy HTTP+SSE transport name. B is the intended choice; current MCP documentation uses stdio and Streamable HTTP, with SSE retained only for legacy compatibility.",
    41: "B is the closest intended answer: -p runs Claude Code non-interactively and prints the result. Project context comes from the working directory and loaded instructions, not from -p itself.",
    55: "This item is outdated. Current Structured Outputs support JSON Schema string format: date, so a schema constraint is preferable to a PostToolUse regex repair.",
    68: "This item predates the Client SDK Tool Runner. Current Client SDKs can automate the tool loop; the Agent SDK remains distinct because it provides the Claude Code runtime and built-in tools such as Read and Bash.",
    70: "This item mixes Claude Code and Agent SDK semantics. In the Agent SDK, explicitly naming a configured AgentDefinition guarantees invocation. In interactive Claude Code, an @-mention guarantees the selected subagent, while natural-language naming only influences delegation."
  };
  BONUS2_SET.questions.forEach((question, index) => {
    question.correct = [BONUS2_KEY.charCodeAt(index) - 65];
    question.verificationStatus = "coach-reviewed-key";
    question.rationale = legacyNotes[question.sourceNumber] || "Answer checked against current Claude, Claude Code, and MCP behavior and the intended exam decision boundary. Prefer the option that directly satisfies the stated constraint.";
  });
}

const repairQuestion = (id, domain, weakness, stem, options, correct, topic, rationale) => ({
  id: `today-repair-${id}`,
  sourceNumber: id,
  sourceSet: "today-repair",
  source: "Personalized repair drill from Bonus Set 2 feedback",
  verificationStatus: "current-docs-verified",
  domain,
  weakness,
  selectionMode: "single",
  stem,
  options,
  correct: [correct],
  topic,
  rationale
});

const TODAY_REPAIR_QUESTIONS = [
  repairQuestion("context-clear", "Claude Code Configuration & Workflows", "today-context",
    "You finished one task and want a completely empty conversation context for a different task, while keeping all code changes already written to disk. Which Claude Code command fits?",
    ["/compact", "/clear", "/rewind", "Restart the terminal"], 1,
    "Clear versus compact",
    "/clear starts a new conversation with empty context. It does not undo files already changed on disk. Use it between tasks or when the current context is polluted."),
  repairQuestion("context-compact", "Claude Code Configuration & Workflows", "today-context",
    "You are still working on the same refactor, but the conversation is long. You need to free context while retaining a summary of goals, decisions, modified files, and tests. What should you use?",
    ["/clear", "/compact focus on goals, modified files, decisions, and tests", "/exit", "/permissions"], 1,
    "Clear versus compact",
    "/compact summarizes the current conversation so the same task can continue. Optional instructions tell Claude which state must survive the summary."),

  repairQuestion("coverage-window", "Prompt Engineering & Structured Output", "today-coverage",
    "A legal-discovery system must find clauses that may cross page boundaries in very long documents. Which preprocessing strategy best protects recall?",
    ["Send each entire document in one request", "Split documents into overlapping chunks and search every chunk", "Ask the model to pay extra attention to middle pages", "Use Message Batches without changing document size"], 1,
    "Coverage before throughput",
    "Overlapping windows preserve evidence near chunk boundaries. Message Batches changes throughput and price, not what fits in one request or whether boundaries lose evidence."),
  repairQuestion("coverage-strata", "Prompt Engineering & Structured Output", "today-coverage",
    "One document type is 70% of volume and four types are 7.5% each. What sampling design best detects regressions in every type?",
    ["Sample only in proportion to volume", "Set a minimum sample size per type, then allocate the remaining sample by volume or risk", "Exclude the high-volume type", "Sample only low-confidence outputs"], 1,
    "Stratified quality sampling",
    "Pure proportional sampling can leave low-volume strata with too few examples. A per-stratum floor preserves detection power while the remainder can follow volume or risk."),

  repairQuestion("output-date", "Prompt Engineering & Structured Output", "today-output",
    "With Claude Structured Outputs, which schema fragment most directly constrains a field to an ISO calendar date such as 2026-09-13?",
    ['{ "type": "string", "format": "date" }', '{ "type": "string", "description": "Please use ISO dates" }', '{ "type": "string" } plus temperature 0', "A PostToolUse hook that rewrites every date"], 0,
    "Put deterministic constraints in the schema",
    "Current Structured Outputs support the JSON Schema string format date. Use the contract first; validate again in application code when the downstream risk warrants defense in depth."),
  repairQuestion("output-truncation", "Tool Design & MCP Integration", "today-output",
    "An extraction response ends with stop_reason max_tokens and its JSON is cut off. What is the best immediate response?",
    ["Enable extended thinking", "Increase max_tokens enough for the expected output, or reduce/chunk the requested output", "Set tool_choice to any", "Add examples of smaller documents"], 1,
    "Diagnose stop_reason literally",
    "max_tokens means generation hit the output ceiling. Raise the ceiling when the expected result should fit; otherwise reduce or chunk the output."),
  repairQuestion("output-retry", "Prompt Engineering & Structured Output", "today-output",
    "Which extraction failure is most suitable for an error-feedback retry?",
    ["A phone number is absent from the source", "A required annual letter was never provided", "A correct meter value was placed in the wrong JSON object", "The only printed address is ambiguous and legally important"], 2,
    "Retry only when the evidence exists",
    "A retry can repair a transformation or placement mistake because the evidence already exists. It cannot recover facts absent from the supplied source and should not guess through high-impact ambiguity."),

  repairQuestion("product-permissions", "Claude Code Configuration & Workflows", "today-product",
    "A repository must keep Claude Code's built-in file tools from reading .env.production. Which project configuration is current?",
    ["Add the path to .gitignore", "Add the path to .claudeignore", "Add Read(./.env.production) under permissions.deny in .claude/settings.json", "Write a warning in CLAUDE.md"], 2,
    "Guidance is not access control",
    "Current Claude Code uses permissions.deny rules in settings.json. For Bash subprocesses, pair permissions with sandbox filesystem restrictions when OS-level protection is required."),
  repairQuestion("product-sdk", "Agentic Architecture & Orchestration", "today-product",
    "Which current distinction between the Anthropic Client SDK Tool Runner and the Claude Agent SDK is accurate?",
    ["The Client SDK can never automate a tool loop", "The Tool Runner automates custom client-tool calls, while the Agent SDK also supplies the Claude Code runtime and built-in tools such as Read and Bash", "Only the Agent SDK exposes stop_reason", "They are identical products with different names"], 1,
    "Choose an SDK by runtime needs",
    "The Client SDK Tool Runner now manages the tool lifecycle automatically. Choose the Agent SDK when you need Claude Code's agent runtime, built-in tools, sessions, hooks, permissions, or subagents."),
  repairQuestion("product-subagent", "Claude Code Configuration & Workflows", "today-product",
    "Which statement correctly distinguishes guaranteed subagent invocation today?",
    ["Natural-language naming is never supported", "In the Agent SDK, explicitly naming a configured subagent guarantees it; in interactive Claude Code, an @-mention guarantees the selected subagent", "Only built-in agents can be invoked explicitly", "Removing the description field guarantees invocation"], 1,
    "Do not mix SDK and CLI invocation rules",
    "Agent SDK documentation treats an explicit configured-agent name as direct invocation. Claude Code documents natural-language naming as a suggestion and @-mention as the one-task guarantee."),

  repairQuestion("cache-economics", "Prompt Engineering & Structured Output", "today-cache",
    "A long stable prompt prefix will be reused many times. What is the correct economic model for prompt caching?",
    ["The cache write costs more than ordinary input, but repeated cache reads are much cheaper; output token pricing is unchanged", "Both input and output are automatically discounted by 50%", "Caching is free and automatic", "Caching only helps prompts under 5,000 tokens"], 0,
    "Cache stable prefixes, not changing documents",
    "Caching pays an upfront write premium for a reusable prefix and discounts later reads. It does not discount generated output tokens, and changing the prefix causes a miss."),

  repairQuestion("carry-projection", "Tool Design & MCP Integration", "today-carryover",
    "A tool returns 40 fields but the model needs only five. What should happen before the result enters model context?",
    ["Ask the model to summarize all 40 fields", "Deterministically project the payload to the five required fields", "Increase the context window", "Cache the full payload"], 1,
    "Reduce context at the boundary",
    "Project or normalize tool output before it consumes model context. Model summarization spends tokens on the data you already know you do not need."),
  repairQuestion("carry-normalize", "Tool Design & MCP Integration", "today-carryover",
    "Two tools return Unix timestamps and ISO strings for the same concept. Where should you make their contract consistent?",
    ["In few-shot examples", "In the tool-server or adapter layer before results reach the model", "By raising temperature", "In the final user-facing response only"], 1,
    "Normalize deterministic formats outside the model",
    "Adapters should normalize equivalent backend formats into one stable tool contract. This removes needless reasoning and reduces downstream errors."),
  repairQuestion("carry-review", "Agentic Architecture & Orchestration", "today-carryover",
    "You need an unbiased review of an agent's research. What context should the reviewer receive?",
    ["The original task and rubric plus the final artifact and necessary evidence, in a fresh reviewer context", "The researcher's full reasoning trace and confidence", "Only the researcher's system prompt", "The same conversation immediately after generation"], 0,
    "Separate evidence from anchoring",
    "A fresh reviewer needs the evaluation target and criteria, not the generator's persuasion, confidence, or retained assumptions."),
  repairQuestion("carry-plan", "Claude Code Configuration & Workflows", "today-carryover",
    "For a 60-file logging migration with uncertain dependencies, which workflow is best?",
    ["Stay in plan mode for the entire task", "Audit and design in plan mode, then switch to execution for edits and tests", "Edit immediately without inspection", "Load every file into one prompt"], 1,
    "Planning is a phase, not the finish line",
    "Use plan mode to understand scope and dependencies. Once the approach is approved, execution mode performs the changes and verifies them."),
];

const IMPORTED_QUESTIONS = PRACTICE_SETS.flatMap((set) => set.questions || []);
const ALL_QUESTIONS = [...QUESTIONS, ...IMPORTED_QUESTIONS, ...TODAY_REPAIR_QUESTIONS];
const QUESTION_BY_ID = new Map(ALL_QUESTIONS.map((question) => [question.id, question]));
const STORAGE_KEY = "cca-architect-practice-v2";
const STATE_VERSION = 3;
const FULL_SECONDS = 120 * 60;
const DRILL_SECONDS = 25 * 60;

const DOMAIN_WHY = {
  "Agentic Architecture & Orchestration": "Production agents need explicit coordination, dependency, safety, and terminal-state logic rather than hopeful model behavior.",
  "Claude Code Configuration & Workflows": "Correct placement determines whether guidance is reusable, scoped correctly, or programmatically enforced.",
  "Prompt Engineering & Structured Output": "Downstream systems need outputs that are both structurally valid and honest about missing or ambiguous information.",
  "Tool Design & MCP Integration": "Clean, distinctive tool contracts reduce routing mistakes, context waste, and leaked backend complexity.",
  "Context Management & Reliability": "Long-running systems stay coherent only when they preserve high-signal state and escalate uncertainty deliberately."
};

const WEAKNESSES = [
  { id:"controls", title:"Hooks & enforced controls", score:0, detail:"PreToolUse · PostToolUse · permissions", priority:"Priority A", ring:"#ff778f", topic:"Choose guidance or an enforced boundary.", why:"Your report has several 0% objectives tied to rules that cannot depend on model discretion.", reason:"CLAUDE.md guides behavior; permissions and PreToolUse block unsafe actions; PostToolUse verifies or repairs completed actions.", example:"CLAUDE.md  → preferred behavior\nPreToolUse → validate / block\nTool runs  → operation\nPostToolUse→ format / lint / test" },
  { id:"handoff", title:"Terminal states & handoffs", score:0, detail:"Resolution · escalation · preserved state", priority:"Priority A", ring:"#ff778f", topic:"Every loop needs a valid terminal owner.", why:"A stopped loop is not a resolved session. Production workflows must complete or transfer control safely.", reason:"Model every exit path, then package goal, evidence, completed work, authorization state, open issues, and the next safe action.", example:"RUNNING ──success──▶ COMPLETED\n   └──blocked─────▶ HANDOFF_READY ─▶ HUMAN" },
  { id:"context", title:"Context placement", score:0, detail:"Inline · @ references · CLAUDE.md", priority:"Priority A", ring:"#ff778f", topic:"Match context mechanism to lifetime and scope.", why:"Reusable project guidance and one-off task detail should not compete for the same context budget.", reason:"Use inline context once, @ references for a file needed now, CLAUDE.md for recurring project guidance, and targeted reads or scratchpads for long investigations.", example:"one request   → inline\nfile needed   → @ reference\nproject rule  → CLAUDE.md\nlong session  → scratchpad + targeted reads" },
  { id:"schema", title:"Ambiguity-safe schemas", score:0, detail:"Optional · nullable · enum", priority:"Priority A", ring:"#ff778f", topic:"Represent uncertainty instead of fabricating values.", why:"You already understand forced structured output; the missed distinction is how the schema represents missing data.", reason:"Optional means absent; nullable means known field with no confident value; enums constrain categories.", example:'{\n  "name": null,\n  "candidates": ["Anne", "Anna"],\n  "review_required": true\n}' },
  { id:"tools", title:"Tool descriptions & MCP", score:25, detail:"Scope · contracts · disambiguation", priority:"Priority A", ring:"#f4ba63", topic:"Make the correct tool easier to choose.", why:"Broad overlapping descriptions cause routing errors even when schemas are valid.", reason:"State when to use the tool, when not to, exact inputs, output shape, limits, and the neighboring tool to prefer in the competing case.", example:"search_faq: common questions first\ndeep_search: only after FAQ is insufficient" },
  { id:"review", title:"Human review routing", score:33, detail:"Confidence · risk · field ambiguity", priority:"Priority B", ring:"#f4ba63", topic:"Route evidence, not random samples.", why:"Review capacity should concentrate on the cases most likely to be wrong or costly.", reason:"Combine confidence, document quality, field-level ambiguity, and impact to determine whether to accept, retry, or escalate.", example:"high confidence + low risk → accept\nlow confidence + retryable → retry\nambiguous + high impact    → human" }
];

const TOMORROW_WEAKNESSES = [
  {
    id:"today-context", title:"/clear versus /compact", score:0,
    detail:"2 decisions · reset or summarize", priority:"Priority A", ring:"#ff778f", missCount:2,
    topic:"Choose whether to erase conversation context or compress it.",
    why:"Both commands free context, but they solve different problems. Confusing them can discard task state or preserve noise you wanted gone.",
    reason:"Use /compact to continue the same task with a summary. Use /clear between tasks or when you want empty conversation context. Neither command reverts changes already written to disk.",
    example:"same task + long context → /compact focus on files, tests, decisions\nnew task / polluted context → /clear\nundo file changes           → neither command"
  },
  {
    id:"today-coverage", title:"Retrieval coverage & sampling", score:0,
    detail:"2 decisions · overlap and strata", priority:"Priority A", ring:"#ff778f", missCount:2,
    topic:"Protect coverage before optimizing throughput.",
    why:"Batching and volume-proportional sampling can be efficient while still missing boundary evidence or low-volume document types.",
    reason:"Use overlapping chunks for long-document recall. In evaluation sampling, set a minimum per document type, then allocate the remaining budget by volume or risk.",
    example:"long document → overlapping windows\nasync volume  → Message Batches\nrare stratum  → minimum sample floor"
  },
  {
    id:"today-output", title:"Output contracts & repair", score:0,
    detail:"3 decisions · date, truncation, retry", priority:"Priority A", ring:"#ff778f", missCount:3,
    topic:"Diagnose whether the problem is a contract, capacity, or evidence failure.",
    why:"Different extraction failures need different fixes; a generic retry is not a substitute for schema constraints or missing evidence.",
    reason:"Use schema format: date for ISO dates. Treat stop_reason max_tokens as an output-capacity problem. Retry a placement/formatting mistake only when the source evidence is present.",
    example:"date shape     → JSON Schema format: date\ncut-off JSON   → more output budget or smaller chunks\nwrong object   → feedback retry\nmissing source → new evidence or human"
  },
  {
    id:"today-product", title:"Current Claude controls & SDKs", score:0,
    detail:"3 repaired items · permissions, SDKs, agents", priority:"Priority A", ring:"#ff778f", missCount:3,
    topic:"Separate current product behavior from legacy course wording.",
    why:"Several skipped questions used outdated or mixed terminology. Memorizing their original keys would make your current-product knowledge worse.",
    reason:"Sensitive paths belong in permissions.deny, plus sandboxing for Bash defense. Client SDK Tool Runner can automate custom tool loops. Agent SDK adds the Claude Code runtime. Subagent guarantees differ between Agent SDK naming and Claude Code @-mentions.",
    example:"secret file  → settings.json permissions.deny\ncustom tools → Client SDK Tool Runner\nCode runtime → Agent SDK\nSDK agent    → explicit configured name\nCode agent   → @-mention guarantee"
  },
  {
    id:"today-cache", title:"Prompt caching economics", score:0,
    detail:"1 decision · write premium, read discount", priority:"Priority B", ring:"#f4ba63", missCount:1,
    topic:"Cache stable prefixes only when they will be reused.",
    why:"Prompt caching changes input economics; it does not halve every token category.",
    reason:"The cache write has a premium, later reads are substantially cheaper, and output tokens are billed normally. A changed prefix misses the cache.",
    example:"stable instructions + shared corpus → cache prefix\nnew document in the prefix          → cache miss\noutput tokens                        → normal price"
  },
  {
    id:"today-carryover", title:"Carry-over architecture traps", score:0,
    detail:"4 earlier misses · boundaries, review, execution", priority:"Priority B", ring:"#f4ba63", missCount:4,
    topic:"Move deterministic work out of model reasoning and keep review independent.",
    why:"These earlier misses are highly transferable exam patterns and are worth one final pass before the exam.",
    reason:"Project and normalize tool data before context, give reviewers fresh evidence-focused context, and treat planning as the design phase before implementation and tests.",
    example:"40 fields → deterministic 5-field projection\nUnix/ISO  → adapter normalization\nartifact  → fresh reviewer + rubric\nlarge migration → PLAN → EXECUTE → TEST"
  }
];

const $ = (id) => document.getElementById(id);
const alphabet = (index) => String.fromCharCode(65 + index);
let toastTimer;
let timerHandle;
let selectedWeakness = "today-context";
let resultsIncorrectOnly = true;
let recommendedWeakness = "today-context";

function hashSeed(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle(items, seedText) {
  let seed = hashSeed(seedText);
  const random = () => {
    seed += 0x6D2B79F5;
    let value = seed;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createAttempt(mode = "full", weakness = null, history = [], sourceSet = null) {
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let pool;
  if (mode === "drill") {
    if (TOMORROW_WEAKNESSES.some((item) => item.id === weakness)) {
      const repairPool = TODAY_REPAIR_QUESTIONS;
      const focused = seededShuffle(repairPool.filter((question) => question.weakness === weakness), `${seed}-repair-focus`);
      const support = seededShuffle(repairPool.filter((question) => question.weakness !== weakness), `${seed}-repair-support`);
      pool = [...focused, ...support].slice(0, 10);
    } else {
      const focused = seededShuffle(QUESTIONS.filter((question) => question.weakness === weakness), `${seed}-focus`);
      const support = seededShuffle(QUESTIONS.filter((question) => question.weakness !== weakness), `${seed}-support`);
      const importedFocus = seededShuffle(IMPORTED_QUESTIONS.filter((question) => question.weakness === weakness), `${seed}-imported`);
      pool = [...focused, ...support].slice(0, 7).concat(importedFocus.slice(0, 3));
      pool = seededShuffle(pool, `${seed}-mixed`);
    }
  } else if (mode === "source") {
    const set = PRACTICE_SETS.find((entry) => entry.id === sourceSet) || PRACTICE_SETS[0];
    pool = set ? [...set.questions] : [];
    sourceSet = set?.id || null;
  } else {
    pool = seededShuffle(QUESTIONS, seed).slice(0, 60);
  }
  const sourceDuration = PRACTICE_SETS.find((entry) => entry.id === sourceSet)?.durationMinutes * 60;
  const duration = mode === "source" ? sourceDuration || FULL_SECONDS : mode === "full" ? FULL_SECONDS : DRILL_SECONDS;
  return {
    version: STATE_VERSION,
    view: "exam",
    mode,
    weakness,
    sourceSet,
    seed,
    activeIds: pool.map((question) => question.id),
    current: 0,
    answers: {},
    confidence: {},
    review: {},
    duration,
    remaining: duration,
    startedAt: new Date().toISOString(),
    lastTick: Date.now(),
    paused: false,
    submittedAt: null,
    history,
    theme: localStorage.getItem("cca-theme") || "dark"
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const idsValid = parsed?.activeIds?.every((id) => QUESTION_BY_ID.has(id));
    if (parsed?.version === STATE_VERSION && idsValid) return parsed;
  } catch (_) {}
  return createAttempt();
}

let state = loadState();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getAttemptQuestions() {
  return state.activeIds.map((id) => QUESTION_BY_ID.get(id)).filter(Boolean);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[character]);
}

function currentQuestion() {
  return getAttemptQuestions()[state.current];
}

function arraysEqual(a = [], b = []) {
  if (a.length !== b.length) return false;
  const left = [...a].sort((x, y) => x - y);
  const right = [...b].sort((x, y) => x - y);
  return left.every((value, index) => value === right[index]);
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1900);
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return [hours, minutes, secs].map((value) => String(value).padStart(2, "0")).join(":");
}

function updateTimer() {
  $("timer").textContent = formatTime(state.remaining);
  const percent = state.duration ? Math.max(0, state.remaining / state.duration * 100) : 0;
  $("timerProgress").style.width = `${percent}%`;
  $("timerProgress").style.background = percent < 15 ? "var(--red)" : "linear-gradient(90deg,var(--mint),var(--brand))";
}

function tickTimer() {
  if (state.submittedAt || state.paused || state.view !== "exam") return;
  const now = Date.now();
  const delta = Math.floor((now - state.lastTick) / 1000);
  if (delta < 1) return;
  state.remaining = Math.max(0, state.remaining - delta);
  state.lastTick = now;
  updateTimer();
  persist();
  if (state.remaining === 0) submitAttempt("Time expired");
}

function setView(view) {
  const validViews = ["exam", "library", "guide", "weakness", "results"];
  if (!validViews.includes(view)) view = "exam";
  if (view !== "exam" && !state.submittedAt && !state.paused) {
    state.paused = true;
    showToast("Attempt paused while you study");
  }
  state.view = view;
  state.lastTick = Date.now();
  document.querySelectorAll(".view").forEach((element) => element.classList.toggle("is-active", element.id === `${view}View`));
  document.querySelectorAll(".view-tab").forEach((element) => {
    const active = element.dataset.view === view;
    element.classList.toggle("is-active", active);
    element.toggleAttribute("aria-current", active);
  });
  persist();
  if (view === "exam") renderExam();
  if (view === "library") renderSetLibrary();
  if (view === "weakness") renderWeaknesses(selectedWeakness);
  if (location.hash !== `#${view}`) history.replaceState(null, "", `#${view}`);
}

function renderExam() {
  if (state.submittedAt) {
    $("resultsPanel").hidden = false;
    document.querySelector(".exam-layout").hidden = true;
    renderResults();
    return;
  }
  $("resultsPanel").hidden = true;
  document.querySelector(".exam-layout").hidden = false;
  const questions = getAttemptQuestions();
  const question = currentQuestion();
  if (!question) return;
  const sourceSet = PRACTICE_SETS.find((set) => set.id === state.sourceSet);
  $("modeLabel").textContent = state.mode === "full" ? "Coach-reviewed simulation" : state.mode === "source" ? sourceSet?.title || "Source-set practice" : `${[...TOMORROW_WEAKNESSES, ...WEAKNESSES].find((item) => item.id === state.weakness)?.title || "Focused"} mixed drill`;
  $("examMeta").textContent = `${questions.length} questions · ${Math.round(state.duration / 60)} minutes`;
  $("questionCounter").textContent = `Question ${state.current + 1} of ${questions.length}`;
  $("questionNumber").textContent = String(state.current + 1).padStart(2, "0");
  $("domainLabel").textContent = question.domain;
  $("questionStem").textContent = question.stem;
  const imported = !Array.isArray(question.correct);
  const udemyVerified = question.verificationStatus === "udemy-key-verified";
  $("sourceBadge").textContent = imported ? "Imported challenge · key pending" : udemyVerified ? "Udemy result · key verified" : "Coach-reviewed";
  $("sourceBadge").classList.toggle("is-pending", imported);
  $("selectionNote").textContent = `${question.selectionMode === "multiple" ? "Select all answers that apply." : "Select one answer."}${imported ? " This item builds recall but is not scored yet." : ""}`;
  const marked = Boolean(state.review[question.id]);
  $("reviewButton").classList.toggle("is-active", marked);
  $("reviewButton").setAttribute("aria-pressed", String(marked));
  $("reviewButton").textContent = marked ? "★ Marked for review" : "☆ Mark for review";

  const selected = state.answers[question.id] || [];
  $("answersForm").innerHTML = question.options.map((option, index) => `
    <label class="answer-option">
      <input type="${question.selectionMode === "multiple" ? "checkbox" : "radio"}" name="answer" value="${index}" ${selected.includes(index) ? "checked" : ""}>
      <span class="option-letter">${alphabet(index)}</span>
      <span class="option-text">${escapeHtml(option)}</span>
    </label>`).join("");
  $("answersForm").querySelectorAll("input").forEach((input) => input.addEventListener("change", () => {
    const value = Number(input.value);
    if (question.selectionMode === "single") {
      state.answers[question.id] = [value];
    } else {
      const next = new Set(state.answers[question.id] || []);
      input.checked ? next.add(value) : next.delete(value);
      state.answers[question.id] = [...next];
    }
    persist();
    renderNavigator();
    updateMetrics();
  }));

  $("confidenceButtons").innerHTML = [1,2,3,4,5].map((level) => `<button type="button" class="${state.confidence[question.id] === level ? "is-active" : ""}" aria-label="Confidence ${level}" aria-pressed="${state.confidence[question.id] === level}">${level}</button>`).join("");
  $("confidenceButtons").querySelectorAll("button").forEach((button, index) => button.addEventListener("click", () => {
    state.confidence[question.id] = index + 1;
    persist();
    renderQuestionConfidence();
  }));

  $("backButton").disabled = state.current === 0;
  $("nextButton").textContent = state.current === questions.length - 1 ? "Finish attempt →" : "Next question →";
  $("pauseButton").textContent = "Pause exam";
  renderNavigator();
  updateMetrics();
  updateTimer();
  if (state.paused && !$("pauseDialog").open) $("pauseDialog").showModal();
}

function renderQuestionConfidence() {
  const question = currentQuestion();
  $("confidenceButtons").querySelectorAll("button").forEach((button, index) => {
    const active = state.confidence[question.id] === index + 1;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderNavigator() {
  const questions = getAttemptQuestions();
  $("questionGrid").innerHTML = questions.map((question, index) => `<button class="question-chip ${index === state.current ? "is-current" : ""} ${(state.answers[question.id] || []).length ? "is-answered" : ""} ${state.review[question.id] ? "is-review" : ""}" aria-label="Question ${index + 1}" data-index="${index}">${index + 1}</button>`).join("");
  $("questionGrid").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.current = Number(button.dataset.index);
    persist();
    renderExam();
  }));
}

function updateMetrics() {
  const ids = state.activeIds;
  $("answeredCount").textContent = ids.filter((id) => (state.answers[id] || []).length).length;
  $("reviewCount").textContent = ids.filter((id) => state.review[id]).length;
}

function openFinishDialog() {
  const unanswered = state.activeIds.filter((id) => !(state.answers[id] || []).length).length;
  const flagged = state.activeIds.filter((id) => state.review[id]).length;
  const label = state.mode === "source" ? "Complete this practice set" : "Submit this attempt";
  const hasScoredKey = getAttemptQuestions().some((question) => Array.isArray(question.correct));
  $("finishSummary").textContent = `${unanswered} unanswered · ${flagged} marked for review. ${state.mode === "source" && !hasScoredKey ? "The set is completion-based because its answer key is pending verification." : "Answers cannot be changed after submission."}`;
  $("confirmFinishButton").textContent = label;
  $("finishDialog").showModal();
}

function calculateResult() {
  const questions = getAttemptQuestions();
  const items = questions.map((question) => {
    const answer = state.answers[question.id] || [];
    const isScored = Array.isArray(question.correct);
    return {
      id: question.id,
      correct: isScored ? arraysEqual(answer, question.correct) : null,
      answer,
      confidence: state.confidence[question.id] || null,
      weakness: question.weakness,
      domain: question.domain
    };
  });
  const scoredItems = items.filter((item) => typeof item.correct === "boolean");
  const correct = scoredItems.filter((item) => item.correct).length;
  const answered = items.filter((item) => item.answer.length).length;
  const scaledScore = scoredItems.length ? Math.round(correct / scoredItems.length * 1000) : null;
  return {
    items,
    correct,
    total: items.length,
    scoredTotal: scoredItems.length,
    challengeTotal: items.length - scoredItems.length,
    answered,
    percent: scoredItems.length ? Math.round(correct / scoredItems.length * 100) : Math.round(answered / Math.max(1, items.length) * 100),
    scaledScore
  };
}

function submitAttempt(reason = "Submitted") {
  if (state.submittedAt) return;
  const result = calculateResult();
  state.submittedAt = new Date().toISOString();
  state.paused = true;
  state.result = result;
  state.history = [...(state.history || []), {
    mode: state.mode,
    weakness: state.weakness,
    sourceSet: state.sourceSet,
    startedAt: state.startedAt,
    submittedAt: state.submittedAt,
    duration: state.duration,
    remaining: state.remaining,
    result
  }].slice(-20);
  persist();
  if ($("finishDialog").open) $("finishDialog").close();
  showToast(reason);
  renderExam();
}

function accuracyFor(items) {
  const scored = items.filter((item) => typeof item.correct === "boolean");
  if (!scored.length) return 0;
  return Math.round(scored.filter((item) => item.correct).length / scored.length * 100);
}

function renderResults() {
  const result = state.result || calculateResult();
  const sourceOnly = result.scoredTotal === 0;
  $("exportAttemptButton").hidden = !sourceOnly;
  $("newExamButton").textContent = sourceOnly ? "Choose another practice set" : "Start a fresh full exam";
  $("resultDrillButton").textContent = sourceOnly ? "Practice a verified weakness" : "Practice this weakness";
  $("resultsMode").textContent = state.mode === "full" ? "Coach-reviewed simulation complete" : state.sourceSet === "bonus-2" ? "Bonus Set 2 simulation complete" : state.mode === "source" ? "Source practice complete" : "Mixed weakness drill complete";
  $("resultScore").textContent = sourceOnly ? `${result.percent}%` : `${result.scaledScore}`;
  $("resultRingLabel").textContent = sourceOnly ? "answered" : "/ 1000";
  $("resultsSubhead").textContent = sourceOnly ? "Completion is shown instead of correctness because this source set’s answer key has not been imported." : "Linear 0–1000 practice scale · 720 practice pass line. This is a study estimate, not Anthropic’s proprietary scaled-score calculation.";
  $("resultRing").style.setProperty("--result", result.percent);
  $("resultRing").style.setProperty("--result-color", sourceOnly ? "var(--mint)" : result.scaledScore >= 720 ? "var(--mint)" : result.scaledScore >= 600 ? "var(--amber)" : "var(--red)");
  const used = state.duration - state.remaining;
  const confidenceValues = result.items.map((item) => item.confidence).filter(Boolean);
  const averageConfidence = confidenceValues.length ? (confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length).toFixed(1) : "—";
  const highConfidenceMisses = result.items.filter((item) => item.correct === false && item.confidence >= 4).length;
  const resultCards = sourceOnly ? [
    ["Answered", `${result.answered} / ${result.total}`],
    ["Time used", formatTime(used)],
    ["Average confidence", `${averageConfidence}${averageConfidence === "—" ? "" : " / 5"}`],
    ["Answer-key status", "Pending"]
  ] : [
    ["Correct", `${result.correct} / ${result.scoredTotal}`],
    ["Scaled score", `${result.scaledScore} / 1000`],
    ["Result", result.scaledScore >= 720 ? "Pass" : "Needs review"],
    ["Time used", formatTime(used)]
  ];
  $("resultMetrics").innerHTML = resultCards.map(([label, value]) => `<div class="metric-card"><span>${label}</span><strong>${value}</strong></div>`).join("");

  const domains = [...new Set(getAttemptQuestions().map((question) => question.domain))];
  $("domainBreakdown").innerHTML = domains.map((domain) => {
    const items = result.items.filter((item) => item.domain === domain);
    const answered = items.filter((item) => item.answer.length).length;
    const score = sourceOnly ? Math.round(answered / Math.max(1, items.length) * 100) : accuracyFor(items);
    return `<div class="domain-row"><span>${escapeHtml(domain)}</span><div class="domain-bar"><i style="width:${score}%"></i></div><strong>${score}%</strong></div>`;
  }).join("");

  const weaknessScores = [...TOMORROW_WEAKNESSES, ...WEAKNESSES].map((weakness) => {
    const items = result.items.filter((item) => item.weakness === weakness.id && typeof item.correct === "boolean");
    return { ...weakness, attemptScore: items.length ? accuracyFor(items) : 101, count: items.length };
  }).filter((item) => item.count).sort((a, b) => a.attemptScore - b.attemptScore || a.score - b.score);
  const weakest = weaknessScores[0] || WEAKNESSES.find((item) => item.id === selectedWeakness) || WEAKNESSES[0];
  recommendedWeakness = weakest.id;
  $("nextStepTitle").textContent = weakest.title;
  $("nextStepText").textContent = sourceOnly ? "Use confidence and review flags from this set to choose a Weakness Lab topic, then practice it with verified feedback." : `${weakest.attemptScore}% on ${weakest.count} coach-reviewed question${weakest.count === 1 ? "" : "s"} in this attempt. ${weakest.reason}`;
  renderReviewList();
}

function exportAttempt() {
  const questions = getAttemptQuestions();
  const set = PRACTICE_SETS.find((entry) => entry.id === state.sourceSet);
  const payload = {
    exportVersion: 1,
    sourceSet: state.sourceSet,
    title: set?.title || "Source practice set",
    exportedAt: new Date().toISOString(),
    answered: questions.filter((question) => (state.answers[question.id] || []).length).length,
    total: questions.length,
    responses: questions.map((question, index) => {
      const answer = state.answers[question.id] || [];
      return {
        number: index + 1,
        id: question.id,
        answerIndexes: answer,
        answerLetters: answer.map(alphabet),
        selectedOptions: answer.map((optionIndex) => question.options[optionIndex])
      };
    })
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.sourceSet || "practice"}-saved-answers.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Saved answers exported");
}

function renderReviewList() {
  const result = state.result || calculateResult();
  const questionMap = new Map(getAttemptQuestions().map((question) => [question.id, question]));
  const sourceOnly = result.scoredTotal === 0;
  const items = resultsIncorrectOnly ? result.items.filter((item) => item.correct !== true) : result.items;
  $("incorrectOnlyButton").textContent = resultsIncorrectOnly ? (sourceOnly ? "Review all" : "Needs review") : "All questions";
  $("incorrectOnlyButton").setAttribute("aria-pressed", String(resultsIncorrectOnly));
  if (!items.length) {
    $("reviewList").innerHTML = `<div class="metric-card"><strong>No incorrect answers to review.</strong><span>Open all questions to revisit the reasoning.</span></div>`;
    return;
  }
  $("reviewList").innerHTML = items.map((item) => {
    const question = questionMap.get(item.id);
    const weakness = [...TOMORROW_WEAKNESSES, ...WEAKNESSES].find((entry) => entry.id === question.weakness);
    const chosen = item.answer.length ? item.answer.map((index) => `${alphabet(index)}. ${escapeHtml(question.options[index])}`).join(" · ") : "No answer";
    const isPending = item.correct === null;
    const correct = isPending ? "Pending source verification" : question.correct.map((index) => `${alphabet(index)}. ${escapeHtml(question.options[index])}`).join(" · ");
    return `<article class="review-item">
      <button class="review-summary" aria-expanded="false">
        <span class="review-status ${isPending ? "pending" : item.correct ? "correct" : "incorrect"}">${isPending ? "?" : item.correct ? "✓" : "×"}</span>
        <span><strong>${escapeHtml(question.stem)}</strong><small>${escapeHtml(question.domain)} · source question ${question.sourceNumber} · ${isPending ? "key pending" : question.verificationStatus === "udemy-key-verified" ? "Udemy-verified key" : "coach-reviewed key"}</small></span>
        <span>⌄</span>
      </button>
      <div class="review-detail">
        <div class="review-detail-grid">
          <div class="review-detail-block"><span>Topic</span><p>${escapeHtml(question.topic)}</p></div>
          <div class="review-detail-block"><span>Why</span><p>${escapeHtml(DOMAIN_WHY[question.domain])}</p></div>
          <div class="review-detail-block"><span>Reason</span><p>${escapeHtml(isPending ? "Name the decision boundary in the stem, eliminate options that rely on vague model discretion, and verify your choice against your course answer review." : question.rationale)}</p></div>
          <div class="review-detail-block"><span>Example</span><pre>${escapeHtml(weakness?.example || correct)}</pre></div>
        </div>
        <div class="answer-comparison"><strong>Your answer:</strong> ${chosen}<br><strong>${isPending ? "Answer-key status" : "Coach-reviewed answer"}:</strong> ${correct}</div>
      </div>
    </article>`;
  }).join("");
  $("reviewList").querySelectorAll(".review-summary").forEach((button) => button.addEventListener("click", () => {
    const item = button.closest(".review-item");
    const open = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
  }));
}

function masteryFor(weakness) {
  const historyItems = (state.history || []).flatMap((attempt) => attempt.result?.items || []).filter((item) => item.weakness === weakness.id && typeof item.correct === "boolean");
  return historyItems.length ? accuracyFor(historyItems) : weakness.score;
}

function renderSetLibrary() {
  const active = !state.submittedAt && state.mode === "source" ? state.sourceSet : null;
  $("setCards").innerHTML = PRACTICE_SETS.map((set, index) => {
    const isActive = active === set.id;
    const status = isActive ? `${state.activeIds.filter((id) => (state.answers[id] || []).length).length} answered · attempt in progress` : set.id === "bonus-1" ? "Question order preserved · Udemy-verified answer key" : set.id === "bonus-2" ? "Question order preserved · coach-reviewed key · scored 0–1000" : "Question order preserved · completion-based";
    return `<article class="set-card ${isActive ? "is-active" : ""}">
      <div class="set-index">${String(index + 1).padStart(2, "0")}</div>
      <div><p class="eyebrow">${set.questions.length} questions · ${set.durationMinutes} minutes</p><h2>${escapeHtml(set.title)}</h2><p>${escapeHtml(set.subtitle)}</p><small>${status}</small></div>
      <button class="${isActive ? "secondary-button" : "primary-button"}" data-set-id="${set.id}">${isActive ? "Resume set" : "Start set"}</button>
    </article>`;
  }).join("");
  $("setCards").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    if (active === button.dataset.setId) {
      state.paused = false;
      state.lastTick = Date.now();
      persist();
      setView("exam");
    } else {
      beginAttempt("source", null, button.dataset.setId);
    }
  }));
}

function renderWeaknesses(activeId = "today-context") {
  selectedWeakness = activeId;
  $("weaknessCards").innerHTML = TOMORROW_WEAKNESSES.map((item) => {
    const mastery = masteryFor(item);
    return `<button class="weakness-card ${item.id === activeId ? "is-active" : ""}" data-id="${item.id}"><span class="mastery-ring" style="--score:${mastery};--ring:${mastery >= 75 ? "#58d6b2" : item.ring}">${mastery}%</span><span><strong>${item.title}</strong><small>${item.detail}</small></span><span class="priority-tag">${item.priority}</span></button>`;
  }).join("");
  $("weaknessCards").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => renderWeaknesses(button.dataset.id)));
  const item = TOMORROW_WEAKNESSES.find((entry) => entry.id === activeId) || TOMORROW_WEAKNESSES[0];
  $("studyTitle").textContent = item.title;
  $("lessonTopic").textContent = item.topic;
  $("lessonWhy").textContent = item.why;
  $("lessonReason").textContent = item.reason;
  $("lessonExample").textContent = item.example;
  $("labMix").innerHTML = `<strong>Today: 10-question current-doc repair drill</strong><br>Starts with this ${item.missCount}-question weakness, then mixes the other missed decisions to test transfer.`;
}

function beginAttempt(mode, weakness = null, sourceSet = null) {
  let history = state.history || [];
  const answered = state.activeIds?.filter((id) => (state.answers[id] || []).length).length || 0;
  if (!state.submittedAt && answered > 0) {
    history = [...history, {
      mode: state.mode,
      weakness: state.weakness,
      sourceSet: state.sourceSet,
      startedAt: state.startedAt,
      savedAt: new Date().toISOString(),
      duration: state.duration,
      remaining: state.remaining,
      activeIds: [...state.activeIds],
      current: state.current,
      answers: { ...state.answers },
      confidence: { ...state.confidence },
      review: { ...state.review },
      status: "superseded-draft",
      result: calculateResult()
    }].slice(-20);
  }
  const theme = state.theme;
  state = createAttempt(mode, weakness, history, sourceSet);
  state.theme = theme;
  selectedWeakness = weakness || selectedWeakness;
  persist();
  setView("exam");
  renderExam();
  showToast(mode === "full" ? "Fresh 60-question verified exam started" : sourceSet === "bonus-2" ? "Bonus Set 2 · 70-question scored simulation started" : mode === "source" ? "Complete source set started" : "Mixed 10-question weakness drill started");
}

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  try {
    void Promise.resolve(context.registerTool({
      name: "start_weakness_drill",
      title: "Start weakness drill",
      description: "Start a new 10-question current-doc repair drill drawn from today's Bonus Set 2 feedback and carry-over traps. This replaces the active local attempt and opens the exam view.",
      inputSchema: {
        type: "object",
        properties: { weakness: { type: "string", enum: TOMORROW_WEAKNESSES.map((item) => item.id) } },
        required: ["weakness"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || ![...TOMORROW_WEAKNESSES, ...WEAKNESSES].some((item) => item.id === input.weakness)) throw new Error("Unknown weakness cluster");
        beginAttempt("drill", input.weakness);
        return { status: "started", mode: "drill", weakness: input.weakness, verifiedQuestionCount: 10, sourceSet: "bonus-1" };
      }
    })).catch(() => {});
  } catch (_) {}
}

document.querySelectorAll(".view-tab").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
$("reviewButton").addEventListener("click", () => {
  const id = currentQuestion().id;
  state.review[id] = !state.review[id];
  persist();
  renderExam();
});
$("backButton").addEventListener("click", () => {
  if (state.current > 0) {
    state.current--;
    persist();
    renderExam();
  }
});
$("nextButton").addEventListener("click", () => {
  if (state.current < getAttemptQuestions().length - 1) {
    state.current++;
    persist();
    renderExam();
  } else {
    openFinishDialog();
  }
});
$("clearButton").addEventListener("click", () => {
  delete state.answers[currentQuestion().id];
  persist();
  renderExam();
});
$("pauseButton").addEventListener("click", () => {
  state.paused = true;
  persist();
  $("pauseDialog").showModal();
});
$("resumeButton").addEventListener("click", () => {
  state.paused = false;
  state.lastTick = Date.now();
  persist();
  showToast("Attempt resumed");
});
$("pauseDialog").addEventListener("cancel", (event) => event.preventDefault());
$("finishDialog").addEventListener("close", () => {
  if ($("finishDialog").returnValue === "submit") submitAttempt();
});
$("themeButton").addEventListener("click", () => {
  state.theme = document.body.classList.toggle("light") ? "light" : "dark";
  localStorage.setItem("cca-theme", state.theme);
  persist();
});
$("startDrillButton").addEventListener("click", () => beginAttempt("drill", selectedWeakness));
document.querySelectorAll("[data-guide-weakness]").forEach((button) => button.addEventListener("click", () => {
  selectedWeakness = button.dataset.guideWeakness;
  setView("weakness");
  renderWeaknesses(selectedWeakness);
}));
$("resultDrillButton").addEventListener("click", () => beginAttempt("drill", recommendedWeakness));
$("exportAttemptButton").addEventListener("click", exportAttempt);
$("newExamButton").addEventListener("click", () => state.mode === "source" ? setView("library") : beginAttempt("full"));
$("returnWeaknessButton").addEventListener("click", () => setView("weakness"));
$("incorrectOnlyButton").addEventListener("click", () => {
  resultsIncorrectOnly = !resultsIncorrectOnly;
  renderReviewList();
});

if (["bonus-1", "bonus-2"].includes(state.sourceSet) && state.submittedAt) {
  state.result = calculateResult();
  const matchingHistory = [...(state.history || [])].reverse().find((attempt) => attempt.sourceSet === state.sourceSet);
  if (matchingHistory) matchingHistory.result = state.result;
  persist();
}
if (state.theme === "light") document.body.classList.add("light");
const linkedView = location.hash.slice(1);
setView(["exam", "library", "guide", "weakness", "results"].includes(linkedView) ? linkedView : state.view || "exam");
renderWeaknesses(selectedWeakness);
clearInterval(timerHandle);
timerHandle = setInterval(tickTimer, 1000);
registerWebMCP();
