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
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
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
      setEvents(snap.exists() ? (snap.data()["items"] as CommunityEvent[]) : defaultEvents);
    });

    const unsubPast = onSnapshot(doc(db, FS, "pastEvents"), (snap) => {
      setPastEvents(snap.exists() ? (snap.data()["items"] as CommunityEvent[]) : defaultPastEvents);
    });

    const unsubRhythm = onSnapshot(doc(db, FS, "weeklyRhythm"), (snap) => {
      setWeeklyRhythm(snap.exists() ? (snap.data()["items"] as WeeklySlot[]) : defaultWeeklyRhythm);
    });

    const unsubGallery = onSnapshot(doc(db, FS, "gallery"), (snap) => {
      setGallery(snap.exists() ? (snap.data()["items"] as GalleryImage[]) : []);
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
 * Upload one File to Supabase Storage (bucket: 'gallery') and return a GalleryImage record
 * with the permanent public download URL.
 */
export async function uploadGalleryImage(
  file: File,
  id: string,
): Promise<GalleryImage> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${id}_${sanitizedName}`;

  if (isSupabaseConfigured) {
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Supabase Storage upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from("gallery").getPublicUrl(fileName);

    return {
      id,
      src: data.publicUrl,
      caption: file.name.replace(/\.[^.]+$/, ""),
    };
  }

  // Fallback to Firebase Storage if Supabase is not yet configured in .env
  try {
    const storageRef = ref(storage, `gallery/${fileName}`);
    await uploadBytes(storageRef, file);
    const src = await getDownloadURL(storageRef);
    return {
      id,
      src,
      caption: file.name.replace(/\.[^.]+$/, ""),
    };
  } catch {
    throw new Error(
      "Supabase Storage is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.",
    );
  }
}

/**
 * Delete an image from Supabase Storage or Firebase Storage by its URL.
 * Fails silently if the file is already gone.
 */
export async function deleteGalleryImage(src: string): Promise<void> {
  try {
    if (src.includes("/storage/v1/object/public/gallery/")) {
      const parts = src.split("/storage/v1/object/public/gallery/");
      if (parts[1]) {
        const filePath = decodeURIComponent(parts[1]);
        await supabase.storage.from("gallery").remove([filePath]);
        return;
      }
    }
    // Backward-compatibility: delete from Firebase Storage if it was hosted there
    if (
      src.includes("firebasestorage.app") ||
      src.includes("firebasestorage.googleapis.com")
    ) {
      const fileRef = ref(storage, src);
      await deleteObject(fileRef);
    }
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

