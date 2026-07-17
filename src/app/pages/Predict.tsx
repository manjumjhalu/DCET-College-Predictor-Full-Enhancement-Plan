import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Wand2, AlertTriangle, ChevronRight, ChevronLeft, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { CATEGORIES, BRANCHES, LOCATIONS, type Category } from "../data/dataset";
import { predict, type BranchCode, type PredictionInput } from "../lib/predictor";
import { useApp } from "../context/AppContext";

// ── Step definitions ───────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Your Rank", desc: "Enter your DCET rank" },
  { id: 2, label: "Category & Branch", desc: "Choose your eligibility" },
  { id: 3, label: "Preferences", desc: "Optional filters" },
];

export function Predict() {
  const navigate = useNavigate();
  const { setPrediction } = useApp();

  const [step, setStep] = useState(1);
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState<Category>("GM");
  const [branch, setBranch] = useState<BranchCode>("CS");
  const [gender, setGender] = useState("any");
  const [location, setLocation] = useState<string>("Any");
  const [round, setRound] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateStep1(): boolean {
    const rankNum = parseInt(rank, 10);
    if (!rankNum || rankNum < 1 || rankNum > 500000) {
      setError("Please enter a valid DCET rank (1 – 5,00,000).");
      return false;
    }
    setError("");
    return true;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(s + 1, 3));
  }

  function fillExample() {
    setRank("1540");
    setCategory("GM");
    setBranch("CS");
    setLocation("Any");
    setRound("1");
    setStep(1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) { setStep(1); return; }
    setLoading(true);

    // Simulate slight delay for "AI processing" effect
    setTimeout(() => {
      const input: PredictionInput = {
        rank: parseInt(rank, 10),
        category,
        branch,
        location: location as PredictionInput["location"],
        round: parseInt(round, 10),
        gender,
      };
      const results = predict(input);
      setPrediction(input, results);
      setLoading(false);
      navigate("/results");
    }, 800);
  }

  const branchName = BRANCHES.find((b) => b.code === branch)?.name ?? branch;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
          <Sparkles className="size-3.5" /> AI College Predictor
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Enter your DCET details
        </h1>
        <p className="mt-2 text-muted-foreground">
          We'll match you against 5 years of Karnataka DCET counseling cutoffs.
        </p>
      </div>

      {/* Disclaimer inline */}
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <p>
          <strong>Reminder:</strong> Admission probabilities are{" "}
          <strong>statistical estimates only</strong> — not guaranteed outcomes. Always
          verify with{" "}
          <a
            href="https://kea.kar.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            kea.kar.nic.in
          </a>
          .
        </p>
      </div>

      {/* Step progress */}
      <div className="mt-8 flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  step > s.id
                    ? "bg-indigo-600 text-white"
                    : step === s.id
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-1"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.id ? <Check className="size-4" /> : s.id}
              </div>
              <div className="mt-1 hidden text-center sm:block">
                <div className={`text-xs font-medium ${step === s.id ? "text-indigo-600" : "text-muted-foreground"}`}>
                  {s.label}
                </div>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 transition-colors ${step > s.id ? "bg-indigo-600" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form card */}
      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

        {/* ── Step 1: Rank ────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">What is your DCET Rank?</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Enter the rank from your DCET result card.
                </p>
              </div>

              <Label htmlFor="rank">DCET Rank *</Label>
              <Input
                id="rank"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 1540"
                value={rank}
                onChange={(e) => { setRank(e.target.value); setError(""); }}
                className="mt-1.5 text-lg h-12"
                autoFocus
              />
              {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}

              {rank && !error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                  <Check className="size-4" />
                  Rank {parseInt(rank).toLocaleString("en-IN")} entered
                </div>
              )}
            </div>

            {/* Rank insight */}
            {rank && parseInt(rank) > 0 && (
              <div className="rounded-xl bg-muted/50 p-4 text-sm">
                <div className="font-medium mb-1">Rank insight</div>
                {parseInt(rank) <= 500 && <p className="text-emerald-600">🏆 Excellent rank! Top-tier colleges like UVCE, RVCE, BMS are within reach for CSE.</p>}
                {parseInt(rank) > 500 && parseInt(rank) <= 2000 && <p className="text-sky-600">⭐ Very good rank. Strong colleges across Bengaluru and Mysuru available.</p>}
                {parseInt(rank) > 2000 && parseInt(rank) <= 5000 && <p className="text-amber-600">📊 Good rank. Several quality colleges available depending on branch choice.</p>}
                {parseInt(rank) > 5000 && parseInt(rank) <= 15000 && <p className="text-orange-600">📌 Moderate rank. Many colleges will be in the Moderate–Dream range for CSE; easier for ME/CV.</p>}
                {parseInt(rank) > 15000 && <p className="text-rose-600">💡 Higher rank range. Focus on less competitive branches and locations for better options.</p>}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Category & Branch ────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Category & Branch Preference</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your category determines which cutoff row is used for matching.
              </p>
            </div>

            <div>
              <Label>Reservation Category *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="mt-1.5 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      <span className="font-medium">{c}</span>
                      <span className="ml-2 text-muted-foreground text-xs">
                        {c === "GM" ? "(General Merit)" :
                         c === "SC" ? "(Scheduled Caste)" :
                         c === "ST" ? "(Scheduled Tribe)" :
                         c === "1G" ? "(Category 1 General)" :
                         `(OBC Category ${c})`}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preferred Branch *</Label>
              <Select value={branch} onValueChange={(v) => setBranch(v as BranchCode)}>
                <SelectTrigger className="mt-1.5 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((b) => (
                    <SelectItem key={b.code} value={b.code}>
                      <span className="font-medium">{b.code}</span>
                      <span className="ml-2 text-muted-foreground text-xs">{b.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Selected: <strong>{branchName}</strong>
              </p>
            </div>

            {/* Branch competition info */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
              {(branch === "CS" || branch === "AI" || branch === "CD" || branch === "CY") && (
                <p>🔥 <strong>High demand branch.</strong> CS/AI cutoffs are very competitive — smaller closing ranks needed.</p>
              )}
              {branch === "IS" && (
                <p>📈 <strong>Moderately competitive.</strong> IS is popular and demand is growing year on year.</p>
              )}
              {branch === "EC" && (
                <p>⚡ <strong>Balanced competition.</strong> EC has stable demand and good industry prospects.</p>
              )}
              {(branch === "EE" || branch === "ME" || branch === "CV") && (
                <p>✅ <strong>Lower competition.</strong> EE/ME/CV have more seats available relative to applicants — better options for higher ranks.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3: Preferences ─────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Optional Preferences</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Filter results further or leave as default for all options.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Preferred Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any location (show all)</SelectItem>
                    {LOCATIONS.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Prefer not to say</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Counseling Round</Label>
              <Select value={round} onValueChange={setRound}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Round 1 — Strictest cutoffs</SelectItem>
                  <SelectItem value="2">Round 2 — Slightly relaxed (~8%)</SelectItem>
                  <SelectItem value="3">Extended / Mock Round — Most relaxed (~15%)</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Later rounds have slightly relaxed cutoffs. Predictions adjust accordingly.
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-muted/50 p-4 text-sm space-y-1.5">
              <div className="font-medium mb-2">Prediction Summary</div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rank</span><strong>{parseInt(rank).toLocaleString("en-IN")}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><strong>{category}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Branch</span><strong>{branchName}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Location</span><strong>{location}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Round</span><strong>Round {round}</strong></div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-7 flex gap-3">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-none">
              <ChevronLeft className="size-4" /> Back
            </Button>
          )}

          {step < 3 ? (
            <Button type="button" onClick={handleNext} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              Next <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <>
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Predicting colleges…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Predict Colleges
                </>
              )}
            </Button>
          )}
        </div>

        {/* Example button */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={fillExample}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Wand2 className="size-3.5" /> Try example: Rank 1540, GM, CSE
          </button>
        </div>
      </form>
    </div>
  );
}
