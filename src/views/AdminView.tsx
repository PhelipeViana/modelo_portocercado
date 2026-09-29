import React, { useMemo, useState } from 'react';
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
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Moon,
  Newspaper,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Sun,
  Users,
  X,
} from 'lucide-react';

type ArticleStatus = 'Publicado' | 'Rascunho' | 'Agendado';

interface ManagedArticle {
  id: number;
  title: string;
  category: string;
  author: string;
  updatedAt: string;
  status: ArticleStatus;
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
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
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

  const generateDraft = () => {
    const topic = aiPrompt.trim() || 'a rotina e os desafios da comunidade de Porto Cercado';
    setIsGenerating(true);
    window.setTimeout(() => {
      setDraftTitle(`Comunidade debate ${topic.charAt(0).toLocaleUpperCase('pt-BR') + topic.slice(1)}`);
      setDraftSummary(`Rascunho inicial produzido para informar os associados sobre ${topic}. Revise os dados, acrescente fontes e publique quando o conteúdo estiver aprovado.`);
      setIsGenerating(false);
      setIsAiOpen(false);
      setIsEditorOpen(true);
      setNotice('Rascunho criado com IA. Revise antes de publicar.');
    }, 650);
  };

  const saveDraft = (status: ArticleStatus) => {
    const title = draftTitle.trim() || 'Nova publicação sem título';
    setArticles((current) => [{
      id: Date.now(),
      title,
      category: 'Comunidade',
      author: 'Administração',
      updatedAt: 'Agora',
      status,
    }, ...current]);
    setIsEditorOpen(false);
    setNotice(status === 'Publicado' ? 'Notícia publicada com sucesso.' : 'Rascunho salvo com sucesso.');
  };

  const navigation = [
    { label: 'Visão geral', icon: LayoutDashboard },
    { label: 'Notícias', icon: Newspaper },
    { label: 'Rascunhos', icon: FilePenLine },
    { label: 'Mídia', icon: Archive },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-3 pb-7 pt-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/25">PC</div>
        <div>
          <p className="text-sm font-black tracking-tight text-slate-950 dark:text-white">Porto Cercado</p>
          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Painel administrativo</p>
        </div>
      </div>

      <nav className="space-y-1" aria-label="Navegação administrativa">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => { setActiveSection(label); closeMobileMenu(); }}
            className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition-colors ${activeSection === label
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-800">
        <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Configurações</p>
        <button type="button" className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <Settings className="h-4 w-4" /> Ajustes do portal
        </button>
        <button type="button" onClick={onExit} className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" /> Ver portal público
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-[#090D16] dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white/90 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:block">
        {sidebarContent}
      </aside>

      {isMobileMenuOpen && <button type="button" aria-label="Fechar menu" className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={closeMobileMenu} />}
      <aside id="admin-mobile-menu" className={`fixed inset-y-0 left-0 z-50 w-[78%] max-w-xs border-r border-slate-200 bg-white p-5 shadow-2xl transition-transform duration-200 dark:border-slate-800 dark:bg-slate-950 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      <main className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-slate-200 bg-slate-50/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10 dark:border-slate-800 dark:bg-[#090D16]/85">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" onClick={() => setIsMobileMenuOpen((value) => !value)} aria-expanded={isMobileMenuOpen} aria-controls="admin-mobile-menu" aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Conteúdo</p>
              <h1 className="truncate text-base font-black sm:text-lg">{activeSection}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={onToggleDarkMode} aria-label="Alternar tema" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button type="button" aria-label="Notificações" className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-200 sm:flex dark:text-slate-300 dark:hover:bg-slate-800"><Bell className="h-4 w-4" /></button>
            <button type="button" className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 text-left dark:border-slate-800 dark:bg-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">GA</span>
              <span className="hidden text-xs font-bold sm:block">Administração</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          {notice && <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{notice}</span><button type="button" aria-label="Fechar aviso" onClick={() => setNotice('')}><X className="h-4 w-4" /></button></div>}

          <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Gerencie as publicações do portal em um só lugar.</p>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Central de notícias</h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => setIsAiOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-sm font-bold text-emerald-800 transition-all hover:bg-emerald-50 dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"><Sparkles className="h-4 w-4" /> Gerar com IA</button>
              <button type="button" onClick={openNewArticle} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-600/30 active:scale-[.98]"><Plus className="h-4 w-4" /> Nova notícia</button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[['24', 'Notícias publicadas', Newspaper, 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300'], ['3', 'Rascunhos em revisão', FilePenLine, 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300'], ['2', 'Agendadas para a semana', Clock3, 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300'], ['1.284', 'Leituras este mês', Users, 'text-violet-600 bg-violet-50 dark:bg-violet-950/50 dark:text-violet-300']].map(([value, label, Icon, colors]) => {
              const StatIcon = Icon as React.ElementType;
              return <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between"><div><p className="text-2xl font-black tracking-tight">{value as string}</p><p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{label as string}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors as string}`}><StatIcon className="h-4 w-4" /></span></div></div>;
            })}
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-slate-800">
              <div><h3 className="font-black">Publicações recentes</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Acompanhe, revise e publique o conteúdo da associação.</p></div>
              <label className="relative block sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar notícia..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950" /></label>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredArticles.map((article) => <article key={article.id} className="flex flex-col gap-3 px-4 py-4 sm:px-5 lg:grid lg:grid-cols-[minmax(0,1fr)_140px_150px_110px_42px] lg:items-center lg:gap-5">
                <div className="min-w-0"><p className="truncate font-bold text-slate-900 dark:text-white">{article.title}</p><div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400"><span>{article.category}</span><span className="hidden sm:inline">•</span><span>{article.author}</span></div></div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{article.updatedAt}</span>
                <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusStyles[article.status]}`}>{article.status}</span>
                <button type="button" onClick={() => { setDraftTitle(article.title); setDraftSummary(''); setIsEditorOpen(true); }} className="w-fit text-xs font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400">Editar</button>
                <button type="button" aria-label={`Mais ações para ${article.title}`} className="absolute right-4 mt-[-32px] flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:static lg:mt-0 dark:hover:bg-slate-800"><MoreHorizontal className="h-5 w-5" /></button>
              </article>)}
              {filteredArticles.length === 0 && <div className="p-10 text-center"><FileText className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-bold">Nenhuma publicação encontrada</p><p className="mt-1 text-sm text-slate-500">Tente uma nova busca ou crie uma notícia.</p></div>}
            </div>
          </section>
        </div>
      </main>

      {isAiOpen && <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="ai-modal-title"><div className="w-full rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Bot className="h-5 w-5" /></span><div><h3 id="ai-modal-title" className="font-black">Criar rascunho com IA</h3><p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Informe o assunto. O conteúdo gerado deve ser revisado antes da publicação.</p></div></div><button type="button" aria-label="Fechar" onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white"><X className="h-5 w-5" /></button></div><label className="mt-6 block text-sm font-bold">Sobre o que você quer escrever?<textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="Ex.: Mutirão de limpeza nas margens do Rio Cuiabá" className="mt-2 min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950" /></label><button type="button" disabled={isGenerating} onClick={generateDraft} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-70"><Sparkles className="h-4 w-4" />{isGenerating ? 'Gerando rascunho...' : 'Gerar conteúdo'}</button></div></div>}

      {isEditorOpen && <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="editor-modal-title"><div className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:max-w-2xl sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Editor</p><h3 id="editor-modal-title" className="mt-1 text-xl font-black">Nova notícia</h3></div><button type="button" aria-label="Fechar" onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white"><X className="h-5 w-5" /></button></div><label className="mt-6 block text-sm font-bold">Título<input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="Digite o título da notícia" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950" /></label><label className="mt-4 block text-sm font-bold">Resumo<textarea value={draftSummary} onChange={(event) => setDraftSummary(event.target.value)} placeholder="Adicione um resumo para a publicação" className="mt-2 min-h-32 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950" /></label><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setIsEditorOpen(false)} className="min-h-11 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button><button type="button" onClick={() => saveDraft('Rascunho')} className="min-h-11 rounded-xl border border-emerald-200 px-4 text-sm font-bold text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40">Salvar rascunho</button><button type="button" onClick={() => saveDraft('Publicado')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"><Send className="h-4 w-4" />Publicar</button></div></div></div>}
    </div>
  );
};
