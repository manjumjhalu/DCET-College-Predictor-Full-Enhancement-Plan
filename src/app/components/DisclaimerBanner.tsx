import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

// ============================================================
// DisclaimerBanner
// Shows a persistent amber banner at the top of every page,
// plus a one-time modal on first visit (localStorage flag).
// ============================================================

export function DisclaimerBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="relative flex items-start gap-3 bg-amber-500 px-4 py-2.5 text-sm text-amber-950 dark:bg-amber-600 dark:text-amber-50"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1 font-medium leading-snug">
        <span className="font-bold uppercase tracking-wide">⚠️ Important Disclaimer: </span>
        All predictions and admission probabilities shown here are{" "}
        <span className="font-bold underline">statistical estimates only</span>, based on
        historical DCET cutoff trends. These are{" "}
        <span className="font-bold">NOT official KEA results</span> and do NOT guarantee
        admission. Always verify with{" "}
        <a
          href="https://kea.kar.nic.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-amber-900"
        >
          kea.kar.nic.in
        </a>
        .
      </p>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss disclaimer"
        className="mt-0.5 rounded p-0.5 hover:bg-amber-600/20"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

// ============================================================
// FirstVisitModal — shows once per browser session
// ============================================================

export function FirstVisitModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("dcet_disclaimer_seen");
    if (!seen) {
      setOpen(true);
      sessionStorage.setItem("dcet_disclaimer_seen", "1");
    }
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
            <AlertTriangle className="size-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Important Disclaimer
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Please read before using the predictor
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-600">●</span>
              <span>
                <strong>Probabilities are ESTIMATES</strong> — not official KEA
                admission offers. They are derived from historical DCET closing-rank
                patterns (2021–2025) using statistical modelling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-600">●</span>
              <span>
                Actual cutoffs vary each year based on seat availability, number of
                applicants, category-wise demand, and counseling round.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-600">●</span>
              <span>
                College fees, placements, and hostel data are <strong>representative
                figures</strong> and should be verified directly with the college.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-600">●</span>
              <span>
                Always refer to the{" "}
                <a
                  href="https://kea.kar.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  official KEA website
                </a>{" "}
                for authoritative cutoff data and admission schedules.
              </span>
            </li>
          </ul>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          This tool is for <strong>guidance and planning purposes only</strong>. Use it
          alongside official KEA counseling resources.
        </p>

        <button
          onClick={() => setOpen(false)}
          className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          I Understand — Continue to Predictor
        </button>
      </div>
    </div>
  );
}
