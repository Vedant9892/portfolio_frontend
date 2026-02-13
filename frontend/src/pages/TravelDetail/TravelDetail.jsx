import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { travelApi } from '../../api/api';
import { useRef } from 'react';

function normalizeImageUrl(url) {
  if (url == null) return '';
  const s = typeof url === 'string' ? url.trim() : String(url).trim();
  return s || '';
}

function OptimizedImage({ src, alt, className = '' }) {
  const url = normalizeImageUrl(src);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [url]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-surface p-8 text-xs text-text-muted ${className}`}>
        No image
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-surface" aria-hidden="true" />
      )}
      {error ? (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-surface p-8 text-xs text-text-muted">
          Image unavailable
        </div>
      ) : (
        <motion.img
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
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className={`h-auto w-full rounded-xl border border-border bg-surface object-contain shadow-md transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

function DaySection({ day, index, isReversed }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative"
    >
      <div className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
        <div className={`space-y-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-primary text-lg font-bold text-white shadow-lg"
            >
              {day.dayNumber ?? index + 1}
            </motion.div>
            {day.title && (
              <h2 className="text-2xl font-bold text-text sm:text-3xl">
                {day.title}
              </h2>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm shadow-lg">
            {day.description && (
              <p className="mb-4 text-base leading-relaxed text-text-muted">
                {day.description}
              </p>
            )}
            {day.highlights && day.highlights.length > 0 && (
              <ul className="space-y-3">
                {day.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="flex gap-3 text-sm text-text-muted"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"></span>
                    <span>{h}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
          {day.images && day.images.length > 0 && (
            <div className="grid gap-4" style={{ gridTemplateColumns: day.images.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {day.images.map((imgUrl, i) => (
                <OptimizedImage
                  key={i}
                  src={imgUrl}
                  alt={`Day ${day.dayNumber ?? index + 1} - Image ${i + 1}`}
                  className="w-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {index < 99 && (
        <div className="absolute left-7 top-20 hidden h-full w-px bg-gradient-to-b from-border via-primary/30 to-transparent lg:block" aria-hidden />
      )}
    </motion.div>
  );
}

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
        <div className="mx-auto max-w-6xl">
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
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-2xl">
          <div className="relative aspect-[21/9] min-h-[200px] w-full sm:aspect-[3/1] sm:min-h-[240px]">
            {trip.coverImage ? (
              <img
                src={normalizeImageUrl(trip.coverImage)}
                alt={trip.title}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-surface" />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-4 pb-6 text-center sm:pb-8">
              <h1 className="mb-3 text-2xl font-bold text-text drop-shadow-lg sm:text-3xl lg:text-4xl">
                {trip.title}
              </h1>
              <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                {trip.location?.name && (
                  <span className="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-text backdrop-blur-sm sm:text-sm">
                    {trip.location.name}
                    {trip.location?.country && `, ${trip.location.country}`}
                  </span>
                )}
                {trip.duration && (
                  <span className="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-text-muted backdrop-blur-sm sm:text-sm">
                    {trip.duration}
                  </span>
                )}
                {trip.tripType && (
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm sm:text-sm">
                    {trip.tripType === 'multi-day' ? 'Multi-day' : 'One-day'}
                  </span>
                )}
              </div>
              {trip.shortDescription && (
                <p className="max-w-2xl text-sm text-text-muted drop-shadow-sm sm:text-base">
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

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
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
          <div className="space-y-20">
            {days.map((day, index) => (
              <DaySection
                key={index}
                day={day}
                index={index}
                isReversed={index % 2 !== 0}
              />
            ))}
          </div>
        )}

        {trip.gallery && trip.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-20"
          >
            <h2 className="mb-6 text-2xl font-bold text-text">Gallery</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {trip.gallery.map((url, i) => (
                <OptimizedImage
                  key={i}
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="w-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
