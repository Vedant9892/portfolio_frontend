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
    <section className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-20 text-center">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl"
      >
        <motion.p
          variants={item}
          className="mb-8 text-sm font-bold uppercase tracking-widest text-primary"
        >
          Welcome to my Portfolio
        </motion.p>

        <motion.div variants={item} className="mb-8">
          {info.profileImage ? (
            <motion.img
              src={info.profileImage}
              alt={info.name}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="mx-auto h-40 w-40 rounded-full border-4 border-primary/20 object-cover shadow-2xl ring-4 ring-primary/10"
            />
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10 text-4xl font-bold text-primary shadow-2xl ring-4 ring-primary/10"
              aria-hidden="true"
            >
              {initials}
            </motion.div>
          )}
        </motion.div>

        <motion.h1
          variants={item}
          className="mb-5 text-5xl font-extrabold tracking-tight text-text sm:text-6xl lg:text-7xl"
        >
          Hi, I&apos;m <span className="gradient-text">{info.name}</span>
        </motion.h1>
        {info.bio && (
          <motion.p
            variants={item}
            className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-text-muted sm:text-xl"
          >
            {info.bio}
          </motion.p>
        )}

        <motion.div
          variants={item}
          className="mb-10 flex flex-wrap justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/projects"
              className="group relative overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-transform group-hover:scale-105"></div>
              <span className="relative flex items-center gap-2">
                View My Work
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/terminal"
              className="rounded-xl border-2 border-border bg-surface px-8 py-4 text-base font-bold text-text shadow-md transition-all hover:border-primary hover:bg-primary/5 hover:shadow-lg"
            >
              Terminal
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/experience"
              className="rounded-xl border-2 border-border bg-surface px-8 py-4 text-base font-bold text-text shadow-md transition-all hover:border-primary hover:bg-primary/5 hover:shadow-lg"
            >
              Resume
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={item}
          className="flex flex-wrap justify-center gap-6"
        >
          {info.socials?.github && (
            <motion.a
              href={info.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              className="flex items-center gap-2 text-base font-semibold text-text-muted transition-colors hover:text-primary"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </motion.a>
          )}
          {info.socials?.linkedin && (
            <motion.a
              href={info.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              className="flex items-center gap-2 text-base font-semibold text-text-muted transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
