import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { experienceApi, personalInfoApi } from '../../api/api';

function formatEndDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemMotion = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([experienceApi.getAll(), personalInfoApi.get()])
      .then(([expRes, infoRes]) => {
        if (cancelled) return;
        setExperience(expRes.data || []);
        setResumeUrl(infoRes.data?.resume || null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-3xl font-bold text-text">Work Experience</h1>
          <p className="text-text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-3xl font-bold text-text">Work Experience</h1>
          <p className="text-red-500">Could not load experience. {error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-[60vh] bg-background text-text"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <h1 className="mb-2 text-3xl font-bold text-text sm:text-4xl">
            Work Experience
          </h1>
          <p className="text-text-muted">
            My professional journey and accomplishments.
          </p>
        </motion.div>

        {/* Main grid: left = experience cards, right = resume panel */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left column (~65%): experience cards */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-6 lg:col-span-8"
          >
            {experience.length === 0 && (
              <p className="text-sm text-text-muted">
                No experience entries yet. Run{' '}
                <code className="rounded bg-border px-1">npm run seed:experience</code>{' '}
                in the backend.
              </p>
            )}

            {experience.map((entry) => (
              <motion.article
                key={entry._id}
                variants={itemMotion}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-text">
                      {entry.organization}
                    </h2>
                    <p className="text-sm font-medium text-primary">
                      {entry.title}
                    </p>
                    {entry.type && (
                      <p className="mt-1 text-xs uppercase tracking-wide text-text-muted">
                        {entry.type}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 text-right text-xs text-text-muted">
                    <div className="flex items-center justify-end gap-1">
                      <svg
                        className="h-4 w-4 text-text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatEndDate(entry.endDate)}</span>
                    </div>
                    {entry.location && (
                      <div className="flex items-center justify-end gap-1">
                        <svg
                          className="h-4 w-4 text-text-muted"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 11a3 3 0 100-6 3 3 0 000 6z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 22s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"
                          />
                        </svg>
                        <span>{entry.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {entry.description && (
                  <p className="mb-4 text-sm text-text-muted">
                    {entry.description}
                  </p>
                )}

                {entry.responsibilities?.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-text">
                      Key Responsibilities &amp; Achievements
                    </h3>
                    <ul className="space-y-2 text-sm text-text-muted">
                      {entry.responsibilities.map((r, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
              </motion.article>
            ))}
          </motion.div>

          {/* Right column (~35%): resume panel */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-text">Resume</h2>
                <p className="text-xs text-text-muted">
                  Professional experience &amp; skills
                </p>
              </div>
              <div className="rounded-lg bg-background/60 p-2 text-text-muted">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-background/40 aspect-[3/4]">
              {resumeUrl ? (
                <iframe
                  src={resumeUrl}
                  title="Resume preview"
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs text-text-muted">
                  Resume link is not available yet. Add a Supabase URL to the
                  <code className="mx-1 rounded bg-border px-1">resume</code>
                  field in your personal info document.
                </div>
              )}
            </div>

            <div className="space-y-3">
              {resumeUrl ? (
                <>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
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
                        d="M15 13l-3 3m0 0l-3-3m3 3V5m-4 14h8a2 2 0 002-2v-1"
                      />
                    </svg>
                    View Resume
                  </a>
                  <a
                    href={resumeUrl}
                    download
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text hover:bg-border"
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
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                      />
                    </svg>
                    Download PDF
                  </a>
                </>
              ) : (
                <p className="text-xs text-text-muted">
                  Once a resume URL is added, buttons to view and download it
                  will appear here.
                </p>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </motion.div>
  );
}
