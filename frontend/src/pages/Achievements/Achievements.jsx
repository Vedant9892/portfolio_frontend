import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { achievementsApi } from '../../api/api';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardMotion = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    achievementsApi
      .getAll()
      .then((res) => setAchievements(res.data))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text">Achievements</h1>
        <p className="text-text-muted">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text">Achievements</h1>
        <p className="text-red-500">Could not load achievements. {error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">Achievements</h1>
        <p className="text-lg text-text-muted">Awards, certifications, and milestones.</p>
      </motion.div>

      {achievements.length === 0 && (
        <p className="text-center text-text-muted">
          No achievements yet. Run <code className="rounded bg-border px-1">npm run seed:achievements</code> in the backend.
        </p>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2"
      >
        {achievements.map((entry) => (
          <motion.div
            key={entry._id}
            variants={cardMotion}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-lg transition-all hover:border-primary/30 hover:shadow-2xl"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 transition-all group-hover:scale-150 group-hover:bg-primary/10"></div>
            <div className="relative">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-md transition-all group-hover:scale-110 group-hover:bg-primary/20">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-text transition-colors group-hover:text-primary">
                    {entry.title}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                  {entry.year}
                </span>
              </div>
              {entry.organization && (
                <p className="mb-3 text-base font-semibold text-primary">
                  {entry.organization}
                </p>
              )}
              {entry.description && (
                <p className="mb-5 text-sm leading-relaxed text-text-muted">
                  {entry.description}
                </p>
              )}
              {entry.highlights?.length > 0 && (
                <ul className="mb-5 space-y-2 text-sm text-text-muted">
                  {entry.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {entry.certificateUrl && (
                <div className="mt-5">
                  <motion.a
                    href={entry.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-md"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    View Certificate
                  </motion.a>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
