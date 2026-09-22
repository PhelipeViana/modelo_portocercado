import React, { useState } from 'react';
import { 
  PlayCircle, 
  Radio, 
  FileText, 
  Gavel, 
  Landmark, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Send,
  CheckCircle2,
  Fish
} from 'lucide-react';
import { ScreenTab } from '../types';
import { PORTO_CERCADO_INFO } from '../data/pesqueirosData';

interface FooterProps {
  onNavigateTab: (tab: ScreenTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      alert('Por favor, digite um e-mail válido.');
      return;
    }
    setNewsletterSent(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <footer className="w-full bg-[#064E3B] text-white py-12 lg:py-16 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Coluna 1: Sobre & Social */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={PORTO_CERCADO_INFO.logoWhiteUrl} 
                alt="Logo Associação Porto Cercado" 
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-sans text-base font-black text-white leading-tight block">
                  PORTO CERCADO
                </span>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                  PANTANAL VERDE
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/80 leading-relaxed mb-6">
              Associação dos Ribeirinhos do Porto Cercado - Pantanal Verde. Promovendo união, sustentabilidade e representação comunitária em Poconé - MT.
            </p>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => onNavigateTab('videos-e-tv')}
                aria-label="Canal de Vídeos" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-500/30 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/10"
              >
                <PlayCircle className="w-4 h-4 text-emerald-300" />
              </button>
              <button 
                onClick={() => onNavigateTab('videos-e-tv')}
                aria-label="Podcast e Rádio" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-500/30 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/10"
              >
                <Radio className="w-4 h-4 text-emerald-300" />
              </button>
              <button 
                onClick={() => onNavigateTab('inscricao')}
                aria-label="Ficha de Filiação" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-500/30 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/10"
              >
                <Fish className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </div>

          {/* Coluna 2: Transparência & Atos */}
          <div>
            <h4 className="text-xs font-black text-emerald-300 mb-4 tracking-wider uppercase">
              Transparência &amp; Atos
            </h4>
            <ul className="space-y-3 text-xs text-emerald-100/90">
              <li>
                <button
                  onClick={() => onNavigateTab('editais-e-atas')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-2 cursor-pointer text-left"
                >
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Editais de Convocação</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('editais-e-atas')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-2 cursor-pointer text-left"
                >
                  <Gavel className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Atas das Assembleias</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('institucional')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-2 cursor-pointer text-left"
                >
                  <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Prestação de Contas Anual</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('institucional')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-2 cursor-pointer text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Estatuto &amp; Regimento Interno</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('institucional')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-2 cursor-pointer text-left"
                >
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Diretoria da Associação</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Sede & Contato */}
          <div>
            <h4 className="text-xs font-black text-emerald-300 mb-4 tracking-wider uppercase">
              Sede &amp; Contato
            </h4>
            <ul className="space-y-3 text-xs text-emerald-100/90">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Porto Cercado, Pantanal Mato-Grossense, Poconé - MT</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://api.whatsapp.com/send/?phone=5565998059960" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  (65) 99805-9960 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contato@portocercado.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>CNPJ: 61.968.959/0001-00</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Boletim Informativo */}
          <div>
            <h4 className="text-xs font-black text-emerald-300 mb-4 tracking-wider uppercase">
              Informativo Pantanal
            </h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed mb-3">
              Receba informes sobre nível das águas, pesqueiros, meio ambiente e comunicados da Associação.
            </p>

            {newsletterSent ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>E-mail cadastrado com sucesso!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white/10 text-white placeholder:text-emerald-200/60 text-xs focus:outline-none focus:bg-white/15 border border-emerald-700 focus:border-emerald-400"
                  placeholder="Seu e-mail..."
                  type="email"
                  required
                />
                <button
                  className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  type="submit"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Receber Notícias</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 border-t border-emerald-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70">
          <p>© 2026 Associação dos Ribeirinhos do Porto Cercado - Pantanal Verde. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button 
              onClick={() => onNavigateTab('institucional')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Estatuto Social
            </button>
            <button 
              onClick={() => onNavigateTab('institucional')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Termos e Privacidade
            </button>
            <button 
              onClick={() => onNavigateTab('inscricao')} 
              className="text-emerald-300 font-bold hover:text-white transition-colors cursor-pointer"
            >
              Ficha de Filiação
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
