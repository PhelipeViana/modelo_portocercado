import React, { useState } from 'react';
import { ArrowRight, Share2, RotateCw, Check } from 'lucide-react';
import { Article } from '../types';

interface NewsFeedSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onShareArticle: (article: Article) => void;
}

export const NewsFeedSection: React.FC<NewsFeedSectionProps> = ({
  articles,
  onSelectArticle,
  onShareArticle
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Exclui apenas o primeiro artigo (que já está no destaque único)
  // As informações não são categorizadas: fluxo direto e sequencial
  const feedArticles = articles.slice(1);

  const handleShare = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    onShareArticle(article);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col">
      {/* Header Limpo Sem Categorização */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-full"></span>
          <h2 className="font-sans text-xl lg:text-2xl text-slate-900 dark:text-white font-black">
            Notícias &amp; Comunicados
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
          Informativos Comunitários
        </span>
      </div>

      {/* Grade de 2 Colunas */}
      {feedArticles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
          Nenhuma publicação encontrada no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {feedArticles.slice(0, visibleCount).map((article) => {
            return (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="group bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 cursor-pointer"
              >
                <div>
                  {/* Thumbnail com proporção 16:10 (sem badge de categoria) */}
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3.5">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>

                  {/* Metadados */}
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400 truncate">{article.author.name}</span>
                    <span>•</span>
                    <span className="shrink-0">{article.date}</span>
                  </div>

                  {/* Título */}
                  <h3 className="font-sans text-base text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors font-bold mb-2 leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Resumo */}
                  <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {article.subtitle || article.summary}
                  </p>
                </div>

                {/* Rodapé do Card */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold group-hover:underline">
                    <span>Ler notícia</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>

                  <button
                    onClick={(e) => handleShare(e, article)}
                    className="flex items-center gap-1 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer p-1"
                    title="Compartilhar notícia"
                  >
                    {copiedId === article.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{article.shares}</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Botão Carregar Mais */}
      {feedArticles.length > visibleCount && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <RotateCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Carregar Mais Publicações</span>
          </button>
        </div>
      )}
    </div>
  );
};
