import React from 'react';
import { HeroBento } from '../components/HeroBento';
import { NewsFeedSection } from '../components/NewsFeedSection';
import { SidebarWidgets } from '../components/SidebarWidgets';
import { PhotoGalleryStrip } from '../components/PhotoGalleryStrip';
import { Article, PhotoAlbum, ScreenTab } from '../types';
import { ARTICLES_DATA } from '../data/newsData';

interface HomeViewProps {
  onSelectArticle: (article: Article) => void;
  onSelectVideo: (videoId?: string) => void;
  onOpenAlbum: (album: PhotoAlbum) => void;
  onNavigateTab: (tab: ScreenTab) => void;
  onShareArticle: (article: Article) => void;
  onOpenDocumentModal: (doc: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectArticle,
  onOpenAlbum,
  onNavigateTab,
  onShareArticle,
  onOpenDocumentModal
}) => {
  return (
    <main className="w-full flex flex-col">
      {/* 1. Destaque Principal Único (sem categorias) */}
      <HeroBento
        articles={ARTICLES_DATA}
        onSelectArticle={onSelectArticle}
      />

      {/* 2. Feed de Notícias & Sidebar de Serviços e Filiação */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main 8-col News Feed */}
          <div className="lg:col-span-8">
            <NewsFeedSection
              articles={ARTICLES_DATA}
              onSelectArticle={onSelectArticle}
              onShareArticle={onShareArticle}
            />
          </div>

          {/* 4-col Sidebar */}
          <SidebarWidgets
            onNavigateTab={onNavigateTab}
            onOpenDocumentModal={onOpenDocumentModal}
          />
        </div>
      </section>

      {/* 3. Galeria de Fotos do Pantanal e Porto Cercado */}
      <PhotoGalleryStrip
        onOpenAlbum={onOpenAlbum}
        onOpenAllGalleries={() => onNavigateTab('galeria-de-fotos')}
      />
    </main>
  );
};
