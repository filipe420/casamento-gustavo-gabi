import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import GiftCard from "@/components/GiftCard";
import PixContribution from "@/components/PixContribution";
import { toast } from "sonner";

const initialGifts = [
  {
    id: "1",
    name: "Máquina de Lavar",
    description: "Para cuidar das nossas roupas com carinho.",
    imageUrl: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop",
    price: 2500,
    purchased: false,
  },
  {
    id: "2",
    name: "Geladeira",
    description: "Para manter nossos alimentos sempre frescos.",
    imageUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop",
    price: 3500,
    purchased: false,
  },
  {
    id: "3",
    name: "Sofá",
    description: "Para momentos de descanso e carinho juntos.",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    price: 2800,
    purchased: true,
    purchasedBy: "Tia Maria",
  },
  {
    id: "4",
    name: "Micro-ondas",
    description: "Praticidade no nosso dia a dia.",
    imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop",
    price: 800,
    purchased: false,
  },
  {
    id: "5",
    name: "Jogo de Panelas",
    description: "Para preparar deliciosas refeições em família.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    price: 600,
    purchased: false,
  },
  {
    id: "6",
    name: "Jogo de Cama",
    description: "Conforto e elegância para nossas noites.",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop",
    price: 450,
    purchased: false,
  },
];

const GiftList = () => {
  const [gifts, setGifts] = useState(initialGifts);

  const handleSelectGift = (id: string) => {
    // In production, this would open a checkout flow
    toast.info("Em breve você poderá presentear via Pix! 🎁");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle title="Lista de Presentes" subtitle="Escolha um presente especial para nós" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {gifts.map((gift) => (
            <GiftCard key={gift.id} {...gift} onSelect={handleSelectGift} />
          ))}
        </motion.div>
      </div>

      {/* Pix Section */}
      <PixContribution />
    </div>
  );
};

export default GiftList;
