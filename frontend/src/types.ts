export type ScreenTab =
  | 'inicio'
  | 'institucional'
  | 'inscricao'
  | 'editais-e-atas'
  | 'area-associado'
  | 'artigos-e-opiniao'
  | 'videos-e-tv'
  | 'galeria-de-fotos'
  | 'agenda-de-eventos'
  | 'noticia';

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string[];
  category: 'Institucional' | 'Jurídico' | 'Convenções' | 'Carreira & Mérito' | 'Regionais' | 'Artigo & Opinião' | 'Comunidade' | 'Meio Ambiente' | 'Turismo & Pesca' | 'Editais & Atas' | 'Infraestrutura';
  categoryColor: string;
  tag?: string;
  imageUrl: string;
  author: {
    name: string;
    role: string;
    initials: string;
  };
  date: string;
  readTime: string;
  featured?: boolean;
  shares?: number;
  viewCount?: number;
  publishedAt?: string;
  videoUrl?: string;
}

export interface VideoEpisode {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  duration: string;
  published: string;
  imageUrl: string;
  presenter?: string;
  description?: string;
  videoUrl?: string;
}

export interface PhotoAlbum {
  id: string;
  title: string;
  category: string;
  photoCount: number;
  coverUrl: string;
  date: string;
  location: string;
  description: string;
  photos: {
    url: string;
    caption: string;
  }[];
}

export interface OfficialDocument {
  id: string;
  title: string;
  code: string;
  type: 'Edital' | 'Ata' | 'Balanço' | 'Regulamento' | 'Resolução';
  date: string;
  size: string;
  status: string;
  summary: string;
  description?: string;
  category?: string;
  downloadUrl: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  day: string;
  month: string;
  year: string;
  time: string;
  modality: 'Online via Zoom' | 'Presencial' | 'Votação Eletrônica' | 'Híbrido';
  location: string;
  description: string;
  category: string;
  registered?: boolean;
}

export interface MemberProfile {
  name: string;
  registrationNumber: string;
  category: string;
  section: string;
  status: 'Ativo' | 'Pendente' | 'Regular';
  sinceYear: string;
  validThrough: string;
  cpfMasked: string;
}

export interface CommentUser {
  name: string;
  email: string;
  isPremium: boolean;
  avatarUrl?: string;
  memberSince?: string;
}

export interface ArticleComment {
  id: string | number;
  parentId?: string | number;
  parentAuthorName?: string;
  articleId?: number;
  articleSlug?: string;
  articleTitle?: string;
  authorName: string;
  authorEmail: string;
  authorRole?: string;
  isPremium?: boolean;
  content: string;
  status?: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  likes?: number;
  likedByMe?: boolean;
}

export interface MediaFile {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
}

export interface Subscriber {
  id: number;
  name: string;
  email: string;
  ativo: boolean;
  createdAt?: string;
}
