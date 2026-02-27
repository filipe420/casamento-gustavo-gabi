import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, QrCode, Copy, Check, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SectionTitle from "./SectionTitle";

const quickValues = [100, 200, 500];

type PaymentMethod = "pix" | "card";

const PixContribution = () => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [cardSubmitted, setCardSubmitted] = useState(false);

  const pixKey = "email@noivos.com.br";

  const getValue = () => selectedValue || Number(customValue);

  const handleContribute = () => {
    const value = getValue();
    if (!value || value <= 0) {
      toast.error("Por favor, selecione ou digite um valor.");
      return;
    }
    setShowPayment(true);
    setCardSubmitted(false);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave Pix copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
      toast.error("Preencha todos os campos do cartão.");
      return;
    }
    // In production, this would call a payment gateway
    setCardSubmitted(true);
    toast.success(`Pagamento de R$ ${getValue().toLocaleString("pt-BR")} processado com sucesso! 💖`);
  };

  const formatCardNumber = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 16);
    return nums.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 4);
    if (nums.length >= 3) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
    return nums;
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-xl">
        <SectionTitle title="Contribua com Qualquer Valor" subtitle="Escolha a forma de pagamento que preferir 💎" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border"
        >
          {/* Quick values */}
          <div className="flex gap-3 mb-6">
            {quickValues.map((val) => (
              <button
                key={val}
                onClick={() => {
                  setSelectedValue(val);
                  setCustomValue("");
                  setShowPayment(false);
                  setCardSubmitted(false);
                }}
                className={`flex-1 py-3 rounded-lg font-body text-sm font-medium transition-all border ${
                  selectedValue === val
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
              >
                R$ {val}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="text-sm font-body text-muted-foreground mb-2 block">
              Ou digite o valor que deseja contribuir:
            </label>
            <Input
              type="number"
              placeholder="R$ 0,00"
              value={customValue}
              onChange={(e) => {
                setCustomValue(e.target.value);
                setSelectedValue(null);
                setShowPayment(false);
                setCardSubmitted(false);
              }}
              className="font-body"
            />
          </div>

          {/* Payment method selector */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod("pix")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-body text-sm font-medium transition-all border ${
                paymentMethod === "pix"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Pix
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-body text-sm font-medium transition-all border ${
                paymentMethod === "card"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Cartão
            </button>
          </div>

          <Button onClick={handleContribute} className="w-full font-body" size="lg">
            <Heart className="w-4 h-4 mr-2" />
            {paymentMethod === "pix" ? "Contribuir via Pix" : "Contribuir via Cartão"}
          </Button>

          {/* Payment details */}
          <AnimatePresence mode="wait">
            {showPayment && paymentMethod === "pix" && (
              <motion.div
                key="pix"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-border text-center overflow-hidden"
              >
                <p className="text-sm font-body text-foreground font-medium mb-4">
                  Valor: R$ {getValue().toLocaleString("pt-BR")}
                </p>
                <div className="w-48 h-48 mx-auto bg-muted rounded-xl flex items-center justify-center mb-4">
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-body mb-3">
                  Escaneie o QR Code ou copie a chave Pix abaixo:
                </p>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                  <span className="flex-1 text-sm font-mono text-foreground truncate">{pixKey}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyPix}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </motion.div>
            )}

            {showPayment && paymentMethod === "card" && !cardSubmitted && (
              <motion.form
                key="card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCardSubmit}
                className="mt-6 pt-6 border-t border-border space-y-4 overflow-hidden"
              >
                <p className="text-sm font-body text-foreground font-medium text-center mb-2">
                  Valor: R$ {getValue().toLocaleString("pt-BR")}
                </p>

                <div>
                  <Label className="font-body text-sm">Número do cartão</Label>
                  <Input
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                    placeholder="0000 0000 0000 0000"
                    className="mt-1 font-body font-mono"
                    maxLength={19}
                    required
                  />
                </div>

                <div>
                  <Label className="font-body text-sm">Nome no cartão</Label>
                  <Input
                    value={cardForm.name}
                    onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                    placeholder="Nome como está no cartão"
                    className="mt-1 font-body"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-body text-sm">Validade</Label>
                    <Input
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/AA"
                      className="mt-1 font-body font-mono"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label className="font-body text-sm">CVV</Label>
                    <Input
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123"
                      className="mt-1 font-body font-mono"
                      maxLength={4}
                      type="password"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full font-body" size="lg">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar R$ {getValue().toLocaleString("pt-BR")}
                </Button>

                <p className="text-xs text-muted-foreground font-body text-center">
                  🔒 Pagamento seguro e criptografado
                </p>
              </motion.form>
            )}

            {showPayment && paymentMethod === "card" && cardSubmitted && (
              <motion.div
                key="card-success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-border text-center overflow-hidden"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Pagamento Confirmado! 💖
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  Obrigado por contribuir com R$ {getValue().toLocaleString("pt-BR")} para o nosso sonho.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PixContribution;
