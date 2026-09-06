import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { events, pastEvents, weeklyRhythm, formatEventDate } from "@/data/site";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Meetings — Yuvajana Sakhyam, Pattor" },
      {
        name: "description",
        content:
          "Upcoming events, Sunday service timings and the weekly fellowship meeting of the Yuvajana Sakhyam at Pattor.",
      },
      { property: "og:title", content: "Events & Meetings — Yuvajana Sakhyam, Pattor" },
      {
        property: "og:description",
        content: "Sunday worship, weekly meetings and upcoming youth events at Pattor.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-serif text-4xl text-foreground">Events & meetings</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Our week always begins with worship. Everything else — study, practice, service —
        grows out of that.
      </p>

      <section className="mt-10 grid gap-6 sm:grid-cols-3">
        {weeklyRhythm.map((slot) => (
          <div key={slot.title} className="rounded-2xl border border-border bg-secondary/50 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-primary">
              {slot.day} · {slot.time}
            </p>
            <h2 className="mt-2 font-serif text-lg text-foreground">{slot.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{slot.detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-foreground">Upcoming</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {events.map((ev) => (
            <article key={ev.id} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                {formatEventDate(ev.date)}
              </p>
              <h3 className="mt-3 font-serif text-xl text-card-foreground">{ev.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ev.description}</p>
              <div className="mt-4 flex flex-wrap gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {ev.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {ev.place}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-foreground">Recently held</h2>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {pastEvents.map((ev) => (
            <li key={ev.id} className="flex flex-wrap items-baseline justify-between gap-3 py-5">
              <div>
                <h3 className="font-serif text-lg text-foreground">{ev.title}</h3>
                <p className="text-sm text-muted-foreground">{ev.description}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {formatEventDate(ev.date)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
