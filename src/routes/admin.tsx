import { createFileRoute } from "@tanstack/react-router";
import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Lock,
  LogOut,
  Upload,
  Image as ImageIcon,
  Calendar,
  Clock3,
  MapPin,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import {
  adminStorage,
  useAdminData,
  type GalleryImage,
  type WeeklySlot,
} from "@/hooks/useAdminData";
import {
  events as defaultEvents,
  pastEvents as defaultPastEvents,
  weeklyRhythm as defaultWeeklyRhythm,
  type CommunityEvent,
} from "@/data/site";

// ─── Auth ────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "ys-pattor-2026"; // Change this!
const AUTH_KEY = "admin:authenticated";

function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

// ─── Route ───────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Yuvajana Sakhyam, Pattor" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyEvent(): CommunityEvent {
  return {
    id: uid(),
    title: "",
    date: "",
    time: "",
    place: "",
    description: "",
  };
}

// ─── Main page ───────────────────────────────────────────────────────────────
function AdminPage() {
  const [authed, setAuthed] = useState(isAuthenticated);

  if (!authed) {
    return <LoginGate onSuccess={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={() => setAuthed(false)} />;
}

// ─── Login gate ──────────────────────────────────────────────────────────────
function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "true");
      onSuccess();
    } else {
      setError(true);
      setPw("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Lock className="h-7 w-7 text-primary" />
        </div>

        <h1 className="mb-1 text-center font-serif text-3xl text-foreground">
          Admin Access
        </h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Yuvajana Sakhyam, Pattor
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setError(false);
              }}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none ring-ring transition focus:ring-2"
              placeholder="Enter admin password"
              autoFocus
            />
            {error && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" /> Incorrect password
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
type Tab = "events" | "past" | "rhythm" | "gallery";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("events");
  const { events, pastEvents, weeklyRhythm, gallery } = useAdminData();

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    onLogout();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "events", label: "Upcoming Events" },
    { id: "past", label: "Past Events" },
    { id: "rhythm", label: "Weekly Rhythm" },
    { id: "gallery", label: "Gallery" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <LayoutDashboard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">
                Admin
              </p>
              <p className="font-serif text-sm text-foreground">
                Yuvajana Sakhyam
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-destructive hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Tabs */}
        <div className="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-secondary/60 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {tab === "events" && (
          <EventsPanel
            title="Upcoming Events"
            events={events}
            onSave={(updated) => {
              adminStorage.saveEvents(updated);
            }}
            defaultList={defaultEvents}
          />
        )}
        {tab === "past" && (
          <EventsPanel
            title="Past Events"
            events={pastEvents}
            onSave={(updated) => {
              adminStorage.savePastEvents(updated);
            }}
            defaultList={defaultPastEvents}
          />
        )}
        {tab === "rhythm" && (
          <WeeklyRhythmPanel
            slots={weeklyRhythm}
            onSave={adminStorage.saveWeeklyRhythm}
            defaultSlots={defaultWeeklyRhythm}
          />
        )}
        {tab === "gallery" && (
          <GalleryPanel
            images={gallery}
            onSave={adminStorage.saveGallery}
          />
        )}
      </div>
    </div>
  );
}

// ─── Events Panel ─────────────────────────────────────────────────────────────
function EventsPanel({
  title,
  events,
  onSave,
  defaultList,
}: {
  title: string;
  events: CommunityEvent[];
  onSave: (data: CommunityEvent[]) => void;
  defaultList: CommunityEvent[];
}) {
  const [editing, setEditing] = useState<CommunityEvent | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState("");

  function openNew() {
    setEditing(emptyEvent());
    setIsNew(true);
  }

  function openEdit(ev: CommunityEvent) {
    setEditing({ ...ev });
    setIsNew(false);
  }

  function closeModal() {
    setEditing(null);
  }

  function handleSave(ev: CommunityEvent) {
    let updated: CommunityEvent[];
    if (isNew) {
      updated = [...events, ev];
    } else {
      updated = events.map((e) => (e.id === ev.id ? ev : e));
    }
    onSave(updated);
    setEditing(null);
    showToast(isNew ? "Event added ✓" : "Event updated ✓");
  }

  function handleDelete(id: string) {
    const updated = events.filter((e) => e.id !== id);
    onSave(updated);
    showToast("Event deleted");
  }

  function handleReset() {
    onSave(defaultList);
    showToast("Reset to defaults ✓");
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const copy = [...events];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    onSave(copy);
  }

  function moveDown(index: number) {
    if (index === events.length - 1) return;
    const copy = [...events];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
    onSave(copy);
  }

  return (
    <section>
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl text-foreground">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            Reset to defaults
          </button>
          <button
            id={`add-event-btn-${title.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add event
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          <Check className="h-4 w-4" /> {toast}
        </div>
      )}

      {/* Event cards */}
      {events.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No events yet. Click "Add event" to create one.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((ev, i) => (
          <div
            key={ev.id}
            className="group relative rounded-2xl border border-border bg-card p-5 transition hover:shadow-md"
          >
            {/* Reorder buttons */}
            <div className="absolute right-12 top-4 flex flex-col gap-0.5 opacity-0 transition group-hover:opacity-100">
              <button
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
                title="Move up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => moveDown(i)}
                disabled={i === events.length - 1}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
                title="Move down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="absolute right-3 top-3 flex gap-1">
              <button
                onClick={() => openEdit(ev)}
                className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-secondary hover:text-foreground group-hover:opacity-100"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(ev.id)}
                className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-xs uppercase tracking-widest text-primary">
              {ev.date}
            </p>
            <h3 className="mt-1.5 font-serif text-lg text-card-foreground">
              {ev.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {ev.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3 w-3 text-primary" /> {ev.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-primary" /> {ev.place}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editing && (
        <EventModal
          event={editing}
          isNew={isNew}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </section>
  );
}

// ─── Event Modal ──────────────────────────────────────────────────────────────
function EventModal({
  event,
  isNew,
  onSave,
  onClose,
}: {
  event: CommunityEvent;
  isNew: boolean;
  onSave: (ev: CommunityEvent) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CommunityEvent>(event);

  function set(field: keyof CommunityEvent, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({ ...form, id: form.id || uid() });
  }

  const fields: {
    key: keyof CommunityEvent;
    label: string;
    type?: string;
    placeholder?: string;
    icon?: React.ReactNode;
  }[] = [
    { key: "title", label: "Title", placeholder: "Event name" },
    {
      key: "date",
      label: "Date",
      type: "date",
      icon: <Calendar className="h-3.5 w-3.5" />,
    },
    {
      key: "time",
      label: "Time",
      placeholder: "e.g. 9:00 AM",
      icon: <Clock3 className="h-3.5 w-3.5" />,
    },
    {
      key: "place",
      label: "Venue",
      placeholder: "Church hall, Pattor…",
      icon: <MapPin className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-serif text-xl text-card-foreground">
            {isNew ? "New Event" : "Edit Event"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label
                htmlFor={`event-${f.key}`}
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {f.label}
              </label>
              <input
                id={`event-${f.key}`}
                type={f.type ?? "text"}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                required={f.key !== "description"}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none ring-ring transition focus:ring-2"
              />
            </div>
          ))}

          {/* Description */}
          <div>
            <label
              htmlFor="event-description"
              className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Description
            </label>
            <textarea
              id="event-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none ring-ring transition focus:ring-2"
              placeholder="Short description of the event…"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <Check className="h-4 w-4" />
              {isNew ? "Add event" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Weekly Rhythm Panel ──────────────────────────────────────────────────────
function WeeklyRhythmPanel({
  slots,
  onSave,
  defaultSlots,
}: {
  slots: WeeklySlot[];
  onSave: (data: WeeklySlot[]) => void;
  defaultSlots: WeeklySlot[];
}) {
  const [local, setLocal] = useState<WeeklySlot[]>(slots);
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newSlot, setNewSlot] = useState<WeeklySlot>({
    day: "",
    time: "",
    title: "",
    detail: "",
  });

  function setField(
    index: number,
    field: keyof WeeklySlot,
    value: string,
  ) {
    setLocal((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  }

  function deleteSlot(index: number) {
    setLocal((prev) => prev.filter((_, i) => i !== index));
  }

  function addSlot() {
    if (!newSlot.title.trim()) return;
    setLocal((prev) => [...prev, { ...newSlot }]);
    setNewSlot({ day: "", time: "", title: "", detail: "" });
    setAdding(false);
  }

  function handleSave() {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    setLocal(defaultSlots);
    onSave(defaultSlots);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl text-foreground">Weekly Rhythm</h2>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            Reset to defaults
          </button>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add slot
          </button>
        </div>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          <Check className="h-4 w-4" /> Saved ✓
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {local.map((slot, i) => (
          <div
            key={i}
            className="group relative rounded-2xl border border-border bg-card p-5"
          >
            <button
              onClick={() => deleteSlot(i)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            {(["day", "time", "title", "detail"] as (keyof WeeklySlot)[]).map(
              (field) => (
                <div key={field} className="mb-3 last:mb-0">
                  <label className="mb-0.5 block text-xs uppercase tracking-wider text-muted-foreground">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={slot[field]}
                    onChange={(e) => setField(i, field, e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none ring-ring transition focus:ring-2"
                  />
                </div>
              ),
            )}
          </div>
        ))}

        {/* Add new slot card */}
        {adding && (
          <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-card p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-primary">
              New slot
            </p>
            {(
              ["day", "time", "title", "detail"] as (keyof WeeklySlot)[]
            ).map((field) => (
              <div key={field} className="mb-3 last:mb-0">
                <label className="mb-0.5 block text-xs uppercase tracking-wider text-muted-foreground">
                  {field}
                </label>
                <input
                  type="text"
                  value={newSlot[field]}
                  onChange={(e) =>
                    setNewSlot((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none ring-ring transition focus:ring-2"
                />
              </div>
            ))}
            <div className="mt-3 flex gap-2">
              <button
                onClick={addSlot}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                <Check className="h-3.5 w-3.5" /> Add
              </button>
              <button
                onClick={() => setAdding(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Check className="h-4 w-4" /> Save all changes
        </button>
      </div>
    </section>
  );
}

// ─── Gallery Panel ────────────────────────────────────────────────────────────
function GalleryPanel({
  images,
  onSave,
}: {
  images: GalleryImage[];
  onSave: (data: GalleryImage[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      setError("");
      const MAX_SIZE = 4 * 1024 * 1024; // 4 MB per image
      const allowed = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (allowed.length === 0) {
        setError("Please select image files (JPEG, PNG, WebP, GIF).");
        return;
      }

      let loaded = 0;
      const newImages: GalleryImage[] = [];

      allowed.forEach((file) => {
        if (file.size > MAX_SIZE) {
          setError(`"${file.name}" is too large (max 4 MB).`);
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          const src = ev.target?.result as string;
          newImages.push({
            id: uid(),
            src,
            caption: file.name.replace(/\.[^.]+$/, ""),
          });
          loaded++;
          if (loaded === allowed.length) {
            const updated = [...images, ...newImages];
            try {
              onSave(updated);
              showToast(`${newImages.length} image(s) added ✓`);
            } catch (err: unknown) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Storage full — try removing some images first.",
              );
            }
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [images, onSave],
  );

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    processFiles(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }

  function deleteImage(id: string) {
    const updated = images.filter((img) => img.id !== id);
    onSave(updated);
    showToast("Image removed");
  }

  function updateCaption(id: string, caption: string) {
    const updated = images.map((img) =>
      img.id === id ? { ...img, caption } : img,
    );
    onSave(updated);
    setEditingId(null);
    showToast("Caption updated ✓");
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl text-foreground">
          Image Gallery
        </h2>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" /> Upload images
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          id="gallery-file-input"
        />
      </div>

      {/* Toast */}
      {toast && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          <Check className="h-4 w-4" /> {toast}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`mb-6 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/40"
        }`}
      >
        <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Drag & drop images here, or{" "}
          <span className="text-primary underline">click to browse</span>
        </p>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP, GIF · max 4 MB each
        </p>
      </div>

      {/* Gallery grid */}
      {images.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No images yet. Upload some above.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <GalleryCard
            key={img.id}
            image={img}
            isEditing={editingId === img.id}
            onEdit={() => setEditingId(img.id)}
            onCancelEdit={() => setEditingId(null)}
            onSaveCaption={(c) => updateCaption(img.id, c)}
            onDelete={() => deleteImage(img.id)}
          />
        ))}
      </div>
    </section>
  );
}

function GalleryCard({
  image,
  isEditing,
  onEdit,
  onCancelEdit,
  onSaveCaption,
  onDelete,
}: {
  image: GalleryImage;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveCaption: (caption: string) => void;
  onDelete: () => void;
}) {
  const [caption, setCaption] = useState(image.caption);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image.src}
          alt={image.caption}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {/* Overlay actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="rounded-full bg-white/90 p-2 text-foreground transition hover:bg-white"
            title="Edit caption"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-full bg-white/90 p-2 text-destructive transition hover:bg-white"
            title="Delete image"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="p-3">
        {isEditing ? (
          <div className="flex gap-1.5">
            <input
              autoFocus
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveCaption(caption);
                if (e.key === "Escape") onCancelEdit();
              }}
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none ring-ring focus:ring-2"
            />
            <button
              onClick={() => onSaveCaption(caption)}
              className="rounded-lg bg-primary p-1.5 text-primary-foreground"
            >
              <Check className="h-3 w-3" />
            </button>
            <button
              onClick={onCancelEdit}
              className="rounded-lg border border-border p-1.5 text-muted-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <p
            className="cursor-pointer truncate text-xs text-muted-foreground transition hover:text-foreground"
            onClick={onEdit}
            title={image.caption}
          >
            {image.caption || "Click to add caption"}
          </p>
        )}
      </div>
    </div>
  );
}
