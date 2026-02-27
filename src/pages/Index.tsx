import { motion } from "framer-motion";
import { Heart, Gift, CalendarHeart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import heroImage from "@/assets/flores-lirio.avif";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Decoração floral do casamento"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Nós vamos nos casar
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-foreground leading-tight whitespace-nowrap">
              Gabriela <span className="text-primary">&</span> Gustavo
            </h1>
            <p className="mt-4 font-display text-lg md:text-xl text-muted-foreground italic">
              "O amor não se vê com os olhos, mas com o coração."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6"
          >
            <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <CalendarHeart className="w-4 h-4 inline-block mr-2" />
              19 de Dezembro de 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8"
          >
            <CountdownTimer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="font-body text-sm uppercase tracking-wider"
            >
              <Link to="/presenca">
                <Heart className="w-4 h-4 mr-2" />
                Confirmar Presença
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-body text-sm uppercase tracking-wider"
            >
              <Link to="/presentes">
                <Gift className="w-4 h-4 mr-2" />
                Lista de Presentes
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Celebre Conosco
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Com imenso prazer, convidamos vocês para celebrar o nosso
              casamento. Será uma honra compartilhar este momento tão especial
              ao lado de quem amamos.
            </p>
            <div className="mt-8 flex justify-center gap-12 text-center">
              {[
                { label: "Cerimônia", value: "16:00" },
                { label: "Recepção", value: "18:00" },
                { label: "Festa", value: "20:00" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-sm font-body text-muted-foreground mt-1">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
