/**
 * useAdminData
 *
 * Returns the live version of events, pastEvents, weeklyRhythm and gallery.
 *
 * All data is stored in Firestore so every visitor sees the latest admin
 * edits in real-time across all devices.
 *
 * Gallery images are uploaded to Firebase Storage; only the download URLs
 * (+ captions) are stored in Firestore — avoiding the 1 MB document limit.
 *
 * Firestore structure:
 *   siteData/events        { items: CommunityEvent[] }
 *   siteData/pastEvents    { items: CommunityEvent[] }
 *   siteData/weeklyRhythm  { items: WeeklySlot[]     }
 *   siteData/gallery       { items: GalleryImage[]   }  ← URLs, not base64
 */

import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import {
  events as defaultEvents,
  pastEvents as defaultPastEvents,
  weeklyRhythm as defaultWeeklyRhythm,
  type CommunityEvent,
} from "@/data/site";

export type GalleryImage = {
  id: string;
  src: string;   // Firebase Storage download URL
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
// Hook
// ---------------------------------------------------------------------------

export function useAdminData() {
  // Start with static defaults so SSR and the first paint are instant.
  const [events, setEvents] = useState<CommunityEvent[]>(defaultEvents);
  const [pastEvents, setPastEvents] = useState<CommunityEvent[]>(defaultPastEvents);
  const [weeklyRhythm, setWeeklyRhythm] = useState<WeeklySlot[]>(defaultWeeklyRhythm);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

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

    const unsubGallery = onSnapshot(doc(db, FS, "gallery"), (snap) => {
      setGallery(snap.exists() ? (snap.data().items as GalleryImage[]) : []);
    });

    return () => {
      unsubEvents();
      unsubPast();
      unsubRhythm();
      unsubGallery();
    };
  }, []);

  return { events, pastEvents, weeklyRhythm, gallery };
}

// ---------------------------------------------------------------------------
// adminStorage — called by admin.tsx to persist changes
// ---------------------------------------------------------------------------

/**
 * Upload one File to Firebase Storage and return a GalleryImage record
 * with the permanent download URL.
 */
export async function uploadGalleryImage(
  file: File,
  id: string,
): Promise<GalleryImage> {
  const storageRef = ref(storage, `gallery/${id}_${file.name}`);
  await uploadBytes(storageRef, file);
  const src = await getDownloadURL(storageRef);
  return {
    id,
    src,
    caption: file.name.replace(/\.[^.]+$/, ""),
  };
}

/**
 * Delete an image from Firebase Storage by its URL.
 * Fails silently if the file is already gone.
 */
export async function deleteGalleryImage(src: string): Promise<void> {
  try {
    const fileRef = ref(storage, src);
    await deleteObject(fileRef);
  } catch {
    // File already deleted or URL not a Storage path — ignore.
  }
}

export const adminStorage = {
  saveEvents: (data: CommunityEvent[]) => writeDoc("events", data),
  savePastEvents: (data: CommunityEvent[]) => writeDoc("pastEvents", data),
  saveWeeklyRhythm: (data: WeeklySlot[]) => writeDoc("weeklyRhythm", data),
  saveGallery: (data: GalleryImage[]) => writeDoc("gallery", data),
};

