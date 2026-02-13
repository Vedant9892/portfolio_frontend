import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Copy, Check } from 'lucide-react';
import { personalInfoApi } from '../../api/api';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardMotion = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Contact() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    personalInfoApi
      .get()
      .then((res) => setInfo(res.data))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyEmail = async () => {
    if (!info?.email) return;
    try {
      await navigator.clipboard.writeText(info.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text">Contact</h1>
        <p className="text-text-muted">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-text">Contact</h1>
        <p className="text-red-500">Could not load contact info. {error}</p>
      </div>
    );
  }

  const contactCards = [
    {
      id: 'email',
      icon: Mail,
      title: 'Email',
      description: 'Send me a message',
      href: info?.email ? `mailto:${info.email}` : null,
      value: info?.email || null,
      showCopy: true,
    },
    {
      id: 'github',
      icon: Github,
      title: 'GitHub',
      description: 'View my code',
      href: info?.socials?.github || null,
      value: info?.socials?.github || null,
      showCopy: false,
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      title: 'LinkedIn',
      description: 'Connect professionally',
      href: info?.socials?.linkedin || null,
      value: info?.socials?.linkedin || null,
      showCopy: false,
    },
  ].filter((card) => card.value); // Only show cards with values

  return (
    <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
        >
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
          Available for new opportunities
        </motion.div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
          Let&apos;s Connect
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-muted">
          Have a project in mind or want to collaborate? I&apos;m always open to
          discussing new opportunities and interesting ideas.
        </p>
      </motion.div>

      {/* Contact Cards Grid */}
      {contactCards.length === 0 ? (
        <p className="text-center text-text-muted">
          No contact details available yet.
        </p>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={cardMotion}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-lg transition-all hover:border-primary/30 hover:shadow-2xl"
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 transition-transform group-hover:scale-150"></div>
                <div className="relative">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-lg transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-xl">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-text">{card.title}</h2>
                      <p className="text-sm text-text-muted">{card.description}</p>
                    </div>
                  </div>

                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.id === 'email' ? undefined : '_blank'}
                      rel={card.id === 'email' ? undefined : 'noopener noreferrer'}
                      className="mb-4 block break-all text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="mb-4 break-all text-sm font-medium text-text-muted">
                      {card.value}
                    </p>
                  )}

                  {card.showCopy && card.value && (
                    <motion.button
                      onClick={handleCopyEmail}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-text shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Copied to clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Email Address</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
