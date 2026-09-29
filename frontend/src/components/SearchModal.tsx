import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Newspaper, Video, FileText, ArrowRight } from 'lucide-react';
import { ARTICLES_DATA, VIDEOS_DATA, OFFICIAL_DOCUMENTS } from '../data/newsData';
import { Article } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
  onSelectVideo: (videoId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
  onSelectVideo
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const matchedArticles = normalizedQuery
    ? ARTICLES_DATA.filter(
        (a) =>
          a.title.toLowerCase().includes(normalizedQuery) ||
          a.summary.toLowerCase().includes(normalizedQuery) ||
          a.category.toLowerCase().includes(normalizedQuery)
      )
    : ARTICLES_DATA.slice(0, 3);

  const matchedVideos = normalizedQuery
    ? VIDEOS_DATA.filter((v) => v.title.toLowerCase().includes(normalizedQuery))
    : [];

  const matchedDocs = normalizedQuery
    ? OFFICIAL_DOCUMENTS.filter((d) => d.title.toLowerCase().includes(normalizedQuery))
    : [];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar notícias, atas, editais, resoluções e vídeos..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Limpar
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-5 space-y-5">
          
          {/* Articles Section */}
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Notícias e Informativos ({matchedArticles.length})</span>
            </div>

            {matchedArticles.length > 0 ? (
              <div className="space-y-2">
                {matchedArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                        {art.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {art.summary}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">Nenhuma notícia encontrada.</p>
            )}
          </div>

          {/* Videos Section */}
          {matchedVideos.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>Vídeos e Entrevistas ({matchedVideos.length})</span>
              </div>
              <div className="space-y-2">
                {matchedVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      onSelectVideo(vid.id);
                      onClose();
                    }}
                    className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                      {vid.title}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Docs Section */}
          {matchedDocs.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Documentos Oficiais ({matchedDocs.length})</span>
              </div>
              <div className="space-y-2">
                {matchedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                      {doc.title}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {doc.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
