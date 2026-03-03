import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import TimelineItem from "@/components/TimelineItem";

import encontroImg from "@/assets/logo-casamento.png";
import namoroImg from "@/assets/imagem-do-pedido.jpeg";
import viagemImg from "@/assets/hero-wedding.png";
import pedidoImg from "@/assets/imagem-do-pedido.jpeg";
import casamentoImg from "@/assets/couple-story.png";

const timeline = [
  {
    date: "Outubro de 2022",
    title: "Primeiro Encontro",
    description:
      "Nos conhecemos no Castelão em dia de jogo. Um olhar, um sorriso, e tudo mudou.",
    imageUrl: encontroImg,
  },
  {
    date: "Janeiro de 2023",
    title: "Primeiro pedido de namoro",
    description:
      "Ele me levou para jantar e, no meio da surpresa, fez o pedido que mudou tudo.",
    imageUrl: namoroImg,
  },
  {
    date: "Junho de 2024",
    title: "Viagem dos Sonhos",
    description:
      "Nossa Eurotrip ainda é um sonho. Mas já sabemos que será um capítulo lindo da nossa história.",
    imageUrl: viagemImg,
  },
  {
    date: "Agosto de 2025",
    title: "O Pedido",
    description:
      "De joelhos, com o coração acelerado, veio o pedido mais importante: 'Quer casar comigo?'",
    imageUrl: pedidoImg,
  },
  {
    date: "Dezembro de 2026",
    title: "Nosso Casamento",
    description:
      "O dia em que diremos 'sim' diante de todos que amamos. O começo de uma nova jornada.",
    imageUrl: casamentoImg,
  },
];

const OurStory = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nossa História"
          subtitle="Cada momento nos trouxe até aqui"
        />

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