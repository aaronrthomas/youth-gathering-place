import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-church.jpg";
import { site, weeklyRhythm, events, execom, formatEventDate } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "St. Thomas Mar Thoma Yuvajana Sakhyam, Pattor" },
      {
        name: "description",
        content:
          "The Christian youth fellowship of St. Thomas Mar Thoma Church, Pattor — Sunday worship, weekly meetings, events and how to join us.",
      },
      { property: "og:title", content: "St. Thomas Mar Thoma Yuvajana Sakhyam, Pattor" },
      {
        property: "og:description",
        content:
          "Sunday worship, weekly meetings and events of the youth fellowship at Pattor.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const upcoming = events.slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Morning light falling on the wooden pews of the church at Pattor"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            {site.place} · Mar Thoma Parish
          </p>
          <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-tight text-foreground sm:text-6xl">
            {site.name}
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {site.tagline}. We gather every Sunday for worship, stay back for our
            fellowship meeting, and serve the neighbourhood around Pattor through the year.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              See what's coming up
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
          {weeklyRhythm.map((slot) => (
            <div key={slot.title}>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">
                {slot.day} · {slot.time}
              </p>
              <h3 className="mt-2 font-serif text-xl text-foreground">{slot.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{slot.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-3xl text-foreground">Upcoming gatherings</h2>
          <Link to="/events" className="text-sm text-primary hover:underline">
            All events
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {upcoming.map((ev) => (
            <article
              key={ev.id}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                {formatEventDate(ev.date)}
              </p>
              <h3 className="mt-3 font-serif text-xl text-card-foreground">{ev.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ev.description}</p>
              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {ev.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {ev.place}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-foreground">Who we are</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The Yuvajana Sakhyam is the youth wing of our parish — students, working
              young people and newly married members who share worship, study and service.
              Meetings follow the Sunday service, and everyone from the parish and around
              Pattor is welcome to join us.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Through the year we lead Youth Sunday, run Bible study and quiz programmes,
              organise camps and take part in charity work across the ward.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-serif text-xl text-card-foreground">
              This year's executive committee
            </h3>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {execom.slice(0, 5).map((m) => (
                <li key={m.role} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <span>{m.role}</span>
                  <span className="text-foreground">{m.name}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/execom"
              className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Meet the full committee <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
