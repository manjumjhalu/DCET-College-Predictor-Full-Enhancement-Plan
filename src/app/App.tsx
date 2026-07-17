import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";
import { Predict } from "./pages/Predict";
import { Results } from "./pages/Results";
import { CollegeDetails } from "./pages/CollegeDetails";
import { Compare } from "./pages/Compare";
import { DisclaimerBanner, FirstVisitModal } from "./components/DisclaimerBanner";
import { GraduationCap, ExternalLink } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <GraduationCap className="size-4" />
              </div>
              <span className="font-semibold">DCET College Predictor</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Karnataka Diploma CET college prediction tool. Powered by historical
              cutoff trend analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Quick Links</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {[
                { label: "Predict Colleges", to: "/predict" },
                { label: "Compare Colleges", to: "/compare" },
              ].map((l) => (
                <li key={l.to}>
                  <a href={l.to} className="hover:text-foreground transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Links */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Official Resources</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {[
                { label: "KEA Official Website", url: "https://kea.kar.nic.in" },
                { label: "VTU Official", url: "https://vtu.ac.in" },
                { label: "DCET Counseling Schedule", url: "https://kea.kar.nic.in" },
              ].map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    {l.label} <ExternalLink className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <strong>⚠️ Disclaimer:</strong> All predictions are statistical estimates based on
          historical DCET cutoff data. These are NOT official KEA results. Actual
          admission depends on KEA counseling outcomes. Use for guidance only.
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} DCET College Predictor · Karnataka</span>
          <span>For guidance only · Not affiliated with KEA or VTU</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* First-visit disclaimer modal */}
        <FirstVisitModal />

        <div className="flex min-h-screen flex-col bg-background text-foreground">
          {/* Persistent disclaimer banner */}
          <DisclaimerBanner />

          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/results" element={<Results />} />
              <Route path="/college/:id" element={<CollegeDetails />} />
              <Route path="/compare" element={<Compare />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </AppProvider>
  );
}
