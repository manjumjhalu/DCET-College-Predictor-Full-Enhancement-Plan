import { Link } from "react-router";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Wallet,
  Briefcase,
  Award,
  ArrowUpRight,
  Home,
  BadgeCheck,
  Lightbulb,
  GitCompare,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from "recharts";
import type { Chance, Prediction } from "../lib/predictor";
import { Progress } from "./ui/progress";

const chanceStyles: Record<
  Chance,
  { ring: string; text: string; bar: string; badge: string; bg: string }
> = {
  Safe: {
    ring: "border-emerald-200 dark:border-emerald-900",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "[&>div]:bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    bg: "from-emerald-50 dark:from-emerald-950/20",
  },
  High: {
    ring: "border-sky-200 dark:border-sky-900",
    text: "text-sky-600 dark:text-sky-400",
    bar: "[&>div]:bg-sky-500",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
    bg: "from-sky-50 dark:from-sky-950/20",
  },
  Moderate: {
    ring: "border-amber-200 dark:border-amber-900",
    text: "text-amber-600 dark:text-amber-400",
    bar: "[&>div]:bg-amber-500",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    bg: "from-amber-50 dark:from-amber-950/20",
  },
  Dream: {
    ring: "border-fuchsia-200 dark:border-fuchsia-900",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    bar: "[&>div]:bg-fuchsia-500",
    badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-400",
    bg: "from-fuchsia-50 dark:from-fuchsia-950/20",
  },
};

const trendIcon = {
  rising: <TrendingUp className="size-3.5 text-rose-500" />,
  falling: <TrendingDown className="size-3.5 text-emerald-500" />,
  stable: <Minus className="size-3.5 text-muted-foreground" />,
};

const trendLabel = {
  rising: "Cutoffs rising",
  falling: "Cutoffs easing",
  stable: "Stable trend",
};

const trendColor = {
  rising: "#ef4444",
  falling: "#10b981",
  stable: "#6366f1",
};

interface CollegeCardProps {
  p: Prediction;
  onAddToCompare?: (id: string) => void;
  inCompare?: boolean;
}

export function CollegeCard({ p, onAddToCompare, inCompare }: CollegeCardProps) {
  const s = chanceStyles[p.chance];
  const sparkData = p.history.map((h) => ({ rank: h.closingRank }));

  return (
    <div
      className={`group relative rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${s.ring}`}
    >
      {/* Gradient top accent */}
      <div className={`h-1 rounded-t-2xl bg-gradient-to-r ${
        p.chance === "Safe" ? "from-emerald-400 to-emerald-600" :
        p.chance === "High" ? "from-sky-400 to-sky-600" :
        p.chance === "Moderate" ? "from-amber-400 to-amber-600" :
        "from-fuchsia-400 to-fuchsia-600"
      }`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-1.5 py-0.5 font-medium">{p.collegeCode}</span>
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="size-3" /> {p.location}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.badge}`}>
                {p.type}
              </span>
            </div>
            <Link
              to={`/college/${p.collegeId}`}
              className="mt-1.5 block line-clamp-2 font-semibold leading-snug hover:text-indigo-600 transition-colors"
            >
              {p.collegeName}
            </Link>
            <div className="mt-1 text-xs text-muted-foreground">{p.branchName}</div>
          </div>

          {/* Probability */}
          <div className="shrink-0 text-right">
            <div className={`text-2xl font-black ${s.text}`}>{p.probability}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Est. chance
            </div>
            <div className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.badge}`}>
              {p.chance}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <Progress value={p.probability} className={`h-1.5 ${s.bar}`} />
        </div>

        {/* Sparkline + cutoff stats */}
        <div className="mt-4 flex items-start gap-3">
          {/* Mini sparkline */}
          <div className="shrink-0" style={{ width: 80, height: 40 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="rank"
                  stroke={trendColor[p.trend]}
                  strokeWidth={1.5}
                  dot={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="rounded bg-card border border-border px-2 py-1 text-[10px]">
                          Rank: {payload[0].value?.toLocaleString("en-IN")}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cutoff stats */}
          <div className="grid flex-1 grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-muted/50 py-1.5">
              <div className="font-semibold">{p.prevCutoff.toLocaleString("en-IN")}</div>
              <div className="text-[10px] text-muted-foreground">2025 Cutoff</div>
            </div>
            <div className="rounded-lg bg-muted/50 py-1.5">
              <div className="font-semibold inline-flex items-center gap-0.5">
                {p.predictedCutoff.toLocaleString("en-IN")}
                {trendIcon[p.trend]}
              </div>
              <div className="text-[10px] text-muted-foreground">Predicted</div>
            </div>
            <div className="rounded-lg bg-muted/50 py-1.5">
              <div className="font-semibold">{p.weightedCutoff.toLocaleString("en-IN")}</div>
              <div className="text-[10px] text-muted-foreground">Weighted Avg</div>
            </div>
          </div>
        </div>

        {/* Trend label */}
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          {trendIcon[p.trend]}
          <span>{trendLabel[p.trend]}</span>
          <span className="ml-auto flex items-center gap-1 text-[10px]">
            <BadgeCheck className="size-3 text-indigo-500" /> NAAC {p.naacGrade}
          </span>
        </div>

        {/* Bottom stats row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Wallet className="size-3.5" />₹{(p.fees / 1000).toFixed(0)}k/yr
          </span>
          {p.hostelFees > 0 && (
            <span className="inline-flex items-center gap-1">
              <Home className="size-3.5" />₹{(p.hostelFees / 1000).toFixed(0)}k hostel
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Briefcase className="size-3.5" />{p.placementPercentage}% placed
          </span>
          <span className="inline-flex items-center gap-1">
            <Award className="size-3.5" />{p.avgPackage} LPA avg
          </span>
          <div className="ml-auto flex items-center gap-2">
            {onAddToCompare && (
              <button
                onClick={() => onAddToCompare(p.collegeId)}
                className={`inline-flex items-center gap-0.5 text-[10px] font-medium transition-colors ${
                  inCompare
                    ? "text-indigo-600"
                    : "text-muted-foreground hover:text-indigo-600"
                }`}
                title={inCompare ? "Added to compare" : "Add to compare"}
              >
                <GitCompare className="size-3" />
                {inCompare ? "Added" : "Compare"}
              </button>
            )}
            <Link
              to={`/college/${p.collegeId}`}
              className="inline-flex items-center gap-0.5 font-medium text-indigo-600 hover:underline"
            >
              Details <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Counseling tip */}
        {p.counselingTip && (
          <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
            <Lightbulb className="mt-0.5 size-3 shrink-0 text-amber-500" />
            {p.counselingTip}
          </div>
        )}
      </div>
    </div>
  );
}
