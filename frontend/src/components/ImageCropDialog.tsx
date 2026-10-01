import React, { useEffect, useRef, useState } from 'react';

interface ImageCropDialogProps {
  file: File;
  onCancel: () => void;
  onComplete: (image: Blob) => void;
}

export const ImageCropDialog: React.FC<ImageCropDialogProps> = ({ file, onCancel, onComplete }) => {
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [sourceUrl, setSourceUrl] = useState('');
  const [isImageReady, setIsImageReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    setIsImageReady(false);
    setLoadError('');
    setSourceUrl('');
    reader.onload = () => setSourceUrl(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => setLoadError('Não foi possível ler este arquivo de imagem.');
    reader.readAsDataURL(file);
    return () => reader.abort();
  }, [file]);

  const crop = () => {
    const image = imageRef.current;
    if (!image || !isImageReady || !image.naturalWidth || !image.naturalHeight) return;
    const width = 1280;
    const height = 720;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;

    const baseScale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const scale = baseScale * zoom;
    const drawnWidth = image.naturalWidth * scale;
    const drawnHeight = image.naturalHeight * scale;
    const overflowX = Math.max(0, drawnWidth - width);
    const overflowY = Math.max(0, drawnHeight - height);
    const x = (width - drawnWidth) / 2 + (positionX / 100) * (overflowX / 2);
    const y = (height - drawnHeight) / 2 + (positionY / 100) * (overflowY / 2);
    context.drawImage(image, x, y, drawnWidth, drawnHeight);
    canvas.toBlob((blob) => { if (blob) onComplete(blob); }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="crop-image-title">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:p-6">
        <h3 id="crop-image-title" className="text-lg font-black">Recortar imagem de capa</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A capa será salva em 1280 × 720 pixels, no formato 16:9.</p>
        <div className="relative mt-5 aspect-video overflow-hidden rounded-xl bg-slate-950">
          {sourceUrl && <img ref={imageRef} src={sourceUrl} alt="Imagem para recorte" onLoad={() => setIsImageReady(true)} onError={() => setLoadError('Não foi possível carregar esta imagem para recorte.')} className="absolute h-full w-full object-cover" style={{ transform: `scale(${zoom}) translate(${positionX / zoom}%, ${positionY / zoom}%)` }} />}
          {!isImageReady && !loadError && <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-white/80">Carregando imagem…</span>}
          {loadError && <span className="absolute inset-0 grid place-items-center px-6 text-center text-sm font-semibold text-rose-200">{loadError}</span>}
          <div className="pointer-events-none absolute inset-0 border-2 border-white/80" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="text-xs font-bold">Zoom<input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full" /></label>
          <label className="text-xs font-bold">Posição horizontal<input type="range" min="-100" max="100" value={positionX} onChange={(event) => setPositionX(Number(event.target.value))} className="mt-2 w-full" /></label>
          <label className="text-xs font-bold">Posição vertical<input type="range" min="-100" max="100" value={positionY} onChange={(event) => setPositionY(Number(event.target.value))} className="mt-2 w-full" /></label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="min-h-11 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
          <button type="button" onClick={crop} disabled={!isImageReady} className="min-h-11 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50">Usar imagem recortada</button>
        </div>
      </div>
    </div>
  );
};
