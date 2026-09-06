import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Instagram, MessageCircle } from "lucide-react";
import { site, weeklyRhythm } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Join Us — Yuvajana Sakhyam, Pattor" },
      {
        name: "description",
        content:
          "Reach the St. Thomas Mar Thoma Yuvajana Sakhyam at Pattor — church address, service timings and a message form for new members.",
      },
      { property: "og:title", content: "Contact & Join Us — Yuvajana Sakhyam, Pattor" },
      {
        property: "og:description",
        content: "Get in touch with the youth fellowship at Pattor or come along on Sunday.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-serif text-4xl text-foreground">Join us</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Come for the Sunday service and stay back for our meeting, or send us a message and
        someone from the committee will get back to you.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-7">
          {sent ? (
            <div className="py-10 text-center">
              <h2 className="font-serif text-2xl text-card-foreground">Thank you</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Your message has been noted. A committee member will contact you soon.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 text-sm text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="text-sm text-foreground">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="contact" className="text-sm text-foreground">
                  Phone or email
                </label>
                <input
                  id="contact"
                  name="contact"
                  required
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Send message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-foreground">Where to find us</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {site.address}
              </p>
              <p className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {site.phone}
              </p>
              <p className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {site.email}
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <a
                href={site.instagram}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-foreground hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a
                href={site.whatsapp}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-foreground hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/50 p-6">
            <h3 className="font-serif text-lg text-foreground">Weekly timings</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {weeklyRhythm.map((slot) => (
                <li key={slot.title} className="flex justify-between gap-4">
                  <span>{slot.title}</span>
                  <span className="text-foreground">
                    {slot.day} {slot.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Address, phone and social links are placeholders for now — send us the real ones
            and they will be updated.
          </p>
        </div>
      </div>
    </div>
  );
}
