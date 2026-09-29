import React, { useState } from 'react';
import { FileCheck2, FileText, Download, Search, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { OFFICIAL_DOCUMENTS } from '../data/newsData';
import { OfficialDocument } from '../types';

interface EditaisViewProps {
  onOpenDocumentModal: (doc: OfficialDocument) => void;
}

export const EditaisView: React.FC<EditaisViewProps> = ({ onOpenDocumentModal }) => {
  const [activeType, setActiveType] = useState('Todos');
  const [search, setSearch] = useState('');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const types = ['Todos', 'Edital', 'Ata', 'Balanço', 'Regulamento', 'Resolução'];

  const filteredDocs = OFFICIAL_DOCUMENTS.filter((doc) => {
    const matchesType = activeType === 'Todos' || doc.type === activeType;
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
                          doc.code.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownload = (doc: OfficialDocument) => {
    setDownloadedId(doc.id);
    setTimeout(() => setDownloadedId(null), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <FileCheck2 className="w-4 h-4" />
          <span>Transparência Pública e Governança</span>
        </div>
        <h1 className="font-newsreader text-3xl lg:text-4xl font-bold text-[#0B1C30] dark:text-white">
          Repositório de Editais, Atas &amp; Resoluções Oficiais
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl mt-2 leading-relaxed">
          Documentos originais assinados digitalmente com certificação ICP-Brasil, garantindo conformidade estatutária e pleno acesso a todos os associados.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeType === t
                  ? 'bg-emerald-600 dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por código ou assunto..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {doc.code}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {doc.status}
                  </span>
                </div>

                <h3 
                  onClick={() => onOpenDocumentModal(doc)}
                  className="font-newsreader text-base sm:text-lg font-bold text-[#0B1C30] dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
                >
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {doc.summary}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Publicado em {doc.date}
                  </span>
                  <span>•</span>
                  <span>PDF Document ({doc.size})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <button
                onClick={() => onOpenDocumentModal(doc)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Visualizar Detalhes
              </button>

              <button
                onClick={() => handleDownload(doc)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {downloadedId === doc.id ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span>Baixado!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
