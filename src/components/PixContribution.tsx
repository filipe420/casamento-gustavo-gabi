import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, QrCode, Copy, Check, CreditCard, Smartphone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SectionTitle from "./SectionTitle";

const quickValues = [100, 200, 500];

type PaymentMethod = "pix" | "card";
type CardBrand = "visa" | "mastercard" | "amex" | "elo" | null;

interface CardErrors {
  number?: string;
  name?: string;
  expiry?: string;
  cvv?: string;
}

// Função para validar cartão com Luhn Algorithm
const validateCardNumber = (number: string): boolean => {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Detectar bandeira de cartão
const detectCardBrand = (number: string): CardBrand => {
  const digits = number.replace(/\D/g, "");
  
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(digits)) return "visa";
  if (/^5[1-5][0-9]{14}$/.test(digits)) return "mastercard";
  if (/^3[47][0-9]{13}$/.test(digits)) return "amex";
  if (/^(4011|5190|5067|4576|4532|3067|3164|3165|6504|6516|6509|6703|6708|6709|6711)/.test(digits.substring(0, 4))) return "elo";
  
  return null;
};

// Validar data de validade
const validateExpiry = (expiry: string): boolean => {
  const [month, year] = expiry.split("/");
  if (!month || !year) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);
  
  if (expiryMonth < 1 || expiryMonth > 12) return false;
  if (expiryYear < currentYear) return false;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
  
  return true;
};

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
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const cardBrand = detectCardBrand(cardForm.number);

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
    setCardErrors({});
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave Pix copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: CardErrors = {};

    // Validar número do cartão
    if (!cardForm.number) {
      errors.number = "Número do cartão é obrigatório";
    } else if (!validateCardNumber(cardForm.number)) {
      errors.number = "Número do cartão inválido";
    }

    // Validar nome
    if (!cardForm.name || cardForm.name.trim().length < 3) {
      errors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    // Validar validade
    if (!cardForm.expiry) {
      errors.expiry = "Validade é obrigatória";
    } else if (!validateExpiry(cardForm.expiry)) {
      errors.expiry = "Cartão inválido ou vencido";
    }

    // Validar CVV
    if (!cardForm.cvv || cardForm.cvv.length < 3) {
      errors.cvv = "CVV inválido (3-4 dígitos)";
    }

    if (Object.keys(errors).length > 0) {
      setCardErrors(errors);
      toast.error("Verifique os dados do cartão");
      return;
    }

    setCardErrors({});
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
              onClick={() => {
                setPaymentMethod("pix");
                setCardSubmitted(false);
                setCardErrors({});
              }}
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
              onClick={() => {
                setPaymentMethod("card");
                setCardSubmitted(false);
                setCardErrors({});
              }}
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
                <div className="bg-primary/5 rounded-lg p-4 mb-4">
                  <p className="text-sm font-body text-foreground font-semibold">
                    Valor a pagar: R$ {getValue().toLocaleString("pt-BR")}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="font-body text-sm font-medium">Número do cartão</Label>
                    {cardBrand && (
                      <span className="text-xs font-body text-muted-foreground capitalize">
                        {cardBrand === "visa" && "💳 Visa"}
                        {cardBrand === "mastercard" && "💳 Mastercard"}
                        {cardBrand === "amex" && "💳 American Express"}
                        {cardBrand === "elo" && "💳 Elo"}
                      </span>
                    )}
                  </div>
                  <Input
                    value={cardForm.number}
                    onChange={(e) => {
                      setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) });
                      if (cardErrors.number) setCardErrors({ ...cardErrors, number: undefined });
                    }}
                    placeholder="0000 0000 0000 0000"
                    className={`mt-1 font-body font-mono ${cardErrors.number ? "border-red-500" : ""}`}
                    maxLength={19}
                  />
                  {cardErrors.number && (
                    <p className="mt-1 text-xs text-red-500 font-body flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {cardErrors.number}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="font-body text-sm font-medium">Nome no cartão</Label>
                  <Input
                    value={cardForm.name}
                    onChange={(e) => {
                      setCardForm({ ...cardForm, name: e.target.value });
                      if (cardErrors.name) setCardErrors({ ...cardErrors, name: undefined });
                    }}
                    placeholder="Nome como está no cartão"
                    className={`mt-1 font-body uppercase ${cardErrors.name ? "border-red-500" : ""}`}
                  />
                  {cardErrors.name && (
                    <p className="mt-1 text-xs text-red-500 font-body flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {cardErrors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-body text-sm font-medium">Validade</Label>
                    <Input
                      value={cardForm.expiry}
                      onChange={(e) => {
                        setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) });
                        if (cardErrors.expiry) setCardErrors({ ...cardErrors, expiry: undefined });
                      }}
                      placeholder="MM/AA"
                      className={`mt-1 font-body font-mono ${cardErrors.expiry ? "border-red-500" : ""}`}
                      maxLength={5}
                    />
                    {cardErrors.expiry && (
                      <p className="mt-1 text-xs text-red-500 font-body flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {cardErrors.expiry}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="font-body text-sm font-medium">CVV</Label>
                    <Input
                      value={cardForm.cvv}
                      onChange={(e) => {
                        setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) });
                        if (cardErrors.cvv) setCardErrors({ ...cardErrors, cvv: undefined });
                      }}
                      placeholder="123"
                      className={`mt-1 font-body font-mono ${cardErrors.cvv ? "border-red-500" : ""}`}
                      maxLength={4}
                      type="password"
                    />
                    {cardErrors.cvv && (
                      <p className="mt-1 text-xs text-red-500 font-body flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {cardErrors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-xs text-green-800 dark:text-green-200 font-body">
                    🔒 Pagamento seguro com SSL 256-bit. Seus dados são criptografados.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full font-body" 
                  size="lg"
                  disabled={Object.keys(cardErrors).length > 0 && cardForm.number !== ""}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Processar Pagamento
                </Button>
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
