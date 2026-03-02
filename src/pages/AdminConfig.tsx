import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SectionTitle from "@/components/SectionTitle";

const AdminConfig = () => {
  const [config, setConfig] = useState({
    emailServiceId: "",
    emailTemplateId: "",
    emailUserId: "",
    destinationEmail: "",
  });
  const [showKeys, setShowKeys] = useState({
    serviceId: false,
    templateId: false,
    userId: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Carregar configurações do localStorage
    const savedConfig = localStorage.getItem("weddingEmailConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!config.destinationEmail.trim()) {
      toast.error("Email destinatário é obrigatório");
      return;
    }

    if (config.emailServiceId || config.emailTemplateId || config.emailUserId) {
      if (!config.emailServiceId || !config.emailTemplateId || !config.emailUserId) {
        toast.error("Se usar EmailJS, preencha todos os campos de credenciais");
        return;
      }
    }

    localStorage.setItem("weddingEmailConfig", JSON.stringify(config));
    setSaved(true);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Configuração de Email"
          subtitle="Gerencie os emails de confirmação de presença"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm"
        >
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📧 Como configurar?
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Crie uma conta em <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">emailjs.com</a></li>
              <li>Copie seu Service ID, Template ID e User ID</li>
              <li>Cole os valores nos campos abaixo</li>
              <li>Insira o email onde wants receber as confirmações</li>
            </ol>
          </div>

          <div className="space-y-6">
            {/* Destination Email */}
            <div>
              <Label className="font-body text-sm font-medium">
                Email para receber confirmações * (obrigatório)
              </Label>
              <Input
                type="email"
                value={config.destinationEmail}
                onChange={(e) =>
                  setConfig({ ...config, destinationEmail: e.target.value })
                }
                placeholder="seu-email@gmail.com"
                className="mt-2 font-body"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Você receberá um email a cada confirmação de presença
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Credenciais EmailJS (opcional)
              </h3>

              {/* Service ID */}
              <div className="mb-4">
                <Label className="font-body text-sm font-medium">
                  Service ID
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type={showKeys.serviceId ? "text" : "password"}
                    value={config.emailServiceId}
                    onChange={(e) =>
                      setConfig({ ...config, emailServiceId: e.target.value })
                    }
                    placeholder="service_xxxxx"
                    className="mt-1 font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowKeys({ ...showKeys, serviceId: !showKeys.serviceId })
                    }
                    className="mt-1"
                  >
                    {showKeys.serviceId ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Template ID */}
              <div className="mb-4">
                <Label className="font-body text-sm font-medium">
                  Template ID
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type={showKeys.templateId ? "text" : "password"}
                    value={config.emailTemplateId}
                    onChange={(e) =>
                      setConfig({ ...config, emailTemplateId: e.target.value })
                    }
                    placeholder="template_xxxxx"
                    className="mt-1 font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowKeys({ ...showKeys, templateId: !showKeys.templateId })
                    }
                    className="mt-1"
                  >
                    {showKeys.templateId ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* User ID */}
              <div className="mb-4">
                <Label className="font-body text-sm font-medium">
                  User ID (Public Key)
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type={showKeys.userId ? "text" : "password"}
                    value={config.emailUserId}
                    onChange={(e) =>
                      setConfig({ ...config, emailUserId: e.target.value })
                    }
                    placeholder="user_xxxxx"
                    className="mt-1 font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowKeys({ ...showKeys, userId: !showKeys.userId })
                    }
                    className="mt-1"
                  >
                    {showKeys.userId ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Deixe em branco se não quiser usar EmailJS. O sistema pode usar um endpoint customizado.
              </p>
            </div>

            <div className="pt-6 border-t border-border flex gap-3">
              <Button
                onClick={handleSave}
                size="lg"
                className="flex-1 font-body text-sm uppercase tracking-wider"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Configuração
              </Button>
              {saved && (
                <div className="px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-green-800 dark:text-green-200">
                    Salvo
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>⚠️ Segurança:</strong> As credenciais são armazenadas apenas no seu navegador (localStorage). Nunca compartilhe estas chaves com terceiros.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminConfig;
