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
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-10"
      >
        <h1 className="mb-2 text-3xl font-bold text-text">Achievements</h1>
        <p className="text-text-muted">Awards, certifications, and milestones.</p>
      </motion.div>

      {achievements.length === 0 && (
        <p className="text-text-muted">
          No achievements yet. Run <code className="rounded bg-border px-1">npm run seed:achievements</code> in the backend.
        </p>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2"
      >
        {achievements.map((entry) => (
          <motion.div
            key={entry._id}
            variants={cardMotion}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h2 className="text-lg font-semibold text-text">
                {entry.title}
              </h2>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                {entry.year}
              </span>
            </div>
            {entry.organization && (
              <p className="mb-2 text-sm font-medium text-primary">
                {entry.organization}
              </p>
            )}
            {entry.description && (
              <p className="mb-4 text-sm leading-relaxed text-text-muted">
                {entry.description}
              </p>
            )}
            {entry.highlights?.length > 0 && (
              <ul className="mb-4 space-y-1.5 text-sm text-text-muted">
                {entry.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {entry.certificateUrl && (
              <div className="mt-4">
                <a
                  href={entry.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-border hover:text-primary"
                >
                  <svg
                    className="h-3.5 w-3.5"
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
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
