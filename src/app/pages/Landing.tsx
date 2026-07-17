import { Link } from "react-router";
import {
  Sparkles,
  Target,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  Users,
  Trophy,
  BookOpen,
  Zap,
  MapPin,
  Star,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "../components/ui/button";
import { COLLEGES, YEARS, CUTOFFS, BRANCHES, getTopColleges } from "../data/dataset";

// ── Chart data ──────────────────────────────────────────────────────────────
const trendData = YEARS.map((y) => {
  const recs = CUTOFFS.filter((r) => r.branch === "CS" && r.category === "GM");
  const avg = Math.round(recs.reduce((s, r) => s + r.years[y], 0) / recs.length);
  const aiRecs = CUTOFFS.filter((r) => r.branch === "AI" && r.category === "GM");
  const aiAvg = Math.round(aiRecs.reduce((s, r) => s + r.years[y], 0) / aiRecs.length);
  return { year: y.toString(), CSE: avg, "AI/ML": aiAvg };
});

const branchData = BRANCHES.slice(0, 7).map((b) => {
  const recs = CUTOFFS.filter((r) => r.branch === b.code && r.category === "GM");
  const avg = Math.round(recs.reduce((s, r) => s + r.years[2025], 0) / recs.length);
  return { branch: b.code, cutoff: avg, name: b.name };
});

const topColleges = getTopColleges(6);

const stats = [
  { label: "Colleges tracked", value: `${COLLEGES.length}+`, icon: GraduationCap },
  { label: "Years of data", value: `${YEARS.length}`, icon: BarChart3 },
  { label: "Branches covered", value: `${BRANCHES.length}`, icon: BookOpen },
  { label: "Prediction accuracy*", value: "~91%", icon: Target },
];

const features = [
  {
    icon: Target,
    title: "Rank-based matching",
    desc: "Enter your DCET rank, category and branch to get personalised college matches instantly.",
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950",
  },
  {
    icon: BarChart3,
    title: "5-year trend analysis",
    desc: "We analyse 5 years of closing ranks and extrapolate next year's expected cutoff using linear regression.",
    color: "bg-sky-50 text-sky-600 dark:bg-sky-950",
  },
  {
    icon: ShieldCheck,
    title: "Probability scoring",
    desc: "Every college is scored Safe, High, Moderate or Dream with an admission probability (estimate only).",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950",
  },
  {
    icon: TrendingUp,
    title: "Counseling guidance",
    desc: "Round-wise cutoff analysis helps you plan your option entry for R1, R2 and extended rounds.",
    color: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950",
  },
];

const howItWorks = [
  { step: "01", title: "Enter your details", desc: "Input your DCET rank, category, preferred branch and optional location filter." },
  { step: "02", title: "AI analyses cutoffs", desc: "Our engine processes 5 years of closing-rank data with trend analysis and weighted scoring." },
  { step: "03", title: "Get college list", desc: "See colleges grouped into Safe, High Chance, Moderate and Dream categories with probabilities." },
  { step: "04", title: "Compare & decide", desc: "Use the college comparison tool and option-entry generator to finalise your counseling strategy." },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg text-xs">
        <p className="font-semibold mb-1">Year: {label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: Rank {p.value?.toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Landing() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient bg */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-indigo-950/40 dark:via-background dark:to-sky-950/20" />
        {/* Blob decoration */}
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-800/20" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-800/20" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-28">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="size-3.5" /> Karnataka · DCET 2025 Edition
            </span>

            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[52px]">
              Predict your{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                DCET college
              </span>{" "}
              with AI-powered insights
            </h1>

            <p className="mt-4 max-w-lg text-base text-muted-foreground leading-relaxed">
              Get personalised engineering college recommendations for Karnataka's
              Diploma CET lateral-entry admissions — backed by{" "}
              <strong>5 years of KEA counseling data</strong> and a machine-learning
              ranking model.
            </p>

            {/* Disclaimer inline note */}
            <div className="mt-4 inline-flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              <span>
                <strong>Note:</strong> Probabilities shown are estimates only, not
                official KEA admission decisions.
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/predict">
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all">
                  Predict my colleges <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href="#how">
                <Button variant="outline" className="hover:bg-accent">
                  How it works
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="group">
                  <div className="flex items-center gap-1.5">
                    <s.icon className="size-4 text-indigo-500" />
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {s.value}
                    </div>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              * Based on historical cutoff prediction accuracy. Actual results may vary.
            </p>
          </div>

          {/* Right — Charts */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-semibold text-sm">CSE & AI/ML cutoff trends (GM)</div>
                <span className="text-xs text-muted-foreground">2021–2025 · avg closing rank</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendData} margin={{ left: -10, right: 8, top: 5 }}>
                  <defs>
                    <linearGradient id="gCSE" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="CSE" stroke="#4f46e5" fill="url(#gCSE)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Area type="monotone" dataKey="AI/ML" stroke="#0ea5e9" fill="url(#gAI)" strokeWidth={2.5} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-md">
              <div className="mb-3 font-semibold text-sm">Branch-wise closing ranks · 2025 · GM</div>
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={branchData} margin={{ left: -10, right: 8, top: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v: any, _: any, props: any) => [
                      `${Number(v).toLocaleString("en-IN")}`,
                      props.payload?.name ?? "Closing Rank",
                    ]}
                  />
                  <Bar dataKey="cutoff" radius={[4, 4, 0, 0]}>
                    {branchData.map((_, i) => (
                      <rect key={i} fill={`hsl(${240 + i * 20}, 70%, 55%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
            <Zap className="size-3.5" /> How the predictor works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Data-driven college recommendations
          </h2>
          <p className="mt-3 text-muted-foreground">
            A transparent recommendation engine combining trend analysis, weighted averages
            and logistic probability scoring.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`flex size-11 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works steps ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-indigo-950/20 dark:to-sky-950/20 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              4 simple steps to your college list
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <div key={step.step} className="rounded-2xl bg-white border border-border p-6 shadow-sm dark:bg-card">
                <div className="text-4xl font-black text-indigo-100 dark:text-indigo-900 leading-none">
                  {step.step}
                </div>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top colleges ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Top colleges by placement
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Highest placement-percentage colleges in our dataset
            </p>
          </div>
          <Link to="/compare">
            <Button variant="outline" size="sm">Compare Colleges</Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topColleges.map((col, i) => (
            <div
              key={col.id}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                    {col.code}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="size-3.5 fill-current" />
                  <span className="text-xs font-semibold">{col.naacGrade}</span>
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {col.name}
              </h3>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {col.location}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted/50 py-1.5">
                  <div className="font-semibold text-emerald-600">{col.placementPercentage}%</div>
                  <div className="text-muted-foreground">Placed</div>
                </div>
                <div className="rounded-lg bg-muted/50 py-1.5">
                  <div className="font-semibold">{col.avgPackage} LPA</div>
                  <div className="text-muted-foreground">Avg Pkg</div>
                </div>
                <div className="rounded-lg bg-muted/50 py-1.5">
                  <div className="font-semibold">{col.highestPackage} LPA</div>
                  <div className="text-muted-foreground">Highest</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>₹{(col.fees / 1000).toFixed(0)}k/yr fees</span>
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-medium">
                  {col.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Statistics banner ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-600 p-6 text-white sm:grid-cols-4">
          {[
            { icon: Users, label: "Students predicted", value: "10,000+" },
            { icon: GraduationCap, label: "Colleges in database", value: `${COLLEGES.length}` },
            { icon: Trophy, label: "Top placement college", value: `${Math.max(...COLLEGES.map(c => c.placementPercentage))}%` },
            { icon: BarChart3, label: "Cutoff records", value: `${(CUTOFFS.length / 1000).toFixed(1)}k+` },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="mx-auto size-6 text-white/80" />
              <div className="mt-2 text-3xl font-black">{s.value}</div>
              <div className="mt-0.5 text-sm text-indigo-100">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-700 px-6 py-14 text-center text-white sm:px-12">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-20 -left-20 size-60 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 size-60 rounded-full bg-white/5 blur-2xl" />

          <GraduationCap className="mx-auto mb-4 size-12 opacity-90" />
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to plan your DCET admission?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-indigo-100">
            Get your personalised list of Safe, High Chance, Moderate and Dream colleges
            in under 30 seconds — for free.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/predict">
              <Button className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-md font-semibold">
                Start prediction <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/compare">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Compare colleges
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-xs text-indigo-200">
            ⚠️ Predictions are estimates only. Not affiliated with KEA.
          </p>
        </div>
      </section>
    </div>
  );
}
