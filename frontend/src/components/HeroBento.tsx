import React from 'react';
import { Clock, Timer, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface HeroBentoProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const HeroBento: React.FC<HeroBentoProps> = ({
  articles,
  onSelectArticle,
}) => {
  // Apenas 1 Destaque Principal
  const mainArticle = articles[0];

  if (!mainArticle) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-4">
      {/* Título de Seção Limpo */}
      <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-full"></span>
          <h2 className="font-sans text-2xl lg:text-3xl text-slate-900 dark:text-white font-black tracking-tight">
            Destaque
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
          Porto Cercado • Rio Cuiabá • Poconé - MT
        </span>
      </div>

      {/* Card Único de Destaque (Apenas 1 destaque, sem categorias) */}
      <article 
        onClick={() => onSelectArticle(mainArticle)}
        className="group bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs hover:shadow-lg transition-all border border-slate-200/80 dark:border-slate-800 cursor-pointer"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Foto Principal de Destaque (7 Cols no desktop) */}
          <div className="lg:col-span-7 relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm">
            <img 
              src={mainArticle.imageUrl} 
              alt={mainArticle.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
          </div>

          {/* Bloco Editorial de Destaque (5 Cols no desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
            <div>
              {/* Metadados: Autor, Data, Tempo de Leitura (sem categorização) */}
              <div className="flex flex-wrap items-center gap-2.5 text-slate-500 dark:text-slate-400 text-xs font-medium mb-3">
                <span className="font-bold text-emerald-800 dark:text-emerald-400">{mainArticle.author.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {mainArticle.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {mainArticle.readTime}
                </span>
              </div>

              {/* Manchete Principal de Destaque */}
              <h1 className="font-sans text-2xl sm:text-3xl lg:text-3xl font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight mb-3">
                {mainArticle.title}
              </h1>

              {/* Resumo da Notícia */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-4">
                {mainArticle.subtitle || mainArticle.summary}
              </p>
            </div>

            {/* Ação de Leitura */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm group-hover:underline">
                <span>Ler reportagem completa</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Comunidade Ribeirinha
              </span>
            </div>
          </div>

        </div>
      </article>
    </section>
  );
};
