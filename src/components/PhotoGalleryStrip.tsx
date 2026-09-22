import React from 'react';
import { Camera, ArrowRight, Images } from 'lucide-react';
import { PhotoAlbum } from '../types';
import { PHOTO_ALBUMS } from '../data/newsData';

interface PhotoGalleryStripProps {
  onOpenAlbum: (album: PhotoAlbum) => void;
  onOpenAllGalleries: () => void;
}

export const PhotoGalleryStrip: React.FC<PhotoGalleryStripProps> = ({
  onOpenAlbum,
  onOpenAllGalleries
}) => {
  return (
    <section className="w-full bg-emerald-50/70 dark:bg-slate-900/90 py-12 px-4 sm:px-6 lg:px-12 my-6 border-y border-emerald-200/70 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Images className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Memória e Belezas do Pantanal</span>
            </div>
            <h2 className="font-sans text-2xl lg:text-3xl text-slate-900 dark:text-white font-black">
              Galeria de Fotos • Rio Cuiabá &amp; Porto Cercado
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Registros da rica fauna, eventos comunitários ribeirinhos, pescarias esportivas e paisagens pantaneiras.
            </p>
          </div>

          <button
            onClick={onOpenAllGalleries}
            className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 text-xs font-bold hover:underline cursor-pointer"
          >
            <span>Ver Toda a Galeria</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid de 4 Fotos com Hover Dinâmico e Contadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PHOTO_ALBUMS.map((album) => (
            <div
              key={album.id}
              onClick={() => onOpenAlbum(album)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#0B1120] shadow-sm hover:shadow-lg transition-all cursor-pointer border border-slate-200/60 dark:border-slate-800"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${album.coverUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/90 via-[#0B1120]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Counter Badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-white text-[11px] font-medium flex items-center gap-1 border border-white/10">
                <Camera className="w-3.5 h-3.5 text-emerald-300" />
                <span>{album.photoCount} fotos</span>
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] uppercase text-emerald-300 font-bold tracking-wider">
                  {album.category}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5 group-hover:text-emerald-200 transition-colors">
                  {album.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
