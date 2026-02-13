import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsApi } from '../../api/api';

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

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    projectsApi
      .getAll()
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text">Projects</h1>
        <p className="text-text-muted">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text">Projects</h1>
        <p className="text-red-500">Could not load projects. {error}</p>
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
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">Projects</h1>
        <p className="text-lg text-text-muted">Explore my work and side projects.</p>
      </motion.div>

      {projects.length === 0 && (
        <p className="text-center text-text-muted">No projects yet.</p>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project.slug}`}>
            <motion.article
              variants={cardMotion}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="group h-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg transition-all hover:border-primary/30 hover:shadow-2xl"
            >
              {project.images?.[0] && (
                <div className="relative h-52 w-full overflow-hidden bg-surface">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              )}
              <div className="p-6">
                <h2 className="mb-3 text-xl font-bold text-text transition-colors group-hover:text-primary">
                  {project.title}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-text-muted line-clamp-3">
                  {project.description}
                </p>
                {project.techStack?.length > 0 && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors group-hover:bg-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm font-semibold">
                  {project.liveUrl && (
                    <span className="flex items-center gap-1.5 text-primary transition-all group-hover:gap-2">
                      <span>Live Demo</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  )}
                  {project.githubUrl && (
                    <span className="flex items-center gap-1.5 text-text-muted transition-colors group-hover:text-text">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      <span>Code</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
