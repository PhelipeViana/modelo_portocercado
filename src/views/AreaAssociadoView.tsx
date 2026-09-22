import React, { useState, useEffect } from 'react';
import { 
  BadgeCheck, 
  QrCode, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  HeartHandshake, 
  GraduationCap, 
  Percent,
  UserPlus,
  UserCog,
  MapPin
} from 'lucide-react';
import { getLoggedUser, LoggedUser } from '../data/userData';

interface AreaAssociadoViewProps {
  onOpenEditUser?: () => void;
}

export const AreaAssociadoView: React.FC<AreaAssociadoViewProps> = ({ onOpenEditUser }) => {
  const [activeTab, setActiveTab] = useState<'carteirinha' | 'filiacao'>('carteirinha');
  const [user, setUser] = useState<LoggedUser>(getLoggedUser());

  // Listen to user changes
  useEffect(() => {
    const handleUpdate = () => {
      setUser(getLoggedUser());
    };
    window.addEventListener('pc_user_updated', handleUpdate);
    return () => window.removeEventListener('pc_user_updated', handleUpdate);
  }, []);

  // Affiliation form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [uf, setUf] = useState('MT');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-10">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BadgeCheck className="w-4 h-4" />
            <span>Portal do Associado &amp; Clube de Benefícios</span>
          </div>
          <h1 className="font-newsreader text-3xl lg:text-4xl font-bold text-[#0B1C30] dark:text-white">
            Área do Membro Ribeirinho
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl mt-1 leading-relaxed">
            Consulte sua carteirinha digital oficial com verificação criptográfica, edite seus dados ou gerencie sua filiação.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenEditUser && (
            <button
              onClick={onOpenEditUser}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <UserCog className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Editar Meus Dados</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl transition-colors">
            <button
              onClick={() => setActiveTab('carteirinha')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'carteirinha'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Carteirinha Digital
            </button>
            <button
              onClick={() => setActiveTab('filiacao')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'filiacao'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Filiar-se Online
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'carteirinha' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Carteirinha Digital Visual Card (6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#064E3B] via-[#0B1120] to-[#064E3B] text-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-emerald-900/60 relative overflow-hidden">
            {/* Background seal */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Top Card Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
              <div>
                <span className="font-sans text-lg sm:text-xl font-bold tracking-tight text-white block">
                  ASSOCIAÇÃO PORTO CERCADO
                </span>
                <span className="text-[10px] text-emerald-300 tracking-widest uppercase font-semibold">
                  Carteira Oficial de Identidade Associativa • Pantanal Verde
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {user.isPremium ? 'Ativo e Regular' : 'Membro Cadastrado'}
              </span>
            </div>

            {/* Middle Card Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Nome do Titular</span>
                  <span className="text-base sm:text-lg font-bold text-white leading-tight block">{user.name}</span>
                  <span className="text-[11px] text-emerald-300/90 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{user.location}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registro / RGP</span>
                    <span className="font-mono font-bold text-emerald-300">{user.registration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Categoria</span>
                    <span className="font-semibold text-slate-200 line-clamp-1">{user.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Filiação</span>
                    <span className="font-medium text-slate-300">{user.memberSince}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Validade</span>
                    <span className="font-medium text-slate-300">{user.validUntil}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Validation Box */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-slate-900 shadow-inner">
                <QrCode className="w-16 h-16 text-[#0B1120]" />
                <span className="text-[9px] font-mono font-bold mt-1 text-slate-600">ID: {user.qrCodeId}</span>
              </div>
            </div>

            {/* Bottom Card Bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Certificação Pantaneira Ativa
              </span>
              
              <div className="flex items-center gap-3">
                {onOpenEditUser && (
                  <button
                    onClick={onOpenEditUser}
                    className="flex items-center gap-1 text-emerald-300 hover:text-white font-bold transition-colors cursor-pointer"
                  >
                    <UserCog className="w-3.5 h-3.5" />
                    <span>Editar Dados</span>
                  </button>
                )}

                <button
                  onClick={() => alert(`Carteirinha digital do associado ${user.name} salva com sucesso!`)}
                  className="flex items-center gap-1 text-emerald-300 hover:text-white font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Salvar PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clube de Benefícios & Convênios (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-newsreader text-xl font-bold text-slate-900 dark:text-white">
                Benefícios do Associado
              </h3>
              {onOpenEditUser && (
                <button
                  onClick={onOpenEditUser}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  Atualizar Cadastro
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Assessoria Jurídica</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Apoio na regularização fundiária, pesca e questões ribeirinhas.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Apoio Comunitário</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Parcerias de saúde e socorro a emergências no pantanal de Poconé.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Cursos de Condutores</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Capacitação náutica, guias de turismo ecológico e segurança de bordo.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Clube de Vantagens</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Condições especiais em combustíveis, peças náuticas e suprimentos.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Formulário de Filiação Online */
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md transition-colors">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-newsreader text-2xl font-bold text-slate-900 dark:text-white">
                Solicitação de Filiação Enviada!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Agradecemos seu interesse, <b>{name}</b>! Enviamos as instruções para o e-mail <b>{email}</b>. Nossa equipe entrará em contato em breve.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setActiveTab('carteirinha');
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Concluir e Voltar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="font-newsreader text-2xl font-bold text-slate-900 dark:text-white">
                  Formulário de Filiação Rápida
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Preencha seus dados para filiar-se à Associação dos Ribeirinhos do Porto Cercado.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Pantaneiro"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@exemplo.com"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Estado / UF</label>
                  <select
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="MT">Mato Grosso (MT)</option>
                    <option value="MS">Mato Grosso do Sul (MS)</option>
                    <option value="DF">Distrito Federal (DF)</option>
                    <option value="SP">São Paulo (SP)</option>
                    <option value="GO">Goiás (GO)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Categoria de Atuação</label>
                  <select className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600">
                    <option>Rancheiro / Morador</option>
                    <option>Pescador Profissional / Esportivo</option>
                    <option>Guia / Operador de Turismo</option>
                    <option>Pousadeiro / Empresário</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Enviar Proposta de Filiação
                </button>
              </div>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
