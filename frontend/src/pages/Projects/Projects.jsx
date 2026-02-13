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
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-10"
      >
        <h1 className="mb-2 text-3xl font-bold text-text">Projects</h1>
        <p className="text-text-muted">Explore my work and side projects.</p>
      </motion.div>

      {projects.length === 0 && (
        <p className="text-text-muted">No projects yet.</p>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project.slug}`}>
            <motion.article
              variants={cardMotion}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
            >
              {project.images?.[0] && (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="mb-2 text-lg font-semibold text-text">
                  {project.title}
                </h2>
                <p className="mb-3 text-sm leading-relaxed text-text-muted line-clamp-2">
                  {project.description}
                </p>
                {project.techStack?.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-border px-2.5 py-0.5 text-xs text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 text-sm font-medium text-primary">
                  {project.liveUrl && (
                    <span className="hover:underline">Live</span>
                  )}
                  {project.githubUrl && (
                    <span className="hover:underline">GitHub</span>
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
