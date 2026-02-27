import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-secondary/50 border-t border-border/50">
      <div className="container mx-auto px-4 text-center">
        <p className="font-display text-2xl text-foreground mb-2">Ana & João</p>
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-body">
          <span>Feito com</span>
          <Heart className="w-4 h-4 text-primary fill-primary" />
          <span>para o nosso grande dia</span>
        </div>
        <p className="mt-4 text-xs text-muted-foreground font-body">
          © 2026 — Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
};

export default Footer;
