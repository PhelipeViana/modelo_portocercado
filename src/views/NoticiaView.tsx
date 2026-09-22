import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Printer, 
  Check, 
  Bookmark, 
  ChevronRight,
  Eye,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Article, ScreenTab } from '../types';
import { ARTICLES_DATA } from '../data/newsData';
import { ArticleCommentsSection } from '../components/ArticleCommentsSection';

interface NoticiaViewProps {
  article: Article;
  onNavigateHome: () => void;
  onSelectArticle: (article: Article) => void;
  onNavigateTab: (tab: ScreenTab) => void;
}

export const NoticiaView: React.FC<NoticiaViewProps> = ({
  article,
  onNavigateHome,
  onSelectArticle,
  onNavigateTab
}) => {
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.slug, article.id]);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${article.title}*\n\nLeia mais no portal da Associação Porto Cercado: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const fontSizeClass = fontScale === 'sm' 
    ? 'text-base leading-relaxed' 
    : fontScale === 'lg' 
    ? 'text-xl leading-relaxed font-normal' 
    : 'text-lg leading-relaxed';

  // 3 Related articles excluding current
  const relatedArticles = ARTICLES_DATA.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article className="w-full pb-16 pt-4 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Breadcrumbs & Return Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-200/80 dark:border-slate-800 mb-6 text-xs text-slate-500 dark:text-slate-400">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <button 
              onClick={onNavigateHome}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold cursor-pointer transition-colors"
            >
              Início
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            <button 
              onClick={onNavigateHome}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer transition-colors"
            >
              Notícias
            </button>
          </nav>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal</span>
          </button>
        </div>

        {/* 2. Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Publicado: {article.date}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* 3. Headline (H1) */}
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white font-black leading-tight tracking-tight mb-4">
          {article.title}
        </h1>

        {/* 4. Subtitle / Linha Fina */}
        {article.subtitle && (
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-normal border-l-4 border-emerald-600 dark:border-emerald-500 pl-4 py-1 italic bg-slate-50/60 dark:bg-slate-900/60 rounded-r-xl">
            {article.subtitle}
          </p>
        )}

        {/* 5. Author Bar & Reading Utilities */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 my-6 border-y border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-4 rounded-2xl transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {article.author.initials}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block leading-tight">
                {article.author.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                {article.author.role} • Porto Cercado, MT
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Font Scaler */}
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-2xs">
              <button 
                onClick={() => setFontScale('sm')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                  fontScale === 'sm' 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Tamanho de fonte menor"
              >
                A-
              </button>
              <button 
                onClick={() => setFontScale('md')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                  fontScale === 'md' 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Tamanho de fonte normal"
              >
                A
              </button>
              <button 
                onClick={() => setFontScale('lg')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                  fontScale === 'lg' 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Tamanho de fonte maior"
              >
                A+
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
              title="Imprimir Notícia"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer shadow-2xs ${
                bookmarked
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Salvar artigo"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Compartilhar no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Copiar link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* 6. Lead Image with Caption */}
        <div className="rounded-2xl overflow-hidden shadow-md aspect-video sm:aspect-21/9 bg-slate-100 dark:bg-slate-800 relative mb-8 border border-slate-200 dark:border-slate-800">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-lg">
            Foto: Acervo Associação dos Ribeirinhos do Porto Cercado
          </div>
        </div>

        {/* 7. Article Body Paragraphs */}
        <div className={`space-y-6 text-slate-800 dark:text-slate-100 ${fontSizeClass}`}>
          {article.content.map((paragraph, index) => (
            <p key={index} className="leading-relaxed font-normal text-slate-700 dark:text-slate-200">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 8. Institutional Footer / Seal Box */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                Assessoria de Imprensa e Comunicação Oficial
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Associação dos Ribeirinhos e Rancheiros do Porto Cercado • Poconé/MT
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            Mais Notícias do Portal
          </button>
        </div>

        {/* 9. Comments Section: Free to read, requires login & Premium (R$ 9,99/mo) to comment */}
        <ArticleCommentsSection articleSlug={article.slug} />

        {/* 10. Related Articles ("Leia Também") */}
        <div className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2.5 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-full"></span>
            <h3 className="font-sans text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Leia Também no Portal
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div 
                key={rel.id}
                onClick={() => onSelectArticle(rel)}
                className="group bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
                    <img 
                      src={rel.imageUrl} 
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block mb-1">
                    {rel.date} • {rel.readTime}
                  </span>

                  <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <span>Ler artigo completo</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </article>
  );
};
