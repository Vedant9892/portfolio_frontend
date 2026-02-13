import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { travelApi, mylifeApi } from '../../api/api';

function normalizeImageUrl(url) {
  if (url == null) return '';
  const s = typeof url === 'string' ? url.trim() : String(url).trim();
  return s || '';
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardMotion = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Travel() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let cancelled = false;
    travelApi
      .getAll()
      .then((res) => {
        if (!cancelled) setTrips(res.data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load travel entries');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Derive hero slides: prefer heroSlides from first trip; otherwise fall back to coverImage/shortDescription.
  const primaryTrip = trips[0] || null;
  let heroSlides = [];

  if (primaryTrip?.heroSlides && primaryTrip.heroSlides.length > 0) {
    heroSlides = primaryTrip.heroSlides
      .map((slide) => ({
        image: normalizeImageUrl(slide.image),
        heading: slide.heading,
        subheading: slide.subheading,
        description: slide.description,
      }))
      .filter((s) => s.image && s.heading);
  } else if (primaryTrip) {
    const fallbackImage = normalizeImageUrl(primaryTrip.coverImage) || normalizeImageUrl(mainImage);
    if (fallbackImage) {
      heroSlides = [
        {
          image: fallbackImage,
          heading: primaryTrip.title || 'Travel Journal',
          subheading: primaryTrip.location?.name || null,
          description:
            primaryTrip.shortDescription ||
            "Places I've visited and journeys I want to remember.",
        },
      ];
    }
  } else if (mainImage) {
    const img = normalizeImageUrl(mainImage);
    if (img) {
      heroSlides = [
        {
          image: img,
          heading: 'Travel Journal',
          subheading: null,
          description: "Places I've visited and journeys I want to remember.",
        },
      ];
    }
  }

  // Auto-advance hero slide every 4s when there is more than one slide.
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev + 1;
        return next >= heroSlides.length ? 0 : next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  // Ensure currentSlide is always within bounds if slides change.
  useEffect(() => {
    if (currentSlide >= heroSlides.length && heroSlides.length > 0) {
      setCurrentSlide(0);
    }
  }, [heroSlides.length, currentSlide]);

  // Fetch main background image from the mainimage collection (MyLife)
  useEffect(() => {
    let cancelled = false;

    mylifeApi
      .get()
      .then((res) => {
        if (cancelled) return;
        const raw = res.data?.mainImage ?? res.data?.mainimage ?? null;
        const url = typeof raw === 'string' ? raw.trim() || null : null;
        setMainImage(url);
      })
      .catch(() => {
        if (!cancelled) {
          setMainImage(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text">Travel</h1>
        <p className="text-text-muted">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text">Travel</h1>
        <p className="text-red-500">Could not load travel entries. {error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
      {heroSlides.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <div className="group relative overflow-hidden rounded-3xl border-2 border-border bg-surface shadow-2xl">
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                {heroSlides.map((slide, index) =>
                  index === currentSlide ? (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0"
                    >
                      <img
                        src={slide.image}
                        alt={slide.heading}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              {heroSlides.map((slide, index) =>
                index === currentSlide ? (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative z-10 flex h-72 flex-col justify-end p-8 sm:h-96 sm:p-10"
                  >
                    {slide.subheading && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                      >
                        {slide.subheading}
                      </motion.p>
                    )}
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="mb-3 text-3xl font-extrabold text-white drop-shadow-lg sm:text-4xl lg:text-5xl"
                    >
                      {slide.heading}
                    </motion.h1>
                    {slide.description && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="max-w-2xl text-base leading-relaxed text-white/90 drop-shadow-md sm:text-lg"
                      >
                        {slide.description}
                      </motion.p>
                    )}
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border-2 border-white/30 bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 hover:border-white/50 hover:scale-110 sm:left-6"
                  aria-label="Previous slide"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border-2 border-white/30 bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 hover:border-white/50 hover:scale-110 sm:right-6"
                  aria-label="Next slide"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide ? 'w-8 bg-white shadow-lg' : 'w-2 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">Travel Journal</h1>
        <p className="text-lg text-text-muted">
          Places I&apos;ve visited and journeys I want to remember.
        </p>
      </motion.div>

      {trips.length === 0 && (
        <p className="text-center text-text-muted">
          No travel entries yet. Seed the Travel collection in the backend to see journeys here.
        </p>
      )}
      {trips.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {trips.map((trip) => (
            <Link key={trip._id} to={`/travel/${trip.slug}`}>
              <motion.article
                variants={cardMotion}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lg transition-all hover:border-primary/30 hover:shadow-2xl"
              >
                {trip.coverImage && (
                  <div className="relative h-48 w-full overflow-hidden bg-background">
                    <img
                      src={normalizeImageUrl(trip.coverImage)}
                      alt={trip.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-text line-clamp-2 transition-colors group-hover:text-primary">
                      {trip.title}
                    </h2>
                    {trip.tripType && (
                      <span className="whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {trip.tripType === 'multi-day' ? 'Multi-day' : 'One-day'}
                      </span>
                    )}
                  </div>
                  {trip.location?.name && (
                    <p className="mb-2 text-sm font-semibold text-primary">
                      {trip.location.name}
                    </p>
                  )}
                  {trip.duration && (
                    <p className="mb-3 text-xs font-medium text-text-muted">{trip.duration}</p>
                  )}
                  {trip.shortDescription && (
                    <p className="text-sm leading-relaxed text-text-muted line-clamp-3">
                      {trip.shortDescription}
                    </p>
                  )}
                </div>
              </motion.article>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}
