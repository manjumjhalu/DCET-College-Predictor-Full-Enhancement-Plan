import { Link, useLocation } from "react-router";
import { GraduationCap, Moon, Sun, Menu, X, GitCompare } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Predict" },
  { to: "/results", label: "Results" },
  { to: "/compare", label: "Compare" },
];

export function Navbar() {
  const { dark, toggleDark } = useApp();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm">
            <GraduationCap className="size-5" />
          </div>
          <div className="leading-tight">
            <div className="font-bold tracking-tight text-sm">DCET Predictor</div>
            <div className="text-[10px] text-muted-foreground">Karnataka · AI-powered</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {l.to === "/compare" && <GitCompare className="mr-1.5 inline size-3.5" />}
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {dark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>

          <Link to="/predict" className="hidden md:block">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
              Predict Colleges
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent md:hidden transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden bg-background">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {l.to === "/compare" && <GitCompare className="size-4" />}
              {l.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link to="/predict" onClick={() => setOpen(false)}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Predict Colleges
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
