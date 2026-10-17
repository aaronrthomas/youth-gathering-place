import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";

const nav = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/execom", label: "Execom" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
        {/* Logo — truncates gracefully on small screens */}
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-serif text-base text-primary sm:h-10 sm:w-10 sm:text-lg">
            ✝
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-serif text-sm text-foreground sm:text-base md:text-lg">
              {site.name}
            </span>
            <span className="block text-xs uppercase tracking-[0.15em] text-muted-foreground sm:tracking-[0.2em]">
              {site.place}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-md border border-border p-2 text-foreground transition hover:bg-secondary md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          className="border-t border-border/70 bg-background px-5 pb-5 pt-1 md:hidden"
          aria-label="Mobile navigation"
        >
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center border-b border-border/50 py-3.5 text-sm text-foreground last:border-0 hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
