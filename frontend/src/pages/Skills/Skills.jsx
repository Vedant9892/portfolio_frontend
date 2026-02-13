import { motion } from 'framer-motion';

/**
 * Structured skills data organized by category.
 * Easy to update - just modify this array.
 */
const skillsData = [
  {
    category: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
  },
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'HTML', 'CSS'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'MongoDB', 'Mongoose'],
  },
  {
    category: 'Tools',
    items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Supabase', 'MongoDB Atlas', 'Figma'],
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemMotion = {
  hidden: { y: 8, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Skills() {
  return (
    <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">Skills & Technologies</h1>
        <p className="mx-auto max-w-2xl text-lg text-text-muted">
          A comprehensive overview of the technologies and tools I use to build modern applications.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2"
      >
        {skillsData.map(({ category, items }) => (
          <motion.div
            key={category}
            variants={itemMotion}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-lg transition-all hover:border-primary/30 hover:shadow-2xl"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-all group-hover:scale-150 group-hover:bg-primary/10"></div>
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary/20">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-text transition-colors group-hover:text-primary">{category}</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {items.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-default rounded-lg border-2 border-border bg-background px-4 py-2 text-sm font-semibold text-text shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-md"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
