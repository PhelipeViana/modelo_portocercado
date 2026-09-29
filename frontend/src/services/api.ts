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
    return await res.json();
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

export async function sendAIChat(prompt: string): Promise<{ reply: string; timestamp: string }> {
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
    };
  }
}
