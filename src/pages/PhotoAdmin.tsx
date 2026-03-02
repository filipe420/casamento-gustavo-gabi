import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Download, Eye, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Photo {
  id: string;
  url: string;
  uploadedBy?: string;
  likes?: number;
}

const PhotoAdmin = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    const storedPhotos = localStorage.getItem("weddingPhotos");
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotoToDelete(photoId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!photoToDelete) return;

    const updatedPhotos = photos.filter((photo) => photo.id !== photoToDelete);
    setPhotos(updatedPhotos);
    localStorage.setItem("weddingPhotos", JSON.stringify(updatedPhotos));
    
    toast.success("Foto excluída com sucesso");
    setShowDeleteDialog(false);
    setPhotoToDelete(null);
  };

  const handleDeleteAll = () => {
    localStorage.removeItem("weddingPhotos");
    setPhotos([]);
    toast.success("Todas as fotos foram excluídas");
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(photos, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `wedding-photos-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    
    toast.success("Dados exportados com sucesso");
  };

  const totalLikes = photos.reduce((sum, photo) => sum + (photo.likes || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12 md:py-20"
      >
        {/* Header */}
        <div className="mb-12">
          <SectionTitle
            title="Administração de Fotos"
            subtitle="Gerencie as fotos da galeria"
          />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Total de Fotos
              </h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{photos.length}</p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Total de Likes
              </h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalLikes}</p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Colaboradores
              </h3>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {new Set(photos.map(p => p.uploadedBy)).size}
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Button
            onClick={handleExportData}
            variant="outline"
            disabled={photos.length === 0}
            className="font-body"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </Button>
          
          <AlertDialog>
            <Button
              onClick={handleDeleteAll}
              variant="destructive"
              disabled={photos.length === 0}
              className="font-body"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Todas
            </Button>
          </AlertDialog>
        </motion.div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16 px-4"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhuma foto na galeria
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              As fotos enviadas aparecerão aqui
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm bg-card"
              >
                <img
                  src={photo.url}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <p className="text-white text-xs font-body truncate">
                      {photo.uploadedBy || "Anônimo"}
                    </p>
                    <p className="text-white/80 text-xs font-body">
                      {photo.likes || 0} {photo.likes === 1 ? "like" : "likes"}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedPhoto(photo)}
                        className="flex-1 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Photo Preview Dialog */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-4xl max-h-[90vh] relative"
            >
              <img
                src={selectedPhoto.url}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg"
              />
              <Button
                onClick={() => setSelectedPhoto(null)}
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PhotoAdmin;
