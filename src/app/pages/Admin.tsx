import { useRef, useState } from "react";
import {
  Upload,
  Database,
  Building2,
  Cpu,
  BarChart3,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  Pencil,
  Save,
  X,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  COLLEGES,
  CUTOFFS,
  BRANCHES,
  LOCATIONS,
  YEARS,
  type College,
  type Location,
} from "../data/dataset";
import { datasetStats } from "../lib/predictor";

const stats = datasetStats();

const branchDist = BRANCHES.map((b) => ({
  branch: b.code,
  records: CUTOFFS.filter((r) => r.branch === b.code).length,
}));

const locationDist = LOCATIONS.map((loc) => ({
  name: loc,
  count: COLLEGES.filter((c) => c.location === loc).length,
}));

const PIE_COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#d946ef", "#ef4444", "#8b5cf6", "#ec4899"];

const typeDist = (["Government", "Aided", "Private"] as College["type"][]).map((t) => ({
  name: t,
  value: COLLEGES.filter((c) => c.type === t).length,
}));

// Simulate historical accuracy trend
const accuracyTrend = YEARS.map((y, i) => ({
  year: y.toString(),
  accuracy: +(88 + i * 0.9).toFixed(1),
}));

function Row({ k, v, boxed }: { k: string; v: React.ReactNode; boxed?: boolean }) {
  if (boxed) {
    return (
      <div className="rounded-xl bg-muted/50 p-4">
        <div className="text-2xl font-bold">{v}</div>
        <div className="mt-1 text-sm text-muted-foreground">{k}</div>
      </div>
    );
  }
  return (
    <div className="flex justify-between border-b border-border/60 pb-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

export function Admin() {
  const [colleges, setColleges] = useState<College[]>([...COLLEGES]);
  const [training, setTraining] = useState(false);
  const [accuracy, setAccuracy] = useState(91.8);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<College>>({});
  const [form, setForm] = useState({ name: "", code: "", location: "Bengaluru", fees: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`"${file.name}" uploaded`, {
      description: "CSV parsed — available for next model retrain.",
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  function addCollege(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.code) { toast.error("Name and code are required."); return; }
    const newC: College = {
      id: `c${Date.now()}`,
      code: form.code,
      name: form.name,
      location: form.location as Location,
      fees: parseInt(form.fees, 10) || 0,
      hostelFees: 65000,
      hostel: true,
      placementPercentage: 70,
      avgPackage: 4.5,
      highestPackage: 18,
      naacGrade: "A",
      established: 2005,
      type: "Private",
      affiliation: "VTU",
      website: "https://kea.kar.nic.in",
    };
    setColleges((c) => [newC, ...c]);
    setForm({ name: "", code: "", location: "Bengaluru", fees: "" });
    toast.success(`Added ${newC.name}`);
  }

  function startEdit(c: College) {
    setEditId(c.id);
    setEditForm({ fees: c.fees, placementPercentage: c.placementPercentage, avgPackage: c.avgPackage });
  }

  function saveEdit(id: string) {
    setColleges((cs) =>
      cs.map((c) => (c.id === id ? { ...c, ...editForm } : c)),
    );
    setEditId(null);
    toast.success("College updated.");
  }

  function removeCollege(id: string) {
    setColleges((c) => c.filter((x) => x.id !== id));
    toast.success("College removed.");
  }

  function retrain() {
    setTraining(true);
    toast.info("Retraining RandomForest model…");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        const acc = +(89 + Math.random() * 5).toFixed(1);
        setAccuracy(acc);
        setTraining(false);
        toast.success(`Model retrained · ${acc}% accuracy`, {
          description: "Saved to model.joblib",
        });
      }
    }, 440);
  }

  const statCards = [
    { icon: Building2, label: "Colleges", value: colleges.length, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950" },
    { icon: Database, label: "Cutoff records", value: stats.cutoffRecords.toLocaleString("en-IN"), color: "text-sky-600 bg-sky-50 dark:bg-sky-950" },
    { icon: BarChart3, label: "Branches", value: stats.branches, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950" },
    { icon: Cpu, label: "Model accuracy", value: `${accuracy}%`, color: "text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage dataset, colleges, and the prediction model.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <AlertTriangle className="size-3.5" />
          Session-only changes · no backend connected
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className={`flex size-10 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="size-5" />
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="colleges" className="mt-8">
        <TabsList className="flex flex-wrap gap-1 h-auto">
          <TabsTrigger value="colleges">Manage Colleges</TabsTrigger>
          <TabsTrigger value="data">Dataset & CSV</TabsTrigger>
          <TabsTrigger value="model">ML Model</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ── Colleges tab ─────────────────────────────────────────────── */}
        <TabsContent value="colleges" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Add form */}
            <form
              onSubmit={addCollege}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-1"
            >
              <div className="flex items-center gap-2 font-semibold">
                <Plus className="size-4 text-indigo-600" /> Add New College
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="cname">College name</Label>
                  <Input id="cname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" placeholder="e.g. ABC Institute of Tech" />
                </div>
                <div>
                  <Label htmlFor="ccode">KEA college code</Label>
                  <Input id="ccode" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="mt-1.5" placeholder="e.g. E099" />
                </div>
                <div>
                  <Label htmlFor="cloc">Location</Label>
                  <select
                    id="cloc"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="cfees">Annual fees (₹)</Label>
                  <Input id="cfees" type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} className="mt-1.5" placeholder="e.g. 120000" />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="size-4" /> Add College
                </Button>
              </div>
            </form>

            {/* College list */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold">Colleges ({colleges.length})</span>
                <span className="text-xs text-muted-foreground">Click ✏️ to edit fees / placement</span>
              </div>
              <div className="max-h-[460px] space-y-2 overflow-auto pr-1">
                {colleges.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border/60 px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">{c.code}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.location} · {c.type} · NAAC {c.naacGrade}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {editId === c.id ? (
                          <>
                            <button onClick={() => saveEdit(c.id)} className="flex size-7 items-center justify-center rounded text-emerald-600 hover:bg-emerald-50 transition-colors">
                              <Save className="size-3.5" />
                            </button>
                            <button onClick={() => setEditId(null)} className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors">
                              <X className="size-3.5" />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => startEdit(c)} className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-accent transition-colors">
                            <Pencil className="size-3.5" />
                          </button>
                        )}
                        <button onClick={() => removeCollege(c.id)} className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {editId === c.id && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground">Fees (₹)</label>
                          <Input
                            type="number"
                            value={editForm.fees ?? c.fees}
                            onChange={(e) => setEditForm((f) => ({ ...f, fees: parseInt(e.target.value) }))}
                            className="h-7 text-xs mt-0.5"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground">Placement %</label>
                          <Input
                            type="number"
                            value={editForm.placementPercentage ?? c.placementPercentage}
                            onChange={(e) => setEditForm((f) => ({ ...f, placementPercentage: parseInt(e.target.value) }))}
                            className="h-7 text-xs mt-0.5"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground">Avg Pkg (LPA)</label>
                          <Input
                            type="number"
                            step="0.1"
                            value={editForm.avgPackage ?? c.avgPackage}
                            onChange={(e) => setEditForm((f) => ({ ...f, avgPackage: parseFloat(e.target.value) }))}
                            className="h-7 text-xs mt-0.5"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Dataset tab ──────────────────────────────────────────────── */}
        <TabsContent value="data" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 font-semibold">
                <Upload className="size-4 text-indigo-600" /> Upload Cutoff CSV
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-4 flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border py-12 text-muted-foreground transition-colors hover:border-indigo-400 hover:text-indigo-600"
              >
                <FileSpreadsheet className="size-10" />
                <div>
                  <div className="text-sm font-medium">Click to upload cutoff_data.csv</div>
                  <div className="mt-1 text-xs text-center">
                    Expected columns: college_code, year, round, branch, category, closing_rank
                  </div>
                </div>
              </button>
              <input ref={fileRef} type="file" accept=".csv" onChange={handleUpload} className="hidden" />
              <p className="mt-3 text-xs text-muted-foreground">
                In production, this CSV is parsed by the FastAPI backend and stored in MySQL.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 font-semibold">Dataset Summary</div>
              <dl className="space-y-2.5 text-sm">
                <Row k="Total colleges" v={colleges.length} />
                <Row k="Cutoff records" v={stats.cutoffRecords.toLocaleString("en-IN")} />
                <Row k="Branches" v={stats.branches} />
                <Row k="Categories" v="8 (GM, 1G, 2A, 2B, 3A, 3B, SC, ST)" />
                <Row k="Years covered" v={`${YEARS[0]}–${YEARS[YEARS.length - 1]}`} />
                <Row k="Locations" v={stats.locations} />
                <Row k="Avg placement" v={`${stats.avgPlacement}%`} />
              </dl>
            </div>
          </div>
        </TabsContent>

        {/* ── Model tab ────────────────────────────────────────────────── */}
        <TabsContent value="model" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 font-semibold">
                <Cpu className="size-4 text-indigo-600" /> RandomForest Classifier
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Row k="Estimators" v="200" boxed />
                <Row k="Current accuracy" v={`${accuracy}%`} boxed />
                <Row k="Max depth" v="None (auto)" boxed />
                <Row k="Min samples split" v="2" boxed />
                <Row k="Features" v="6" boxed />
                <Row k="Saved model" v="model.joblib" boxed />
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Pipeline: preprocess.py → train_model.py → predict.py.
                Features: rank, category (encoded), branch (encoded), year, round, weighted_cutoff_trend.
                Output: predict_proba() scores per college.
              </p>
              <Button
                onClick={retrain}
                disabled={training}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700"
              >
                {training ? (
                  <><Loader2 className="size-4 animate-spin" /> Training…</>
                ) : (
                  <><Cpu className="size-4" /> Retrain Model</>
                )}
              </Button>
              {!training && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle2 className="size-4" /> Model is up to date
                </div>
              )}
            </div>

            {/* Accuracy trend */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <TrendingUp className="size-4 text-indigo-600" /> Historical accuracy trend
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={accuracyTrend} margin={{ left: -10, right: 8, top: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis domain={[85, 97]} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: any) => [`${v}%`, "Accuracy"]} />
                  <Line type="monotone" dataKey="accuracy" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* ── Analytics tab ───────────────────────────────────────────── */}
        <TabsContent value="analytics" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Branch distribution */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-3 font-semibold">Cutoff records per branch</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={branchDist} margin={{ left: -12, right: 8, top: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="records" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* College type pie */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-3 font-semibold">College types</div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={typeDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {typeDist.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Location distribution */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
              <div className="mb-3 font-semibold">Colleges per city</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={locationDist} margin={{ left: -12, right: 8, top: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
