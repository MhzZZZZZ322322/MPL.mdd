import React from 'react';
import EventGallery, { GalleryItem } from '@/components/ui/event-gallery';

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
    src: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
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
    src: '/attached_assets/image_1744907275538.png',
    alt: 'MPL League Gaming Session',
    category: 'Community'
  },
  {
    id: 8,
    src: '/attached_assets/IMG_0006.png',
    alt: 'MPL Event Setup',
    category: 'Community'
  }
];

const EventGallerySection: React.FC = () => {
  return (
    <EventGallery 
      title="MPL Event Gallery" 
      subtitle="Explorează cele mai importante momente din cadrul evenimentelor Moldova Pro League"
      images={eventImages}
    />
  );
};

export default EventGallerySection;