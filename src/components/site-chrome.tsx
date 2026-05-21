import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-leaf)] transition-transform group-hover:rotate-[-8deg]">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">LeafSense</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" className="px-3 py-2 text-muted-foreground hover:text-foreground" activeProps={{ className: "px-3 py-2 text-foreground font-medium" }}>
            Home
          </Link>
          <Link to="/analyze" className="px-3 py-2 text-muted-foreground hover:text-foreground" activeProps={{ className: "px-3 py-2 text-foreground font-medium" }}>
            Analyze
          </Link>
          <Link to="/about" className="px-3 py-2 text-muted-foreground hover:text-foreground" activeProps={{ className: "px-3 py-2 text-foreground font-medium" }}>
            About
          </Link>
          <Link
            to="/analyze"
            className="ml-2 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-leaf)] transition hover:opacity-90"
          >
            Start scan
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} LeafSense — Final year major project.</p>
        <p>AI-powered plant health diagnostics.</p>
      </div>
    </footer>
  );
}
