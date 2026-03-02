import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SectionTitle from "@/components/SectionTitle";

const RSVP = () => {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    guests: 0,
    attending: "yes",
    guestNames: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validação obrigatória
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Preencha nome e email.");
      return;
    }

    // ✅ Validação acompanhantes
    if (form.attending === "yes" && form.guests > 0) {
      if (form.guestNames.length !== form.guests) {
        toast.error("Erro interno na lista de acompanhantes.");
        return;
      }

      const hasEmptyGuest = form.guestNames.some((guest) => !guest.trim());

      if (hasEmptyGuest) {
        toast.error("Preencha o nome de todos os acompanhantes.");
        return;
      }
    }

    setSubmitted(true);
    toast.success("Presença confirmada! Obrigado 💖");
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>

          <h2 className="font-display text-3xl font-semibold text-foreground mb-3">
            Presença Confirmada!
          </h2>

          <p className="font-body text-muted-foreground">
            Obrigado, {form.name}! Estamos muito felizes que você estará
            conosco.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <SectionTitle
            title="Confirme sua Presença"
            subtitle="Será uma honra ter você conosco"
          />
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm space-y-5"
        >
          {/* Nome */}
          <div>
            <Label>Nome completo *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Seu nome"
              required
            />
          </div>

          {/* Telefone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* CONFIRMA PRESENÇA */}
          <div>
            <Label className="font-body text-sm">Confirma presença?</Label>
            <div className="flex gap-3 mt-2">
              {[
                { value: "yes", label: "Sim, estarei lá! 🎉" },
                { value: "no", label: "Infelizmente, não poderei 😢" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (option.value === "no") {
                      setForm((prev) => ({
                        ...prev,
                        attending: "no",
                        guests: 0,
                        guestNames: [],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        attending: "yes",
                      }));
                    }
                  }}
                  className={`flex-1 py-3 rounded-lg font-body text-sm transition-all border ${
                    form.attending === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* ACOMPANHANTES (SÓ SE FOR YES) */}
          {form.attending === "yes" && (
            <>
              <div>
                <Label>Número de acompanhantes</Label>
                <Input
                  type="number"
                  min="0"
                  max="4"
                  value={form.guests}
                  onChange={(e) => {
                    let value = Number(e.target.value);

                    if (value > 4) value = 4;
                    if (value < 0) value = 0;

                    setForm((prev) => ({
                      ...prev,
                      guests: value,
                      guestNames: Array.from(
                        { length: value },
                        (_, i) => prev.guestNames[i] || "",
                      ),
                    }));
                  }}
                />
              </div>

              {form.guestNames.map((guest, index) => (
                <div key={index}>
                  <Label>Nome do acompanhante {index + 1}</Label>
                  <Input
                    value={guest}
                    onChange={(e) => {
                      const updatedGuests = [...form.guestNames];
                      updatedGuests[index] = e.target.value;

                      setForm((prev) => ({
                        ...prev,
                        guestNames: updatedGuests,
                      }));
                    }}
                    placeholder={`Nome do acompanhante ${index + 1}`}
                  />
                </div>
              ))}
            </>
          )}

          <Button type="submit" size="lg" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Confirmar Presença
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default RSVP;
