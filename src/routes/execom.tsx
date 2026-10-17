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

      <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {execom.map((m, i) => (
          <article
            key={`${m.role}-${i}`}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg"
          >
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-2xl border border-primary/30 bg-primary/10">
              {m.photo ? (
                <img
                  src={m.photo}
                  alt={m.name}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-2xl text-primary">
                  {initials(m.name)}
                </div>
              )}
            </div>
            <h2 className="mt-4 font-serif text-lg text-card-foreground">{m.name}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-primary">{m.role}</p>
            {m.note && <p className="mt-2 text-sm text-muted-foreground">{m.note}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
