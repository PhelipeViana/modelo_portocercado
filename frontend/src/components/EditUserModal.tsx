import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCog, 
  Check, 
  ShieldCheck, 
  IdCard, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Award,
  Sparkles
} from 'lucide-react';
import { LoggedUser, getLoggedUser, saveLoggedUser } from '../data/userData';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSaved?: (user: LoggedUser) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onUserSaved
}) => {
  const [formData, setFormData] = useState<LoggedUser>(getLoggedUser());
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reload current user when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(getLoggedUser());
      setIsSaved(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof LoggedUser, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('O nome completo do associado é obrigatório.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }

    saveLoggedUser(formData);
    setIsSaved(true);
    setErrorMessage('');

    if (onUserSaved) {
      onUserSaved(formData);
    }

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const categories = [
    'Pescador Profissional Artesanal / Piloteiro Pantaneiro',
    'Morador Ribeirinho / Pescador Tradicional',
    'Proprietário de Rancho / Pousada em Porto Cercado',
    'Condutor Náutico & Guia de Pesca Esportiva',
    'Associado Amigo do Pantanal'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <UserCog className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-sans text-lg font-black text-slate-900 dark:text-white">
                Editar Dados do Associado Logado
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atualize suas informações cadastrais e sua carteirinha digital
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagem de Confirmação */}
        {isSaved && (
          <div className="m-6 p-4 rounded-2xl bg-emerald-500 text-white flex items-center gap-3 shadow-lg animate-in fade-in">
            <Check className="w-6 h-6" />
            <div>
              <p className="font-bold text-sm">Dados atualizados com sucesso!</p>
              <p className="text-xs text-emerald-100">Sua carteirinha e dados da sessão já refletem as alterações.</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs font-semibold border border-red-200 dark:border-red-900/60">
            {errorMessage}
          </div>
        )}

        {/* Formulário de Edição */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nome e CPF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nome Completo *</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Gerson Arruda de Almeida"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <IdCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>CPF ou RGP *</span>
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => handleChange('cpf', e.target.value)}
                placeholder="Ex: 812.319.801-44"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* E-mail e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>E-mail de Notificações *</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Ex: gerson@portocercado.org.br"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp / Celular</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Ex: (65) 99805-9960"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Categoria de Membro */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Categoria de Membro na Associação</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Registro e Localidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nº Registro Interno / Matrícula</span>
              </label>
              <input
                type="text"
                value={formData.registration}
                onChange={(e) => handleChange('registration', e.target.value)}
                placeholder="Ex: RP-0842-MT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Localidade / Rancho / Ponto Fluvial</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Ex: Porto Cercado - Margens do Rio Cuiabá"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Biografia / Observação Comunitária */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Histórico / Observações de Campo
            </label>
            <textarea
              rows={2}
              value={formData.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Descreva sua atuação nos rios pantaneiros ou ligação com a comunidade de Porto Cercado..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
