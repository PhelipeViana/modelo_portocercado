import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Camera, MapPin, Calendar } from 'lucide-react';
import { PhotoAlbum } from '../types';

interface GalleryLightboxProps {
  album: PhotoAlbum | null;
  onClose: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ album, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!album) return null;

  const currentPhoto = album.photos[currentIndex] || { url: album.coverUrl, caption: album.title };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : album.photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < album.photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md">
      
      {/* Top Header */}
      <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none">{album.title}</h3>
            <div className="flex items-center gap-3 text-slate-400 text-xs mt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {album.location}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {album.date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono bg-white/10 px-2.5 py-1 rounded-full">
            Foto {currentIndex + 1} de {Math.max(album.photos.length, 1)} ({album.photoCount} no acervo)
          </span>

          <a
            href={currentPhoto.url}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs"
            title="Abrir imagem em alta resolução"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-colors"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image Container with direct link */}
        <div className="max-w-5xl max-h-[70vh] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center bg-black">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption}
            className="w-full h-full object-contain max-h-[70vh] transition-all duration-300"
          />
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Caption */}
      <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-3xl mx-auto w-full text-center">
        <p className="text-white text-xs sm:text-sm font-medium">
          {currentPhoto.caption || album.description}
        </p>
        <span className="text-[11px] text-slate-400 mt-1 block">
          Registro Fotográfico Oficial • Associação Notícias © 2024
        </span>
      </div>

    </div>
  );
};
