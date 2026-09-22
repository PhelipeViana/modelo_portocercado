import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TickerBar } from './components/TickerBar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { InstitucionalView } from './views/InstitucionalView';
import { ArtigosView } from './views/ArtigosView';
import { VideosTvView } from './views/VideosTvView';
import { GaleriaView } from './views/GaleriaView';
import { EditaisView } from './views/EditaisView';
import { AgendaView } from './views/AgendaView';
import { InscricaoView } from './views/InscricaoView';
import { AreaAssociadoView } from './views/AreaAssociadoView';
import { NoticiaView } from './views/NoticiaView';

import { GalleryLightbox } from './components/GalleryLightbox';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { DocumentModal } from './components/DocumentModal';
import { SearchModal } from './components/SearchModal';
import { DonationModal } from './components/DonationModal';
import { EditUserModal } from './components/EditUserModal';

import { Article, PhotoAlbum, VideoEpisode, OfficialDocument, ScreenTab } from './types';
import { ARTICLES_DATA, VIDEOS_DATA, PHOTO_ALBUMS, getArticleBySlug } from './data/newsData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('inicio');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  
  // Accessibility and Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(0); // 0: normal, 1: +2px, 2: +4px

  useEffect(() => {
    if (darkMode || highContrast) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode, highContrast]);

  // Modal active states (excluding ArticleModal which is now a dedicated page)
  const [activeAlbum, setActiveAlbum] = useState<PhotoAlbum | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoEpisode | null>(null);
  const [activeDocument, setActiveDocument] = useState<OfficialDocument | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  // URL Hash & Path Router Synchronization
  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const path = window.location.pathname.replace(/^\//, '');

      // Check if user clicked direct donation route
      if (hash === 'doar' || path === 'doar') {
        setIsDonationOpen(true);
      }

      // Check for noticia slug in hash or path
      let noticiaSlug = '';
      if (hash.startsWith('noticia/')) {
        noticiaSlug = hash.replace('noticia/', '').split('?')[0];
      } else if (path.startsWith('noticia/')) {
        noticiaSlug = path.replace('noticia/', '').split('?')[0];
      }

      if (noticiaSlug) {
        const found = getArticleBySlug(noticiaSlug);
        if (found) {
          setActiveArticle(found);
          setCurrentTab('noticia');
          return;
        }
      }

      const validTabs: ScreenTab[] = [
        'inicio',
        'institucional',
        'inscricao',
        'editais-e-atas',
        'area-associado',
        'artigos-e-opiniao',
        'videos-e-tv',
        'galeria-de-fotos',
        'agenda-de-eventos'
      ];

      const cleanHash = hash.split('?')[0] as ScreenTab;
      const cleanPath = path.split('?')[0] as ScreenTab;

      if (validTabs.includes(cleanHash)) {
        setCurrentTab(cleanHash);
        setActiveArticle(null);
      } else if (validTabs.includes(cleanPath)) {
        setCurrentTab(cleanPath);
        setActiveArticle(null);
      }
    };

    parseRoute();
    const handleRouteEvent = () => parseRoute();
    window.addEventListener('popstate', handleRouteEvent);
    window.addEventListener('hashchange', handleRouteEvent);
    return () => {
      window.removeEventListener('popstate', handleRouteEvent);
      window.removeEventListener('hashchange', handleRouteEvent);
    };
  }, []);

  const handleSelectArticle = (article: Article) => {
    setActiveArticle(article);
    setCurrentTab('noticia');
    window.history.pushState({ slug: article.slug }, '', `#/noticia/${article.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActiveArticle(null);
    setCurrentTab('inicio');
    window.history.pushState(null, '', '#/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: ScreenTab) => {
    if (tab !== 'noticia') {
      setActiveArticle(null);
    }
    setCurrentTab(tab);
    window.history.pushState(null, '', tab === 'inicio' ? '#/' : `#/${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global Keyboard shortcuts (Cmd+K / Ctrl+K for search, Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setActiveAlbum(null);
        setActiveVideo(null);
        setActiveDocument(null);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCycleFontSize = () => {
    setFontSizeLevel((prev) => (prev + 1) % 3);
  };

  const handleOpenVideoById = (videoId?: string) => {
    const found = VIDEOS_DATA.find((v) => v.id === videoId) || VIDEOS_DATA[0];
    setActiveVideo(found);
  };

  const handleOpenAlbumById = (albumId?: string) => {
    const found = PHOTO_ALBUMS.find((a) => a.id === albumId) || PHOTO_ALBUMS[0];
    setActiveAlbum(found);
  };

  const handleShareArticle = (article: Article) => {
    if (navigator.clipboard) {
      const url = `${window.location.origin}${window.location.pathname}#/noticia/${article.slug}`;
      navigator.clipboard.writeText(url);
    }
  };

  // Font size multiplier class applied to main body wrapper
  const fontSizeStyleClass = fontSizeLevel === 1 
    ? 'text-[17px]' 
    : fontSizeLevel === 2 
    ? 'text-[18px]' 
    : 'text-base';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      highContrast 
        ? 'bg-black text-white' 
        : 'bg-[#F8FAFC] dark:bg-[#090D16] text-[#0B1C30] dark:text-slate-100'
    } ${fontSizeStyleClass}`}>
      
      {/* 1. Header with box navigation with icons, user profile box, and search */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        highContrast={highContrast}
        onToggleContrast={() => setHighContrast(!highContrast)}
        fontSizeLevel={fontSizeLevel}
        onCycleFontSize={handleCycleFontSize}
        onOpenLiveTv={() => handleOpenVideoById(VIDEOS_DATA[0].id)}
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenEditUser={() => setIsEditUserOpen(true)}
      />

      {/* 2. Breaking News Ticker Bar */}
      <TickerBar
        onSelectHeadline={(headline) => {
          const matched = ARTICLES_DATA.find((a) => a.title.includes(headline.slice(0, 20)));
          handleSelectArticle(matched || ARTICLES_DATA[0]);
        }}
      />

      {/* 3. Dynamic Screen View Router */}
      <div className="flex-1">
        {currentTab === 'inicio' && (
          <HomeView
            onSelectArticle={handleSelectArticle}
            onSelectVideo={handleOpenVideoById}
            onOpenAlbum={(album) => setActiveAlbum(album)}
            onNavigateTab={handleSelectTab}
            onShareArticle={handleShareArticle}
            onOpenDocumentModal={(doc) => setActiveDocument(doc)}
          />
        )}

        {currentTab === 'noticia' && (
          <NoticiaView
            article={activeArticle || ARTICLES_DATA[0]}
            onNavigateHome={handleNavigateHome}
            onSelectArticle={handleSelectArticle}
            onNavigateTab={handleSelectTab}
          />
        )}

        {currentTab === 'institucional' && (
          <InstitucionalView
            onNavigateTab={handleSelectTab}
          />
        )}

        {currentTab === 'inscricao' && (
          <InscricaoView />
        )}

        {currentTab === 'editais-e-atas' && (
          <EditaisView
            onOpenDocumentModal={(doc) => setActiveDocument(doc)}
          />
        )}

        {currentTab === 'area-associado' && (
          <AreaAssociadoView
            onOpenEditUser={() => setIsEditUserOpen(true)}
          />
        )}

        {currentTab === 'artigos-e-opiniao' && (
          <ArtigosView
            onSelectArticle={handleSelectArticle}
          />
        )}

        {currentTab === 'videos-e-tv' && (
          <VideosTvView
            onSelectVideo={handleOpenVideoById}
          />
        )}

        {currentTab === 'galeria-de-fotos' && (
          <GaleriaView
            onOpenAlbum={(album) => setActiveAlbum(album)}
          />
        )}

        {currentTab === 'agenda-de-eventos' && (
          <AgendaView />
        )}
      </div>

      {/* 4. Complete Footer with clipping signup and institutional links */}
      <Footer
        onNavigateTab={handleSelectTab}
      />

      {/* Lightboxes and Modals */}
      <GalleryLightbox
        album={activeAlbum}
        onClose={() => setActiveAlbum(null)}
      />

      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />

      <DocumentModal
        document={activeDocument}
        onClose={() => setActiveDocument(null)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleSelectArticle}
        onSelectVideo={(id) => handleOpenVideoById(id)}
      />

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />

      <EditUserModal
        isOpen={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
      />

    </div>
  );
}

