import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";

const details = [
  {
    icon: Calendar,
    title: "Data",
    value: "19 de Dezembro de 2026",
    sub: "Sábado",
  },
  {
    icon: Clock,
    title: "Horário",
    value: "16:00",
    sub: "Cerimônia religiosa",
  },
  {
    icon: MapPin,
    title: "Local",
    value: "Igreja Matriz de São João",
    sub: "Rua das Flores, 123 — Centro",
  },
  {
    icon: Shirt,
    title: "Dress Code",
    value: "Traje Social",
    sub: "Cores claras são bem-vindas",
  },
];

const EventDetails = () => {
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Casamento Ana & João"
  )}&dates=20261219T160000/20261220T020000&details=${encodeURIComponent(
    "Celebre conosco!"
  )}&location=${encodeURIComponent("Igreja Matriz de São João, Rua das Flores, 123")}`;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle title="Detalhes do Evento" subtitle="Tudo que você precisa saber" />

        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {details.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border shadow-sm text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {item.title}
                </h3>
                <p className="font-display text-xl font-semibold text-card-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground font-body mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden border border-border shadow-sm mb-8"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976734698493!2d-46.65429922466513!3d-23.561684363379354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1690000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do evento"
            />
          </motion.div>

          <div className="text-center">
            <Button asChild size="lg" className="font-body text-sm uppercase tracking-wider">
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                <Calendar className="w-4 h-4 mr-2" />
                Adicionar ao Google Calendar
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
