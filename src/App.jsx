import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Play, Pause, RotateCcw, SkipForward, Flame, Trophy, Search, Star,
  Home, Library, BarChart3, Mic, X, Sparkles, ChevronRight, Target,
  Clock, TrendingUp, Award, Lock, Check
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, CartesianGrid
} from "recharts";

/* ----------------------------------------------------------------
   DATA: Topic bank
------------------------------------------------------------------*/
const TOPICS = [
  // Technical / CS fundamentals
  t("REST APIs", "technical", "easy", "high", ["Endpoint","Verb","Stateless","JSON","Status Code"], true),
  t("OOP Principles", "technical", "easy", "high", ["Encapsulation","Inheritance","Polymorphism","Abstraction"], true),
  t("Operating Systems Basics", "technical", "medium", "medium", ["Kernel","Process","Scheduling","Memory"], true),
  t("Threads vs Processes", "technical", "medium", "high", ["Concurrency","Context Switch","Shared Memory"], true),
  t("Garbage Collection", "technical", "medium", "medium", ["Heap","Mark and Sweep","Reference Counting"], true),
  t("Java Collections Framework", "technical", "medium", "medium", ["List","Set","Map","Iterator"], true),
  t("React Hooks", "technical", "medium", "high", ["useState","useEffect","Dependency Array","Re-render"], true),
  t("JWT Authentication", "technical", "medium", "high", ["Token","Signature","Header","Expiration"], true),
  t("SQL vs NoSQL", "technical", "easy", "high", ["Schema","Joins","Scalability","Consistency"], true),
  t("Database Indexing", "technical", "medium", "medium", ["B-Tree","Query Plan","Lookup Speed"], true),
  t("Docker Fundamentals", "technical", "easy", "high", ["Image","Container","Layer","Dockerfile"], true),
  t("Kubernetes Basics", "technical", "hard", "medium", ["Pod","Node","Deployment","Service"], true),
  t("Git Internals", "technical", "easy", "medium", ["Commit","Branch","Merge","Rebase"], true),
  t("Load Balancing", "technical", "medium", "high", ["Round Robin","Health Check","Sticky Session"], true),
  t("Caching Strategies", "technical", "medium", "high", ["TTL","Cache Invalidation","Write-through"], true),
  t("API Design Best Practices", "technical", "medium", "high", ["Versioning","Idempotency","Pagination"], true),
  t("Event-Driven Architecture", "technical", "hard", "medium", ["Queue","Producer","Consumer","Broker"], true),
  t("Microservices vs Monolith", "technical", "medium", "high", ["Coupling","Deployment","Boundaries"], true),
  t("Common Design Patterns", "technical", "medium", "medium", ["Singleton","Factory","Observer","Strategy"], true),
  t("Big-O and Complexity", "technical", "medium", "high", ["Time Complexity","Space Complexity","Big-O"], true),
  t("HashMap vs TreeMap", "technical", "medium", "high", ["Hashing","Ordering","Collision"], true),
  t("Virtual Memory", "technical", "hard", "medium", ["Paging","Page Fault","Address Space"], true),
  t("CAP Theorem", "technical", "hard", "medium", ["Consistency","Availability","Partition Tolerance"], true),
  t("What Happens When You Type a URL", "technical", "hard", "high", ["DNS","TCP Handshake","Rendering"], true),
  t("Async Programming vs Threading", "technical", "hard", "medium", ["Event Loop","Callback","Non-blocking"], true),
  // AI / ML
  t("What is Artificial Intelligence", "ai", "easy", "medium", ["Agent","Reasoning","Automation"], true),
  t("Machine Learning Basics", "ai", "medium", "high", ["Training Data","Model","Overfitting"], true),
  t("Neural Networks", "ai", "hard", "medium", ["Neuron","Weights","Backpropagation"], true),
  t("Large Language Models", "ai", "medium", "high", ["Tokens","Transformer","Context Window"], true),
  t("Retrieval-Augmented Generation", "ai", "hard", "high", ["Embedding","Vector Search","Chunking"], true),
  t("Prompt Engineering", "ai", "easy", "medium", ["Instruction","Few-shot","System Prompt"], true),
  t("Vector Databases", "ai", "medium", "medium", ["Embedding","Similarity","Index"], true),
  // Behavioral / HR
  t("Tell Me About Yourself", "behavioral", "easy", "high", ["Background","Strengths","Goals"], true),
  t("Your Biggest Weakness", "behavioral", "easy", "high", ["Self-awareness","Growth","Honesty"], true),
  t("A Time You Showed Leadership", "behavioral", "medium", "high", ["Initiative","Ownership","Influence"], true),
  t("Resolving a Conflict", "behavioral", "medium", "high", ["Communication","Compromise","Empathy"], true),
  t("Working on a Team", "behavioral", "easy", "high", ["Collaboration","Roles","Trust"], true),
  t("A Time You Failed", "behavioral", "medium", "high", ["Accountability","Lesson","Recovery"], true),
  t("Managing Your Time", "behavioral", "easy", "medium", ["Prioritization","Deadlines","Focus"], true),
  t("A Difficult Project", "behavioral", "medium", "high", ["Obstacle","Planning","Delivery"], true),
  t("Explain Your Favorite Project", "behavioral", "medium", "high", ["Motivation","Tech Stack","Impact"], true),
  t("Explain Your Resume Project", "behavioral", "medium", "high", ["Ownership","Decisions","Outcome"], true),
  // General speaking
  t("Social Media's Impact on Society", "general", "easy", "low", ["Connection","Privacy","Attention"], false),
  t("Climate Change", "general", "medium", "low", ["Emissions","Policy","Sustainability"], false),
  t("Space Exploration", "general", "medium", "low", ["Discovery","Funding","Ambition"], false),
  t("The Future of Education", "general", "easy", "low", ["Access","Technology","Curriculum"], false),
  t("Remote Work", "general", "easy", "low", ["Flexibility","Isolation","Productivity"], false),
  t("Productivity Habits", "general", "easy", "low", ["Focus","Routine","Discipline"], false),
  t("Why Books Still Matter", "general", "easy", "low", ["Attention","Imagination","Knowledge"], false),
  t("Technology and Daily Life", "general", "easy", "low", ["Convenience","Dependence","Change"], false),
  t("What Makes People Creative", "general", "medium", "low", ["Curiosity","Constraint","Play"], false),
  t("What Happiness Means", "general", "medium", "low", ["Purpose","Contentment","Balance"], false),
  t("Why Sports Matter", "general", "easy", "low", ["Discipline","Teamwork","Community"], false),
  t("Music and Emotion", "general", "easy", "low", ["Rhythm","Memory","Mood"], false),
  t("Why People Travel", "general", "easy", "low", ["Perspective","Culture","Adventure"], false),
  // System design (interview mode staples)
  t("Design a URL Shortener", "technical", "hard", "high", ["Hashing","Redirection","Storage"], true),
  t("Design a Rate Limiter", "technical", "hard", "high", ["Token Bucket","Sliding Window"], true),
  t("Explain REST APIs to a Beginner", "technical", "easy", "high", ["Resource","Request","Response"], true),
  t("Why Use Docker", "technical", "easy", "high", ["Portability","Isolation","Consistency"], true),
];

function t(title, category, difficulty, relevance, keywords, interview) {
  return {
    id: slug(title),
    title,
    category, // technical | ai | behavioral | general
    difficulty, // easy | medium | hard
    relevance, // low | medium | high
    keywords,
    interview,
  };
}
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

const CATEGORY_META = {
  technical: { label: "Technical", color: "var(--c-cyan)" },
  ai: { label: "AI / ML", color: "var(--c-violet)" },
  behavioral: { label: "Behavioral", color: "var(--c-amber)" },
  general: { label: "General", color: "var(--c-green)" },
};

/* ----------------------------------------------------------------
   STORAGE
------------------------------------------------------------------*/
const STORE_KEY = "speaksprint-data";
const emptyData = () => ({ sessions: [], favorites: [] });

async function loadData() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
    return emptyData();
  } catch {
    return emptyData();
  }
}
async function saveData(data) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    // best-effort
  }
}

/* ----------------------------------------------------------------
   HELPERS
------------------------------------------------------------------*/
function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function dayKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
}
function daysBetween(a, b) {
  const MS = 86400000;
  const da = new Date(a); da.setHours(0, 0, 0, 0);
  const db = new Date(b); db.setHours(0, 0, 0, 0);
  return Math.round((db - da) / MS);
}

function computeStreaks(sessions) {
  if (sessions.length === 0) return { current: 0, longest: 0 };
  const uniqueDays = [...new Set(sessions.map((s) => dayKey(s.date)))]
    .map((k) => sessions.find((s) => dayKey(s.date) === k).date)
    .sort((a, b) => new Date(a) - new Date(b));

  let longest = 1, run = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    if (daysBetween(uniqueDays[i - 1], uniqueDays[i]) === 1) run++;
    else run = 1;
    longest = Math.max(longest, run);
  }

  const today = new Date();
  const lastDay = uniqueDays[uniqueDays.length - 1];
  const gapFromToday = daysBetween(lastDay, today);
  let current = 0;
  if (gapFromToday <= 1) {
    current = 1;
    for (let i = uniqueDays.length - 1; i > 0; i--) {
      if (daysBetween(uniqueDays[i - 1], uniqueDays[i]) === 1) current++;
      else break;
    }
  }
  return { current, longest };
}

const BADGES = [
  { id: "streak-3", label: "3 Day Streak", icon: "🔥", test: (s, st) => st.longest >= 3 },
  { id: "streak-7", label: "7 Day Streak", icon: "🔥", test: (s, st) => st.longest >= 7 },
  { id: "streak-30", label: "30 Day Streak", icon: "🔥", test: (s, st) => st.longest >= 30 },
  { id: "sessions-100", label: "100 Sessions", icon: "🏆", test: (s) => s.length >= 100 },
  { id: "first-ai", label: "First AI Topic", icon: "🤖", test: (s) => s.some((x) => x.category === "ai") },
  { id: "first-hr", label: "First HR Topic", icon: "🗣️", test: (s) => s.some((x) => x.category === "behavioral") },
  { id: "minutes-1000", label: "1000 Speaking Minutes", icon: "⏱️", test: (s) => s.reduce((a, x) => a + x.speakingSeconds, 0) / 60 >= 1000 },
];

const QUOTES = [
  "You explained that better than yesterday.",
  "Consistency beats perfection.",
  "One session closer to interview confidence.",
  "Great speakers are built, not born.",
  "Clarity is a muscle. You just trained it.",
];

/* ----------------------------------------------------------------
   MAIN APP
------------------------------------------------------------------*/
export default function SpeakSprint() {
  const [view, setView] = useState("home"); // home | library | dashboard
  const [data, setData] = useState(emptyData());
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData().then((d) => { setData(d); setLoaded(true); });
  }, []);

  const persist = useCallback(async (next) => {
    setData(next);
    await saveData(next);
  }, []);

  const streaks = useMemo(() => computeStreaks(data.sessions), [data.sessions]);
  const earnedBadgeIds = useMemo(
    () => new Set(BADGES.filter((b) => b.test(data.sessions, streaks)).map((b) => b.id)),
    [data.sessions, streaks]
  );

  const addSession = useCallback((session) => {
    const prevBadges = new Set(BADGES.filter((b) => b.test(data.sessions, streaks)).map((b) => b.id));
    const nextSessions = [...data.sessions, session];
    const nextStreaks = computeStreaks(nextSessions);
    const nextBadges = BADGES.filter((b) => b.test(nextSessions, nextStreaks));
    const newlyUnlocked = nextBadges.find((b) => !prevBadges.has(b.id));
    persist({ ...data, sessions: nextSessions });
    if (newlyUnlocked) {
      showToast(`${newlyUnlocked.icon} Achievement unlocked — ${newlyUnlocked.label}`);
    } else {
      showToast(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }
  }, [data, streaks, persist]);

  const toggleFavorite = useCallback((topicId) => {
    const has = data.favorites.includes(topicId);
    const nextFav = has ? data.favorites.filter((id) => id !== topicId) : [...data.favorites, topicId];
    persist({ ...data, favorites: nextFav });
  }, [data, persist]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3600);
  }

  const [activeTopic, setActiveTopic] = useState(null);

  return (
    <div className="ss-root">
      <StyleSheet />
      <div className="ss-blob ss-blob-1" />
      <div className="ss-blob ss-blob-2" />

      <header className="ss-header">
        <div className="ss-brand">
          <span className="ss-brand-mark">
            <Mic size={18} />
          </span>
          <span className="ss-brand-name">SpeakSprint</span>
        </div>
        <nav className="ss-nav">
          <NavBtn active={view === "home"} onClick={() => setView("home")} icon={<Home size={16} />} label="Practice" />
          <NavBtn active={view === "library"} onClick={() => setView("library")} icon={<Library size={16} />} label="Library" />
          <NavBtn active={view === "dashboard"} onClick={() => setView("dashboard")} icon={<BarChart3 size={16} />} label="Dashboard" />
        </nav>
        <div className="ss-streak-pill" title="Current streak">
          <Flame size={15} color="var(--c-amber)" />
          <span>{streaks.current}</span>
        </div>
      </header>

      <main className="ss-main">
        {!loaded ? (
          <div className="ss-loading">Loading your progress…</div>
        ) : view === "home" ? (
          <PracticeView
            data={data}
            activeTopic={activeTopic}
            setActiveTopic={setActiveTopic}
            onComplete={addSession}
            favorites={data.favorites}
            toggleFavorite={toggleFavorite}
          />
        ) : view === "library" ? (
          <LibraryView
            data={data}
            favorites={data.favorites}
            toggleFavorite={toggleFavorite}
            onPractice={(topic) => { setActiveTopic(topic); setView("home"); }}
          />
        ) : (
          <DashboardView data={data} streaks={streaks} earnedBadgeIds={earnedBadgeIds} />
        )}
      </main>

      {toast && (
        <div className="ss-toast">
          <Sparkles size={15} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button className={`ss-navbtn ${active ? "is-active" : ""}`} onClick={onClick}>
      {icon}<span>{label}</span>
    </button>
  );
}

/* ----------------------------------------------------------------
   PRACTICE VIEW (topic -> prep -> speak -> reflect)
------------------------------------------------------------------*/
const PREP_SECONDS = 10 * 60;
const SPEAK_SECONDS = 5 * 60;

function PracticeView({ activeTopic, setActiveTopic, onComplete, favorites, toggleFavorite }) {
  const [phase, setPhase] = useState(activeTopic ? "prep" : "idle"); // idle | prep | speak | reflect
  const [filterMode, setFilterMode] = useState("random"); // random|technical|ai|behavioral|general|easy|medium|hard|interview
  const [topic, setTopic] = useState(activeTopic || null);
  const [notes, setNotes] = useState("");
  const [speakingElapsed, setSpeakingElapsed] = useState(0);

  useEffect(() => {
    if (activeTopic) { setTopic(activeTopic); setPhase("prep"); setActiveTopic(null); }
  }, [activeTopic, setActiveTopic]);

  function pickTopic() {
    let pool = TOPICS;
    if (filterMode === "interview") pool = TOPICS.filter((x) => x.interview);
    else if (["technical", "ai", "behavioral", "general"].includes(filterMode)) pool = TOPICS.filter((x) => x.category === filterMode);
    else if (["easy", "medium", "hard"].includes(filterMode)) pool = TOPICS.filter((x) => x.difficulty === filterMode);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setTopic(pick);
    setPhase("prep");
    setNotes("");
    setSpeakingElapsed(0);
  }

  function reset() {
    setPhase("idle"); setTopic(null); setNotes(""); setSpeakingElapsed(0);
  }

  if (phase === "idle") {
    return (
      <div className="ss-panel ss-center">
        <div className="ss-eyebrow">Speaking Gym</div>
        <h1 className="ss-h1">Ready for today's rep?</h1>
        <p className="ss-sub">Press start — you'll get a random topic, 10 minutes to prepare, and 5 minutes to speak it through.</p>

        <div className="ss-mode-grid">
          {["random", "technical", "ai", "behavioral", "general", "interview"].map((m) => (
            <button key={m} className={`ss-chip ${filterMode === m ? "is-active" : ""}`} onClick={() => setFilterMode(m)}>
              {m === "random" ? "Pure Random" : m === "ai" ? "Only AI" : m === "interview" ? "Interview Mode" : m === "behavioral" ? "Only HR" : `Only ${m[0].toUpperCase()}${m.slice(1)}`}
            </button>
          ))}
        </div>
        <div className="ss-mode-grid ss-mode-grid-sm">
          {["easy", "medium", "hard"].map((m) => (
            <button key={m} className={`ss-chip ss-chip-sm ${filterMode === m ? "is-active" : ""}`} onClick={() => setFilterMode(m)}>
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        <button className="ss-cta" onClick={pickTopic}>
          <Play size={18} /> Start Session
        </button>
      </div>
    );
  }

  if (phase === "prep") {
    return (
      <PrepPhase
        topic={topic}
        notes={notes}
        setNotes={setNotes}
        isFav={favorites.includes(topic.id)}
        onFav={() => toggleFavorite(topic.id)}
        onDone={() => setPhase("speak")}
      />
    );
  }

  if (phase === "speak") {
    return (
      <SpeakPhase
        topic={topic}
        onFinish={(elapsed) => { setSpeakingElapsed(elapsed); setPhase("reflect"); }}
      />
    );
  }

  return (
    <ReflectPhase
      topic={topic}
      speakingSeconds={speakingElapsed || SPEAK_SECONDS}
      onSave={(ratings, improvement) => {
        onComplete({
          id: `${Date.now()}`,
          date: new Date().toISOString(),
          topicId: topic.id,
          topicTitle: topic.title,
          category: topic.category,
          difficulty: topic.difficulty,
          speakingSeconds: speakingElapsed || SPEAK_SECONDS,
          ratings,
          improvement,
        });
        reset();
      }}
    />
  );
}

function PrepPhase({ topic, notes, setNotes, onDone, isFav, onFav }) {
  const [remaining, setRemaining] = useState(PREP_SECONDS);
  const ref = useRef();
  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(ref.current); onDone(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [onDone]);

  const pct = 1 - remaining / PREP_SECONDS;
  const meta = CATEGORY_META[topic.category];

  return (
    <div className="ss-panel">
      <div className="ss-topic-row">
        <span className="ss-badge" style={{ "--accent": meta.color }}>{meta.label}</span>
        <span className="ss-badge ss-badge-ghost">{topic.difficulty}</span>
        <button className="ss-star-btn" onClick={onFav} aria-label="Toggle favorite">
          <Star size={17} fill={isFav ? "var(--c-amber)" : "none"} color={isFav ? "var(--c-amber)" : "var(--text-dim)"} />
        </button>
      </div>
      <h2 className="ss-topic-title">{topic.title}</h2>
      <div className="ss-keywords">
        {topic.keywords.map((k) => <span key={k} className="ss-kw">{k}</span>)}
      </div>

      <div className="ss-prep-grid">
        <TimerRing seconds={remaining} totalSeconds={PREP_SECONDS} label="Preparation" pct={pct} />
        <div className="ss-notes-wrap">
          <div className="ss-notes-label">Scratch notes (not saved)</div>
          <textarea
            className="ss-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Jot a rough structure — intro, key points, example…"
          />
        </div>
      </div>

      <div className="ss-actions">
        <button className="ss-btn-ghost" onClick={onDone}>
          <SkipForward size={16} /> Skip to speaking
        </button>
      </div>
    </div>
  );
}

function SpeakPhase({ topic, onFinish }) {
  const [remaining, setRemaining] = useState(SPEAK_SECONDS);
  const [running, setRunning] = useState(true);
  const ref = useRef();

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(ref.current); onFinish(SPEAK_SECONDS); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running, onFinish]);

  useEffect(() => {
    function onKey(e) {
      if (e.code === "Space") { e.preventDefault(); setRunning((r) => !r); }
      if (e.code === "Escape") onFinish(SPEAK_SECONDS - remaining);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onFinish, remaining]);

  const pct = 1 - remaining / SPEAK_SECONDS;

  return (
    <div className="ss-panel ss-center ss-speak">
      <div className="ss-eyebrow">Speaking now — eyes up, not down</div>
      <h2 className="ss-topic-title ss-topic-title-lg">{topic.title}</h2>
      <TimerRing seconds={remaining} totalSeconds={SPEAK_SECONDS} label="Speaking" pct={pct} big low={remaining < 30} />
      <div className="ss-actions">
        <button className="ss-btn-ghost" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause size={16} /> : <Play size={16} />} {running ? "Pause" : "Resume"}
        </button>
        <button className="ss-btn-ghost" onClick={() => setRemaining(SPEAK_SECONDS)}>
          <RotateCcw size={16} /> Restart
        </button>
        <button className="ss-cta ss-cta-sm" onClick={() => onFinish(SPEAK_SECONDS - remaining)}>
          Finish Session
        </button>
      </div>
      <div className="ss-kbd-hint">Space = pause · Esc = finish</div>
    </div>
  );
}

function TimerRing({ seconds, totalSeconds, label, pct, big, low }) {
  const size = big ? 220 : 160;
  const stroke = big ? 10 : 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  return (
    <div className={`ss-ring-wrap ${big ? "ss-ring-wrap-big" : ""}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={low ? "var(--c-danger)" : "url(#ssGrad)"}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
        <defs>
          <linearGradient id="ssGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--c-violet)" />
            <stop offset="100%" stopColor="var(--c-cyan)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ss-ring-center">
        <span className={`ss-ring-time ${big ? "ss-ring-time-big" : ""}`}>{formatClock(seconds)}</span>
        <span className="ss-ring-label">{label}</span>
      </div>
    </div>
  );
}

function ReflectPhase({ topic, speakingSeconds, onSave }) {
  const [ratings, setRatings] = useState({ Confidence: 0, Clarity: 0, Knowledge: 0, Fluency: 0, Structure: 0 });
  const [improvement, setImprovement] = useState("");
  const canSave = Object.values(ratings).every((v) => v > 0);

  return (
    <div className="ss-panel">
      <div className="ss-eyebrow">Session complete</div>
      <h2 className="ss-topic-title">{topic.title}</h2>
      <p className="ss-sub">You spoke for {formatClock(speakingSeconds)}. Rate yourself honestly — it's how the ring moves.</p>

      <div className="ss-rating-grid">
        {Object.keys(ratings).map((key) => (
          <div key={key} className="ss-rating-row">
            <span className="ss-rating-label">{key}</span>
            <div className="ss-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRatings((r) => ({ ...r, [key]: n }))} aria-label={`${key} ${n} stars`}>
                  <Star size={19} fill={ratings[key] >= n ? "var(--c-amber)" : "none"} color={ratings[key] >= n ? "var(--c-amber)" : "var(--text-dim)"} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ss-notes-label">What could you improve next time?</div>
      <textarea
        className="ss-notes ss-notes-reflect"
        value={improvement}
        onChange={(e) => setImprovement(e.target.value)}
        placeholder="e.g. Slow down on the technical middle section, use a concrete example…"
      />

      <div className="ss-actions">
        <button className="ss-cta" disabled={!canSave} onClick={() => onSave(ratings, improvement)}>
          <Check size={16} /> Save & Finish
        </button>
      </div>
      {!canSave && <div className="ss-hint-dim">Rate all five categories to save.</div>}
    </div>
  );
}

/* ----------------------------------------------------------------
   LIBRARY VIEW
------------------------------------------------------------------*/
function LibraryView({ data, favorites, toggleFavorite, onPractice }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [onlyFav, setOnlyFav] = useState(false);

  const completedIds = useMemo(() => new Set(data.sessions.map((s) => s.topicId)), [data.sessions]);

  const filtered = TOPICS.filter((topic) => {
    if (cat !== "all" && topic.category !== cat) return false;
    if (onlyFav && !favorites.includes(topic.id)) return false;
    if (query && !topic.title.toLowerCase().includes(query.toLowerCase()) &&
        !topic.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="ss-panel">
      <div className="ss-eyebrow">Topic Library</div>
      <h1 className="ss-h1">{TOPICS.length} topics to work through</h1>

      <div className="ss-lib-controls">
        <div className="ss-search">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search topics or keywords…" />
        </div>
        <div className="ss-mode-grid ss-mode-grid-sm">
          {["all", "technical", "ai", "behavioral", "general"].map((c) => (
            <button key={c} className={`ss-chip ss-chip-sm ${cat === c ? "is-active" : ""}`} onClick={() => setCat(c)}>
              {c === "all" ? "All" : CATEGORY_META[c]?.label || c}
            </button>
          ))}
          <button className={`ss-chip ss-chip-sm ${onlyFav ? "is-active" : ""}`} onClick={() => setOnlyFav((v) => !v)}>
            <Star size={13} style={{ marginRight: 4 }} /> Favorites
          </button>
        </div>
      </div>

      <div className="ss-topic-grid">
        {filtered.map((topic) => {
          const meta = CATEGORY_META[topic.category];
          const done = completedIds.has(topic.id);
          const fav = favorites.includes(topic.id);
          return (
            <div key={topic.id} className="ss-topic-card" onClick={() => onPractice(topic)}>
              <div className="ss-topic-card-top">
                <span className="ss-badge ss-badge-sm" style={{ "--accent": meta.color }}>{meta.label}</span>
                <button className="ss-star-btn" onClick={(e) => { e.stopPropagation(); toggleFavorite(topic.id); }}>
                  <Star size={15} fill={fav ? "var(--c-amber)" : "none"} color={fav ? "var(--c-amber)" : "var(--text-dim)"} />
                </button>
              </div>
              <div className="ss-topic-card-title">{topic.title}</div>
              <div className="ss-topic-card-bottom">
                <span className="ss-badge-ghost ss-badge-sm">{topic.difficulty}</span>
                {done && <span className="ss-done-tag"><Check size={12} /> Practiced</span>}
              </div>
              <ChevronRight className="ss-topic-card-arrow" size={16} />
            </div>
          );
        })}
        {filtered.length === 0 && <div className="ss-hint-dim">No topics match — try a different search or filter.</div>}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   DASHBOARD VIEW
------------------------------------------------------------------*/
function DashboardView({ data, streaks, earnedBadgeIds }) {
  const sessions = data.sessions;
  const totalSessions = sessions.length;
  const totalMinutes = Math.round(sessions.reduce((a, s) => a + s.speakingSeconds, 0) / 60);

  const avgOverall = (s) => Object.values(s.ratings).reduce((a, b) => a + b, 0) / 5;

  const byCategory = useMemo(() => {
    const map = {};
    for (const s of sessions) {
      if (!map[s.category]) map[s.category] = { category: s.category, count: 0, ratingSum: 0 };
      map[s.category].count += 1;
      map[s.category].ratingSum += avgOverall(s);
    }
    return Object.values(map).map((c) => ({
      name: CATEGORY_META[c.category]?.label || c.category,
      sessions: c.count,
      avgRating: +(c.ratingSum / c.count).toFixed(2),
    }));
  }, [sessions]);

  const strongest = byCategory.length ? [...byCategory].sort((a, b) => b.avgRating - a.avgRating)[0] : null;
  const weakest = byCategory.length ? [...byCategory].sort((a, b) => a.avgRating - b.avgRating)[0] : null;

  const trend = sessions.slice(-12).map((s, i) => ({ name: `${i + 1}`, rating: +avgOverall(s).toFixed(2) }));

  const heatDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 69; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      const count = sessions.filter((s) => dayKey(s.date) === key).length;
      days.push({ key, count });
    }
    return days;
  }, [sessions]);

  const recent = [...sessions].reverse().slice(0, 6);
  const favTopics = TOPICS.filter((t) => data.favorites.includes(t.id));

  return (
    <div className="ss-panel">
      <div className="ss-eyebrow">Your Progress</div>
      <h1 className="ss-h1">Dashboard</h1>

      <div className="ss-stat-grid">
        <StatCard icon={<Flame size={18} color="var(--c-amber)" />} label="Current Streak" value={streaks.current} suffix="days" />
        <StatCard icon={<Trophy size={18} color="var(--c-amber)" />} label="Longest Streak" value={streaks.longest} suffix="days" />
        <StatCard icon={<Target size={18} color="var(--c-cyan)" />} label="Total Sessions" value={totalSessions} />
        <StatCard icon={<Clock size={18} color="var(--c-violet)" />} label="Speaking Minutes" value={totalMinutes} />
      </div>

      <div className="ss-grid-2">
        <div className="ss-card">
          <div className="ss-card-title">Consistency, last 10 weeks</div>
          <Heatmap days={heatDays} />
        </div>
        <div className="ss-card">
          <div className="ss-card-title">Category distribution</div>
          {byCategory.length === 0 ? <div className="ss-hint-dim">Complete a session to see this fill in.</div> : (
            <div style={{ width: "100%", height: 180 }}>
              <ResponsiveContainer>
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={11} />
                  <YAxis stroke="var(--text-dim)" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#151A26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="sessions" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--c-violet)" />
                      <stop offset="100%" stopColor="var(--c-cyan)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="ss-grid-2">
        <div className="ss-card">
          <div className="ss-card-title">Confidence trend (recent sessions)</div>
          {trend.length < 2 ? <div className="ss-hint-dim">Track a few more sessions to see a trend line.</div> : (
            <div style={{ width: "100%", height: 160 }}>
              <ResponsiveContainer>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={11} />
                  <YAxis domain={[0, 5]} stroke="var(--text-dim)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#151A26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="rating" stroke="var(--c-cyan)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="ss-card">
          <div className="ss-card-title">Strongest & weakest category</div>
          {!strongest ? <div className="ss-hint-dim">No data yet.</div> : (
            <div className="ss-strong-weak">
              <div className="ss-sw-row"><TrendingUp size={16} color="var(--c-green)" /><span>Strongest</span><b>{strongest.name}</b></div>
              <div className="ss-sw-row"><TrendingUp size={16} color="var(--c-danger)" style={{ transform: "scaleY(-1)" }} /><span>Weakest</span><b>{weakest.name}</b></div>
            </div>
          )}
        </div>
      </div>

      <div className="ss-card">
        <div className="ss-card-title">Achievements</div>
        <div className="ss-badge-grid">
          {BADGES.map((b) => {
            const earned = earnedBadgeIds.has(b.id);
            return (
              <div key={b.id} className={`ss-badge-card ${earned ? "is-earned" : ""}`}>
                <span className="ss-badge-icon">{earned ? b.icon : <Lock size={16} />}</span>
                <span className="ss-badge-name">{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ss-grid-2">
        <div className="ss-card">
          <div className="ss-card-title">Recent sessions</div>
          {recent.length === 0 ? <div className="ss-hint-dim">Nothing yet — go complete your first rep.</div> : (
            <div className="ss-recent-list">
              {recent.map((s) => (
                <div key={s.id} className="ss-recent-row">
                  <span className="ss-badge ss-badge-sm" style={{ "--accent": CATEGORY_META[s.category].color }}>{CATEGORY_META[s.category].label}</span>
                  <span className="ss-recent-title">{s.topicTitle}</span>
                  <span className="ss-recent-rating">{avgOverall(s).toFixed(1)}★</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="ss-card">
          <div className="ss-card-title">Favorite topics</div>
          {favTopics.length === 0 ? <div className="ss-hint-dim">Star topics in the library to pin them here.</div> : (
            <div className="ss-recent-list">
              {favTopics.map((t) => (
                <div key={t.id} className="ss-recent-row">
                  <span className="ss-badge ss-badge-sm" style={{ "--accent": CATEGORY_META[t.category].color }}>{CATEGORY_META[t.category].label}</span>
                  <span className="ss-recent-title">{t.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, suffix }) {
  return (
    <div className="ss-stat-card">
      <div className="ss-stat-icon">{icon}</div>
      <div className="ss-stat-value">{value}{suffix && <span className="ss-stat-suffix"> {suffix}</span>}</div>
      <div className="ss-stat-label">{label}</div>
    </div>
  );
}

function Heatmap({ days }) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return (
    <div className="ss-heatmap">
      {weeks.map((week, wi) => (
        <div key={wi} className="ss-heat-col">
          {week.map((d) => (
            <div key={d.key} className={`ss-heat-cell ${d.count > 0 ? "is-on" : ""}`} title={`${d.key}: ${d.count} session(s)`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------
   STYLES
------------------------------------------------------------------*/
function StyleSheet() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

      .ss-root {
        --bg: #0A0D14;
        --surface: rgba(255,255,255,0.045);
        --border: rgba(255,255,255,0.09);
        --text: #E9EBF2;
        --text-dim: #8B90A8;
        --c-violet: #8B7CFF;
        --c-cyan: #4FD8E0;
        --c-amber: #FFB454;
        --c-green: #3ED9A0;
        --c-danger: #FF6B6B;
        position: relative;
        min-height: 100%;
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', system-ui, sans-serif;
        overflow: hidden;
        border-radius: 16px;
      }
      .ss-root * { box-sizing: border-box; }
      .ss-blob { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.25; pointer-events: none; }
      .ss-blob-1 { width: 340px; height: 340px; background: var(--c-violet); top: -120px; left: -80px; }
      .ss-blob-2 { width: 300px; height: 300px; background: var(--c-cyan); bottom: -140px; right: -60px; }

      .ss-header {
        position: relative; z-index: 2;
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 22px; border-bottom: 1px solid var(--border);
        background: rgba(255,255,255,0.02); backdrop-filter: blur(12px);
      }
      .ss-brand { display: flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; }
      .ss-brand-mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--c-violet), var(--c-cyan)); color: #0A0D14; }
      .ss-nav { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); padding: 4px; border-radius: 999px; }
      .ss-navbtn { display: flex; align-items: center; gap: 6px; border: none; background: transparent; color: var(--text-dim); font-size: 13px; font-weight: 500; padding: 7px 14px; border-radius: 999px; cursor: pointer; transition: all 0.2s; }
      .ss-navbtn:hover { color: var(--text); }
      .ss-navbtn.is-active { background: linear-gradient(135deg, var(--c-violet), var(--c-cyan)); color: #0A0D14; }
      .ss-streak-pill { display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 13px; background: var(--surface); border: 1px solid var(--border); padding: 6px 12px; border-radius: 999px; }

      .ss-main { position: relative; z-index: 1; padding: 28px 22px 40px; max-width: 920px; margin: 0 auto; }
      .ss-loading { text-align: center; padding: 80px 0; color: var(--text-dim); }

      .ss-panel { animation: ssFadeUp 0.4s ease; }
      .ss-center { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 30px 10px; }
      @keyframes ssFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

      .ss-eyebrow { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--c-cyan); font-weight: 600; margin-bottom: 6px; }
      .ss-h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; margin: 0 0 10px; }
      .ss-sub { color: var(--text-dim); font-size: 14px; max-width: 480px; margin: 0 0 22px; line-height: 1.5; }

      .ss-mode-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 10px; }
      .ss-mode-grid-sm { margin-bottom: 20px; }
      .ss-chip { border: 1px solid var(--border); background: var(--surface); color: var(--text-dim); font-size: 13px; font-weight: 500; padding: 9px 16px; border-radius: 999px; cursor: pointer; transition: all 0.15s; }
      .ss-chip:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
      .ss-chip.is-active { color: #0A0D14; background: linear-gradient(135deg, var(--c-violet), var(--c-cyan)); border-color: transparent; }
      .ss-chip-sm { padding: 6px 12px; font-size: 12px; }

      .ss-cta { display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 15px; color: #0A0D14; background: linear-gradient(135deg, var(--c-violet), var(--c-cyan)); padding: 13px 26px; border-radius: 12px; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 8px 24px rgba(139,124,255,0.25); }
      .ss-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(139,124,255,0.35); }
      .ss-cta:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
      .ss-cta-sm { padding: 9px 18px; font-size: 13px; }

      .ss-btn-ghost { display: flex; align-items: center; gap: 6px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 13px; font-weight: 500; padding: 9px 16px; border-radius: 10px; cursor: pointer; transition: all 0.15s; }
      .ss-btn-ghost:hover { border-color: rgba(255,255,255,0.25); }

      .ss-topic-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
      .ss-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: color-mix(in srgb, var(--accent) 18%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent); }
      .ss-badge-sm { font-size: 10px; padding: 3px 8px; }
      .ss-badge-ghost { background: rgba(255,255,255,0.06); color: var(--text-dim); border: 1px solid var(--border); }
      .ss-star-btn { margin-left: auto; background: none; border: none; cursor: pointer; display: flex; padding: 4px; }
      .ss-topic-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 12px; }
      .ss-topic-title-lg { font-size: 26px; margin-bottom: 20px; }
      .ss-keywords { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 22px; }
      .ss-kw { font-size: 11px; color: var(--text-dim); background: rgba(255,255,255,0.05); border: 1px solid var(--border); padding: 3px 9px; border-radius: 6px; }

      .ss-prep-grid { display: grid; grid-template-columns: 200px 1fr; gap: 26px; align-items: start; }
      @media (max-width: 640px) { .ss-prep-grid { grid-template-columns: 1fr; justify-items: center; } }
      .ss-notes-wrap { width: 100%; }
      .ss-notes-label { font-size: 12px; color: var(--text-dim); margin-bottom: 6px; font-weight: 500; }
      .ss-notes { width: 100%; min-height: 150px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; color: var(--text); padding: 12px; font-size: 13px; font-family: inherit; resize: vertical; }
      .ss-notes:focus { outline: none; border-color: var(--c-cyan); }
      .ss-notes-reflect { min-height: 90px; margin-bottom: 22px; }

      .ss-ring-wrap { position: relative; display: inline-grid; place-items: center; }
      .ss-ring-wrap-big { margin: 10px 0 26px; }
      .ss-ring-center { position: absolute; display: flex; flex-direction: column; align-items: center; }
      .ss-ring-time { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums; }
      .ss-ring-time-big { font-size: 40px; }
      .ss-ring-label { font-size: 11px; color: var(--text-dim); margin-top: 2px; }

      .ss-speak { padding-top: 10px; }
      .ss-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 10px; }
      .ss-kbd-hint { margin-top: 14px; font-size: 11px; color: var(--text-dim); }

      .ss-rating-grid { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
      .ss-rating-row { display: flex; align-items: center; justify-content: space-between; background: var(--surface); border: 1px solid var(--border); padding: 10px 14px; border-radius: 10px; }
      .ss-rating-label { font-size: 13px; font-weight: 500; }
      .ss-stars { display: flex; gap: 3px; }
      .ss-stars button { background: none; border: none; cursor: pointer; padding: 2px; display: flex; }
      .ss-hint-dim { font-size: 12px; color: var(--text-dim); margin-top: 8px; text-align: center; }

      .ss-lib-controls { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
      .ss-search { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 9px 14px; color: var(--text-dim); }
      .ss-search input { flex: 1; background: none; border: none; color: var(--text); font-size: 14px; font-family: inherit; }
      .ss-search input:focus { outline: none; }
      .ss-topic-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
      .ss-topic-card { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px; cursor: pointer; transition: all 0.15s; }
      .ss-topic-card:hover { border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }
      .ss-topic-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
      .ss-topic-card-title { font-weight: 600; font-size: 14px; margin-bottom: 10px; padding-right: 16px; line-height: 1.35; }
      .ss-topic-card-bottom { display: flex; align-items: center; gap: 8px; }
      .ss-done-tag { display: flex; align-items: center; gap: 3px; font-size: 10px; color: var(--c-green); }
      .ss-topic-card-arrow { position: absolute; bottom: 14px; right: 14px; color: var(--text-dim); }

      .ss-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }
      .ss-stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
      .ss-stat-icon { margin-bottom: 8px; }
      .ss-stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; }
      .ss-stat-suffix { font-size: 12px; color: var(--text-dim); font-weight: 500; }
      .ss-stat-label { font-size: 12px; color: var(--text-dim); margin-top: 2px; }

      .ss-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
      @media (max-width: 700px) { .ss-grid-2 { grid-template-columns: 1fr; } }
      .ss-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
      .ss-card-title { font-size: 13px; font-weight: 600; color: var(--text-dim); margin-bottom: 12px; }

      .ss-heatmap { display: flex; gap: 3px; overflow-x: auto; }
      .ss-heat-col { display: flex; flex-direction: column; gap: 3px; }
      .ss-heat-cell { width: 11px; height: 11px; border-radius: 3px; background: rgba(255,255,255,0.06); }
      .ss-heat-cell.is-on { background: linear-gradient(135deg, var(--c-violet), var(--c-cyan)); }

      .ss-strong-weak { display: flex; flex-direction: column; gap: 10px; }
      .ss-sw-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-dim); }
      .ss-sw-row b { color: var(--text); margin-left: auto; }

      .ss-badge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
      .ss-badge-card { display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 10px; padding: 14px 8px; opacity: 0.45; }
      .ss-badge-card.is-earned { opacity: 1; border-color: color-mix(in srgb, var(--c-amber) 40%, transparent); background: color-mix(in srgb, var(--c-amber) 8%, transparent); }
      .ss-badge-icon { font-size: 20px; }
      .ss-badge-name { font-size: 11px; text-align: center; color: var(--text-dim); }
      .ss-badge-card.is-earned .ss-badge-name { color: var(--text); }

      .ss-recent-list { display: flex; flex-direction: column; gap: 8px; }
      .ss-recent-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
      .ss-recent-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ss-recent-rating { color: var(--c-amber); font-weight: 600; font-size: 12px; }

      .ss-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; background: #151A26; border: 1px solid rgba(255,255,255,0.15); padding: 12px 18px; border-radius: 12px; font-size: 13px; box-shadow: 0 12px 32px rgba(0,0,0,0.4); animation: ssToastIn 0.3s ease; z-index: 50; }
      @keyframes ssToastIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
    `}</style>
  );
}
