import React, { useState } from 'react';
import { X, FileText, Download, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';
import { OfficialDocument } from '../types';

interface DocumentModalProps {
  document: OfficialDocument | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!document) return null;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
              {document.code}
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {document.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-newsreader text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {document.title}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Publicado em {document.date}</span>
                <span>•</span>
                <span>Tamanho: {document.size}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Ementa do Documento:</p>
            <p>{document.summary}</p>
          </div>

          <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span>Classificação Arquivística:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{document.type}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span>Autenticidade:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">ICP-Brasil SHA-256 Verificado</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span>Acesso:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Público / Irrestrito aos Associados</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Fechar
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            {downloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Arquivo Baixado</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Baixar Documento</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
