import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionTitle from "@/components/SectionTitle";
import PhotoGrid from "@/components/PhotoGrid";
import { getGallery, type GalleryImage } from "@/services/api";

interface Photo {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  createdAt: string;
  likes?: number;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);
        const galleryItems: GalleryImage[] = await getGallery();
        setPhotos(
          galleryItems.map((item) => ({
            id: item.id,
            name: item.name,
            url: item.url,
            uploadedBy: item.name,
            createdAt: item.createdAt,
            likes: 0,
          }))
        );
      } catch {
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    void loadPhotos();
  }, []);

  const handleLike = (id: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id
          ? { ...photo, likes: (photo.likes || 0) + 1 }
          : photo
      )
    );
  };

  const filteredPhotos = photos.filter((photo) =>
    photo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            title="Nossa Galeria"
            subtitle={`${photos.length} ${photos.length === 1 ? "foto compartilhada" : "fotos compartilhadas"}`}
          />
        </div>

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-body"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="font-body flex-1 sm:flex-initial"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            
            <Link to="/upload" className="flex-1 sm:flex-initial">
              <Button
                size="sm"
                className="w-full font-body"
              >
                <Upload className="w-4 h-4 mr-2" />
                Enviar Fotos
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PhotoGrid
            photos={searchTerm ? filteredPhotos : photos}
            onLike={handleLike}
            loading={loading}
          />
        </motion.div>

        {/* Empty State CTA */}
        {photos.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 max-w-2xl mx-auto text-center p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">
              Seja o primeiro a compartilhar!
            </h3>
            <p className="text-muted-foreground font-body mb-6">
              Ajude a construir nossa galeria de memórias enviando suas fotos do casamento
            </p>
            <Link to="/upload">
              <Button
                size="lg"
                className="font-body text-sm uppercase tracking-wider"
              >
                <Upload className="w-4 h-4 mr-2" />
                Enviar Fotos
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Gallery;
