/**
 * useAdminData
 *
 * Returns the live version of events, pastEvents, weeklyRhythm and gallery.
 *
 * Events / pastEvents / weeklyRhythm are stored in Firestore so every
 * visitor sees the latest admin edits in real-time.
 *
 * Gallery images (base64 data URLs) are kept in localStorage only because
 * Firestore documents have a 1 MB limit that images quickly exceed.
 *
 * Firestore structure:
 *   siteData/events        { items: CommunityEvent[] }
 *   siteData/pastEvents    { items: CommunityEvent[] }
 *   siteData/weeklyRhythm  { items: WeeklySlot[]     }
 */

import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

// ---------------------------------------------------------------------------
// Firestore helpers
// ---------------------------------------------------------------------------

const FS = "siteData"; // Firestore collection name

async function writeDoc<T>(docId: string, items: T) {
  await setDoc(doc(db, FS, docId), { items });
}

// ---------------------------------------------------------------------------
// localStorage helpers (gallery only)
// ---------------------------------------------------------------------------

const GALLERY_KEY = "admin:gallery";

function readLocal<T>(key: string, fallback: T): T {
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

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAdminData() {
  // Start with static defaults so SSR and the first paint are instant.
  const [events, setEvents] = useState<CommunityEvent[]>(defaultEvents);
  const [pastEvents, setPastEvents] = useState<CommunityEvent[]>(defaultPastEvents);
  const [weeklyRhythm, setWeeklyRhythm] = useState<WeeklySlot[]>(defaultWeeklyRhythm);
  const [gallery, setGallery] = useState<GalleryImage[]>(() =>
    readLocal(GALLERY_KEY, []),
  );

  useEffect(() => {
    // Subscribe to Firestore — updates arrive on ALL devices in real-time.
    const unsubEvents = onSnapshot(doc(db, FS, "events"), (snap) => {
      setEvents(snap.exists() ? (snap.data().items as CommunityEvent[]) : defaultEvents);
    });

    const unsubPast = onSnapshot(doc(db, FS, "pastEvents"), (snap) => {
      setPastEvents(snap.exists() ? (snap.data().items as CommunityEvent[]) : defaultPastEvents);
    });

    const unsubRhythm = onSnapshot(doc(db, FS, "weeklyRhythm"), (snap) => {
      setWeeklyRhythm(snap.exists() ? (snap.data().items as WeeklySlot[]) : defaultWeeklyRhythm);
    });

    // Gallery stays local (images too large for Firestore).
    function onStorage(e: StorageEvent) {
      if (e.key === GALLERY_KEY) setGallery(readLocal(GALLERY_KEY, []));
    }
    window.addEventListener("storage", onStorage);

    return () => {
      unsubEvents();
      unsubPast();
      unsubRhythm();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { events, pastEvents, weeklyRhythm, gallery };
}

// ---------------------------------------------------------------------------
// adminStorage — called by admin.tsx to persist changes
// ---------------------------------------------------------------------------

export const adminStorage = {
  saveEvents: (data: CommunityEvent[]) => writeDoc("events", data),
  savePastEvents: (data: CommunityEvent[]) => writeDoc("pastEvents", data),
  saveWeeklyRhythm: (data: WeeklySlot[]) => writeDoc("weeklyRhythm", data),
  // Gallery stays in localStorage only
  saveGallery: (data: GalleryImage[]) => saveToStorage(GALLERY_KEY, data),
  // Kept for backwards-compatibility (used nowhere else currently)
  read: readLocal,
  KEYS: { gallery: GALLERY_KEY },
};
