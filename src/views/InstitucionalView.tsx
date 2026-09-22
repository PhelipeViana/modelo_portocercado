import React from 'react';
import { Users, Scale, Target, Fish, Anchor } from 'lucide-react';
import { ScreenTab } from '../types';

interface InstitucionalViewProps {
  onNavigateTab: (tab: ScreenTab) => void;
}

export const InstitucionalView: React.FC<InstitucionalViewProps> = ({ onNavigateTab }) => {
  const boardMembers = [
    { name: 'Gerson Leite de Arruda', role: 'Presidente', desc: 'Liderança comunitária e rancheiro atuante na região de Porto Cercado há mais de 30 anos.', initials: 'GA' },
    { name: 'Sebastião Campos', role: 'Vice-Presidente', desc: 'Pescador profissional e articulador do turismo náutico sustentável no Pantanal.', initials: 'SC' },
    { name: 'Valdir dos Santos', role: 'Secretário-Geral', desc: 'Rancheiro e coordenador das iniciativas de preservação e conservação do rio Cuiabá.', initials: 'VS' },
    { name: 'Benedito da Silva', role: 'Diretor Financeiro', desc: 'Gestor comunitário dedicado à prestação de contas transparente da associação.', initials: 'BS' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-12">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-[#064E3B] dark:bg-[#03291f] text-white p-8 lg:p-14 overflow-hidden border border-emerald-700/60 dark:border-emerald-800 shadow-xl transition-colors">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Anchor className="w-4 h-4 text-emerald-400" />
            <span>Associação dos Ribeirinhos do Porto Cercado • Poconé - MT</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-5xl font-black leading-tight">
            Defesa das Tradições Pantaneiras e dos Moradores Ribeirinhos
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-4 leading-relaxed font-normal">
            Fundada com o compromisso de unir rancheiros, pescadores esportivos, guias de turismo e famílias ribeirinhas de Porto Cercado, a nossa Associação atua firmemente no desenvolvimento comunitário, na preservação dos ecossistemas do Rio Cuiabá e no diálogo com os órgãos públicos.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigateTab('inscricao')}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Filiar-se à Associação
            </button>
            <button
              onClick={() => onNavigateTab('editais-e-atas')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer"
            >
              Consultar Estatuto e Atas
            </button>
          </div>
        </div>
      </div>

      {/* Missão, Visão e Valores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-sans text-xl font-black text-slate-900 dark:text-white mb-2">Missão</h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            Representar e defender ativamente os rancheiros e ribeirinhos de Porto Cercado, garantindo melhorias na infraestrutura regional, acesso à estrada, regularização e conservação ambiental.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Fish className="w-6 h-6" />
          </div>
          <h3 className="font-sans text-xl font-black text-slate-900 dark:text-white mb-2">Visão</h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            Consolidar Porto Cercado como polo de pesca esportiva sustentável, ecoturismo de respeito ao Pantanal e convivência harmoniosa entre a comunidade ribeirinha e os visitantes.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-sans text-xl font-black text-slate-900 dark:text-white mb-2">Valores</h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            União comunitária, respeito às leis ambientais, preservação da rica fauna e flora pantaneira, transparência associativa e valorização da cultura ribeirinha mato-grossense.
          </p>
        </div>
      </div>

      {/* Diretoria Executiva */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 shadow-xs border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Users className="w-4 h-4" />
          <span>Gestão Atual</span>
        </div>
        <h2 className="font-sans text-2xl lg:text-3xl text-slate-900 dark:text-white font-black mb-8">
          Diretoria e Coordenação Comunitária
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boardMembers.map((member, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center text-center transition-colors">
              <div className="w-16 h-16 rounded-full bg-[#064E3B] text-emerald-200 flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                {member.initials}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</h4>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">{member.role}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
