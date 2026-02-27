import { motion } from "framer-motion";
import { Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GiftCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  purchased: boolean;
  purchasedBy?: string;
  onSelect: (id: string) => void;
}

const GiftCard = ({ id, name, description, imageUrl, price, purchased, purchasedBy, onSelect }: GiftCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl overflow-hidden border border-border bg-card shadow-sm transition-shadow hover:shadow-md ${
        purchased ? "opacity-75" : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
        {purchased && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <div className="bg-background/90 rounded-full p-3">
              <Check className="w-8 h-8 text-primary" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-card-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-display text-xl font-semibold text-foreground">
            R$ {price.toLocaleString("pt-BR")}
          </span>
          {purchased ? (
            <span className="text-xs font-body text-muted-foreground">
              Presenteado{purchasedBy ? ` por ${purchasedBy}` : ""}
            </span>
          ) : (
            <Button size="sm" onClick={() => onSelect(id)} className="font-body">
              <Gift className="w-4 h-4 mr-1" />
              Presentear
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GiftCard;
