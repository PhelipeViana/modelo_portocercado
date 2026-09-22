import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Radio, 
  Clock, 
  Share2, 
  Check, 
  FileText 
} from 'lucide-react';
import { VideoEpisode } from '../types';

interface VideoPlayerModalProps {
  video: VideoEpisode | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!video) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-[#0B1120] text-white rounded-2xl max-w-5xl w-full my-auto shadow-2xl overflow-hidden border border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#DC2626] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              TV Associação • Transmissão Oficial
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Container with direct image background */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${video.imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Central Play/Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-10 w-20 h-20 rounded-full bg-[#2563EB] hover:bg-[#0051d5] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-white/20"
          >
            {isPlaying ? <Pause className="w-9 h-9" /> : <Play className="w-9 h-9 ml-1 fill-white" />}
          </button>

          {/* Overlay Tag */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#DC2626] text-white text-[11px] font-bold uppercase shadow-sm">
              {video.category}
            </span>
            <span className="bg-black/60 px-2.5 py-1 rounded text-white text-xs font-mono">
              {video.duration}
            </span>
          </div>

          {/* Bottom Bar inside Video */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-red-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-blue-400 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <span className="font-mono text-slate-300">03:45 / {video.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-white hover:bg-white/20"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>Compartilhar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Description & Transcripts */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="font-newsreader text-2xl font-bold text-white">
              {video.title}
            </h2>
            {video.presenter && (
              <p className="text-sm text-blue-300 font-semibold mt-1">
                {video.presenter}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {video.description || "Episódio gravado e transmitido pela TV Associação, com comentários e análises técnicas em prol dos associados."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
            <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-1">Destaques da Pauta:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li>Contextualização das recentes votações em plenário.</li>
                <li>Impactos operacionais e tributários diretos para o profissional associado.</li>
                <li>Perguntas enviadas pela comunidade durante a transmissão ao vivo.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
