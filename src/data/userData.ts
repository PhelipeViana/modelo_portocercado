export interface LoggedUser {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  category: string;
  registration: string;
  location: string;
  memberSince: string;
  validUntil: string;
  qrCodeId: string;
  isPremium: boolean;
  avatarUrl?: string;
  bio?: string;
}

export const DEFAULT_LOGGED_USER: LoggedUser = {
  name: 'Gerson Arruda de Almeida',
  email: 'gerson.pescador@portocercado.org.br',
  phone: '(65) 99805-9960',
  cpf: '812.319.801-44',
  category: 'Pescador Profissional Artesanal / Piloteiro Pantaneiro',
  registration: 'RP-0842-MT',
  location: 'Porto Cercado - Margens do Rio Cuiabá, Poconé/MT',
  memberSince: 'Março / 2014',
  validUntil: 'Dezembro / 2026',
  qrCodeId: 'PC-884210',
  isPremium: true,
  bio: 'Pescador profissional e piloteiro pantaneiro, morador tradicional das margens do Rio Cuiabá em Porto Cercado.'
};

export const USER_STORAGE_KEY = 'pc_logged_user';

export function getLoggedUser(): LoggedUser {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_LOGGED_USER, ...parsed };
    }
  } catch (e) {
    console.error('Erro ao ler usuário do localStorage', e);
  }
  return DEFAULT_LOGGED_USER;
}

export function saveLoggedUser(user: LoggedUser): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    
    // Sincroniza também com o usuário de comentários para manter coerência imediata
    const commentUser = {
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      memberSince: user.memberSince
    };
    localStorage.setItem('pc_comment_user', JSON.stringify(commentUser));

    // Notifica todos os componentes sobre a atualização
    window.dispatchEvent(new Event('pc_user_updated'));
  } catch (e) {
    console.error('Erro ao salvar usuário no localStorage', e);
  }
}
