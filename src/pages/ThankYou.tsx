import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
        >
          <Heart className="w-10 h-10 text-primary fill-primary" />
        </motion.div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
          Obrigado! 💍
        </h1>
        <p className="font-body text-muted-foreground leading-relaxed mb-8">
          Obrigado por fazer parte do nosso sonho. Seu carinho e presença significam o mundo para nós.
        </p>
        <Button asChild variant="outline" className="font-body">
          <Link to="/">Voltar ao Início</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default ThankYou;
