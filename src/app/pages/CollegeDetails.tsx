import { Link, useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Briefcase,
  TrendingUp,
  Home,
  Award,
  Building2,
  BadgeCheck,
  ExternalLink,
  GitCompare,
  GraduationCap,
  Calendar,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { COLLEGES, CUTOFFS, YEARS, BRANCHES, getCollege, type Category } from "../data/dataset";
import { Button } from "../components/ui/button";
import { useApp } from "../context/AppContext";

const LINE_COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#d946ef", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const ALL_CATS: Category[] = ["GM", "2A", "2B", "3A", "3B", "1G", "SC", "ST"];

export function CollegeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { input } = useApp();
  const college = id ? getCollege(id) : undefined;

  if (!college) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">College not found</h1>
        <Link to="/results" className="mt-4 inline-block">
          <Button variant="outline">Back to results</Button>
        </Link>
      </div>
    );
  }

  // GM cutoff history per branch for the trend chart
  const branchRecords = CUTOFFS.filter(
    (r) => r.collegeId === college.id && r.category === "GM",
  );
  const trendChartData = YEARS.map((y) => {
    const row: Record<string, number | string> = { year: y.toString() };
    branchRecords.forEach((r) => { row[r.branch] = r.years[y]; });
    return row;
  });

  // Category-wise cutoffs for the selected branch (from prediction or default CS)
  const selectedBranch = input?.branch ?? "CS";
  const catCutoffData = ALL_CATS.map((cat) => {
    const rec = CUTOFFS.find(
      (r) => r.collegeId === college.id && r.branch === selectedBranch && r.category === cat,
    );
    return {
      cat,
      y2023: rec?.years[2023] ?? 0,
      y2024: rec?.years[2024] ?? 0,
      y2025: rec?.years[2025] ?? 0,
    };
  });

  const keyStats = [
    { icon: Wallet, label: "Annual tuition", value: `₹${college.fees.toLocaleString("en-IN")}` },
    { icon: Home, label: "Hostel + mess", value: college.hostel ? `₹${college.hostelFees.toLocaleString("en-IN")}` : "Not available" },
    { icon: Briefcase, label: "Placement rate", value: `${college.placementPercentage}%` },
    { icon: Award, label: "Average package", value: `${college.avgPackage} LPA` },
    { icon: TrendingUp, label: "Highest package", value: `${college.highestPackage} LPA` },
    { icon: BadgeCheck, label: "NAAC grade", value: college.naacGrade },
    { icon: Calendar, label: "Established", value: college.established },
    { icon: Building2, label: "Type", value: college.type },
  ];

  // Nearby colleges (same city, different college)
  const nearby = COLLEGES.filter(
    (c) => c.location === college.location && c.id !== college.id,
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Back */}
      <Link
        to="/results"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to results
      </Link>

      {/* ── College hero card ────────────────────────────────────────────── */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border shadow-md">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-700 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-indigo-100">
            <span className="rounded bg-white/20 px-2 py-0.5 font-bold">{college.code}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {college.location}, Karnataka
            </span>
            <span>· Est. {college.established}</span>
            <span className="rounded bg-white/10 px-2 py-0.5">{college.type}</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{college.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-indigo-100 leading-relaxed">
            A <strong>NAAC {college.naacGrade}</strong> accredited engineering institution
            in {college.location}, Karnataka. Affiliated to{" "}
            <strong>{college.affiliation}</strong>. Admits DCET lateral-entry students
            across {BRANCHES.length} branches.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={college.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                <ExternalLink className="size-3.5" /> Official Website
              </Button>
            </a>
            <Button
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate(`/compare?id=${college.id}`)}
            >
              <GitCompare className="size-3.5" /> Compare College
            </Button>
            <Link to="/predict">
              <Button size="sm" className="bg-white text-indigo-700 hover:bg-indigo-50">
                <GraduationCap className="size-3.5" /> Run Prediction
              </Button>
            </Link>
          </div>
        </div>

        {/* Key stats grid */}
        <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4">
          {keyStats.map((s) => (
            <div key={s.label} className="p-4">
              <s.icon className="size-4 text-indigo-600" />
              <div className="mt-2 text-lg font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Disclaimer ──────────────────────────────────────────────────── */}
      <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
        Fees, placement and cutoff data shown are <strong>approximate figures</strong> for
        guidance. Verify with the college directly and{" "}
        <a href="https://kea.kar.nic.in" target="_blank" rel="noopener noreferrer" className="underline">
          kea.kar.nic.in
        </a>{" "}
        before making decisions.
      </div>

      {/* ── Branch-wise GM cutoff trend chart ───────────────────────────── */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <TrendingUp className="size-4 text-indigo-600" /> Branch-wise cutoff trends (GM — closing rank)
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Lower closing rank = more competitive. Data 2021–2025. Approximate figures — see disclaimer.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={trendChartData} margin={{ left: -6, right: 8, top: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: any) => [Number(v).toLocaleString("en-IN"), "Closing Rank"]} />
            <Legend />
            {branchRecords.map((r, i) => (
              <Line
                key={r.branch}
                type="monotone"
                dataKey={r.branch}
                stroke={LINE_COLORS[i % LINE_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 2.5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Category-wise cutoffs bar chart ─────────────────────────────── */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <BarChart3 className="size-4 text-indigo-600" /> Category-wise cutoffs — {selectedBranch} (2023–2025)
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Closing ranks per category. Higher value = more relaxed cutoff.
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={catCutoffData} margin={{ left: -8, right: 8, top: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="cat" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any) => [Number(v).toLocaleString("en-IN"), "Closing Rank"]} />
            <Legend />
            <Bar dataKey="y2023" name="2023" fill="#818cf8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="y2024" name="2024" fill="#6366f1" radius={[3, 3, 0, 0]} />
            <Bar dataKey="y2025" name="2025" fill="#4338ca" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Branches + latest cutoffs table ─────────────────────────────── */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2 font-semibold">
          <Building2 className="size-4 text-indigo-600" /> Branches & 2025 closing ranks
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Branch</th>
                <th className="py-2 pr-4 font-medium">Code</th>
                <th className="py-2 pr-4 font-medium">GM</th>
                <th className="py-2 pr-4 font-medium">2A</th>
                <th className="py-2 pr-4 font-medium">SC</th>
                <th className="py-2 font-medium">ST</th>
              </tr>
            </thead>
            <tbody>
              {BRANCHES.map((b) => {
                const getCutoff = (cat: Category) =>
                  CUTOFFS.find(
                    (r) => r.collegeId === college.id && r.branch === b.code && r.category === cat,
                  )?.years[2025];

                return (
                  <tr key={b.code} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pr-4">{b.name}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground font-medium">{b.code}</td>
                    <td className="py-2.5 pr-4 font-medium">{getCutoff("GM")?.toLocaleString("en-IN") ?? "–"}</td>
                    <td className="py-2.5 pr-4">{getCutoff("2A")?.toLocaleString("en-IN") ?? "–"}</td>
                    <td className="py-2.5 pr-4">{getCutoff("SC")?.toLocaleString("en-IN") ?? "–"}</td>
                    <td className="py-2.5">{getCutoff("ST")?.toLocaleString("en-IN") ?? "–"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          ⚠️ All cutoff values are approximate estimates. Not official KEA data.
        </p>
      </div>

      {/* ── Nearby colleges ─────────────────────────────────────────────── */}
      {nearby.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-4 font-semibold">Other colleges in {college.location}</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {nearby.map((nc) => (
              <Link
                key={nc.id}
                to={`/college/${nc.id}`}
                className="rounded-xl border border-border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="text-xs font-medium text-muted-foreground">{nc.code}</div>
                <div className="mt-1 text-sm font-semibold line-clamp-2 hover:text-indigo-600">
                  {nc.name}
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{nc.placementPercentage}% placed</span>
                  <span>{nc.naacGrade}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to="/predict">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Run a new prediction
          </Button>
        </Link>
      </div>
    </div>
  );
}
