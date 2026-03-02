import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

const validateFile = (file: File, maxSizeMB: number): string | null => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  
  if (!validTypes.includes(file.type)) {
    return "Formato inválido. Use apenas JPG, PNG ou WEBP";
  }
  
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return `Arquivo muito grande. Máximo ${maxSizeMB}MB`;
  }
  
  return null;
};

const ImageUploader = ({ onUpload, maxFiles = 10, maxSizeMB = 10 }: ImageUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const filesArray = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    filesArray.forEach((file) => {
      const error = validateFile(file, maxSizeMB);
      if (error) {
        toast.error(error);
        return;
      }

      if (selectedFiles.length + validFiles.length >= maxFiles) {
        toast.error(`Máximo de ${maxFiles} imagens por vez`);
        return;
      }

      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  }, [selectedFiles, maxFiles, maxSizeMB]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    if (selectedFiles.length === 0) {
      toast.error("Selecione pelo menos uma imagem");
      return;
    }
    onUpload(selectedFiles);
    setSelectedFiles([]);
    setPreviews([]);
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Arraste suas fotos aqui
          </h3>
          <p className="text-sm text-muted-foreground font-body mb-4">
            ou clique para selecionar do seu dispositivo
          </p>
          
          <Button type="button" variant="outline" className="font-body">
            <ImageIcon className="w-4 h-4 mr-2" />
            Selecionar Fotos
          </Button>
        </label>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground font-body">
          <AlertCircle className="w-3 h-3" />
          <span>JPG, PNG ou WEBP • Máximo {maxSizeMB}MB por foto</span>
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-body text-foreground">
              {selectedFiles.length} {selectedFiles.length === 1 ? "foto selecionada" : "fotos selecionadas"}
            </p>
            <Button
              onClick={() => {
                setSelectedFiles([]);
                setPreviews([]);
              }}
              variant="ghost"
              size="sm"
              className="font-body text-xs"
            >
              Limpar todas
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group aspect-square rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeFile(index)}
                    className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={handleUploadClick}
            size="lg"
            className="w-full font-body text-sm uppercase tracking-wider"
          >
            <Upload className="w-4 h-4 mr-2" />
            Fazer Upload de {selectedFiles.length} {selectedFiles.length === 1 ? "Foto" : "Fotos"}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUploader;
