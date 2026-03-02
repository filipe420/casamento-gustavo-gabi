import { motion } from "framer-motion";
import { Heart, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PhotoCardProps {
  id: string;
  url: string;
  uploadedBy?: string;
  likes?: number;
  onLike?: (id: string) => void;
}

const PhotoCard = ({ id, url, uploadedBy, likes = 0, onLike }: PhotoCardProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `casamento-foto-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Foto baixada com sucesso!");
    } catch (error) {
      toast.error("Erro ao baixar foto");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Foto do Casamento",
          text: "Confira essa foto do casamento!",
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="group relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm bg-card"
    >
      <img
        src={url}
        alt="Foto do casamento"
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {uploadedBy && (
            <p className="text-white text-xs font-body">
              Por: {uploadedBy}
            </p>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onLike?.(id)}
              className="flex-1 font-body gap-1"
            >
              <Heart className={`w-3 h-3 ${likes > 0 ? "fill-red-500 text-red-500" : ""}`} />
              {likes > 0 && <span className="text-xs">{likes}</span>}
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownload}
            >
              <Download className="w-3 h-3" />
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={handleShare}
            >
              <Share2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoCard;
