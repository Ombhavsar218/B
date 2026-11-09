import { useState } from 'react';
import { X, Heart, Mail, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

interface MemoryGalleryModalProps {
  open: boolean;
  initialPhotoId?: string | null;
  onClose: () => void;
}

export function MemoryGalleryModal({
  open,
  initialPhotoId,
  onClose,
}: MemoryGalleryModalProps) {
  const [tab, setTab] = useState<'photos' | 'letters'>('photos');
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (!initialPhotoId) return 0;
    const idx = birthdayConfig.photos.findIndex((p) => p.id === initialPhotoId);
    return idx >= 0 ? idx : 0;
  });

  if (!open) return null;

  const photos = birthdayConfig.photos;
  const activePhoto = photos[selectedIndex] ?? photos[0];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#3B2B4B]/40 p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Memory Pavilion Gallery"
      onClick={onClose}
    >
      <div
        className="storybook-panel flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8D6EC2] uppercase">
              Memory Pavilion
            </p>
            <h2 className="font-display text-3xl font-bold text-[#3B2B4B]">
              Family Photos &amp; Birthday Letters
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E2B362]/45 bg-white/80 text-[#3B2B4B] hover:bg-white"
            aria-label="Close memory gallery"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab('photos')}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              tab === 'photos'
                ? 'bg-[#3B2B4B] text-[#FFF9F2]'
                : 'border border-[#E2B362]/45 bg-white/70 text-[#4B3860]'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Photo Gallery ({photos.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('letters')}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              tab === 'letters'
                ? 'bg-[#3B2B4B] text-[#FFF9F2]'
                : 'border border-[#E2B362]/45 bg-white/70 text-[#4B3860]'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Birthday Letters ({birthdayConfig.letters.length})</span>
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {tab === 'photos' ? (
            <div className="space-y-4">
              {/* Featured Photo Card */}
              <div
                className="relative overflow-hidden rounded-2xl border-4 p-5 shadow-md"
                style={{
                  borderColor: activePhoto.frameTint,
                  background: `linear-gradient(135deg, ${activePhoto.palette[0]}90, ${activePhoto.palette[1]}90)`,
                }}
              >
                <div className="flex flex-col items-center justify-center rounded-xl border border-white/80 bg-white/55 px-6 py-10 text-center">
                  {activePhoto.imageUrl ? (
                    <img
                      src={activePhoto.imageUrl}
                      alt={activePhoto.title}
                      className="max-h-60 rounded-xl object-cover shadow"
                    />
                  ) : (
                    <>
                      <Heart className="h-10 w-10 fill-[#F59BB9]/70 text-[#B8688D]" />
                      <p className="mt-2 text-xs font-semibold tracking-wider text-[#6E5098] uppercase">
                        Photo Placeholder &middot; {activePhoto.date}
                      </p>
                    </>
                  )}
                  <h3 className="font-display mt-2 text-2xl font-bold text-[#3B2B4B]">
                    {activePhoto.title}
                  </h3>
                  <p className="mt-1 max-w-md text-sm text-[#55426B]">
                    {activePhoto.caption}
                  </p>
                </div>

                {/* Prev/Next */}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length)
                    }
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#3B2B4B] hover:bg-white"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>
                  <span className="text-xs font-medium text-[#5A4570]">
                    {selectedIndex + 1} / {photos.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex((prev) => (prev + 1) % photos.length)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#3B2B4B] hover:bg-white"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`cursor-pointer rounded-xl border-2 p-2.5 text-left transition ${
                      idx === selectedIndex
                        ? 'border-[#C8842B] bg-white shadow-sm'
                        : 'border-white/70 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div
                      className="h-12 w-full rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${photo.palette[0]}, ${photo.palette[1]})`,
                      }}
                    />
                    <p className="mt-1.5 truncate text-xs font-semibold text-[#3B2B4B]">
                      {photo.title}
                    </p>
                    <p className="text-[10px] text-[#7D6696]">{photo.date}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {birthdayConfig.letters.map((letter) => (
                <article
                  key={letter.id}
                  className="rounded-2xl border border-[#E2B362]/40 bg-white/75 p-5 shadow-sm"
                >
                  <p className="text-[11px] font-semibold tracking-wider text-[#8D6EC2] uppercase">
                    {letter.from}
                  </p>
                  <h3 className="font-display mt-1 text-2xl font-bold text-[#3B2B4B]">
                    {letter.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#4E3A63]">{letter.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
