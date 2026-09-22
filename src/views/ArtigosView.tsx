import React, { useState } from 'react';
import { Search, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { ARTICLES_DATA } from '../data/newsData';

interface ArtigosViewProps {
  onSelectArticle: (article: Article) => void;
}

export const ArtigosView: React.FC<ArtigosViewProps> = ({ onSelectArticle }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sem categorização: busca geral direta
  const filtered = ARTICLES_DATA.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Caderno de Opinião e Análise Comunitária</span>
        </div>
        <h1 className="font-sans text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
          Artigos, Relatos &amp; Posicionamentos
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl mt-2 leading-relaxed">
          Reflexões e artigos sobre o Pantanal, preservação dos rios, legislação de pesca, turismo sustentável e relatos das famílias ribeirinhas de Porto Cercado.
        </p>
      </div>

      {/* Search Bar Sem Categorização */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Todas as Publicações ({filtered.length})
        </div>

        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, autor ou assunto..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((art) => (
          <article
            key={art.id}
            onClick={() => onSelectArticle(art)}
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              {/* Thumbnail sem badge de categoria */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{art.date}</span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>

                <h3 className="font-newsreader text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2 mb-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {art.subtitle || art.summary}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-750 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-[10px]">
                  {art.author.initials}
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{art.author.name}</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Ler artigo <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};
