import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, CheckCircle, Ticket, CalendarPlus } from 'lucide-react';
import { CALENDAR_EVENTS } from '../data/newsData';

export const AgendaView: React.FC = () => {
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const handleRegister = (id: string) => {
    if (!registeredIds.includes(id)) {
      setRegisteredIds([...registeredIds, id]);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Cronograma e Encontros</span>
        </div>
        <h1 className="font-sans text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
          Agenda Comunitária de Porto Cercado
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl mt-2 leading-relaxed">
          Acompanhe os mutirões ambientais, assembleias dos ribeirinhos, reuniões com autoridades municipais de Poconé e torneios ecológicos de pesca.
        </p>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CALENDAR_EVENTS.map((event) => {
          const isRegistered = registeredIds.includes(event.id);
          return (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex flex-col items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800 shadow-2xs">
                    <span className="font-sans text-2xl text-emerald-800 dark:text-emerald-300 font-black leading-none">
                      {event.day}
                    </span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 uppercase font-bold mt-1">
                      {event.month}
                    </span>
                  </div>

                  <div>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 inline-block mb-1.5">
                      {event.category}
                    </span>
                    <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {event.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-transparent dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><b>Horário:</b> {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><b>Local:</b> {event.location} ({event.modality})</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleRegister(event.id)}
                  disabled={isRegistered}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    isRegistered
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Confirmado</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Confirmar Presença</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => alert(`Lembrete adicionado para o evento: "${event.title}"`)}
                  className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  title="Adicionar à agenda pessoal"
                >
                  <CalendarPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
