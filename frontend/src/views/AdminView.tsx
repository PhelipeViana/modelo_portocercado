import React, { useMemo, useState, useEffect } from 'react';
import {
  Archive,
  ArrowLeft,
  Bell,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FilePenLine,
  FileText,
  Globe,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  MoreHorizontal,
  Moon,
  Newspaper,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  loginApi,
  fetchSiteInfo,
  updateSiteInfo,
  fetchUsers,
  createUser,
  deleteUser,
  fetchArticles,
  sendAIChat,
  SiteInfoData,
  UserAccount
} from '../services/api';
import { Article } from '../types';

type ArticleStatus = 'Publicado' | 'Rascunho' | 'Agendado';

interface ManagedArticle {
  id: number;
  title: string;
  category: string;
  author: string;
  updatedAt: string;
  status: ArticleStatus;
  summary?: string;
}

const INITIAL_ARTICLES: ManagedArticle[] = [
  { id: 1, title: 'Comunidade ribeirinha se une pela preservação do Rio Cuiabá', category: 'Meio Ambiente', author: 'Comunicação Ribeirinha', updatedAt: 'Hoje, 09:30', status: 'Publicado' },
  { id: 2, title: 'A união dos pescadores na conservação das espécies nativas', category: 'Comunidade', author: 'Benedito da Silva', updatedAt: 'Hoje, 08:00', status: 'Publicado' },
  { id: 3, title: 'Agenda de manutenção das pontes de acesso para outubro', category: 'Infraestrutura', author: 'Comissão de Acesso', updatedAt: 'Ontem, 16:20', status: 'Rascunho' },
  { id: 4, title: 'Convocação para Assembleia Geral da Associação', category: 'Institucional', author: 'Diretoria', updatedAt: '28 set, 11:40', status: 'Agendado' },
];

const statusStyles: Record<ArticleStatus, string> = {
  Publicado: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300',
  Rascunho: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300',
  Agendado: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-300',
};

interface AdminViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onExit: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ darkMode, onToggleDarkMode, onExit }) => {
  // Auth State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Content State
  const [articles, setArticles] = useState<ManagedArticle[]>(INITIAL_ARTICLES);
  const [activeSection, setActiveSection] = useState('Visão geral');
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSummary, setDraftSummary] = useState('');
  const [notice, setNotice] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // CMS Site Info State
  const [siteData, setSiteData] = useState<SiteInfoData>({
    title: 'Associação dos Ribeirinhos do Porto Cercado',
    heroTitle: 'Proteja Seu Futuro e Fortaleça Nossa Associação',
    heroSubtitle: 'Junte-se à Associação dos Ribeirinhos do Porto Cercado. Tenha voz e vez na Associação Pantaneira.',
    heroImage: '',
    logo: '',
    statsAssociados: '52',
    statsHistorico: '1',
    footerText: 'Unidos Somos Mais Fortes.',
    address: 'Porto Cercado, Poconé - MT',
    phone: '(65) 99805-9960',
    whatsapp: '(65) 99805-9960',
    email: 'contato@portocercado.com.br',
    cnpj: '61.968.959/0001-00',
    facebook: '',
    instagram: '',
    aboutTitle: 'Voz e Luta em Prol da Comunidade Ribeirinha',
    aboutContent: 'Depois de várias reuniões, a Associação foi criada e aprovada o seu estatuto em 15.03.2025...',
    benefit1Title: 'Assessoria Jurídica',
    benefit1Desc: 'Defesa dos Direitos dos Ribeirinhos.',
    benefit1Icon: 'shield',
    benefit2Title: 'Cursos e Capacitação',
    benefit2Desc: 'Capacitação profissional e pesca sustentável.',
    benefit2Icon: 'book',
    benefit3Title: 'Pagamento Mensalidade',
    benefit3Desc: 'Transparência total junto aos associados.',
    benefit3Icon: 'badge'
  });
  const [isSavingSite, setIsSavingSite] = useState(false);

  // Users State
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'super'>('admin');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Load backend data if authenticated
  useEffect(() => {
    if (token) {
      loadSiteInfo();
      loadUsersData();
      loadBackendArticles();
    }
  }, [token]);

  const loadSiteInfo = async () => {
    const data = await fetchSiteInfo();
    if (data) setSiteData(data);
  };

  const loadUsersData = async () => {
    if (!token) return;
    const data = await fetchUsers(token);
    if (data && data.length > 0) setUsersList(data);
  };

  const loadBackendArticles = async () => {
    const data = await fetchArticles();
    if (data && data.length > 0) {
      const mapped: ManagedArticle[] = data.map((art, idx) => ({
        id: Number(art.id) || idx + 10,
        title: art.title,
        category: art.category || 'Geral',
        author: art.author?.name || 'Administração',
        updatedAt: art.date || 'Recente',
        status: art.featured ? 'Publicado' : 'Publicado',
        summary: art.summary,
      }));
      setArticles(mapped);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const result = await loginApi(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (result && result.token) {
      setToken(result.token);
      setCurrentUser(result.user);
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('auth_user', JSON.stringify(result.user));
      setNotice(`Autenticado com sucesso como ${result.user.name}`);
    } else {
      setLoginError('E-mail ou senha incorretos. Verifique suas credenciais.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const handleSaveSiteInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSavingSite(true);
    const success = await updateSiteInfo(siteData, token);
    setIsSavingSite(false);
    if (success) {
      setNotice('Informações institucionais salvas e cache Redis atualizado!');
    } else {
      alert('Erro ao salvar informações do site.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsCreatingUser(true);
    const success = await createUser(
      {
        name: newUserName,
        email: newUserEmail,
        password: newUserPass,
        role: newUserRole,
        ativo: true,
      },
      token
    );
    setIsCreatingUser(false);
    if (success) {
      setIsCreateUserModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPass('');
      setNotice(`Usuário ${newUserEmail} cadastrado!`);
      loadUsersData();
    } else {
      alert('Erro ao criar usuário.');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!token) return;
    if (!confirm('Deseja realmente remover este usuário administrativo?')) return;
    const success = await deleteUser(id, token);
    if (success) {
      setNotice('Usuário removido com sucesso!');
      loadUsersData();
    } else {
      alert('Erro ao remover usuário (Apenas Super Admin pode remover).');
    }
  };

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR');
    if (!query) return articles;
    return articles.filter((article) => [article.title, article.category, article.author, article.status]
      .some((value) => value.toLocaleLowerCase('pt-BR').includes(query)));
  }, [articles, search]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const openNewArticle = () => {
    setDraftTitle('');
    setDraftSummary('');
    setIsEditorOpen(true);
  };

  const generateDraft = async () => {
    const topic = aiPrompt.trim() || 'a rotina e os desafios da comunidade de Porto Cercado';
    setIsGenerating(true);

    try {
      const response = await sendAIChat(`Escreva um rascunho de notícia sobre: ${topic}`);
      setDraftTitle(`Comunidade debate ${topic.charAt(0).toLocaleUpperCase('pt-BR') + topic.slice(1)}`);
      setDraftSummary(response.reply || `Rascunho produzido com IA para informar os associados sobre ${topic}.`);
    } catch {
      setDraftTitle(`Comunidade debate ${topic.charAt(0).toLocaleUpperCase('pt-BR') + topic.slice(1)}`);
      setDraftSummary(`Rascunho inicial produzido para informar os associados sobre ${topic}. Revise os dados e publique.`);
    }

    setIsGenerating(false);
    setIsAiOpen(false);
    setIsEditorOpen(true);
    setNotice('Rascunho criado com IA. Revise antes de publicar.');
  };

  const saveDraft = (status: ArticleStatus) => {
    const title = draftTitle.trim() || 'Nova publicação sem título';
    setArticles((current) => [{
      id: Date.now(),
      title,
      category: 'Comunidade',
      author: currentUser?.name || 'Administração',
      updatedAt: 'Agora',
      status,
      summary: draftSummary,
    }, ...current]);
    setIsEditorOpen(false);
    setNotice(status === 'Publicado' ? 'Notícia publicada com sucesso.' : 'Rascunho salvo com sucesso.');
  };

  const navigation = [
    { label: 'Visão geral', icon: LayoutDashboard },
    { label: 'Notícias', icon: Newspaper },
    { label: 'Rascunhos', icon: FilePenLine },
    { label: 'Mídia', icon: Archive },
    { label: 'Ajustes do portal', icon: Globe },
    { label: 'Usuários Admin', icon: Users },
  ];

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'GA';

  // --- LOGIN MODAL (When unauthenticated) ---
  if (!token || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={onExit}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Ver portal público
            </button>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-lg mx-auto mb-3 shadow-lg shadow-emerald-600/30">
              PC
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Painel Administrativo</h1>
            <p className="text-xs text-slate-400 mt-1">Porto Cercado 2 • Autenticação de Gestores</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
              <X className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                E-mail Administrativo
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@portocercado.com.br"
                className="w-full h-11 px-3.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              {isLoggingIn ? 'Entrando...' : 'Acessar Painel'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 font-semibold mb-2">Contas de teste rápidas (Senha: admin123):</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              <button
                type="button"
                onClick={() => { setLoginEmail('josecarlos@portocercado.com.br'); setLoginPassword('admin123'); }}
                className="text-[10px] font-bold px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-emerald-400 transition-colors"
              >
                José Carlos (Super)
              </button>
              <button
                type="button"
                onClick={() => { setLoginEmail('phelipegabriel1988@gmail.com'); setLoginPassword('admin123'); }}
                className="text-[10px] font-bold px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Phelipe (Super)
              </button>
              <button
                type="button"
                onClick={() => { setLoginEmail('admin@portocercado.com.br'); setLoginPassword('admin123'); }}
                className="text-[10px] font-bold px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Admin (Admin)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- FULL DESIGNED ADMIN DASHBOARD ---
  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-3 pb-7 pt-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/25">
          PC
        </div>
        <div>
          <p className="text-sm font-black tracking-tight text-slate-950 dark:text-white">Porto Cercado 2</p>
          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Painel administrativo</p>
        </div>
      </div>

      <nav className="space-y-1" aria-label="Navegação administrativa">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => { setActiveSection(label); closeMobileMenu(); }}
            className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition-colors ${
              activeSection === label
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-800">
        <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Sessão Ativa</p>
        <div className="px-3 py-2 mb-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-bold truncate text-slate-900 dark:text-white">{currentUser.name}</p>
          <span className={`inline-block text-[10px] font-black uppercase mt-0.5 ${
            currentUser.role === 'super' ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {currentUser.role === 'super' ? 'Super Admin' : 'Administrador'}
          </span>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" /> Ver portal público
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          <LogOut className="h-4 w-4" /> Encerrar sessão
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-[#090D16] dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white/90 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:block">
        {sidebarContent}
      </aside>

      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
      <aside
        id="admin-mobile-menu"
        className={`fixed inset-y-0 left-0 z-50 w-[78%] max-w-xs border-r border-slate-200 bg-white p-5 shadow-2xl transition-transform duration-200 dark:border-slate-800 dark:bg-slate-950 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      <main className="min-w-0 lg:pl-64">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-slate-200 bg-slate-50/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10 dark:border-slate-800 dark:bg-[#090D16]/85">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="admin-mobile-menu"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Conteúdo & Gestão</p>
              <h1 className="truncate text-base font-black sm:text-lg">{activeSection}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label="Alternar tema"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 text-left dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {userInitials}
                </span>
                <span className="hidden text-xs font-bold sm:block truncate max-w-[100px]">{currentUser.name}</span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content Body */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          
          {notice && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />{notice}
              </span>
              <button type="button" aria-label="Fechar aviso" onClick={() => setNotice('')}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* DYNAMIC SECTIONS */}

          {/* SECTION 1: AJUSTES DO PORTAL (CMS SITE SETTINGS) */}
          {activeSection === 'Ajustes do portal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">CMS Institucional</p>
                  <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Informações do Site</h2>
                </div>
              </div>

              <form onSubmit={handleSaveSiteInfo} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold mb-1">Título da Associação</label>
                    <input
                      type="text"
                      value={siteData.title}
                      onChange={(e) => setSiteData({ ...siteData, title: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">CNPJ</label>
                    <input
                      type="text"
                      value={siteData.cnpj}
                      onChange={(e) => setSiteData({ ...siteData, cnpj: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Título do Capa (Hero)</label>
                    <input
                      type="text"
                      value={siteData.heroTitle}
                      onChange={(e) => setSiteData({ ...siteData, heroTitle: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={siteData.phone}
                      onChange={(e) => setSiteData({ ...siteData, phone: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">E-mail de Contato</label>
                    <input
                      type="email"
                      value={siteData.email}
                      onChange={(e) => setSiteData({ ...siteData, email: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Endereço Oficial</label>
                    <input
                      type="text"
                      value={siteData.address}
                      onChange={(e) => setSiteData({ ...siteData, address: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">História & Sobre a Associação</label>
                  <textarea
                    rows={4}
                    value={siteData.aboutContent}
                    onChange={(e) => setSiteData({ ...siteData, aboutContent: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingSite}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
                  >
                    <Save className="h-4 w-4" />
                    {isSavingSite ? 'Salvando...' : 'Salvar Informações do Site'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 2: USUÁRIOS ADMIN */}
          {activeSection === 'Usuários Admin' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Nível de Acesso</p>
                  <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Usuários Administrativos</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateUserModalOpen(true)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
                >
                  <UserPlus className="h-4 w-4" /> Novo Administrador
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-black uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950">
                      <th className="py-3 px-4">Nome</th>
                      <th className="py-3 px-4">E-mail</th>
                      <th className="py-3 px-4">Nível</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                        <td className="py-3.5 px-4 font-bold">{u.name}</td>
                        <td className="py-3.5 px-4 text-slate-500">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            u.role === 'super'
                              ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {u.role === 'super' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {currentUser.role === 'super' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                              title="Remover Administrador"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: VISÃO GERAL / NOTÍCIAS (STANDARD ORIGINAL DASHBOARD) */}
          {(activeSection === 'Visão geral' || activeSection === 'Notícias' || activeSection === 'Rascunhos' || activeSection === 'Mídia') && (
            <>
              <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Gerencie as publicações do portal em um só lugar.</p>
                  <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Central de notícias</h2>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setIsAiOpen(true)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-sm font-bold text-emerald-800 transition-all hover:bg-emerald-50 dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                  >
                    <Sparkles className="h-4 w-4" /> Gerar com IA
                  </button>
                  <button
                    type="button"
                    onClick={openNewArticle}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-600/30 active:scale-[.98]"
                  >
                    <Plus className="h-4 w-4" /> Nova notícia
                  </button>
                </div>
              </section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [articles.length.toString(), 'Notícias no portal', Newspaper, 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300'],
                  ['3', 'Rascunhos em revisão', FilePenLine, 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300'],
                  ['2', 'Agendadas para a semana', Clock3, 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300'],
                  [usersList.length.toString(), 'Administradores Ativos', Users, 'text-violet-600 bg-violet-50 dark:bg-violet-950/50 dark:text-violet-300']
                ].map(([value, label, Icon, colors]) => {
                  const StatIcon = Icon as React.ElementType;
                  return (
                    <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-2xl font-black tracking-tight">{value as string}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{label as string}</p>
                        </div>
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors as string}`}>
                          <StatIcon className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </section>

              <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-slate-800">
                  <div>
                    <h3 className="font-black">Publicações recentes</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Acompanhe, revise e publique o conteúdo da associação.</p>
                  </div>
                  <label className="relative block sm:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Buscar notícia..."
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </label>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      className="flex flex-col gap-3 px-4 py-4 sm:px-5 lg:grid lg:grid-cols-[minmax(0,1fr)_140px_150px_110px_42px] lg:items-center lg:gap-5"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900 dark:text-white">{article.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>{article.category}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{article.author}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{article.updatedAt}</span>
                      <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusStyles[article.status]}`}>
                        {article.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setDraftTitle(article.title); setDraftSummary(article.summary || ''); setIsEditorOpen(true); }}
                        className="w-fit text-xs font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400 cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        aria-label={`Mais ações para ${article.title}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </article>
                  ))}
                  {filteredArticles.length === 0 && (
                    <div className="p-10 text-center">
                      <FileText className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 font-bold">Nenhuma publicação encontrada</p>
                      <p className="mt-1 text-sm text-slate-500">Tente uma nova busca ou crie uma notícia.</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

        </div>
      </main>

      {/* MODAL 1: AI GENERATOR MODAL */}
      {isAiOpen && (
        <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="ai-modal-title">
          <div className="w-full rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h3 id="ai-modal-title" className="font-black">Criar rascunho com IA (Fiber API)</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Informe o assunto. O conteúdo gerado deve ser revisado antes da publicação.
                  </p>
                </div>
              </div>
              <button type="button" aria-label="Fechar" onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="mt-6 block text-sm font-bold">
              Sobre o que você quer escrever?
              <textarea
                value={aiPrompt}
                onChange={(event) => setAiPrompt(event.target.value)}
                placeholder="Ex.: Mutirão de limpeza nas margens do Rio Cuiabá"
                className="mt-2 min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <button
              type="button"
              disabled={isGenerating}
              onClick={generateDraft}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-70"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Gerando rascunho...' : 'Gerar conteúdo'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="editor-modal-title">
          <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:max-w-2xl sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Editor</p>
                <h3 id="editor-modal-title" className="mt-1 text-xl font-black">Nova notícia</h3>
              </div>
              <button type="button" aria-label="Fechar" onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="mt-6 block text-sm font-bold">
              Título
              <input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="Digite o título da notícia"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="mt-4 block text-sm font-bold">
              Resumo
              <textarea
                value={draftSummary}
                onChange={(event) => setDraftSummary(event.target.value)}
                placeholder="Adicione um resumo para a publicação"
                className="mt-2 min-h-32 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsEditorOpen(false)} className="min-h-11 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Cancelar
              </button>
              <button type="button" onClick={() => saveDraft('Rascunho')} className="min-h-11 rounded-xl border border-emerald-200 px-4 text-sm font-bold text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
                Salvar rascunho
              </button>
              <button type="button" onClick={() => saveDraft('Publicado')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500">
                <Send className="h-4 w-4" />Publicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE USER MODAL */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg">Criar Usuário Administrativo</h3>
              <button type="button" onClick={() => setIsCreateUserModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ex.: Carlos da Silva"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="gestor@portocercado.com.br"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Senha Inicial</label>
                <input
                  type="password"
                  required
                  value={newUserPass}
                  onChange={(e) => setNewUserPass(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Nível de Acesso</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'super')}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="admin">Administrador (CMS & Notícias)</option>
                  <option value="super">Super Admin (Acesso Total)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateUserModalOpen(false)}
                  className="min-h-11 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
                >
                  {isCreatingUser ? 'Criando...' : 'Salvar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
