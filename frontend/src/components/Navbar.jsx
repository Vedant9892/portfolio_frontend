import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { webprofileApi } from '../api/api';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/travel', label: 'Travel' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/terminal', label: 'Terminal' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [profilePic, setProfilePic] = useState(null);
  const [loadingPic, setLoadingPic] = useState(true);

  useEffect(() => {
    let cancelled = false;
    webprofileApi
      .get()
      .then((res) => {
        if (!cancelled) {
          const url = res.data?.profileImageUrl ?? res.data?.profileimageurl ?? null;
          setProfilePic(typeof url === 'string' ? url.trim() || null : null);
        }
      })
      .catch(() => {
        if (!cancelled) setProfilePic(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingPic(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-14 max-w-content items-center justify-between gap-6 px-4 sm:px-6">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-primary transition-colors hover:opacity-90"
        >
          {/* Profile Photo */}
          {profilePic ? (
            <motion.img
              src={profilePic}
              alt="VedantMahajan"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onError={() => setProfilePic(null)}
            />
          ) : (
            !loadingPic && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                VM
              </div>
            )
          )}
          {/* Name */}
          <span>VedantMahajan</span>
        </NavLink>
        <ul className="flex flex-wrap items-center gap-6">
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted hover:text-text'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-lg border border-border p-2 text-text transition-colors hover:bg-border"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </motion.button>
      </div>
    </motion.nav>
  );
}
