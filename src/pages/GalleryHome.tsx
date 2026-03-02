import { motion } from "framer-motion";
import { Camera, Heart, Upload, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";

const GalleryHome = () => {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Veja as Fotos",
      description: "Explore todos os momentos especiais capturados",
      link: "/galeria",
      linkText: "Ver Galeria",
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Compartilhe",
      description: "Faça upload das suas fotos da celebração",
      link: "/upload",
      linkText: "Enviar Fotos",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Curta e Baixe",
      description: "Dê like nas suas favoritas e baixe para guardar",
      link: "/galeria",
      linkText: "Explorar",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-12 md:py-20"
      >
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </motion.div>

          <SectionTitle
            title="Galeria de Fotos"
            subtitle="Reviva os momentos especiais do nosso grande dia"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto"
          >
            Compartilhe suas fotografias e reviva as emoções e alegrias que tornaram nossa celebração inesquecível
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative h-full p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-all">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground font-body mb-6">
                  {feature.description}
                </p>

                <Link to={feature.link}>
                  <Button
                    variant="outline"
                    className="w-full font-body group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    {feature.linkText}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
        >
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Tem fotos do nosso casamento?
          </h2>
          <p className="text-muted-foreground font-body mb-6 text-sm md:text-base">
            Compartilhe conosco! Cada foto é uma memória preciosa que queremos preservar juntos.
          </p>
          <Link to="/upload">
            <Button
              size="lg"
              className="font-body text-sm uppercase tracking-wider"
            >
              <Upload className="w-4 h-4 mr-2" />
              Enviar Minhas Fotos
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GalleryHome;
