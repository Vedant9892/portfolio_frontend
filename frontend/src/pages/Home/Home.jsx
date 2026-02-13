import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { personalInfoApi } from '../../api/api';

function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    personalInfoApi
      .get()
      .then((res) => setInfo(res.data))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-text-muted"
        >
          Loading…
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
        <p className="text-red-500">Could not load profile: {error}</p>
      </div>
    );
  }

  const initials = getInitials(info.name);

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-16 text-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-2xl"
      >
        <motion.p
          variants={item}
          className="mb-6 text-sm font-medium uppercase tracking-wider text-text-muted"
        >
          Welcome to my Portfolio
        </motion.p>

        <motion.div variants={item} className="mb-6">
          {info.profileImage ? (
            <img
              src={info.profileImage}
              alt={info.name}
              className="mx-auto h-36 w-36 rounded-full border-4 border-border object-cover"
            />
          ) : (
            <div
              className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-4 border-border bg-border text-3xl font-bold text-text"
              aria-hidden="true"
            >
              {initials}
            </div>
          )}
        </motion.div>

        <motion.h1
          variants={item}
          className="mb-3 text-3xl font-bold tracking-tight text-text sm:text-4xl"
        >
          Hi, I'm {info.name}
        </motion.h1>
        {info.bio && (
          <motion.p
            variants={item}
            className="mx-auto mb-8 max-w-md text-base leading-relaxed text-text-muted"
          >
            {info.bio}
          </motion.p>
        )}

        <motion.div
          variants={item}
          className="mb-8 flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/projects"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow"
          >
            View My Work
          </Link>
          <Link
            to="/terminal"
            className="rounded-lg border-2 border-border bg-transparent px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-border"
          >
            Terminal
          </Link>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-lg border-2 border-border bg-transparent px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-border"
          >
            Resume
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="flex flex-wrap justify-center gap-4"
        >
          {info.socials?.github && (
            <a
              href={info.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
              aria-label="GitHub"
            >
              GitHub
            </a>
          )}
          {info.socials?.linkedin && (
            <a
              href={info.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
