import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { travelApi } from '../../api/api';

/** Normalize image URL from API (trim, avoid empty). */
function normalizeImageUrl(url) {
  if (url == null) return '';
  const s = typeof url === 'string' ? url.trim() : String(url).trim();
  return s || '';
}

/**
 * Optimized Image component with lazy loading, async decoding, and fade-in.
 * Resets state when src changes so new URLs (e.g. WebP) don't show stale "Image unavailable".
 * referrerPolicy="no-referrer" helps with cross-origin CDNs (e.g. Supabase).
 */
function OptimizedImage({ src, alt, className = '', aspectRatio = 'aspect-video' }) {
  const url = normalizeImageUrl(src);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Reset load state when URL changes so we don't show "Image unavailable" for a new valid URL
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [url]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-surface text-xs text-text-muted ${aspectRatio} ${className}`}>
        No image
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-surface" aria-hidden="true" />
      )}
      {error ? (
        <div className="flex h-full w-full items-center justify-center bg-surface text-xs text-text-muted">
          Image unavailable
        </div>
      ) : (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(false);
          }}
          className={`h-full w-full object-contain transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemMotion = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

/**
 * TravelDetail: single trip by slug from GET /api/travel/slug/:slug.
 * Hero (cover + title + badges + shortDescription) then day-by-day timeline.
 * Desktop: vertical timeline line + cards; mobile: stacked cards.
 */
export default function TravelDetail() {
  const { slug } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setError('No trip specified');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    travelApi
      .getBySlug(slug)
      .then((res) => {
        if (!cancelled) setTrip(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? 'Trip not found'
              : err.message || 'Failed to load trip'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="h-64 sm:h-80 animate-pulse rounded-2xl bg-surface" />
          <div className="mt-8 space-y-4">
            <div className="h-8 w-3/4 max-w-md animate-pulse rounded bg-border" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded bg-border" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-border" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <p className="text-red-500">{error || 'Trip not found.'}</p>
        <Link
          to="/travel"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          ← Back to Travel
        </Link>
      </div>
    );
  }

  const days = Array.isArray(trip.days) ? trip.days : [];
  const hasDays = days.length > 0;

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface sm:rounded-3xl">
          {/* Cover image + gradient overlay */}
          <div className="relative aspect-[21/9] min-h-[200px] w-full sm:aspect-[3/1] sm:min-h-[240px]">
            {trip.coverImage ? (
              <>
                {/* Hero image: eager load (above fold); referrerPolicy helps cross-origin (e.g. WebP from Supabase) */}
                <img
                  src={normalizeImageUrl(trip.coverImage)}
                  alt={trip.title}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"
                  aria-hidden
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-surface" />
            )}
            {/* Centered title + badges + short description */}
            <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-6 text-center sm:pb-8">
              <h1 className="mb-3 text-2xl font-bold text-text drop-shadow-sm sm:text-3xl lg:text-4xl">
                {trip.title}
              </h1>
              <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                {trip.location?.name && (
                  <span className="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-text backdrop-blur sm:text-sm">
                    {trip.location.name}
                    {trip.location?.country && `, ${trip.location.country}`}
                  </span>
                )}
                {trip.duration && (
                  <span className="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-text-muted backdrop-blur sm:text-sm">
                    {trip.duration}
                  </span>
                )}
                {trip.tripType && (
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary sm:text-sm">
                    {trip.tripType === 'multi-day' ? 'Multi-day' : 'One-day'}
                  </span>
                )}
              </div>
              {trip.shortDescription && (
                <p className="max-w-2xl text-sm text-text-muted sm:text-base">
                  {trip.shortDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        <Link
          to="/travel"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          ← Back to Travel
        </Link>
      </motion.section>

      {/* Journey Timeline */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {!hasDays && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-text-muted"
          >
            No day-by-day entries for this trip yet.
          </motion.p>
        )}

        {hasDays && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Desktop: vertical line on left */}
            <div
              className="absolute left-5 top-0 bottom-0 w-px bg-border hidden sm:block sm:left-6"
              aria-hidden
            />

            <ul className="space-y-10 sm:space-y-12">
              {days.map((day, index) => (
                <motion.li
                  key={index}
                  variants={itemMotion}
                  className="relative flex gap-6 sm:gap-8"
                >
                  {/* Day number badge — sits on the timeline line on desktop */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface text-sm font-bold text-primary sm:h-12 sm:w-12 sm:text-base">
                    {day.dayNumber ?? index + 1}
                  </div>

                  {/* Card content */}
                  <div className="min-w-0 flex-1 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
                    {day.title && (
                      <h2 className="mb-3 text-lg font-semibold text-text sm:text-xl">
                        {day.title}
                      </h2>
                    )}
                    {day.description && (
                      <p className="mb-4 text-sm leading-relaxed text-text-muted sm:text-base">
                        {day.description}
                      </p>
                    )}
                    {day.highlights && day.highlights.length > 0 && (
                      <ul className="mb-4 space-y-2">
                        {day.highlights.map((h, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-text-muted"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Optional image grid for this day */}
                    {day.images && day.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {day.images.map((imgUrl, i) => (
                          <OptimizedImage
                            key={i}
                            src={imgUrl}
                            alt={`Day ${day.dayNumber ?? index + 1} ${i + 1}`}
                            aspectRatio="aspect-video"
                            className="rounded-lg border border-border bg-background"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Optional trip gallery below timeline */}
        {trip.gallery && trip.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="mb-4 text-lg font-semibold text-text">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {trip.gallery.map((url, i) => (
                <OptimizedImage
                  key={i}
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  aspectRatio="aspect-[4/3]"
                  className="rounded-xl border border-border bg-surface"
                />
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
