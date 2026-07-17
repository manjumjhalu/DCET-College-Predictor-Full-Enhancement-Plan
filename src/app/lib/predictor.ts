// -----------------------------------------------------------------------------
// DCET College Predictor — Recommendation Engine
//
// Client-side equivalent of the FastAPI + RandomForestClassifier backend.
// The prediction pipeline mirrors the ML service:
//   1. Filter cutoff records by branch + category (+ optional location)
//   2. Trend analysis over 5 years (linear regression)
//   3. Weighted average cutoff (exponentially weighted, recent = higher weight)
//   4. Predicted next-year cutoff via least-squares extrapolation
//   5. Admission probability via logistic function of rank margin
//   6. Classify into Safe / High Chance / Moderate / Dream
//
// ⚠️  NOTE: Probabilities are STATISTICAL ESTIMATES, not guarantees.
// -----------------------------------------------------------------------------

import {
  COLLEGES,
  CUTOFFS,
  YEARS,
  getCollege,
  getTopColleges,
  type BranchCode,
  type Category,
  type Location,
  type College,
} from "../data/dataset";

export type { BranchCode, Category } from "../data/dataset";

export interface PredictionInput {
  rank: number;
  category: Category;
  branch: BranchCode;
  location?: Location | "Any";
  round?: number;        // 1 = Round 1, 2 = Round 2, 3 = Extended
  gender?: string;
}

export type Chance = "Safe" | "High" | "Moderate" | "Dream";

export interface Prediction {
  collegeId: string;
  collegeName: string;
  collegeCode: string;
  branch: BranchCode;
  branchName: string;
  location: Location;
  fees: number;
  hostelFees: number;
  placementPercentage: number;
  avgPackage: number;
  highestPackage: number;
  naacGrade: string;
  type: College["type"];
  probability: number;       // 0..100 — ESTIMATE ONLY
  chance: Chance;
  prevCutoff: number;        // most recent year closing rank
  weightedCutoff: number;
  predictedCutoff: number;
  trend: "rising" | "falling" | "stable"; // closing-rank trend
  history: { year: number; closingRank: number }[];
  counselingTip: string;
}

export interface ComparisonResult {
  college: College;
  prediction?: Prediction;
  cutoffs: { category: Category; year2023: number; year2024: number; year2025: number }[];
}

const BRANCH_NAMES: Record<string, string> = {
  CS: "Computer Science & Engineering",
  IS: "Information Science & Engineering",
  EC: "Electronics & Communication",
  EE: "Electrical & Electronics",
  ME: "Mechanical Engineering",
  CV: "Civil Engineering",
  AI: "Artificial Intelligence & ML",
  CD: "Computer Science (Data Science)",
  CY: "Computer Science (Cyber Security)",
};

// ---------------------------------------------------------------------------
// Statistical helpers
// ---------------------------------------------------------------------------

/** Exponentially-weighted average — recent years carry much more weight. */
function weightedAverage(values: number[]): number {
  let num = 0;
  let den = 0;
  values.forEach((v, i) => {
    const w = Math.pow(1.6, i); // 1, 1.6, 2.56, 4.1, 6.55 for 5 years
    num += v * w;
    den += w;
  });
  return num / den;
}

/** Simple OLS linear regression to extrapolate next year's closing rank. */
function linearPredict(points: number[]): number {
  const n = points.length;
  const xs = points.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = points.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  xs.forEach((x, i) => {
    num += (x - meanX) * (points[i] - meanY);
    den += (x - meanX) ** 2;
  });
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  const predicted = intercept + slope * n;
  return Math.max(10, Math.round(predicted));
}

/**
 * Logistic probability function.
 * margin > 0 → student rank is smaller (better) than predicted cutoff.
 * Round multiplier: later rounds often have slightly relaxed cutoffs.
 */
function probabilityFromMargin(
  rank: number,
  predictedCutoff: number,
  round = 1
): number {
  const roundRelax = round === 2 ? 1.08 : round >= 3 ? 1.15 : 1.0;
  const effectiveCutoff = Math.round(predictedCutoff * roundRelax);
  const margin = (effectiveCutoff - rank) / Math.max(effectiveCutoff, 1);
  const p = 1 / (1 + Math.exp(-7 * margin));
  return Math.min(99, Math.max(1, Math.round(p * 100)));
}

function classify(p: number): Chance {
  if (p >= 82) return "Safe";
  if (p >= 62) return "High";
  if (p >= 38) return "Moderate";
  return "Dream";
}

function counselingTip(chance: Chance, trend: "rising" | "falling" | "stable"): string {
  const tips: Record<Chance, Record<"rising" | "falling" | "stable", string>> = {
    Safe: {
      rising: "Strong match. Cutoffs are tightening — list this college as your confirmed backup.",
      falling: "Excellent match! Cutoffs are easing — secure position for Round 1.",
      stable: "Solid choice with stable cutoffs. Confidently add to option entry.",
    },
    High: {
      rising: "Good chance, but rising demand. Prefer Round 1 entry for better odds.",
      falling: "High probability; easing trend works in your favour this cycle.",
      stable: "Consistent cutoff. A safe pick for your 2nd preference slot.",
    },
    Moderate: {
      rising: "Cutoffs are tightening — consider this a stretch goal. Have backups ready.",
      falling: "Falling cutoffs improve your odds this year. Worth including in options.",
      stable: "Realistic reach. Include in option entry but maintain safer backups.",
    },
    Dream: {
      rising: "Very ambitious. Cutoffs are rising further. List it last in options.",
      falling: "Rare opportunity — falling cutoffs may give a surprise opening.",
      stable: "Long shot; only add if you're comfortable with this being aspirational.",
    },
  };
  return tips[chance][trend];
}

// ---------------------------------------------------------------------------
// Main prediction function
// ---------------------------------------------------------------------------

export function predict(input: PredictionInput): Prediction[] {
  const results: Prediction[] = [];

  CUTOFFS.filter(
    (r) => r.branch === input.branch && r.category === input.category,
  ).forEach((rec) => {
    const college = getCollege(rec.collegeId);
    if (!college) return;
    if (
      input.location &&
      input.location !== "Any" &&
      college.location !== input.location
    )
      return;

    const series = YEARS.map((y) => rec.years[y]);
    const prevCutoff = series[series.length - 1];
    const weightedCutoff = Math.round(weightedAverage(series));
    const predictedCutoff = linearPredict(series);

    const probability = probabilityFromMargin(
      input.rank,
      predictedCutoff,
      input.round ?? 1,
    );

    // Filter out unreachable colleges (< 6% probability)
    if (probability < 6) return;

    // Trend: compare first vs last year closing ranks
    const slope = series[series.length - 1] - series[0];
    const threshold = prevCutoff * 0.06;
    const trend: Prediction["trend"] =
      Math.abs(slope) < threshold
        ? "stable"
        : slope > 0
          ? "rising"   // closing rank growing = more applicants, harder
          : "falling";

    const chance = classify(probability);

    results.push({
      collegeId: college.id,
      collegeName: college.name,
      collegeCode: college.code,
      branch: rec.branch,
      branchName: BRANCH_NAMES[rec.branch] ?? rec.branch,
      location: college.location,
      fees: college.fees,
      hostelFees: college.hostelFees,
      placementPercentage: college.placementPercentage,
      avgPackage: college.avgPackage,
      highestPackage: college.highestPackage,
      naacGrade: college.naacGrade,
      type: college.type,
      probability,
      chance,
      prevCutoff,
      weightedCutoff,
      predictedCutoff,
      trend,
      history: YEARS.map((y) => ({ year: y, closingRank: rec.years[y] })),
      counselingTip: counselingTip(chance, trend),
    });
  });

  // Sort: highest probability first, then better placement percentage
  return results.sort(
    (a, b) => b.probability - a.probability || b.placementPercentage - a.placementPercentage,
  );
}

// ---------------------------------------------------------------------------
// Group predictions by chance category
// ---------------------------------------------------------------------------

export function groupByChance(preds: Prediction[]) {
  return {
    Safe: preds.filter((p) => p.chance === "Safe"),
    High: preds.filter((p) => p.chance === "High"),
    Moderate: preds.filter((p) => p.chance === "Moderate"),
    Dream: preds.filter((p) => p.chance === "Dream"),
  } as Record<Chance, Prediction[]>;
}

// ---------------------------------------------------------------------------
// College comparison helper
// ---------------------------------------------------------------------------

export function compareColleges(
  collegeIds: string[],
  input?: PredictionInput,
): ComparisonResult[] {
  return collegeIds.map((id) => {
    const college = getCollege(id);
    if (!college) return null;

    const cutoffs = (["GM", "2A", "SC"] as Category[]).map((cat) => {
      const rec = CUTOFFS.find(
        (r) => r.collegeId === id && r.branch === (input?.branch ?? "CS") && r.category === cat,
      );
      return {
        category: cat,
        year2023: rec?.years[2023] ?? 0,
        year2024: rec?.years[2024] ?? 0,
        year2025: rec?.years[2025] ?? 0,
      };
    });

    let prediction: Prediction | undefined;
    if (input) {
      prediction = predict(input).find((p) => p.collegeId === id);
    }

    return { college, prediction, cutoffs };
  }).filter(Boolean) as ComparisonResult[];
}

// ---------------------------------------------------------------------------
// Admin / dataset statistics
// ---------------------------------------------------------------------------

export function datasetStats() {
  return {
    colleges: COLLEGES.length,
    cutoffRecords: CUTOFFS.length,
    branches: new Set(CUTOFFS.map((c) => c.branch)).size,
    years: YEARS.length,
    locations: new Set(COLLEGES.map((c) => c.location)).size,
    avgPlacement: Math.round(
      COLLEGES.reduce((s, c) => s + c.placementPercentage, 0) / COLLEGES.length,
    ),
    topColleges: getTopColleges(5).map((c) => c.name),
  };
}
