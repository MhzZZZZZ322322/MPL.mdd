import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: string;
}

// Imagini de eveniment predefinite pentru galerie
const eventImages: GalleryItem[] = [
  {
    id: 1,
    src: 'https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg',
    alt: 'HATOR CS2 LEAGUE 2025',
    category: 'Counter-Strike'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1000',
    alt: 'MPL League of Legends Tournament',
    category: 'LoL'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'MPL Summer Cup 2024',
    category: 'Counter-Strike'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'League of Legends Final',
    category: 'LoL'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'CS:GO Winter Championship',
    category: 'Counter-Strike'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'FIFA 23 Tournament',
    category: 'FIFA'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'MPL League Gaming Session',
    category: 'Community'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'MPL Event Setup',
    category: 'Community'
  }
];

const EventGallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);

  // Extrage categoriile unice din imagini
  const uniqueCategories = Array.from(new Set(eventImages.map(img => img.category)));
  const categories = ['Toate', ...uniqueCategories];

  // Filtrează imaginile în funcție de categoria selectată
  const filteredImages = filteredCategory && filteredCategory !== 'Toate'
    ? eventImages.filter(img => img.category === filteredCategory)
    : eventImages;

  // Animații pentru containerul de imagini
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animații pentru elementele individuale
  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="py-16 md:py-24 bg-darkBg relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani">
            MPL Event Gallery
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explorează cele mai importante momente din cadrul evenimentelor Moldova Pro League
          </p>
        </div>

        {/* Filtrarea după categorie */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10" data-aos="fade-up" data-aos-delay="100">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilteredCategory(category === 'Toate' ? null : category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  (category === 'Toate' && !filteredCategory) || filteredCategory === category
                    ? 'bg-primary text-white shadow-glow-sm shadow-primary/30'
                    : 'bg-darkGray/60 text-gray-300 hover:bg-primary/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Grid de imagini */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              className="relative group overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(image)}
              variants={itemVariants}
              data-aos="zoom-in"
              data-aos-delay={100 + (image.id % 8) * 50}
            >
              <div className="aspect-square overflow-hidden bg-black rounded-lg">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <p className="text-white font-medium truncate">{image.alt}</p>
                  <p className="text-gray-300 text-sm">{image.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal pentru imagine full-size */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full h-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 bg-black/60 p-2 rounded-full text-white hover:bg-primary transition-colors z-10"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 rounded-b-lg">
                <p className="text-white font-medium">{selectedImage.alt}</p>
                <p className="text-gray-400 text-sm">{selectedImage.category}</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventGallerySection;