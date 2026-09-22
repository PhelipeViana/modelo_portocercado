import React, { useState, useEffect } from 'react';
import { ScreenTab } from '../types';
import { 
  Contrast, 
  Type, 
  Search, 
  Megaphone,
  Menu,
  X,
  PhoneCall,
  Sun,
  Moon,
  Heart,
  Home,
  Landmark,
  UserPlus,
  FileText,
  IdCard,
  UserCog,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { PORTO_CERCADO_INFO } from '../data/pesqueirosData';
import { getLoggedUser, LoggedUser } from '../data/userData';

interface HeaderProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  onOpenSearch: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  highContrast: boolean;
  onToggleContrast: () => void;
  fontSizeLevel: number;
  onCycleFontSize: () => void;
  onOpenLiveTv?: () => void;
  onOpenDonation: () => void;
  onOpenEditUser?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  darkMode,
  onToggleDarkMode,
  highContrast,
  onToggleContrast,
  fontSizeLevel,
  onCycleFontSize,
  onOpenDonation,
  onOpenEditUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<LoggedUser>(getLoggedUser());

  // Listen to user profile updates
  useEffect(() => {
    const handleUpdate = () => {
      setUser(getLoggedUser());
    };
    window.addEventListener('pc_user_updated', handleUpdate);
    return () => window.removeEventListener('pc_user_updated', handleUpdate);
  }, []);

  // Menus Lógicos com a regra da Associação (em boxes com ícones)
  const navBoxes = [
    { 
      id: 'inicio' as ScreenTab, 
      label: 'Início', 
      sublabel: 'Notícias', 
      icon: Home 
    },
    { 
      id: 'institucional' as ScreenTab, 
      label: 'A Associação', 
      sublabel: 'Institucional', 
      icon: Landmark 
    },
    { 
      id: 'inscricao' as ScreenTab, 
      label: 'Filiação', 
      sublabel: 'Inscrição', 
      icon: UserPlus 
    },
    { 
      id: 'editais-e-atas' as ScreenTab, 
      label: 'Editais & Atas', 
      sublabel: 'Documentos', 
      icon: FileText 
    },
    { 
      id: 'area-associado' as ScreenTab, 
      label: 'Carteirinha', 
      sublabel: 'Associado', 
      icon: IdCard 
    }
  ];

  const initials = user.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'PC';

  return (
    <header className={`sticky top-0 left-0 w-full z-40 transition-colors backdrop-blur-md shadow-xs ${
      highContrast 
        ? 'bg-black text-white border-b border-gray-700' 
        : 'bg-white/95 dark:bg-slate-950/95 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800'
    } ${mobileMenuOpen ? 'max-h-screen overflow-y-auto overscroll-contain' : ''}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 flex flex-col justify-between">
        
        {/* Top bar: Informações Oficiais e Acessibilidade (Totalmente responsiva sem quebra de palavras) */}
        <div className="h-8 sm:h-9 flex items-center justify-between text-xs font-medium border-b border-gray-100/80 dark:border-slate-800/80 gap-2">
          
          {/* Lado Esquerdo: Localidade e Informação */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 min-w-0 overflow-hidden">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 whitespace-nowrap text-[11px] sm:text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="sm:hidden">Porto Cercado • MT</span>
              <span className="hidden sm:inline">Associação Oficial • Porto Cercado, Poconé/MT</span>
            </span>
            <span className="hidden md:inline-block text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium truncate text-left">
              <Megaphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">Portal Oficial dos Ribeirinhos e Pescadores</span>
            </span>
          </div>

          {/* Lado Direito: WhatsApp & Botões de Acessibilidade */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a 
              href="https://api.whatsapp.com/send/?phone=5565998059960&text=Olá, contato através do portal da Associação Porto Cercado."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors font-bold whitespace-nowrap text-[11px] sm:text-xs px-1.5 py-0.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
            >
              <PhoneCall className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">(65) 99805-9960</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            
            <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-slate-800">
              {/* Dark Mode Toggle */}
              <button 
                onClick={onToggleDarkMode}
                title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
                aria-label="Alternar Modo Escuro" 
                className={`p-1 sm:p-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  darkMode 
                    ? 'text-amber-400 bg-slate-800 hover:bg-slate-700' 
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                }`}
                type="button"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-bold hidden md:inline">{darkMode ? 'Claro' : 'Escuro'}</span>
              </button>

              {/* High Contrast Toggle */}
              <button 
                onClick={onToggleContrast}
                title={highContrast ? "Modo Padrão" : "Modo Alto Contraste"}
                aria-label="Alto Contraste" 
                className={`p-1 sm:p-1.5 rounded-lg transition-colors cursor-pointer ${
                  highContrast 
                    ? 'text-yellow-400 bg-gray-800' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                type="button"
              >
                <Contrast className="w-3.5 h-3.5" />
              </button>
              
              {/* Font Size Toggle */}
              <button 
                onClick={onCycleFontSize}
                title={`Tamanho da fonte: ${fontSizeLevel === 0 ? 'Padrão' : fontSizeLevel === 1 ? 'Média' : 'Grande'}`}
                aria-label="Aumentar Fonte" 
                className={`p-1 sm:p-1.5 rounded-lg flex items-center gap-0.5 text-xs font-bold transition-colors cursor-pointer ${
                  fontSizeLevel > 0 
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                type="button"
              >
                <Type className="w-3.5 h-3.5" />
                <span className="text-[10px]">{fontSizeLevel === 0 ? 'A' : fontSizeLevel === 1 ? 'A+' : 'A++'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Bar: Logo, Título, Doar e Botão do Menu (Fluido, flexível, sem corte de texto no mobile) */}
        <div className="min-h-[58px] sm:min-h-[72px] flex items-center justify-between gap-2 sm:gap-4 py-2 sm:py-2.5">
          
          {/* Logo Oficial Porto Cercado & Título */}
          <button 
            onClick={() => {
              onSelectTab('inicio');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3 text-left min-w-0 max-w-[65%] sm:max-w-none group focus:outline-none cursor-pointer shrink"
          >
            <img 
              src={PORTO_CERCADO_INFO.logoUrl} 
              alt="Logo Associação dos Ribeirinhos do Porto Cercado" 
              className="h-9 sm:h-11 md:h-12 w-auto object-contain drop-shadow-xs group-hover:scale-105 transition-transform shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <span className="font-sans text-base sm:text-lg lg:text-[22px] tracking-tight font-black text-slate-900 dark:text-white leading-tight block truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                PORTO CERCADO
              </span>
              <span className="text-[9px] sm:text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight sm:tracking-widest block truncate">
                <span className="sm:hidden">Associação de Pescadores</span>
                <span className="hidden sm:inline">PANTANAL VERDE • RIBEIRINHOS E PESCADORES</span>
              </span>
            </div>
          </button>

          {/* Search Input Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
            <div 
              onClick={onOpenSearch}
              className="relative w-full cursor-pointer group"
            >
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              <input
                readOnly
                className="w-full h-10 pl-10 pr-10 bg-slate-100/70 dark:bg-slate-900 hover:bg-emerald-50/50 dark:hover:bg-slate-850 rounded-xl text-slate-900 dark:text-slate-100 text-xs font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-all cursor-pointer border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300"
                placeholder="Pesquisar notícias, editais e ranchos..."
                type="text"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs">
                ⌘K
              </span>
            </div>
          </div>

          {/* Ações da Direita: Usuário Logado, Doar e Botão Menu Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Box Desktop: Usuário Logado & Acesso a Editar Dados */}
            {onOpenEditUser && (
              <button
                onClick={onOpenEditUser}
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border border-emerald-200/90 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 text-slate-900 dark:text-slate-100 transition-all cursor-pointer shadow-2xs group"
                title="Clique para editar seus dados de associado"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  {initials}
                </div>
                <div className="text-left leading-tight pr-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs truncate max-w-[120px] text-slate-900 dark:text-white">
                      {user.name}
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                    <UserCog className="w-3 h-3" />
                    Editar Dados
                  </span>
                </div>
              </button>
            )}

            {/* Botão Doar em Destaque (Responsivo, sem cortar no mobile) */}
            <button
              onClick={onOpenDonation}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-[1.02] active:scale-95 border border-amber-300/80 shrink-0"
              title="Apoie os Pescadores e Ribeirinhos de Porto Cercado"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-950 text-amber-950 animate-pulse" />
              <span>Doar</span>
            </button>

            {/* Botão Hambúrguer Mobile (Touch amplo) */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? "Fechar Menu" : "Abrir Menu em Boxes"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Lower Bar: Menus em Box com Ícones (Desktop) */}
        <div className="hidden lg:flex py-2.5 items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <nav className="flex items-center gap-2.5 flex-wrap">
            {navBoxes.map((box) => {
              const isActive = currentTab === box.id;
              const Icon = box.icon;
              return (
                <button
                  key={box.id}
                  onClick={() => onSelectTab(box.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    isActive 
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm' 
                      : 'bg-white dark:bg-slate-900 hover:bg-emerald-50/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive 
                      ? 'bg-emerald-800 text-white' 
                      : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block font-bold">{box.label}</span>
                    <span className={`block text-[10px] font-medium ${
                      isActive ? 'text-emerald-200' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {box.sublabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Box de Acesso Rápido para Editar Dados do Usuário Logado */}
          {onOpenEditUser && (
            <button
              onClick={onOpenEditUser}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700/80 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
            >
              <UserCog className="w-4 h-4 text-emerald-700 dark:text-emerald-400 group-hover:rotate-45 transition-transform" />
              <span>Editar Meus Dados</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Dropdown: Totalmente scrollável, sem cortes de texto ou botões */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3 max-h-[calc(100vh-110px)] overflow-y-auto overscroll-contain pr-1">
            
            {/* Cartão do Associado Logado no Topo do Menu Mobile */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {user.name}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block truncate">
                    {user.category}
                  </span>
                </div>
              </div>
              
              {onOpenEditUser && (
                <button
                  onClick={() => {
                    onOpenEditUser();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            {/* Busca Rápida Mobile */}
            <div>
              <button
                onClick={() => {
                  onOpenSearch();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 p-3 bg-slate-100 dark:bg-slate-850 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 cursor-pointer text-left"
              >
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">Pesquisar notícias, editais e resoluções...</span>
              </button>
            </div>

            {/* Grade de Menus em Box com Ícones (2 colunas equilibradas e textos legíveis) */}
            <div className="grid grid-cols-2 gap-2">
              {navBoxes.map((box) => {
                const isActive = currentTab === box.id;
                const Icon = box.icon;
                return (
                  <button
                    key={box.id}
                    onClick={() => {
                      onSelectTab(box.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm' 
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 shadow-2xs'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 shrink-0 ${
                      isActive 
                        ? 'bg-emerald-800 text-white' 
                        : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="font-bold text-xs leading-tight line-clamp-1">{box.label}</span>
                    <span className={`text-[10px] mt-0.5 leading-none ${
                      isActive ? 'text-emerald-200' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {box.sublabel}
                    </span>
                  </button>
                );
              })}

              {/* Box Adicional no Grid: Editar Meus Dados */}
              {onOpenEditUser && (
                <button
                  onClick={() => {
                    onOpenEditUser();
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl border border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-center transition-all cursor-pointer hover:bg-emerald-100 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1.5 shrink-0 shadow-xs">
                    <UserCog className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-bold text-xs leading-tight line-clamp-1">Editar Cadastro</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-none">
                    Usuário Logado
                  </span>
                </button>
              )}
            </div>

            {/* Box de Doação Mobile com visual de destaque */}
            <button
              onClick={() => {
                onOpenDonation();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-amber-300/80"
            >
              <Heart className="w-4 h-4 fill-amber-950 text-amber-950" />
              <span>Fazer Doação para a Associação</span>
            </button>

          </div>
        )}

      </div>
    </header>
  );
};
