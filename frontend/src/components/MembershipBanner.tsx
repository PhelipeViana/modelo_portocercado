import React from 'react';
import { ArrowRight, Download, Fish, ShieldCheck, Waves } from 'lucide-react';
import { ScreenTab } from '../types';

interface MembershipBannerProps {
  onNavigateTab: (tab: ScreenTab) => void;
  onDownloadStatute: () => void;
}

export const MembershipBanner: React.FC<MembershipBannerProps> = ({
  onNavigateTab,
  onDownloadStatute
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
      <div className="rounded-3xl bg-[#064E3B] text-white p-8 lg:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl border border-emerald-700/50">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-widest inline-block mb-3">
            Filiação Oficial • Pantanal Verde
          </span>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[40px] font-black leading-tight mb-3">
            Faça parte da Associação dos Ribeirinhos do Porto Cercado
          </h2>

          <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed mb-6">
            Fortaleça a voz dos rancheiros, pescadores, guias e famílias ribeirinhas de Poconé na defesa do nosso território, preservação ambiental e infraestrutura local.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigateTab('inscricao')}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              <span>Preencher Ficha de Filiação</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onDownloadStatute}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-white/15"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Baixar Estatuto Social</span>
            </button>
          </div>
        </div>

        {/* Badge Numérico de Impacto */}
        <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-6 lg:p-8 flex flex-col gap-6 shrink-0 w-full sm:w-auto shadow-inner">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Fish className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="font-sans text-2xl font-black text-white leading-none">50+</div>
              <div className="text-xs text-emerald-200 mt-1">Pesqueiros & Ranchos Cadastrados</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="font-sans text-2xl font-black text-white leading-none">100%</div>
              <div className="text-xs text-emerald-200 mt-1">Comunitário & Sustentável</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Waves className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="font-sans text-2xl font-black text-white leading-none">Rio Cuiabá</div>
              <div className="text-xs text-emerald-200 mt-1">Pantanal de Poconé - MT</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
