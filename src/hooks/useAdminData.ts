/**
 * useAdminData
 *
 * Returns the live version of events, pastEvents and weeklyRhythm,
 * falling back to the static defaults when no admin edits have been saved.
 *
 * Admin edits are persisted in localStorage under these keys:
 *   - "admin:events"
 *   - "admin:pastEvents"
 *   - "admin:weeklyRhythm"
 *   - "admin:gallery"     (array of { id, src (data URL), caption })
 */

import { useState, useEffect } from "react";
import {
  events as defaultEvents,
  pastEvents as defaultPastEvents,
  weeklyRhythm as defaultWeeklyRhythm,
  type CommunityEvent,
} from "@/data/site";

export type GalleryImage = {
  id: string;
  src: string; // base-64 data URL
  caption: string;
};

export type WeeklySlot = {
  day: string;
  time: string;
  title: string;
  detail: string;
};

const KEYS = {
  events: "admin:events",
  pastEvents: "admin:pastEvents",
  weeklyRhythm: "admin:weeklyRhythm",
  gallery: "admin:gallery",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  } catch {
    throw new Error("Could not save — storage may be full.");
  }
}

export function useAdminData() {
  const [events, setEvents] = useState<CommunityEvent[]>(() =>
    read(KEYS.events, defaultEvents),
  );
  const [pastEvents, setPastEvents] = useState<CommunityEvent[]>(() =>
    read(KEYS.pastEvents, defaultPastEvents),
  );
  const [weeklyRhythm, setWeeklyRhythm] = useState<WeeklySlot[]>(() =>
    read(KEYS.weeklyRhythm, defaultWeeklyRhythm),
  );
  const [gallery, setGallery] = useState<GalleryImage[]>(() =>
    read(KEYS.gallery, []),
  );

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === KEYS.events)
        setEvents(read(KEYS.events, defaultEvents));
      if (e.key === KEYS.pastEvents)
        setPastEvents(read(KEYS.pastEvents, defaultPastEvents));
      if (e.key === KEYS.weeklyRhythm)
        setWeeklyRhythm(read(KEYS.weeklyRhythm, defaultWeeklyRhythm));
      if (e.key === KEYS.gallery) setGallery(read(KEYS.gallery, []));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { events, pastEvents, weeklyRhythm, gallery };
}

export const adminStorage = {
  saveEvents: (data: CommunityEvent[]) => saveToStorage(KEYS.events, data),
  savePastEvents: (data: CommunityEvent[]) =>
    saveToStorage(KEYS.pastEvents, data),
  saveWeeklyRhythm: (data: WeeklySlot[]) =>
    saveToStorage(KEYS.weeklyRhythm, data),
  saveGallery: (data: GalleryImage[]) => saveToStorage(KEYS.gallery, data),
  read,
  KEYS,
};
