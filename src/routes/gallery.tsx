import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { adminStorage, type GalleryImage } from "@/hooks/useAdminData";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery � Yuvajana Sakhyam, Pattor" },
      {
        name: "description",
        content:
          "Photos from events, camps and gatherings of St. Thomas Mar Thoma Yuvajana Sakhyam, Pattor.",
      },
    ],
  }),
  component: GalleryPage,
});

function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>(() =>
    adminStorage.read<GalleryImage[]>(adminStorage.KEYS.gallery, []),
  );

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === adminStorage.KEYS.gallery) {
        setImages(
          adminStorage.read<GalleryImage[]>(adminStorage.KEYS.gallery, []),
        );
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return images;
}

function GalleryPage() {
  const images = useGallery();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prev, next]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  return (
    <div>
      <section className="border-b border-border/60 bg-secondary/40 px-4 py-12 text-center sm:px-5 sm:py-16">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">
          Our Moments
        </p>
        <h1 className="mt-4 font-serif text-3xl text-foreground sm:text-4xl md:text-5xl">
          Gallery
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
          A collection of photographs from our gatherings, camps, events and
          everyday fellowship life.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16">
        {images.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <p className="mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {images.length} {images.length === 1 ? "photo" : "photos"}
            </p>
            <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
              {images.map((img, i) => (
                <GalleryTile
                  key={img.id}
                  image={img}
                  index={i}
                  onClick={openLightbox}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}

function GalleryTile({
  image,
  index,
  onClick,
}: {
  image: GalleryImage;
  index: number;
  onClick: (index: number) => void;
}) {
  return (
    <div
      className="group mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-secondary/30 transition-shadow hover:shadow-xl"
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={image.caption ? `View photo: ${image.caption}` : `View photo ${index + 1}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(index);
        }
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={image.src}
          alt={image.caption || `Photo ${index + 1}`}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {image.caption && (
            <p className="w-full px-4 py-3 text-sm font-medium text-white">
              {image.caption}
            </p>
          )}
        </div>
      </div>
      {image.caption && (
        <p className="px-4 py-2.5 text-xs text-muted-foreground truncate">
          {image.caption}
        </p>
      )}
    </div>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[index];
  const total = images.length;
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute left-0 right-0 top-4 flex justify-center">
        <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs tracking-widest text-white/80">
          {index + 1} / {total}
        </span>
      </div>

      {total > 1 && (
        <button
          onClick={onPrev}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25 sm:left-6"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      <div className="mx-10 flex max-h-[90vh] max-w-5xl flex-col items-center gap-4 sm:mx-24">
        <img
          key={img.id}
          src={img.src}
          alt={img.caption || `Photo ${index + 1}`}
          className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
        />
        {img.caption && (
          <p className="text-center text-sm text-white/80">{img.caption}</p>
        )}
      </div>

      {total > 1 && (
        <button
          onClick={onNext}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25 sm:right-6"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-dashed border-border bg-secondary/40">
        <Images className="h-9 w-9 text-muted-foreground/50" />
      </div>
      <div>
        <p className="font-serif text-xl text-foreground">No photos yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back soon � our gallery will be updated with photos from our
          events and gatherings.
        </p>
      </div>
    </div>
  );
}
