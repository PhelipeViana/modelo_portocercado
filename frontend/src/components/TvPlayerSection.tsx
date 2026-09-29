import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Settings, 
  Subtitles, 
  Radio, 
  Video, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { VideoEpisode } from '../types';
import { VIDEOS_DATA } from '../data/newsData';

interface TvPlayerSectionProps {
  onOpenFullSchedule: () => void;
  onOpenVideoModal?: (video: VideoEpisode) => void;
}

export const TvPlayerSection: React.FC<TvPlayerSectionProps> = ({ 
  onOpenFullSchedule,
  onOpenVideoModal 
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoEpisode>(VIDEOS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(34);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackTime, setPlaybackTime] = useState({ current: '14:32', total: '42:10' });

  // Simulate progress when playing
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleSelectVideo = (vid: VideoEpisode) => {
    setActiveVideo(vid);
    setIsPlaying(true);
    setProgress(0);
    setPlaybackTime({ current: '00:00', total: vid.duration });
  };

  return (
    <section className="w-full bg-[#0B1120] text-white py-12 lg:py-16 my-4 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#DC2626] text-[11px] font-bold tracking-widest uppercase">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Canal Audiovisual Exclusivo</span>
            </div>
            <h2 className="font-sans text-2xl lg:text-3xl text-white font-black">
              TV Porto Cercado: Pantanal, Pesca e Comunidade
            </h2>
            <p className="text-emerald-100/70 text-sm max-w-2xl mt-1.5 leading-relaxed">
              Assista aos registros dos rios pantaneiros, coberturas de reuniões comunitárias, dicas de pesca esportiva e preservação ambiental.
            </p>
          </div>

          <button
            onClick={onOpenFullSchedule}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all w-fit cursor-pointer border border-white/10"
          >
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Ver Todos os Vídeos</span>
          </button>
        </div>

        {/* Player & Playlist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Player Principal Simulado (8 Cols) */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden bg-slate-900 relative shadow-2xl border border-slate-800">
            <div className="relative aspect-video w-full flex flex-col justify-between p-5 sm:p-7">
              
              {/* Video Backdrop Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url('${activeVideo.imageUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-black/50" />

              {/* Top Bar Player */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded bg-[#DC2626] text-white text-[11px] font-bold uppercase flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  {activeVideo.category}
                </span>

                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-mono border border-white/10">
                  <span className="text-[#DC2626] font-bold">HD</span>
                  <span>1080p 60fps</span>
                </div>
              </div>

              {/* Botão Play Central */}
              <div className="relative z-10 flex items-center justify-center my-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2563EB] hover:bg-[#0051d5] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-white/20"
                  type="button"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 sm:w-9 sm:h-9" />
                  ) : (
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 ml-1 fill-white" />
                  )}
                </button>
              </div>

              {/* Bottom Controls Bar */}
              <div className="relative z-10 w-full">
                <div className="mb-3">
                  <h3 className="font-newsreader text-lg sm:text-xl text-white font-bold line-clamp-2">
                    {activeVideo.title}
                  </h3>
                  {activeVideo.presenter && (
                    <p className="text-slate-300 text-xs mt-1">
                      {activeVideo.presenter}
                    </p>
                  )}
                </div>

                {/* Progress Bar (Interactive scrubber) */}
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newPct = (clickX / rect.width) * 100;
                    setProgress(newPct);
                  }}
                  className="w-full bg-white/25 hover:bg-white/35 h-1.5 rounded-full overflow-hidden mb-3 cursor-pointer transition-colors relative"
                >
                  <div 
                    className="bg-[#DC2626] h-full rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-white text-xs font-mono">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-red-400 transition-colors cursor-pointer"
                      title={isPlaying ? "Pausar" : "Reproduzir"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="hover:text-blue-400 transition-colors cursor-pointer"
                      title={isMuted ? "Desmutar" : "Mutar"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="text-slate-300">
                      {playbackTime.current} / {playbackTime.total}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onOpenVideoModal && onOpenVideoModal(activeVideo)}
                      className="hover:text-blue-400 transition-colors cursor-pointer" 
                      title="Legendas"
                    >
                      <Subtitles className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onOpenVideoModal && onOpenVideoModal(activeVideo)}
                      className="hover:text-blue-400 transition-colors cursor-pointer" 
                      title="Configurações de Áudio e Vídeo"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onOpenVideoModal && onOpenVideoModal(activeVideo)}
                      className="hover:text-blue-400 transition-colors cursor-pointer" 
                      title="Modo Teatro / Tela Cheia"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Lista de Episódios Relacionados (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="text-white text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 flex items-center justify-between">
              <span>Episódios Recentes da TV</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">4 disponíveis</span>
            </div>

            {VIDEOS_DATA.slice(1).map((ep) => {
              const isSelected = activeVideo.id === ep.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectVideo(ep)}
                  className={`group flex gap-3.5 p-3 rounded-xl transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-white/15 border-blue-500 shadow-md' 
                      : 'bg-white/5 hover:bg-white/10 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="relative w-28 h-18 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url('${ep.imageUrl}')` }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-mono">
                      {ep.duration}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wide truncate">
                      {ep.category}
                    </span>
                    <h4 className="text-xs text-white font-semibold line-clamp-2 group-hover:text-blue-300 transition-colors mt-0.5 leading-snug">
                      {ep.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {ep.published}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
};
