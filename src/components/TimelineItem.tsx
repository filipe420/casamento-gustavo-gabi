import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface TimelineItemProps {
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  index: number;
}

const TimelineItem = ({ date, title, description, imageUrl, index }: TimelineItemProps) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
        isEven ? "" : "md:flex-row-reverse"
      }`}
    >
      <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
        <span className="text-sm font-body text-primary uppercase tracking-wider">{date}</span>
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-1 mb-3">
          {title}
        </h3>
        <p className="font-body text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Heart className="w-4 h-4 text-primary fill-primary" />
        </div>
        <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-px h-24 bg-border" />
      </div>

      <div className="flex-1">
        {imageUrl && (
          <div className="rounded-xl overflow-hidden shadow-lg aspect-[4/3]">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TimelineItem;
