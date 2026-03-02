import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ImageIcon, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionTitle from "@/components/SectionTitle";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "sonner";

const PhotoUpload = () => {
  const navigate = useNavigate();
  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async (files: File[]) => {
    if (!uploaderName.trim()) {
      toast.error("Por favor, digite seu nome");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload - In production, this would upload to a server/storage
      const newPhotos = await Promise.all(
        files.map(async (file) => {
          return new Promise<{ id: string; url: string; uploadedBy: string; likes: number }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                url: reader.result as string,
                uploadedBy: uploaderName,
                likes: 0,
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      // Store in localStorage (in production, send to backend)
      const existingPhotos = JSON.parse(localStorage.getItem("weddingPhotos") || "[]");
      const updatedPhotos = [...existingPhotos, ...newPhotos];
      localStorage.setItem("weddingPhotos", JSON.stringify(updatedPhotos));

      setUploadSuccess(true);
      toast.success(`${files.length} ${files.length === 1 ? "foto enviada" : "fotos enviadas"} com sucesso!`);

      // Redirect to gallery after 2 seconds
      setTimeout(() => {
        navigate("/galeria");
      }, 2000);
    } catch (error) {
      toast.error("Erro ao enviar fotos. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <div>
            <h2 className="font-display text-3xl font-semibold text-foreground mb-3">
              Fotos Enviadas!
            </h2>
            <p className="text-muted-foreground font-body">
              Obrigado por compartilhar esses momentos especiais conosco
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12 md:py-20 max-w-4xl"
      >
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <ImageIcon className="w-8 h-8 text-primary" />
          </motion.div>

          <SectionTitle
            title="Enviar Fotos"
            subtitle="Compartilhe suas fotografias do nosso casamento"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-muted-foreground font-body max-w-2xl mx-auto mt-4"
          >
            Cada foto é uma memória especial. Obrigado por fazer parte desta celebração e por compartilhar conosco esses momentos inesquecíveis!
          </motion.p>
        </div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {/* Name Input */}
          <div className="space-y-3">
            <Label htmlFor="name" className="font-body text-sm">
              Seu Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              className="font-body"
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground font-body">
              Seu nome aparecerá nas fotos que você enviar
            </p>
          </div>

          {/* Image Uploader */}
          <div className={isUploading ? "pointer-events-none opacity-50" : ""}>
            <ImageUploader
              onUpload={handleUpload}
              maxFiles={10}
              maxSizeMB={10}
            />
          </div>

          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-body text-muted-foreground">
                Enviando suas fotos...
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PhotoUpload;
