import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Crown, 
  Lock, 
  Sparkles, 
  Check, 
  Heart, 
  UserCheck, 
  LogOut, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  Star,
  AlertCircle
} from 'lucide-react';
import { ArticleComment, CommentUser } from '../types';
import { INITIAL_COMMENTS } from '../data/newsData';

interface ArticleCommentsSectionProps {
  articleSlug: string;
}

export const ArticleCommentsSection: React.FC<ArticleCommentsSectionProps> = ({ articleSlug }) => {
  // 1. Comments list state (persisted per article in localStorage)
  const [comments, setComments] = useState<ArticleComment[]>([]);
  
  // 2. User authentication and Premium status (persisted globally in localStorage)
  const [user, setUser] = useState<CommentUser | null>(null);

  // 3. Form input states
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  
  // 4. Modal / Flow states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionProcessing, setSubscriptionProcessing] = useState(false);
  const [subscriptionSuccessMessage, setSubscriptionSuccessMessage] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');

  // Load user session on mount and listen to updates
  useEffect(() => {
    const loadSession = () => {
      const savedUser = localStorage.getItem('pc_comment_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadSession();

    window.addEventListener('pc_user_updated', loadSession);
    return () => window.removeEventListener('pc_user_updated', loadSession);
  }, []);

  // Load and merge comments for this article on mount and when articleSlug changes
  useEffect(() => {
    const storageKey = `pc_comments_${articleSlug}`;
    const savedLocalComments = localStorage.getItem(storageKey);
    let localList: ArticleComment[] = [];

    if (savedLocalComments) {
      try {
        localList = JSON.parse(savedLocalComments);
      } catch (e) {
        console.error(e);
      }
    }

    // Filter relevant initial mock comments for this article
    const defaultList = INITIAL_COMMENTS.filter(
      (c) => c.articleSlug === articleSlug || c.articleSlug === 'comunidade-ribeirinha-e-rancheiros-porto-cercado'
    );

    // Combine local user comments with mock initial comments
    const combined = [...localList, ...defaultList.filter((d) => !localList.some((l) => l.id === d.id))];
    setComments(combined);
  }, [articleSlug]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim() || !loginEmail.trim()) return;

    // Check if user was previously saved with premium
    const savedUserStr = localStorage.getItem('pc_comment_user');
    let isPrevPremium = false;
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        if (parsed.email === loginEmail.trim() && parsed.isPremium) {
          isPrevPremium = true;
        }
      } catch (err) {}
    }

    const newUser: CommentUser = {
      name: loginName.trim(),
      email: loginEmail.trim().toLowerCase(),
      isPremium: isPrevPremium,
      memberSince: new Date().toLocaleDateString('pt-BR')
    };

    setUser(newUser);
    localStorage.setItem('pc_comment_user', JSON.stringify(newUser));
    setShowLoginModal(false);
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pc_comment_user');
  };

  // Handle Subscription Simulation (R$ 9,99 / mês)
  const handleSubscribePremium = () => {
    if (!user) return;
    setSubscriptionProcessing(true);

    setTimeout(() => {
      const updatedUser: CommentUser = {
        ...user,
        isPremium: true
      };
      setUser(updatedUser);
      localStorage.setItem('pc_comment_user', JSON.stringify(updatedUser));
      setSubscriptionProcessing(false);
      setSubscriptionSuccessMessage(true);

      setTimeout(() => {
        setSubscriptionSuccessMessage(false);
        setShowSubscriptionModal(false);
      }, 1500);
    }, 1000);
  };

  // Handle Comment Submission
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.isPremium || !newCommentText.trim()) return;

    const newComment: ArticleComment = {
      id: `comment-${Date.now()}`,
      articleSlug,
      authorName: user.name,
      authorEmail: user.email,
      authorRole: 'Membro Premium Pantanal',
      isPremium: true,
      content: newCommentText.trim(),
      createdAt: 'Agora mesmo',
      likes: 0
    };

    const updated = [newComment, ...comments];
    setComments(updated);

    // Save user's own comments in localStorage
    const storageKey = `pc_comments_${articleSlug}`;
    const userCreated = updated.filter((c) => c.authorEmail === user.email);
    localStorage.setItem(storageKey, JSON.stringify(userCreated));

    setNewCommentText('');
  };

  // Handle Like on Comment
  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = c.likedByMe;
          return {
            ...c,
            likes: isLiked ? c.likes - 1 : c.likes + 1,
            likedByMe: !isLiked
          };
        }
        return c;
      })
    );
  };

  return (
    <section className="w-full mt-14 pt-10 border-t border-slate-200 dark:border-slate-800">
      
      {/* 1. Header of Comments Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-6 bg-emerald-600 rounded-full"></span>
            <h3 className="font-sans text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>Voz Comunitária • Comentários</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
                {comments.length}
              </span>
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Espaço aberto para leitura pública de toda a comunidade. Para comentar, autentique-se como Membro Premium.
          </p>
        </div>

        {/* User Status Bar */}
        {user ? (
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-2 sm:px-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="leading-tight">
              <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[130px]">
                {user.name}
              </span>
              {user.isPremium ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-500 dark:text-amber-400">
                  <Crown className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>Premium Ativo</span>
                </span>
              ) : (
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline cursor-pointer"
                >
                  Ativar Premium
                </button>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-2xs"
          >
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Fazer Login</span>
          </button>
        )}
      </div>

      {/* 2. Interactive Writing Box or Lock Warning */}
      <div className="mb-10">
        {!user ? (
          /* Case A: Not Logged In */
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-slate-50 to-slate-100 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-800/80 border border-emerald-200/80 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Lock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Deseja Comentar nesta Notícia?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                A leitura dos comentários é 100% livre. Para publicar uma manifestação, faça login com seu nome e e-mail. Para comentar é necessário ser <strong>Usuário Premium</strong> (R$ 9,99/mês).
              </p>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Entrar com Nome e E-mail
            </button>
          </div>
        ) : !user.isPremium ? (
          /* Case B: Logged in, but NOT Premium */
          <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-700">
                  <Crown className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Olá, {user.name}! Torne-se Membro Premium para Comentar
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    O acesso para comentar exige assinatura de <strong>R$ 9,99 por mês</strong> que apoia os ribeirinhos de Porto Cercado.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Ativar Premium (R$ 9,99/mês)
              </button>
            </div>

            <div className="text-xs text-amber-800 dark:text-amber-300/90 pl-1 border-t border-amber-200 dark:border-amber-800/50 pt-3 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Selo Membro Premium ⭐
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Publicação liberada em todo o portal
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Apoio ao fundo de defeso dos pescadores
              </span>
            </div>
          </div>
        ) : (
          /* Case C: Logged in AND Premium */
          <form onSubmit={handleSubmitComment} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1 border border-amber-300 dark:border-amber-700">
                  <Crown className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>Membro Premium ⭐</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {500 - newCommentText.length} caracteres
              </span>
            </div>

            <textarea
              rows={3}
              maxLength={500}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Escreva seu comentário ou consideração sobre esta notícia para a comunidade pantaneira..."
              className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-slate-400">
                Comentários passam por mediação comunitária para manter o respeito mútuo.
              </p>
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar Comentário</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Render Comments List (Free for reading by everyone) */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            Nenhum comentário publicado nesta notícia ainda. Seja o primeiro a comentar!
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2.5 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {comment.authorName}
                      </span>
                      {comment.isPremium && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                          <Crown className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>Membro Premium</span>
                        </span>
                      )}
                    </div>
                    {comment.authorRole && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {comment.authorRole}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{comment.createdAt}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed pl-1 sm:pl-11">
                {comment.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 pl-1 sm:pl-11 text-xs">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer font-semibold ${
                    comment.likedByMe
                      ? 'text-rose-600 dark:text-rose-400 font-bold'
                      : 'text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${comment.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{comment.likes > 0 ? comment.likes : 'Curtir'}</span>
                </button>

                <span className="text-[11px] text-slate-400">
                  Comunidade Porto Cercado
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Modal: Login (Nome & Email) */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLoginModal(false);
          }}
        >
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 p-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 font-sans">
              Identificação para Comentários
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Informe seu nome completo e e-mail para autenticar seu perfil no portal da Associação dos Ribeirinhos.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Seu Nome Completo:
                </label>
                <input
                  type="text"
                  required
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Seu E-mail:
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Ex: carlos@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  Para habilitar o envio de comentários, é necessária a assinatura <strong>Usuário Premium por R$ 9,99/mês</strong>.
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Premium Subscription Simulation (R$ 9,99/mês) */}
      {showSubscriptionModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && !subscriptionProcessing) setShowSubscriptionModal(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-amber-900/60 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-white p-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 fill-white" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Assinatura Comunitária
                </span>
              </div>
              <h3 className="text-2xl font-black font-sans leading-tight">
                Membro Premium Pantanal
              </h3>
              <p className="text-amber-100 text-xs mt-1">
                Comente em todas as notícias e apoie diretamente as famílias ribeirinhas de Porto Cercado.
              </p>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Pricing Box */}
              <div className="flex items-baseline justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <div>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                    Plano Mensal de Comentarista
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Acesso completo a comentários e debates
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    R$ 9,99
                  </span>
                  <span className="text-xs text-slate-500"> / mês</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Publicação de comentários autorizada em todas as notícias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Badge exclusivo <strong>Membro Premium ⭐</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Contribuição direta para o fundo comunitário dos pescadores</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Cancelamento fácil a qualquer momento</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Método de Pagamento Simulado:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'pix'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>PIX Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cartão de Crédito</span>
                  </button>
                </div>
              </div>

              {subscriptionSuccessMessage ? (
                <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-center text-xs flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Assinatura Premium ativada com sucesso!</span>
                </div>
              ) : (
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubscriptionModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={handleSubscribePremium}
                    disabled={subscriptionProcessing}
                    className="flex-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer transform active:scale-95"
                  >
                    {subscriptionProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-amber-950 border-t-transparent rounded-full animate-spin"></span>
                        <span>Processando Simulação...</span>
                      </span>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 fill-amber-950" />
                        <span>Confirmar Assinatura (R$ 9,99)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <p className="text-center text-[11px] text-slate-400">
                Simulação de assinatura: Nenhuma cobrança real será efetuada no seu cartão ou banco.
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
