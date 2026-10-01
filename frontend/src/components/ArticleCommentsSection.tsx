import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Check, 
  Heart, 
  UserCheck, 
  LogOut, 
  Clock, 
  ShieldCheck,
  Reply,
  MessageSquarePlus,
  X,
  CornerDownRight
} from 'lucide-react';
import { ArticleComment, CommentUser } from '../types';
import { INITIAL_COMMENTS } from '../data/newsData';
import { registerSubscriberApi, fetchArticleComments, postArticleComment } from '../services/api';

interface ArticleCommentsSectionProps {
  articleSlug: string;
  articleId?: string | number;
}

export const ArticleCommentsSection: React.FC<ArticleCommentsSectionProps> = ({ articleSlug, articleId }) => {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [user, setUser] = useState<CommentUser | null>(null);

  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  
  const [replyTarget, setReplyTarget] = useState<{ id: string | number; authorName: string; parentId: string | number } | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [submitNotice, setSubmitNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load local subscriber session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('pc_comment_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loadCommentsList = () => {
    const numId = Number(articleId);
    if (!isNaN(numId) && numId > 0) {
      fetchArticleComments(numId).then((backendComments) => {
        if (backendComments && Array.isArray(backendComments)) {
          const mapped: ArticleComment[] = backendComments.map((c: any) => ({
            id: String(c.id),
            parentId: c.parentId ? String(c.parentId) : undefined,
            parentAuthorName: c.parentAuthorName,
            articleSlug,
            authorName: c.authorName,
            authorEmail: c.authorEmail,
            authorRole: 'Assinante Ativo',
            isPremium: true,
            content: c.content,
            createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : 'Recente',
            likes: 0,
          }));
          setComments(mapped);
          return;
        }
        loadFallbackComments();
      });
    } else {
      loadFallbackComments();
    }

    function loadFallbackComments() {
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

      const defaultList = INITIAL_COMMENTS.filter(
        (c: any) => c.articleSlug === articleSlug || c.articleSlug === 'comunidade-ribeirinha-e-rancheiros-porto-cercado'
      );

      const combined = [...localList, ...defaultList.filter((d: any) => !localList.some((l) => l.id === d.id))];
      setComments(combined);
    }
  };

  useEffect(() => {
    loadCommentsList();
  }, [articleSlug, articleId]);

  // Handle Subscriber Registration / Login in Modal
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim() || !loginEmail.trim()) return;

    setIsSubmitting(true);
    const res = await registerSubscriberApi(loginName.trim(), loginEmail.trim().toLowerCase());
    setIsSubmitting(false);

    if (res && res.error) {
      alert(res.error);
      return;
    }

    const newUser: CommentUser = {
      name: res.name || loginName.trim(),
      email: res.email || loginEmail.trim().toLowerCase(),
      isPremium: true,
      memberSince: new Date().toLocaleDateString('pt-BR')
    };

    setUser(newUser);
    localStorage.setItem('pc_comment_user', JSON.stringify(newUser));
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pc_comment_user');
  };

  // Open Comment Modal for a new root comment
  const handleOpenCommentModal = () => {
    setReplyTarget(null);
    setNewCommentText('');
    setShowCommentModal(true);
  };

  // Reply to Comment (sets parent/reply target)
  const handleReplyTo = (comment: ArticleComment) => {
    const parentId = comment.parentId || comment.id;
    setReplyTarget({
      id: comment.id,
      authorName: comment.authorName,
      parentId
    });
    setNewCommentText(`@${comment.authorName} `);
    setShowCommentModal(true);
  };

  // Handle Comment Submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCommentText.trim()) return;

    setIsSubmitting(true);
    const numId = Number(articleId);
    const parentNumId = replyTarget ? Number(replyTarget.parentId) : undefined;
    let success = true;

    if (!isNaN(numId) && numId > 0) {
      success = await postArticleComment(numId, user.name, user.email, newCommentText.trim(), parentNumId);
    }

    setIsSubmitting(false);

    if (success) {
      const newComment: ArticleComment = {
        id: `comment-${Date.now()}`,
        parentId: replyTarget ? replyTarget.parentId : undefined,
        parentAuthorName: replyTarget ? replyTarget.authorName : undefined,
        articleSlug,
        authorName: user.name,
        authorEmail: user.email,
        authorRole: 'Assinante Ativo',
        isPremium: true,
        content: newCommentText.trim(),
        createdAt: 'Agora mesmo',
        likes: 0
      };

      setComments((prev) => [...prev, newComment]);
      setSubmitNotice('Seu comentário foi publicado com sucesso!');
      setNewCommentText('');
      setReplyTarget(null);
      setShowCommentModal(false);
      setTimeout(() => setSubmitNotice(''), 4000);
      loadCommentsList();
    } else {
      alert('Não foi possível publicar seu comentário. Verifique se sua assinatura está ativa.');
    }
  };

  const handleLikeComment = (commentId: string | number) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = c.likedByMe;
          return {
            ...c,
            likes: (c.likes || 0) + (isLiked ? -1 : 1),
            likedByMe: !isLiked
          };
        }
        return c;
      })
    );
  };

  // Organize root comments and child replies
  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string | number) =>
    comments.filter((c) => String(c.parentId) === String(parentId));

  return (
    <section id="comments-section" className="w-full mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
      
      {/* 1. Header with Prominent Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-sans text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Comentários</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
              {comments.length}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Espaço aberto de opinião e participação dos assinantes do portal.
          </p>
        </div>

        {/* Prominent Button "Fazer Comentário" */}
        <button
          onClick={handleOpenCommentModal}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-600/20 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Fazer Comentário</span>
        </button>
      </div>

      {/* Notice Toast */}
      {submitNotice && (
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submitNotice}</span>
        </div>
      )}

      {/* 2. Threaded Comments List (PAI e FILHO) */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs space-y-3">
            <p>Nenhum comentário publicado nesta notícia ainda.</p>
            <button
              onClick={handleOpenCommentModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Seja o primeiro a comentar</span>
            </button>
          </div>
        ) : (
          rootComments.map((parent) => {
            const replies = getReplies(parent.id);

            return (
              <div key={parent.id} className="space-y-3">
                {/* --- COMENTÁRIO PAI --- */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {parent.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {parent.authorName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Assinante Ativo</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{parent.createdAt}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed pl-1 sm:pl-11">
                    {parent.content}
                  </p>

                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 pl-1 sm:pl-11 text-xs">
                    <button
                      onClick={() => handleLikeComment(parent.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer font-semibold ${
                        parent.likedByMe
                          ? 'text-rose-600 dark:text-rose-400 font-bold'
                          : 'text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${parent.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{(parent.likes || 0) > 0 ? parent.likes : 'Curtir'}</span>
                    </button>

                    <button
                      onClick={() => handleReplyTo(parent)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Responder</span>
                    </button>
                  </div>
                </div>

                {/* --- RESPOSTAS FILHOS (SUB-THREAD) --- */}
                {replies.length > 0 && (
                  <div className="ml-4 sm:ml-8 pl-3 sm:pl-5 border-l-2 border-emerald-500/40 dark:border-emerald-600/50 space-y-3 pt-1">
                    {replies.map((child) => (
                      <div 
                        key={child.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5 transition-colors shadow-2xs"
                      >
                        {/* Tag indicando resposta ao PAI */}
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          <CornerDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Em resposta a <strong className="text-slate-900 dark:text-white">{child.parentAuthorName || parent.authorName}</strong></span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-[11px] shrink-0">
                              {child.authorName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                {child.authorName}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[9px] flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Assinante</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{child.createdAt}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed pl-9">
                          {child.content}
                        </p>

                        <div className="flex items-center gap-4 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 pl-9 text-xs">
                          <button
                            onClick={() => handleLikeComment(child.id)}
                            className={`flex items-center gap-1.5 transition-colors cursor-pointer font-semibold ${
                              child.likedByMe
                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                : 'text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400'
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${child.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{(child.likes || 0) > 0 ? child.likes : 'Curtir'}</span>
                          </button>

                          <button
                            onClick={() => handleReplyTo(child)}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
                          >
                            <Reply className="w-3 h-3" />
                            <span>Responder</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. Modal Completo: Cadastro / Login & Redação de Comentário */}
      {showCommentModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCommentModal(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 p-6 sm:p-7">
            
            {/* Close Button */}
            <button
              onClick={() => setShowCommentModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!user ? (
              /* ESTADO 1: NÃO CADASTRADO / NÃO LOGADO */
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <UserCheck className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-sans">
                    Identificação de Assinante
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    A leitura é pública. Para publicar comentários diretamente no portal, informe seu Nome e E-mail como assinante ativo.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-3.5 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Seu Nome Completo:
                    </label>
                    <input
                      type="text"
                      required
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo"
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

                  <div className="flex gap-2.5 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowCommentModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? 'Verificando...' : 'Avançar para Comentar'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ESTADO 2: CADASTRADO / LOGADO -> FORMULÁRIO DE COMENTÁRIO */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">
                        {user.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span>Assinante Ativo</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Trocar de Conta"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sair</span>
                  </button>
                </div>

                {/* Banner de Reposta (se for resposta a um comentário existente) */}
                {replyTarget && (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CornerDownRight className="w-4 h-4 text-emerald-600" />
                      <span>Respondendo a: <strong>{replyTarget.authorName}</strong></span>
                    </span>
                    <button 
                      onClick={() => setReplyTarget(null)}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      Cancelar resposta
                    </button>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-sans">
                    {replyTarget ? `Responder a ${replyTarget.authorName}` : 'Publicar Comentário'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {replyTarget ? 'Sua resposta será anexada diretamente a este comentário.' : 'Escreva sua opinião ou contribuição abaixo.'}
                  </p>
                </div>

                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <textarea
                    rows={4}
                    maxLength={500}
                    autoFocus
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={replyTarget ? `Digite sua resposta para ${replyTarget.authorName}...` : "Escreva seu comentário sobre esta notícia..."}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{500 - newCommentText.length} caracteres restantes</span>
                    <button
                      type="submit"
                      disabled={!newCommentText.trim() || isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Publicando...' : replyTarget ? 'Enviar Resposta' : 'Publicar Comentário'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};

