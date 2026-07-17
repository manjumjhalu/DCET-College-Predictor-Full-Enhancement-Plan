import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Prediction, PredictionInput } from "../lib/predictor";

interface AppState {
  input: PredictionInput | null;
  results: Prediction[];
  setPrediction: (input: PredictionInput, results: Prediction[]) => void;
  dark: boolean;
  toggleDark: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState<PredictionInput | null>(null);
  const [results, setResults] = useState<Prediction[]>([]);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const value = useMemo<AppState>(
    () => ({
      input,
      results,
      setPrediction: (i, r) => {
        setInput(i);
        setResults(r);
      },
      dark,
      toggleDark: () => setDark((d) => !d),
    }),
    [input, results, dark],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
