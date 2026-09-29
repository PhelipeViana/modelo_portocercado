import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Images, ArrowUpRight } from 'lucide-react';
import { PhotoAlbum } from '../types';
import { PHOTO_ALBUMS } from '../data/newsData';

interface GaleriaViewProps {
  onOpenAlbum: (album: PhotoAlbum) => void;
}

export const GaleriaView: React.FC<GaleriaViewProps> = ({ onOpenAlbum }) => {
  const [activeCategory, setActiveCategory] = useState('Todas');

  const categories = ['Todas', 'Confraternização', 'Capacitação Técnica', 'Saúde & Esportes', 'Atuação Institucional'];

  const filteredAlbums = activeCategory === 'Todas'
    ? PHOTO_ALBUMS
    : PHOTO_ALBUMS.filter(a => a.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Images className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Banco de Imagens e Memória</span>
        </div>
        <h1 className="font-sans text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
          Galeria Fotográfica de Porto Cercado
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl mt-2 leading-relaxed">
          Coberturas fotográficas dos pesqueiros, ranchos, rios Cuiabá e São Lourenço, festivais ecológicos e mutirões de limpeza das margens.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Albums */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            onClick={() => onOpenAlbum(album)}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-white text-[11px] font-medium flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{album.photoCount} fotos</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold text-emerald-300">
                    {album.category}
                  </span>
                  <h3 className="font-newsreader text-lg font-bold text-white line-clamp-1 mt-0.5">
                    {album.title}
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {album.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mt-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    {album.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    {album.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                <span>Ver álbum completo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
