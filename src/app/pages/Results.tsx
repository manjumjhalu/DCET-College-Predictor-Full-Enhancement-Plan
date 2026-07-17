import { useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  ListChecks,
  ShieldCheck,
  Info,
  ArrowLeft,
  Trophy,
  Download,
  GitCompare,
  SlidersHorizontal,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { useApp } from "../context/AppContext";
import { groupByChance, type Chance } from "../lib/predictor";
import { CollegeCard } from "../components/CollegeCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { BRANCHES, LOCATIONS } from "../data/dataset";
import { toast } from "sonner";

const chanceMeta: { key: Chance; label: string; color: string; dot: string; desc: string }[] = [
  { key: "Safe", label: "Safe Colleges", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", desc: "≥82% admission probability" },
  { key: "High", label: "High Chance", color: "text-sky-600 dark:text-sky-400", dot: "bg-sky-500", desc: "62–81%" },
  { key: "Moderate", label: "Moderate Chance", color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", desc: "38–61%" },
  { key: "Dream", label: "Dream Colleges", color: "text-fuchsia-600 dark:text-fuchsia-400", dot: "bg-fuchsia-500", desc: "6–37%" },
];

const barColor: Record<Chance, string> = {
  Safe: "#10b981",
  High: "#0ea5e9",
  Moderate: "#f59e0b",
  Dream: "#d946ef",
};

export function Results() {
  const { input, results } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [locFilter, setLocFilter] = useState("Any");
  const [showFilters, setShowFilters] = useState(false);
  const [maxFees, setMaxFees] = useState(500000);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // ── Filter & group ─────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    results.filter((p) => {
      const q = query.toLowerCase();
      const matchSearch =
        p.collegeName.toLowerCase().includes(q) ||
        p.collegeCode.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      const matchLoc = locFilter === "Any" || p.location === locFilter;
      const matchFees = p.fees <= maxFees;
      return matchSearch && matchLoc && matchFees;
    }),
    [results, query, locFilter, maxFees],
  );

  const grouped = useMemo(() => groupByChance(filtered), [filtered]);
  const top10 = useMemo(() => filtered.slice(0, 10), [filtered]);

  const branchName = BRANCHES.find((b) => b.code === input?.branch)?.name ?? "";

  // ── Compare ────────────────────────────────────────────────────────────────
  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        toast.warning("You can compare up to 3 colleges at a time.");
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  function goToCompare() {
    const params = compareIds.map((id) => `id=${id}`).join("&");
    navigate(`/compare?${params}`);
  }

  // ── PDF download ───────────────────────────────────────────────────────────
  function downloadReport() {
    window.print();
  }

  // ── Chart data ─────────────────────────────────────────────────────────────
  const probChartData = top10.map((p) => ({
    name: p.collegeCode,
    probability: p.probability,
    chance: p.chance,
    college: p.collegeName,
  }));

  if (!input || results.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Info className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-semibold">No prediction yet</h1>
        <p className="mt-2 text-muted-foreground">
          Fill in your DCET rank, category and branch to see your recommended colleges.
        </p>
        <Link to="/predict" className="mt-6 inline-block">
          <Button className="bg-indigo-600 hover:bg-indigo-700">Go to prediction form</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* ── Print styles (hidden in screen) ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      {/* Back link */}
      <Link
        to="/predict"
        className="no-print inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Edit inputs
      </Link>

      {/* ── Title row ─────────────────────────────────────────────────── */}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your college predictions</h1>
          <p className="mt-1 text-muted-foreground">
            Rank{" "}
            <span className="font-semibold text-foreground">
              {input.rank.toLocaleString("en-IN")}
            </span>{" "}
            · {input.category} · {branchName}
            {input.location && input.location !== "Any" ? ` · ${input.location}` : ""}
            {" · "}Round {input.round ?? 1}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={downloadReport}>
            <Download className="size-3.5" /> Download PDF
          </Button>
          {compareIds.length > 0 && (
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={goToCompare}>
              <GitCompare className="size-3.5" /> Compare ({compareIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* ── Big disclaimer card ────────────────────────────────────────── */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 dark:border-amber-900 dark:bg-amber-950/40">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="text-sm text-amber-900 dark:text-amber-200">
          <strong className="block text-base">
            ⚠️ These are ESTIMATED probabilities — NOT guaranteed admissions
          </strong>
          The percentages shown reflect how your rank historically compares to
          closing ranks in these colleges. Actual DCET counseling outcomes depend on
          seat availability, the number of applicants, and KEA's counseling schedule.
          Always check{" "}
          <a
            href="https://kea.kar.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            kea.kar.nic.in
          </a>{" "}
          for official data.
        </div>
      </div>

      {/* ── Category summary pills ─────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap gap-2">
        {chanceMeta.map((m) => (
          <span
            key={m.key}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm"
          >
            <span className={`size-2 rounded-full ${m.dot}`} />
            <span className="font-medium">{m.label}</span>
            <span className="text-muted-foreground">{grouped[m.key].length}</span>
          </span>
        ))}
      </div>

      {/* ── Charts row ────────────────────────────────────────────────── */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Probability bar chart */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <Trophy className="size-4 text-indigo-600" /> Top 10 admission probabilities (est.)
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={probChartData} margin={{ left: -12, right: 8, top: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: any, _: any, props: any) => [
                  `${v}% (Estimate)`,
                  props.payload?.college ?? "Probability",
                ]}
              />
              <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
                {probChartData.map((d, i) => (
                  <Cell key={i} fill={barColor[d.chance as Chance]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Option entry order */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <ListChecks className="size-4 text-indigo-600" /> Suggested option entry order
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            List Dream colleges first (max aspirations) and Safe colleges last (guaranteed
            backup) in KEA's counseling option entry.
          </p>
          <ol className="max-h-[220px] space-y-1.5 overflow-auto pr-1">
            {[
              ...grouped.Dream,
              ...grouped.Moderate,
              ...grouped.High,
              ...grouped.Safe,
            ]
              .slice(0, 15)
              .map((p, i) => (
                <li
                  key={`${p.collegeId}-${p.branch}`}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-1.5 text-sm"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="truncate">
                    <span className="font-medium">{p.collegeCode}</span>
                    <span className="ml-1 text-muted-foreground">· {p.collegeName}</span>
                  </span>
                  <span className="ml-auto shrink-0 font-semibold" style={{ color: barColor[p.chance] }}>
                    {p.probability}%
                  </span>
                </li>
              ))}
          </ol>
        </div>
      </div>

      {/* ── Search & filters ──────────────────────────────────────────── */}
      <div className="no-print mt-8 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by college name, code or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters((f) => !f)}
          className={showFilters ? "bg-accent" : ""}
        >
          <SlidersHorizontal className="size-3.5" /> Filters
        </Button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="no-print mt-3 flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Location</label>
            <select
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            >
              <option value="Any">Any location</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Max annual fees: ₹{(maxFees / 1000).toFixed(0)}k
            </label>
            <input
              type="range"
              min={50000}
              max={400000}
              step={10000}
              value={maxFees}
              onChange={(e) => setMaxFees(Number(e.target.value))}
              className="w-40 accent-indigo-600"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setLocFilter("Any"); setMaxFees(500000); setQuery(""); }}
          >
            Reset filters
          </Button>
        </div>
      )}

      {/* ── Grouped sections ──────────────────────────────────────────── */}
      <div className="mt-6 space-y-10">
        {chanceMeta.map((m) => {
          const items = grouped[m.key];
          if (items.length === 0) return null;
          return (
            <section key={m.key}>
              <div className="mb-4 flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${m.dot}`} />
                <h2 className={`text-xl font-bold ${m.color}`}>{m.label}</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {items.length} college{items.length !== 1 ? "s" : ""}
                </span>
                <span className="text-xs text-muted-foreground ml-1">— {m.desc}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <CollegeCard
                    key={`${p.collegeId}-${p.branch}`}
                    p={p}
                    onAddToCompare={toggleCompare}
                    inCompare={compareIds.includes(p.collegeId)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            No colleges match your filters.{" "}
            <button
              onClick={() => { setQuery(""); setLocFilter("Any"); setMaxFees(500000); }}
              className="underline hover:text-foreground"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom disclaimer ─────────────────────────────────────────── */}
      <div className="mt-10 flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        <ShieldCheck className="size-4" />
        <strong>All probabilities shown are estimates only.</strong> Use this as a planning
        guide, not an official admission decision.
      </div>
    </div>
  );
}
