import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsApi } from '../../api/api';

const TABS = ['Overview', 'Features', 'Impact'];

/**
 * Renders a string or array of strings as paragraphs or list items.
 * No hardcoded content — all from project data.
 */
function renderContent(value) {
  if (value == null) return null;
  if (typeof value === 'string') return <p className="leading-relaxed text-text-muted">{value}</p>;
  if (Array.isArray(value) && value.length > 0) {
    return (
      <ul className="space-y-3">
        {value.map((item, i) => (
          <li key={i} className="flex gap-3 text-text-muted">
            <span className="mt-1.5 h-5 w-5 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

/**
 * Single reusable Project Detail page. Renders any project by slug from the URL.
 * Data from GET /api/projects/slug/:slug. Supports content.overview, content.features, content.impact.
 */
export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (!slug) {
      setError('No project specified');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setActiveTab('Overview');
    projectsApi
      .getBySlug(slug)
      .then((res) => {
        if (!cancelled) setProject(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.status === 404 ? 'Project not found' : err.message || 'Failed to load project');
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
      <div className="min-h-[60vh] px-4 py-12 sm:px-6 lg:flex lg:gap-10 lg:px-8">
        <div className="mx-auto max-w-6xl w-full">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4 aspect-video max-h-[320px] lg:max-h-[280px] animate-pulse rounded-xl bg-surface" />
            <div className="lg:col-span-8 space-y-4">
              <div className="h-8 w-48 animate-pulse rounded bg-border" />
              <div className="h-4 w-full animate-pulse rounded bg-border" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-surface p-8 text-center"
        >
          <h1 className="mb-2 text-xl font-semibold text-text">Project not found</h1>
          <p className="mb-6 text-text-muted">{error}</p>
          <Link
            to="/projects"
            className="inline-block rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-border"
          >
            Back to Projects
          </Link>
        </motion.div>
      </div>
    );
  }

  const {
    title,
    description,
    techStack,
    images,
    features,
    githubUrl,
    liveUrl,
    content = {},
  } = project;

  const heroImage = images?.[0] ?? null;
  const overviewContent = content.overview ?? description;
  const featuresContent = content.features ?? features ?? [];
  const impactContent = content.impact;

  const overviewDetails = Array.isArray(featuresContent) ? featuresContent : [];
  const overviewText = typeof overviewContent === 'string' ? overviewContent : null;
  const overviewList = Array.isArray(overviewContent) ? overviewContent : overviewDetails;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-[60vh] bg-background text-text"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* Left column (35%): hero image, short intro, tech stack, action buttons */}
          <div className="space-y-6 lg:col-span-4">
            {/* Hero: fixed aspect ratio + object-contain so image is never stretched or cropped; letterboxing uses bg-surface */}
            <div className="relative flex max-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-surface aspect-video lg:max-h-[280px]">
              {heroImage ? (
                <motion.img
                  src={heroImage}
                  alt={title}
                  className="max-h-full max-w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-muted">
                  <span className="text-sm">No image</span>
                </div>
              )}
            </div>

            {/* Short intro under image: description or content.overview, truncated to 2–3 lines */}
            {(typeof overviewContent === 'string' ? overviewContent : description) && (
              <p className="text-sm leading-relaxed text-text-muted line-clamp-3">
                {typeof overviewContent === 'string' ? overviewContent : description}
              </p>
            )}

            {techStack?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text hover:bg-border"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View Code
                </a>
              )}
            </div>
          </div>

          {/* Right column (65%): back link, title, tabs, tab content — primary reading area */}
          <div className="space-y-6 lg:col-span-8">
            <Link
              to="/projects"
              className="inline-block text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              ← Back to Projects
            </Link>

            <h1 className="text-3xl font-bold text-text sm:text-4xl">{title}</h1>

            {/* Tab navigation */}
            <nav className="flex gap-1 rounded-lg border border-border bg-surface p-1" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-background text-text shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {/* Tab panels */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {activeTab === 'Overview' && (
                  <motion.div
                    key="Overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {overviewText && (
                      <div className="space-y-4">
                        {renderContent(overviewText)}
                      </div>
                    )}
                    {overviewList?.length > 0 && (
                      <>
                        <h2 className="text-lg font-semibold text-text">Project Details</h2>
                        {renderContent(overviewList)}
                      </>
                    )}
                    {!overviewText && !(overviewList?.length > 0) && (
                      <p className="text-text-muted">No overview content yet.</p>
                    )}
                  </motion.div>
                )}

                {activeTab === 'Features' && (
                  <motion.div
                    key="Features"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {Array.isArray(featuresContent) && featuresContent.length > 0 ? (
                      renderContent(featuresContent)
                    ) : (
                      <p className="text-text-muted">No features content yet.</p>
                    )}
                  </motion.div>
                )}

                {activeTab === 'Impact' && (
                  <motion.div
                    key="Impact"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {impactContent != null && (typeof impactContent === 'string' || (Array.isArray(impactContent) && impactContent.length > 0)) ? (
                      renderContent(impactContent)
                    ) : (
                      <p className="text-text-muted">No impact content yet.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Additional images (below fold, full width) */}
        {images?.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mt-12 space-y-4"
          >
            <h2 className="text-lg font-semibold text-text">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {images.slice(1).map((url, i) => (
                <img
                  key={url}
                  src={url}
                  alt={`${title} screenshot ${i + 2}`}
                  className="w-full rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
