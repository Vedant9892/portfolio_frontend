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
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-10"
      >
        <h1 className="mb-2 text-3xl font-bold text-text">Skills</h1>
        <p className="text-text-muted">Technologies and tools I work with.</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillsData.map(({ category, items }) => (
          <motion.div
            key={category}
            variants={itemMotion}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="mb-4 text-lg font-semibold text-text">{category}</h2>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-text transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
