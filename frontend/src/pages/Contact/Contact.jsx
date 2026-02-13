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
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-3 text-3xl font-bold text-text sm:text-4xl">
          Let&apos;s Connect
        </h1>
        <p className="mx-auto max-w-2xl text-text-muted">
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
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={cardMotion}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-text">{card.title}</h2>
                </div>

                <p className="mb-4 text-sm text-text-muted">{card.description}</p>

                {card.href ? (
                  <a
                    href={card.href}
                    target={card.id === 'email' ? undefined : '_blank'}
                    rel={card.id === 'email' ? undefined : 'noopener noreferrer'}
                    className="block break-all text-sm font-medium text-primary hover:underline"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="break-all text-sm font-medium text-text-muted">
                    {card.value}
                  </p>
                )}

                {card.showCopy && card.value && (
                  <button
                    onClick={handleCopyEmail}
                    className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-border hover:text-primary"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
