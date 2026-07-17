import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import {
  GitCompare,
  X,
  Plus,
  MapPin,
  Wallet,
  Briefcase,
  Award,
  TrendingUp,
  Home,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { COLLEGES, CUTOFFS, BRANCHES, getCollege, type College, type BranchCode } from "../data/dataset";
import { Button } from "../components/ui/button";
import { useApp } from "../context/AppContext";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981"];
const BRANCH_DEFAULT: BranchCode = "CS";

function CollegePicker({
  selected,
  onSelect,
  exclude,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  exclude: string[];
}) {
  const [q, setQ] = useState("");
  const available = COLLEGES.filter(
    (c) => !exclude.includes(c.id) && c.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <input
        type="text"
        placeholder="Search college name…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <ul className="max-h-52 overflow-auto space-y-1 pr-1">
        {available.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                selected === c.id ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950" : ""
              }`}
            >
              <span className="font-medium">{c.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">{c.code} · {c.location}</span>
            </button>
          </li>
        ))}
        {available.length === 0 && (
          <li className="py-4 text-center text-sm text-muted-foreground">No colleges found</li>
        )}
      </ul>
    </div>
  );
}

function Slot({
  index,
  college,
  color,
  onRemove,
  onAdd,
  allSelected,
  exclude,
}: {
  index: number;
  college: College | null;
  color: string;
  onRemove: () => void;
  onAdd: (id: string) => void;
  allSelected: string[];
  exclude: string[];
}) {
  const [picking, setPicking] = useState(false);

  if (!college) {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setPicking((p) => !p)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-indigo-400 hover:text-indigo-600"
        >
          <Plus className="size-4" /> Add College {index + 1}
        </button>
        {picking && (
          <CollegePicker
            selected={null}
            onSelect={(id) => { onAdd(id); setPicking(false); }}
            exclude={exclude}
          />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 bg-card shadow-sm" style={{ borderColor: color }}>
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full" style={{ background: color }} />
          <span className="text-xs font-medium rounded bg-muted px-1.5 py-0.5">{college.code}</span>
        </div>
        <button
          onClick={onRemove}
          className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="px-4 pb-4">
        <Link
          to={`/college/${college.id}`}
          className="font-semibold text-sm leading-snug hover:text-indigo-600 transition-colors"
        >
          {college.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" /> {college.location}
        </div>
      </div>
    </div>
  );
}

export function Compare() {
  const [searchParams] = useSearchParams();
  const { input } = useApp();

  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [branch, setBranch] = useState<BranchCode>(input?.branch ?? BRANCH_DEFAULT);

  // Pre-populate from URL params (?id=c1&id=c2)
  useEffect(() => {
    const ids = searchParams.getAll("id").slice(0, 3);
    if (ids.length > 0) {
      const newSlots: (string | null)[] = [null, null, null];
      ids.forEach((id, i) => { newSlots[i] = id; });
      setSlots(newSlots);
    }
  }, []);

  const colleges = slots.map((id) => (id ? getCollege(id) ?? null : null));
  const activeColleges = colleges.filter(Boolean) as College[];

  // Radar chart data
  const radarData = useMemo(() => {
    const metrics = [
      { key: "placement", label: "Placement %", max: 100 },
      { key: "avgPackage", label: "Avg Package", max: 15 },
      { key: "highestPackage", label: "Highest Pkg", max: 80 },
      { key: "feesScore", label: "Fees Score*", max: 100 },
      { key: "naacScore", label: "NAAC Grade", max: 5 },
    ];

    const naacMap: Record<string, number> = { "A++": 5, "A+": 4, "A": 3, "B++": 2, "B+": 1, B: 0.5 };

    return metrics.map((m) => {
      const row: Record<string, any> = { metric: m.label };
      activeColleges.forEach((c, i) => {
        let val = 0;
        if (m.key === "placement") val = (c.placementPercentage / m.max) * 100;
        else if (m.key === "avgPackage") val = (c.avgPackage / m.max) * 100;
        else if (m.key === "highestPackage") val = (c.highestPackage / m.max) * 100;
        else if (m.key === "feesScore") val = 100 - (c.fees / 400000) * 100; // lower fees = higher score
        else if (m.key === "naacScore") val = ((naacMap[c.naacGrade] ?? 1) / 5) * 100;
        row[`c${i}`] = Math.round(Math.max(0, Math.min(100, val)));
      });
      return row;
    });
  }, [activeColleges]);

  // Cutoff comparison bar chart
  const cutoffBarData = useMemo(() => {
    return ["2023", "2024", "2025"].map((yr) => {
      const row: Record<string, any> = { year: yr };
      activeColleges.forEach((c, i) => {
        const rec = CUTOFFS.find(
          (r) =>
            r.collegeId === c.id &&
            r.branch === branch &&
            r.category === (input?.category ?? "GM"),
        );
        row[`c${i}`] = rec?.years[parseInt(yr)] ?? 0;
      });
      return row;
    });
  }, [activeColleges, branch, input?.category]);

  // Comparison table rows
  const tableRows = [
    { label: "Location", get: (c: College) => <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{c.location}</span> },
    { label: "Type", get: (c: College) => c.type },
    { label: "NAAC Grade", get: (c: College) => <span className="flex items-center gap-1"><BadgeCheck className="size-3.5 text-indigo-500" />{c.naacGrade}</span> },
    { label: "Established", get: (c: College) => c.established },
    { label: "Annual Fees", get: (c: College) => <span className="flex items-center gap-1"><Wallet className="size-3.5" />₹{c.fees.toLocaleString("en-IN")}</span> },
    { label: "Hostel + Mess", get: (c: College) => c.hostel ? `₹${c.hostelFees.toLocaleString("en-IN")}` : "Not available" },
    { label: "Placement %", get: (c: College) => <span className="flex items-center gap-1"><Briefcase className="size-3.5 text-emerald-500" /><strong className="text-emerald-600">{c.placementPercentage}%</strong></span> },
    { label: "Avg Package", get: (c: College) => <span className="flex items-center gap-1"><Award className="size-3.5" />{c.avgPackage} LPA</span> },
    { label: "Highest Pkg", get: (c: College) => <span className="flex items-center gap-1"><TrendingUp className="size-3.5" />{c.highestPackage} LPA</span> },
    { label: "2025 Cutoff (GM)", get: (c: College) => {
      const rec = CUTOFFS.find(r => r.collegeId === c.id && r.branch === branch && r.category === "GM");
      return rec ? rec.years[2025].toLocaleString("en-IN") : "–";
    }},
    { label: "2024 Cutoff (GM)", get: (c: College) => {
      const rec = CUTOFFS.find(r => r.collegeId === c.id && r.branch === branch && r.category === "GM");
      return rec ? rec.years[2024].toLocaleString("en-IN") : "–";
    }},
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <GitCompare className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">College Comparison Tool</h1>
          <p className="text-sm text-muted-foreground">Compare up to 3 colleges side by side</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
        Fees, placements and cutoffs shown are <strong>approximate estimates</strong> for
        guidance only. Not affiliated with KEA.
      </div>

      {/* Branch selector */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">Cutoffs for branch:</span>
        {BRANCHES.map((b) => (
          <button
            key={b.code}
            onClick={() => setBranch(b.code)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              branch === b.code
                ? "bg-indigo-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {b.code}
          </button>
        ))}
      </div>

      {/* College slots */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {slots.map((id, i) => (
          <Slot
            key={i}
            index={i}
            college={colleges[i]}
            color={COLORS[i]}
            onRemove={() => setSlots((s) => { const n = [...s]; n[i] = null; return n; })}
            onAdd={(newId) => setSlots((s) => { const n = [...s]; n[i] = newId; return n; })}
            allSelected={slots.filter(Boolean) as string[]}
            exclude={slots.filter((s, si) => s !== null && si !== i) as string[]}
          />
        ))}
      </div>

      {activeColleges.length < 2 && (
        <div className="mt-10 rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <GitCompare className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3">Select at least 2 colleges to start comparing</p>
        </div>
      )}

      {activeColleges.length >= 2 && (
        <>
          {/* ── Radar chart ─────────────────────────────────────────────── */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-1 font-semibold">Multi-metric Radar Comparison</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              All metrics normalised to 0–100. Higher = better. *Fees Score: lower fees = higher score.
            </p>
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                {activeColleges.map((c, i) => (
                  <Radar
                    key={c.id}
                    name={c.name.split(" ").slice(0, 3).join(" ")}
                    dataKey={`c${i}`}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Cutoff trend bar chart ───────────────────────────────────── */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-1 font-semibold">
              Cutoff Comparison — {branch} · {input?.category ?? "GM"} (est.)
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              2023–2025 closing ranks. Lower rank = more competitive.
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={cutoffBarData} margin={{ left: -8, right: 8, top: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => [Number(v).toLocaleString("en-IN"), "Closing Rank"]} />
                <Legend />
                {activeColleges.map((c, i) => (
                  <Bar
                    key={c.id}
                    dataKey={`c${i}`}
                    name={c.name.split(" ").slice(0, 3).join(" ")}
                    fill={COLORS[i]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Comparison table ─────────────────────────────────────────── */}
          <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-5 font-semibold border-b border-border">Detailed Comparison</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="py-3 pl-5 text-left font-medium text-muted-foreground">Metric</th>
                    {activeColleges.map((c, i) => (
                      <th key={c.id} className="py-3 px-4 text-left font-medium" style={{ color: COLORS[i] }}>
                        {c.name.split(" ").slice(0, 3).join(" ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.label} className="border-b border-border/60 hover:bg-muted/20 transition-colors">
                      <td className="py-3 pl-5 text-muted-foreground font-medium">{row.label}</td>
                      {activeColleges.map((c) => (
                        <td key={c.id} className="py-3 px-4">
                          {row.get(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 text-[11px] text-muted-foreground">
              ⚠️ All data shown is approximate. Verify with official sources before making decisions.
            </div>
          </div>
        </>
      )}

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link to="/predict">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Run a college prediction
          </Button>
        </Link>
      </div>
    </div>
  );
}
