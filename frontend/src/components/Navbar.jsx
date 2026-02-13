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
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-md shadow-sm"
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-6 px-4 sm:px-6">
        <NavLink
          to="/"
          className="group flex items-center gap-2.5 text-lg font-bold text-primary transition-all hover:gap-3"
        >
          {profilePic ? (
            <motion.img
              src={profilePic}
              alt="VedantMahajan"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30 transition-all group-hover:ring-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onError={() => setProfilePic(null)}
            />
          ) : (
            !loadingPic && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary ring-2 ring-primary/30 transition-all group-hover:ring-4">
                VM
              </div>
            )
          )}
          <span className="gradient-text">VedantMahajan</span>
        </NavLink>
        <ul className="flex flex-wrap items-center gap-6">
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `relative text-sm font-semibold transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted hover:text-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border-2 border-border bg-surface p-2 text-text shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </motion.button>
      </div>
    </motion.nav>
  );
}
