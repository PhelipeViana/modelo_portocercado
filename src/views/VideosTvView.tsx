import React, { useState } from 'react';
import { Play, Clock, Calendar } from 'lucide-react';
import { VIDEOS_DATA } from '../data/newsData';

interface VideosTvViewProps {
  onSelectVideo: (videoId: string) => void;
}

export const VideosTvView: React.FC<VideosTvViewProps> = ({ onSelectVideo }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', 'Fórum Especial', 'Painel Executivo', 'Debate Jurídico', 'Assembleia Geral', 'Previdência & Saúde'];

  const filteredVideos = activeCategory === 'Todos'
    ? VIDEOS_DATA
    : VIDEOS_DATA.filter(v => v.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-10">
      
      {/* Live TV Hero Banner */}
      <div className="rounded-3xl bg-[#0B1120] text-white p-8 lg:p-12 overflow-hidden relative border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded bg-[#DC2626] text-white text-xs font-bold uppercase flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Transmissão Oficial
            </span>
            <span className="text-slate-400 text-xs font-medium">Sinal Oficial Integrado</span>
          </div>

          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
            TV Porto Cercado: Voz da Comunidade e do Pantanal
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Acompanhe nossas reportagens sobre a vida ribeirinha, reuniões comunitárias com o poder público de Poconé e Barão de Melgaço, boas práticas de turismo e proteção ao Pantanal.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => onSelectVideo(VIDEOS_DATA[0].id)}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Assistir Vídeo em Destaque</span>
            </button>
            <div className="text-xs text-slate-400 font-mono">
              Produções Pantaneiras
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200 dark:border-slate-800 transition-colors">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeCategory === cat
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video.id)}
            className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs hover:shadow-lg border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={video.imageUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  {video.duration}
                </span>
                <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  {video.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-newsreader text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {video.published}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {video.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
