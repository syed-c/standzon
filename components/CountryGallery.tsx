'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CountryGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const gallery = Array.isArray(images) && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1515165562835-c3b8c93deaab?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536895058696-a69b1ccb5540?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1600&auto=format&fit=crop'
  ];

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % gallery.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <>
      <section className="w-full py-10">
        <h2 className="text-2xl font-bold text-center mb-6">Exhibition Booth Highlights</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-4">
          {gallery.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl shadow-lg aspect-square cursor-pointer group"
              onClick={() => openModal(i)}
            >
              <img
                src={src}
                alt={`Exhibition booth ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full-screen Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <img
              src={gallery[selectedImage]}
              alt={`Exhibition booth ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {selectedImage + 1} / {gallery.length}
          </div>
        </div>
      )}
    </>
  );
}


