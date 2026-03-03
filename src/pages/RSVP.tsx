import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SectionTitle from "@/components/SectionTitle";
import emailjs from "@emailjs/browser";

// Credenciais EmailJS - substitua com os seus valores
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// SheetDB API (Google Sheets)
const SHEETDB_API_URL = "https://sheetdb.io/api/v1/c1adr1hpyqyov";

const RSVP = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Preencha nome e email.");
      return;
    }

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

    setLoading(true);

    try {
      // 1. Salvar no Google Sheets via SheetDB
      await fetch(SHEETDB_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              Nome: form.name,
              Email: form.email,
              Telefone: form.phone || "Nao informado",
              Presenca:
                form.attending === "yes" ? "Confirmado" : "Nao vai comparecer",
              Acompanhantes: form.guests,
              "Nomes dos Acompanhantes":
                form.guestNames.length > 0
                  ? form.guestNames.join(", ")
                  : "Nenhum",
            },
          ],
        }),
      });

      // 2. Enviar email de confirmacao via EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: form.email,
          to_name: form.name,
          guest_phone: form.phone || "Nao informado",
          attending_label:
            form.attending === "yes"
              ? "Sim, estarei lá!"
              : "Infelizmente nao poderei comparecer",
          guests_count: form.guests > 0 ? String(form.guests) : "Nenhum",
          guest_names_list:
            form.guestNames.length > 0
              ? form.guestNames.join(", ")
              : "Nenhum acompanhante",
        },
        EMAILJS_PUBLIC_KEY,
      );

      setSubmitted(true);
      toast.success("Presenca confirmada! Verifique seu email");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao confirmar presenca. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
            Presenca Confirmada!
          </h2>
          <p className="font-body text-muted-foreground">
            Obrigado, {form.name}! Estamos muito felizes que voce estara
            conosco. Um email de confirmacao foi enviado para{" "}
            <span className="font-semibold text-primary">{form.email}</span>
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
            title="Confirme sua Presenca"
            subtitle="Sera uma honra ter voce conosco"
          />
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm space-y-5"
        >
          <div>
            <Label>Nome completo *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Seu nome"
              required
            />
          </div>

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

          <div>
            <Label className="font-body text-sm">Confirma presenca?</Label>
            <div className="flex gap-3 mt-2">
              {[
                { value: "yes", label: "Sim, estarei lá!" },
                { value: "no", label: "Infelizmente, nao poderei" },
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
                      setForm((prev) => ({ ...prev, attending: "yes" }));
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

          {form.attending === "yes" && (
            <>
              <div>
                <Label>Numero de acompanhantes</Label>
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

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Enviando...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Confirmar Presenca
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default RSVP;
