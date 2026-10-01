import { Article, OfficialDocument, CalendarEvent, VideoEpisode } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8088';

export interface SiteInfoData {
  id?: number;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  logo: string;
  statsAssociados: string;
  statsHistorico: string;
  footerText: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  cnpj: string;
  facebook: string;
  instagram: string;
  aboutTitle: string;
  aboutContent: string;
  benefit1Title: string;
  benefit1Desc: string;
  benefit1Icon: string;
  benefit2Title: string;
  benefit2Desc: string;
  benefit2Icon: string;
  benefit3Title: string;
  benefit3Desc: string;
  benefit3Icon: string;
}

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'super';
  ativo: boolean;
  createdAt?: string;
}

export interface ManagedArticleData {
  id: number; slug: string; title: string; subtitle?: string; summary: string; content: string;
  category: string; categoryColor: string; tag?: string; imageUrl: string; authorName: string;
  authorRole: string; authorInit: string; date: string; readTime: string; featured: boolean; status: 'published' | 'draft'; videoUrl?: string;
  updatedAt?: string;
}

export async function fetchManagedArticles(token: string): Promise<ManagedArticleData[]> {
  try { const res = await fetch(`${API_BASE_URL}/api/admin/articles`, { headers: { Authorization: `Bearer ${token}` } }); return res.ok ? await res.json() : []; }
  catch { return []; }
}
export async function saveManagedArticle(article: Partial<ManagedArticleData>, token: string): Promise<boolean> {
  try {
    const method = article.id ? 'PUT' : 'POST';
    const url = `${API_BASE_URL}/api/articles${article.id ? `/${article.id}` : ''}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(article) });
    return res.ok;
  } catch { return false; }
}
export async function removeManagedArticle(id: number, token: string): Promise<boolean> {
  try { const res = await fetch(`${API_BASE_URL}/api/articles/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); return res.ok; }
  catch { return false; }
}

export async function uploadArticleImage(image: Blob, token: string): Promise<string | null> {
  try {
    const form = new FormData();
    form.append('image', image, 'capa-noticia.jpg');
    const res = await fetch(`${API_BASE_URL}/api/uploads/images`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
    if (!res.ok) return null;
    const data = await res.json();
    return `${API_BASE_URL}${data.url}`;
  } catch { return null; }
}

export async function generateArticleImage(prompt: string, token: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return `${API_BASE_URL}${data.url}`;
  } catch { return null; }
}

export async function fetchHealth(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error('API Unreachable');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline ou inacessível:', err);
    return { status: 'offline', service: 'local-fallback' };
  }
}

// --- CMS: Informações Institucionais do Site ---

export async function fetchSiteInfo(): Promise<SiteInfoData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/site/info`);
    if (!res.ok) throw new Error('Falha ao obter informações do site');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.warn('Usando dados em memória para site info:', err);
    return null;
  }
}

export async function updateSiteInfo(data: Partial<SiteInfoData>, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/site/info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('Erro ao atualizar dados do site:', err);
    return false;
  }
}

// --- Autenticação & Gerenciamento de Usuários (Backup Role Based) ---

export async function loginApi(email: string, password: string): Promise<{ token: string; user: UserAccount } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Erro no login:', err);
    return null;
  }
}

export async function fetchUsers(token: string): Promise<UserAccount[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Acesso negado');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.warn('Erro ao buscar usuários:', err);
    return [];
  }
}

export async function createUser(userData: Partial<UserAccount> & { password: string }, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return res.ok;
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    return false;
  }
}

export async function updateUser(id: number, userData: Partial<UserAccount>, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return res.ok;
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    return false;
  }
}

export async function deleteUser(id: number, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.ok;
  } catch (err) {
    console.error('Erro ao remover usuário:', err);
    return false;
  }
}

// --- CMS Conteúdo Publicado ---

export async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles`);
    if (!res.ok) throw new Error('Falha ao buscar artigos');
    const rows = await res.json();
    return rows.map((row: any): Article => ({
      id: String(row.id), slug: row.slug, title: row.title, subtitle: row.subtitle || '', summary: row.summary || '',
      content: Array.isArray(row.content) ? row.content : [String(row.content || '')],
      category: row.category || 'Comunidade', categoryColor: row.categoryColor || 'emerald', tag: row.tag,
      imageUrl: row.imageUrl || '', author: { name: row.authorName || 'Associação Porto Cercado', role: row.authorRole || 'Comunicação', initials: row.authorInit || 'PC' },
      date: row.date || '', readTime: row.readTime || '3 min', featured: row.featured, shares: row.shares || 0, videoUrl: row.videoUrl || '',
    }));
  } catch (err) {
    console.warn('Usando fallback local para artigos:', err);
    return [];
  }
}

export async function fetchDocuments(): Promise<OfficialDocument[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/documents`);
    if (!res.ok) throw new Error('Falha ao buscar documentos');
    return await res.json();
  } catch (err) {
    console.warn('Usando fallback local para documentos:', err);
    return [];
  }
}

export async function fetchEvents(): Promise<CalendarEvent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`);
    if (!res.ok) throw new Error('Falha ao buscar eventos');
    return await res.json();
  } catch (err) {
    console.warn('Usando fallback local para eventos:', err);
    return [];
  }
}

export async function fetchVideos(): Promise<VideoEpisode[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/videos`);
    if (!res.ok) throw new Error('Falha ao buscar vídeos');
    return await res.json();
  } catch (err) {
    console.warn('Usando fallback local para vídeos:', err);
    return [];
  }
}

export interface AIResearchSource {
  title: string;
  url: string;
  publishedAt?: string;
}

export interface AIArticleDraft {
  reply: string;
  timestamp: string;
  title?: string;
  summary?: string;
  content?: string;
  provider?: string;
  sources?: AIResearchSource[];
}

export async function sendAIChat(prompt: string): Promise<AIArticleDraft> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error('Erro na chamada da IA');
    return await res.json();
  } catch (err) {
    return {
      reply: `Atendente Virtual (Modo Offline): Recebi sua mensagem sobre "${prompt}". O backend Fiber Go está ativo com Redis & PostgreSQL!`,
      timestamp: new Date().toLocaleTimeString(),
      provider: 'Modo local',
    };
  }
}

// --- Métricas, Comentários, Mídia e CRUD CMS Adicionais ---

export async function incrementArticleView(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}/view`, { method: 'POST' });
    return res.ok;
  } catch { return false; }
}

export async function incrementArticleShare(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}/share`, { method: 'POST' });
    return res.ok;
  } catch { return false; }
}

export async function fetchRelatedArticles(slug: string): Promise<Article[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles/${slug}/related`);
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map((row: any): Article => ({
      id: String(row.id), slug: row.slug, title: row.title, subtitle: row.subtitle || '', summary: row.summary || '',
      content: Array.isArray(row.content) ? row.content : [String(row.content || '')],
      category: row.category || 'Comunidade', categoryColor: row.categoryColor || 'emerald', tag: row.tag,
      imageUrl: row.imageUrl || '', author: { name: row.authorName || 'Associação Porto Cercado', role: row.authorRole || 'Comunicação', initials: row.authorInit || 'PC' },
      date: row.date || '', readTime: row.readTime || '3 min', featured: row.featured, shares: row.shares || 0, viewCount: row.viewCount || 0, videoUrl: row.videoUrl || '',
    }));
  } catch { return []; }
}

export async function fetchArticleComments(articleId: number): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles/${articleId}/comments`);
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

export async function postArticleComment(articleId: number, authorName: string, authorEmail: string, content: string, parentId?: number): Promise<boolean> {
  try {
    const payload: any = { authorName, authorEmail, content };
    if (parentId) payload.parentId = parentId;
    const res = await fetch(`${API_BASE_URL}/api/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch { return false; }
}

export async function fetchAdminComments(token: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/comments`, { headers: { Authorization: `Bearer ${token}` } });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

export async function updateCommentStatus(id: number, status: 'approved' | 'pending' | 'rejected', token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/comments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch { return false; }
}

export async function deleteComment(id: number, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/comments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch { return false; }
}

export async function fetchMediaFiles(token: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/media`, { headers: { Authorization: `Bearer ${token}` } });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

export async function deleteMediaFile(filename: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/media/${encodeURIComponent(filename)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch { return false; }
}

export async function saveManagedDocument(doc: Partial<OfficialDocument>, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(doc),
    });
    return res.ok;
  } catch { return false; }
}

export async function removeManagedDocument(id: number, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/documents/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch { return false; }
}

export async function saveManagedEvent(event: Partial<CalendarEvent>, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(event),
    });
    return res.ok;
  } catch { return false; }
}

export async function removeManagedEvent(id: number, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch { return false; }
}

export async function saveManagedVideo(video: Partial<VideoEpisode>, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(video),
    });
    return res.ok;
  } catch { return false; }
}

export async function removeManagedVideo(id: number, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/videos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch { return false; }
}

// --- Assinantes ---

export async function registerSubscriberApi(name: string, email: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/subscribers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao cadastrar assinante');
    }
    return await res.json();
  } catch (err: any) {
    return { error: err.message || 'Erro de conexão' };
  }
}

export async function loginSubscriberApi(email: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/subscribers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Assinante não encontrado');
    }
    return await res.json();
  } catch (err: any) {
    return { error: err.message || 'Erro de conexão' };
  }
}

export async function fetchAdminSubscribers(token: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/subscribers`, { headers: { Authorization: `Bearer ${token}` } });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

export async function toggleSubscriberStatus(id: number, ativo: boolean, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/subscribers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ativo }),
    });
    return res.ok;
  } catch { return false; }
}

export async function deleteSubscriber(id: number, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/subscribers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch { return false; }
}

