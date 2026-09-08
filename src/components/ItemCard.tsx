import React, { useState } from 'react';
import { Copy, Check, ArrowRight, FileText, Camera, Heart } from 'lucide-react';
import { CatalogItem } from '../types';
import { resolveItemImage } from '../utils/technicalImages';

interface ItemCardProps {
  item: CatalogItem;
  onSelect: (item: CatalogItem) => void;
  onToggleFavorite?: (id: string) => void;
  onCopySuccess: (code: string) => void;
  onOpenDocuments?: (item: CatalogItem) => void;
  onOpenImageManager?: (item: CatalogItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onSelect,
  onToggleFavorite,
  onCopySuccess,
  onOpenDocuments,
  onOpenImageManager,
}) => {
  const [copied, setCopied] = useState(false);
  const docCount = item.documentos ? item.documentos.length : 0;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.codigo);
    setCopied(true);
    onCopySuccess(item.codigo);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleManageImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenImageManager?.(item);
  };

  const imageUrl = resolveItemImage(item);

  return (
    <div
      id={`item-card-${item.id}`}
      onClick={() => onSelect(item)}
      className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-150 cursor-pointer"
    >
      <div>
        {/* Top: Image / Blueprint Graphic Box */}
        <div className="relative flex items-center justify-center w-full h-48 sm:h-52 mb-3 bg-[#f8fafc] bg-card-grid border border-slate-200/90 rounded-sm overflow-hidden p-3 group-hover:border-slate-300 transition-colors">
          <img
            src={item.imagemUrl || imageUrl}
            alt={item.descricao}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const fallback = resolveItemImage(item);
              const target = e.target as HTMLImageElement;
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />

          {/* Top-right quick actions (Copy and Favorite) matching reference image */}
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-slate-300 hover:text-slate-600 hover:bg-white/80 rounded transition-colors"
              title="Copiar código"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                className="p-1 text-slate-300 hover:text-rose-500 hover:bg-white/80 rounded transition-colors"
                title={item.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`w-3.5 h-3.5 ${item.favorito ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            )}
            {onOpenImageManager && (
              <button
                type="button"
                onClick={handleManageImage}
                className="p-1 text-slate-300 hover:text-amber-600 hover:bg-white/80 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Alterar imagem deste componente"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bottom-left watermark matching reference image */}
          <div className="absolute bottom-2 left-2 text-[9px] font-mono tracking-widest text-slate-400 select-none uppercase pointer-events-none">
            VISTA DE REFERÊNCIA
          </div>
        </div>

        {/* Category Badge placed below the image box */}
        <div className="mb-2">
          <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#0e7490] bg-[#f0fdfa] border border-[#a5f3fc] rounded-xs uppercase font-mono">
            {item.categoria}
          </span>
        </div>

        {/* Item Code (Prominent Monospace) */}
        <div className="font-mono text-sm sm:text-base font-bold tracking-wide text-slate-900 group-hover:text-[#0e7490] transition-colors">
          {item.codigo}
        </div>

        {/* Item Description */}
        <p className="mt-1 text-xs text-slate-600 line-clamp-2 min-h-[34px] leading-relaxed">
          {item.descricao}
        </p>

        {/* Optional Dimensions / Fabricante */}
        {item.fabricante && (
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <span>FABR:</span>
            <span className="font-semibold text-slate-600">{item.fabricante}</span>
            {item.dimensao && (
              <>
                <span className="text-slate-300">•</span>
                <span className="truncate">{item.dimensao}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions matching reference image */}
      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
        <button
          id={`btn-copy-${item.id}`}
          type="button"
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold tracking-wider uppercase font-mono rounded-xs border transition-all ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] border-[#fde047]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#b45309]" />
              <span className="truncate">Copiar Código</span>
            </>
          )}
        </button>

        {/* Technical Documents (if available) */}
        {docCount > 0 && onOpenDocuments && (
          <button
            id={`btn-doc-${item.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDocuments(item);
            }}
            className="flex items-center justify-center gap-1 p-2 text-xs font-bold rounded-xs border transition-colors bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100"
            title={`${docCount} documento(s) técnico(s) / data-sheet anexado(s)`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-mono font-black">{docCount}</span>
          </button>
        )}

        <button
          id={`btn-view-${item.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className="flex items-center justify-center p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xs transition-colors"
          title="Ver detalhes técnicos do item"
          aria-label="Ver detalhes"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
