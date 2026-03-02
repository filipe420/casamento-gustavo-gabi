import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, RotateCw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SectionTitle from "@/components/SectionTitle";
import { getAllStoredRSVPs, exportRSVPsAsJSON, RSVPData } from "@/lib/emailService";

interface StoredRSVP extends RSVPData {
  submittedAt: string;
}

const RSVPAdmin = () => {
  const [rsvps, setRSVPs] = useState<StoredRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    loadRSVPs();
  }, []);

  const loadRSVPs = () => {
    setLoading(true);
    const data = getAllStoredRSVPs();
    setRSVPs(data);
    setLoading(false);
  };

  const handleExport = () => {
    const jsonData = exportRSVPsAsJSON();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rsvps-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("RSVPs exportados com sucesso!");
  };

  const handleClear = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os RSVPs? Esta ação não pode ser desfeita!")) {
      localStorage.removeItem("weddingRSVPs");
      setRSVPs([]);
      toast.success("Todos os RSVPs foram removidos");
    }
  };

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attending === "yes").length,
    notAttending: rsvps.filter(r => r.attending === "no").length,
    totalGuests: rsvps.reduce((sum, r) => sum + r.guests, 0),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Painel de RSVPs"
          subtitle="Visualize todas as confirmações de presença"
        />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total", value: stats.total, color: "primary" },
            { label: "Confirmado", value: stats.attending, color: "green" },
            { label: "Não Vem", value: stats.notAttending, color: "red" },
            { label: "Acompanhantes", value: stats.totalGuests, color: "blue" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-card rounded-lg p-4 border border-border text-center`}
            >
              <p className="text-sm font-body text-muted-foreground mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl font-display font-semibold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 mb-8"
        >
          <Button
            onClick={loadRSVPs}
            variant="outline"
            className="font-body gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Atualizar
          </Button>
          <Button
            onClick={handleExport}
            disabled={rsvps.length === 0}
            className="font-body gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar JSON
          </Button>
          <Button
            onClick={handleClear}
            variant="destructive"
            disabled={rsvps.length === 0}
            className="font-body gap-2 ml-auto"
          >
            Limpar Tudo
          </Button>
        </motion.div>

        {/* RSVPs List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">Carregando...</p>
          </div>
        ) : rsvps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl p-12 border border-border text-center"
          >
            <p className="text-muted-foreground font-body mb-2">
              Nenhuma confirmação de presença ainda
            </p>
            <p className="text-sm text-muted-foreground font-body">
              As confirmações aparecerão aqui assim que as pessoas preencherem o formulário
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {rsvps.map((rsvp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === index ? null : index)
                  }
                  className="w-full p-4 hover:bg-secondary/20 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-body font-semibold text-foreground">
                            {rsvp.name}
                          </p>
                          <p className="text-sm text-muted-foreground font-body">
                            {rsvp.email}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-body font-medium ${
                            rsvp.attending === "yes"
                              ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200"
                              : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {rsvp.attending === "yes" ? "✅ Confirmado" : "❌ Não Vem"}
                        </span>
                        {rsvp.guests > 0 && (
                          <span className="px-2 py-1 rounded text-xs font-body font-medium bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200">
                            +{rsvp.guests} {rsvp.guests === 1 ? "acompanhante" : "acompanhantes"}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expandedId === index ? null : index);
                      }}
                      className="ml-4 p-2 hover:bg-secondary rounded"
                    >
                      {expandedId === index ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </button>

                {expandedId === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border bg-secondary/30 p-4"
                  >
                    <div className="space-y-2 text-sm font-body">
                      {rsvp.phone && (
                        <div>
                          <span className="text-muted-foreground">Telefone:</span>
                          <p className="font-mono">{rsvp.phone}</p>
                        </div>
                      )}
                      {rsvp.attending === "yes" && rsvp.guestNames.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Acompanhantes:</span>
                          <ul className="list-disc list-inside">
                            {rsvp.guestNames.map((guest, i) => (
                              <li key={i}>{guest}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                        Confirmado em:{" "}
                        {new Date(rsvp.submittedAt).toLocaleDateString("pt-BR")}{" "}
                        às{" "}
                        {new Date(rsvp.submittedAt).toLocaleTimeString("pt-BR")}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVPAdmin;
