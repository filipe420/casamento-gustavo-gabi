import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-12 md:mb-16"
  >
    <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground">{title}</h2>
    {subtitle && (
      <p className="mt-3 text-muted-foreground font-body max-w-md mx-auto">{subtitle}</p>
    )}
    <div className="mt-4 mx-auto w-16 h-px bg-primary/50" />
  </motion.div>
);

export default SectionTitle;
