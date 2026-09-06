import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="font-serif text-xl text-foreground">{site.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{site.tagline}</p>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="flex gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {site.address}
          </p>
          <p className="flex gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {site.phone}
          </p>
          <p className="flex gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {site.email}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link to="/events" className="text-muted-foreground hover:text-primary">
            Events & meetings
          </Link>
          <Link to="/execom" className="text-muted-foreground hover:text-primary">
            Executive committee
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-primary">
            Join us
          </Link>
        </div>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {site.name}, {site.place}
      </div>
    </footer>
  );
}
