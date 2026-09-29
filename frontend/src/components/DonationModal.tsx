import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  LifeBuoy, 
  Fish, 
  MessageCircle, 
  Sparkles,
  Award
} from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(50);
  const [customAmount, setCustomAmount] = useState<string>('75');
  const [copied, setCopied] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donationSuccess, setDonationSuccess] = useState(false);

  if (!isOpen) return null;

  const currentAmountValue = selectedAmount === 'custom' 
    ? parseFloat(customAmount.replace(',', '.')) || 0 
    : selectedAmount;

  const pixKey = "pix@portocercadopantanal.org.br";

  const handleCopyPix = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSimulateDonation = () => {
    setDonationSuccess(true);
  };

  const handleSendWhatsAppProof = () => {
    const text = encodeURIComponent(
      `Olá, Tesouraria da Associação Porto Cercado! Fiz uma doação no valor de R$ ${currentAmountValue.toFixed(2)} em apoio aos pescadores e ribeirinhos do Pantanal.${donorName ? ` Meu nome é ${donorName}.` : ''}`
    );
    window.open(`https://api.whatsapp.com/send?phone=5565998059960&text=${text}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header with Warm Pantanal Tone */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 pb-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-300/30">
            <Heart className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Fundo Solidário dos Pescadores</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-sans leading-tight">
            Doar para a Associação Porto Cercado
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Sua contribuição apoia diretamente as famílias de pescadores artesanais no período de defeso e mantém os barcos comunitários de socorro no Rio Cuiabá.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {donationSuccess ? (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-500">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Muito Obrigado pelo seu Apoio!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                  Sua doação simulada de <strong className="text-emerald-700 dark:text-emerald-400">R$ {currentAmountValue.toFixed(2)}</strong> foi registrada. Os ribeirinhos de Porto Cercado agradecem imensamente pelo seu gesto!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 text-left space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <Award className="w-4 h-4" />
                  <span>Destinação Comunitária:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                  <li>Manutenção de voadeiras para transporte escolar de crianças ribeirinhas</li>
                  <li>Cestas básicas e remédios para famílias na época do defeso/piracema</li>
                  <li>Mutirões de despoluição e proteção das matas do Rio Cuiabá</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleSendWhatsAppProof}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Comprovante (WhatsApp)</span>
                </button>
                <button
                  onClick={() => {
                    setDonationSuccess(false);
                    onClose();
                  }}
                  className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Value Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  Escolha o Valor da sua Doação:
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[20, 50, 100, 200].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={`py-3 px-2 rounded-2xl text-sm font-black transition-all cursor-pointer border ${
                        selectedAmount === amount
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      R$ {amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount option */}
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedAmount('custom')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      selectedAmount === 'custom'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Outro Valor
                  </button>

                  {selectedAmount === 'custom' && (
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        R$
                      </span>
                      <input
                        type="number"
                        min="5"
                        max="10000"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Ex: 80"
                        className="w-full pl-9 pr-3 py-2 text-sm font-bold bg-white dark:bg-slate-800 border border-emerald-400 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* PIX Key and QR Code Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Chave PIX Oficial (E-mail):</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    PIX Instantâneo
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <code className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate flex-1 select-all">
                    {pixKey}
                  </code>
                  <button
                    onClick={handleCopyPix}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                    title="Copiar Chave PIX"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiada!' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Favorecido: Associação dos Ribeirinhos e Pescadores de Porto Cercado</span>
                </div>
              </div>

              {/* Optional Donor Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Seu Nome (Opcional para Livro de Apoiadores):
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Ex: João da Silva / Amigo do Pantanal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSimulateDonation}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer transform active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-amber-950" />
                  <span>Confirmar Doação de R$ {currentAmountValue.toFixed(2)}</span>
                </button>

                <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                  Transparência total: As doações são registradas em ata com prestação de contas mensal na sede da Associação.
                </p>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
