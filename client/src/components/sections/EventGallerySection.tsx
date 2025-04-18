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
    src: 'https://cdn.midjourney.com/4bd0f169-d6df-45fc-a8b7-d21b3cff9e59/0_2.webp',
    alt: 'MPL League of Legends Tournament 2024',
    category: 'LoL'
  },
  {
    id: 3,
    src: 'https://cdn.midjourney.com/f0a8a4ca-9384-431b-be2c-05ccb2dd911d/0_3.webp',
    alt: 'MPL Summer Cup 2024',
    category: 'Counter-Strike'
  },
  {
    id: 4,
    src: 'https://cdn.midjourney.com/0afefa62-d1a4-4b16-9dc2-abd5e2d1903c/0_1.webp',
    alt: 'League of Legends Finals Moldova 2024',
    category: 'LoL'
  },
  {
    id: 5,
    src: 'https://cdn.midjourney.com/ba6b2c32-b10a-4d74-a277-03821d44cca5/0_1.webp',
    alt: 'CS:GO Winter Championship Chișinău',
    category: 'Counter-Strike'
  },
  {
    id: 6,
    src: 'https://cdn.midjourney.com/e06e97ad-3d5a-4f8a-9bff-4f8462aa3823/0_0.webp',
    alt: 'FIFA 23 Tournament Moldova',
    category: 'FIFA'
  },
  {
    id: 7,
    src: 'https://cdn.midjourney.com/3fcd6030-cd72-4974-95a8-b0ec85b2da32/0_2.webp',
    alt: 'MPL League Gaming Session',
    category: 'Community'
  },
  {
    id: 8,
    src: 'https://cdn.midjourney.com/e4e6b7ba-d359-4dbb-9af4-ef252b511e68/0_1.webp',
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