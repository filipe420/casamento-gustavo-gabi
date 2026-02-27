import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import TimelineItem from "@/components/TimelineItem";
import coupleImage from "@/assets/couple-story.png";

const timeline = [
  {
    date: "Janeiro 2020",
    title: "Primeiro Encontro",
    description: "Nos conhecemos numa cafeteria no centro da cidade. Um olhar, um sorriso, e tudo mudou.",
    imageUrl: coupleImage,
  },
  {
    date: "Junho 2021",
    title: "Primeiro 'Eu Te Amo'",
    description: "Num pôr do sol inesquecível, as palavras vieram naturalmente. Soubemos que era pra sempre.",
  },
  {
    date: "Março 2023",
    title: "Viagem dos Sonhos",
    description: "Paris, a cidade do amor, foi o cenário perfeito para fortalecer ainda mais nossa história.",
  },
  {
    date: "Agosto 2025",
    title: "O Pedido",
    description: "De joelhos, com o coração acelerado, veio o pedido mais importante: 'Quer casar comigo?'",
  },
  {
    date: "Dezembro 2026",
    title: "Nosso Casamento",
    description: "O dia em que diremos 'sim' diante de todos que amamos. O começo de uma nova jornada.",
  },
];

const OurStory = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle title="Nossa História" subtitle="Cada momento nos trouxe até aqui" />

        <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">
          {timeline.map((item, i) => (
            <TimelineItem
              key={i}
              index={i}
              date={item.date}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="font-display text-2xl text-foreground italic">
            "E o melhor ainda está por vir..."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OurStory;
