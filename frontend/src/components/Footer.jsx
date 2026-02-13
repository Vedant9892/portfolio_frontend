import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { personalInfoApi } from '../api/api';

const LOCATION = 'Mumbai, Maharashtra, India';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/my-life', label: 'My Life' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/terminal', label: 'Terminal' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    personalInfoApi
      .get()
      .then((res) => {
        if (!cancelled) setProfile(res.data);
      })
      .catch(() => {
        if (!cancelled) setProfile(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const name = profile?.name ?? 'Portfolio';
  const bio = profile?.bio ?? '';
  const email = profile?.email ?? '';
  const profileImage = profile?.profileImage?.trim() || null;
  const github = profile?.socials?.github?.trim() || null;
  const linkedin = profile?.socials?.linkedin?.trim() || null;

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <footer className="border-t border-border bg-surface text-text">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Profile / Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary ${profileImage ? 'hidden' : ''}`}
              >
                {initials}
              </div>
              <span className="text-lg font-bold text-text">{loading ? '…' : name}</span>
            </div>
            {bio && (
              <p className="text-sm leading-relaxed text-text-muted whitespace-pre-line">
                {bio}
              </p>
            )}
            <div className="flex gap-3">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border p-2 text-text-muted transition-colors hover:bg-border hover:text-text"
                  aria-label="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border p-2 text-text-muted transition-colors hover:bg-border hover:text-text"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              {email && (
                <li>
                  <span className="text-text">Email:</span>{' '}
                  <a href={`mailto:${email}`} className="hover:text-text">
                    {email}
                  </a>
                </li>
              )}
              <li>
                <span className="text-text">Location:</span> {LOCATION}
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-text-muted hover:text-text">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-text-muted hover:text-text">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright + Scroll to top */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-border p-2 text-text transition-colors hover:bg-border"
            aria-label="Scroll to top"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
