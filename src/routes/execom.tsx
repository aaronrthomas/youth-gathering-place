import { createFileRoute } from "@tanstack/react-router";
import { execom } from "@/data/site";

export const Route = createFileRoute("/execom")({
  head: () => ({
    meta: [
      { title: "Executive Committee — Yuvajana Sakhyam, Pattor" },
      {
        name: "description",
        content:
          "The elected executive committee leading the St. Thomas Mar Thoma Yuvajana Sakhyam at Pattor this year.",
      },
      { property: "og:title", content: "Executive Committee — Yuvajana Sakhyam, Pattor" },
      {
        property: "og:description",
        content: "Meet the members serving on this year's youth fellowship committee.",
      },
    ],
  }),
  component: ExecomPage,
});

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ExecomPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-serif text-4xl text-foreground">Executive committee</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Members elected by the fellowship to plan our meetings, lead worship and coordinate
        the year's programmes.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {execom.map((m, i) => (
          <article
            key={`${m.role}-${i}`}
            className="rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-serif text-2xl text-primary">
              {initials(m.name)}
            </div>
            <h2 className="mt-4 font-serif text-lg text-card-foreground">{m.name}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-primary">{m.role}</p>
            {m.note && <p className="mt-2 text-sm text-muted-foreground">{m.note}</p>}
          </article>
        ))}
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Names shown are placeholders — share the real committee list and photos and they
        will be updated here.
      </p>
    </div>
  );
}
