import React, { useState } from 'react';
import { 
  BadgeCheck, 
  FileText, 
  Download, 
  Vote, 
  CheckCircle, 
  FileCheck2, 
  ExternalLink 
} from 'lucide-react';
import { OFFICIAL_DOCUMENTS } from '../data/newsData';
import { ScreenTab } from '../types';

interface SidebarWidgetsProps {
  onNavigateTab: (tab: ScreenTab) => void;
  onOpenDocumentModal: (doc: any) => void;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  onNavigateTab,
  onOpenDocumentModal
}) => {
  // Enquete state
  const [pollOption, setPollOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [pollResults, setPollResults] = useState<{ [key: string]: number }>({
    ia: 48,
    tributos: 32,
    saude: 20
  });

  const handleVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollOption) {
      return;
    }
    setPollResults(prev => ({
      ...prev,
      [pollOption]: prev[pollOption] + 1
    }));
    setHasVoted(true);
  };

  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <aside className="space-y-6">
      
      {/* WIDGET 1: FILIAÇÃO & BENEFÍCIOS */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-600/20 blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-3">
          <BadgeCheck className="w-5 h-5 text-emerald-300" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
            Junte-se à Associação
          </span>
        </div>

        <h3 className="font-sans text-lg font-bold leading-snug mb-2">
          Filie-se à Associação de Porto Cercado
        </h3>
        
        <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
          Defesa dos direitos dos pescadores, assistência náutica comunitária, representatividade perante os órgãos ambientais e apoio às famílias ribeirinhas.
        </p>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => onNavigateTab('inscricao')}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs uppercase tracking-wider transition-all shadow-md text-center cursor-pointer"
          >
            Ficha de Filiação Online
          </button>
          <a
            href="https://api.whatsapp.com/send?phone=5565998059960&text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%20Associa%C3%A7%C3%A3o%20de%20Porto%20Cercado"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <ExternalLink className="w-4 h-4 text-emerald-300" />
            <span>Dúvidas pelo WhatsApp</span>
          </a>
        </div>
      </div>

      {/* WIDGET 2: EDITAIS E COMUNICADOS OFICIAIS (DOWNLOADS) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Editais &amp; Atas Oficiais
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('editais-e-atas')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline cursor-pointer"
            title="Acessar repositório completo"
          >
            Repositório
          </button>
        </div>

        <div className="space-y-3">
          {OFFICIAL_DOCUMENTS.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocumentModal(doc)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-all group cursor-pointer border border-slate-100 dark:border-slate-700/60 hover:border-emerald-200 dark:hover:border-emerald-700"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                    {doc.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {doc.status} • PDF ({doc.size})
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* WIDGET 3: ENQUETE INSTITUCIONAL DO MÊS */}
      <div className="bg-emerald-50/70 dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-emerald-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide">
          <Vote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Participação Coletiva</span>
        </div>

        <h3 className="font-sans text-base font-black text-slate-900 dark:text-white mb-2 leading-snug">
          Enquete: Qual ação é mais urgente para a comunidade de Porto Cercado?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Sua opinião orienta os projetos e as solicitações da Associação junto aos órgãos competentes.
        </p>

        {!hasVoted ? (
          <form onSubmit={handleVote} className="space-y-2.5">
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-slate-750 cursor-pointer transition-colors border border-emerald-100 dark:border-slate-700">
              <input
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
                name="poll_option"
                type="radio"
                value="ia"
                checked={pollOption === 'ia'}
                onChange={() => setPollOption('ia')}
              />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Conservação e cascalhamento da estrada de acesso
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-slate-750 cursor-pointer transition-colors border border-emerald-100 dark:border-slate-700">
              <input
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
                name="poll_option"
                type="radio"
                value="tributos"
                checked={pollOption === 'tributos'}
                onChange={() => setPollOption('tributos')}
              />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Preservação ambiental e saneamento das margens
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-slate-750 cursor-pointer transition-colors border border-emerald-100 dark:border-slate-700">
              <input
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
                name="poll_option"
                type="radio"
                value="saude"
                checked={pollOption === 'saude'}
                onChange={() => setPollOption('saude')}
              />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Fortalecimento do turismo de pesca esportiva e guias
              </span>
            </label>

            <button
              className="w-full mt-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
              type="submit"
            >
              Votar na Enquete
            </button>
          </form>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle className="w-4 h-4" />
              <span>Voto registrado! Parcial dos associados:</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Estrada de Acesso</span>
                  <span className="font-bold">{Math.round((pollResults.ia / totalVotes) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                    style={{ width: `${(pollResults.ia / totalVotes) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Preservação Ambiental</span>
                  <span className="font-bold">{Math.round((pollResults.tributos / totalVotes) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                    style={{ width: `${(pollResults.tributos / totalVotes) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Turismo &amp; Guias de Pesca</span>
                  <span className="font-bold">{Math.round((pollResults.saude / totalVotes) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${(pollResults.saude / totalVotes) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-2">
              Total de votos computados: {totalVotes}
            </p>
          </div>
        )}
      </div>

      {/* WIDGET 4: PLANTÃO & CANAL DIRETO */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <span>Associação de Porto Cercado</span>
        </div>
        <p>Sede Comunitária: Margens do Rio Cuiabá, Porto Cercado, Poconé/MT</p>
        <p>Atendimento comunitário e apoio aos ribeirinhos de segunda a sábado.</p>
      </div>

    </aside>
  );
};
