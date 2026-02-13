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
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      {heroSlides.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface">
            {/* Image slider layer: keeps same aspect ratio & overlay */}
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                {heroSlides.map((slide, index) =>
                  index === currentSlide ? (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6 }}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </div>
            {/* Text layer: synced with currentSlide */}
            <AnimatePresence mode="wait">
              {heroSlides.map((slide, index) =>
                index === currentSlide ? (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 flex h-64 flex-col justify-end p-6 sm:h-80 sm:p-8"
                  >
                    {slide.subheading && (
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {slide.subheading}
                      </p>
                    )}
                    <h1 className="mb-1 text-2xl font-bold text-text sm:text-3xl">
                      {slide.heading}
                    </h1>
                    {slide.description && (
                      <p className="max-w-xl text-sm text-text-muted sm:text-base">
                        {slide.description}
                      </p>
                    )}
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-10"
      >
        <h1 className="mb-2 text-3xl font-bold text-text">Travel Journal</h1>
        <p className="text-text-muted">
          Places I&apos;ve visited and journeys I want to remember.
        </p>
      </motion.div>

      {trips.length === 0 && (
        <p className="text-text-muted">
          No travel entries yet. Seed the Travel collection in the backend to see journeys here.
        </p>
      )}
      {trips.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {trips.map((trip) => (
            <Link key={trip._id} to={`/travel/${trip.slug}`}>
              <motion.article
                variants={cardMotion}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
              >
                {trip.coverImage && (
                  <div className="relative h-44 w-full overflow-hidden bg-background">
                    <img
                      src={normalizeImageUrl(trip.coverImage)}
                      alt={trip.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-text line-clamp-2">
                      {trip.title}
                    </h2>
                    {trip.tripType && (
                      <span className="whitespace-nowrap rounded-full bg-border px-2 py-0.5 text-xs font-medium text-text-muted">
                        {trip.tripType === 'multi-day' ? 'Multi-day' : 'One-day'}
                      </span>
                    )}
                  </div>
                  {trip.location?.name && (
                    <p className="mb-1 text-xs font-medium text-primary">
                      {trip.location.name}
                    </p>
                  )}
                  {trip.duration && (
                    <p className="mb-3 text-xs text-text-muted">{trip.duration}</p>
                  )}
                  {trip.shortDescription && (
                    <p className="mb-4 text-sm text-text-muted line-clamp-3">
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
