import React, { useState } from 'react';
import { Copy, Check, Heart, ArrowRight, Camera } from 'lucide-react';
import { CatalogItem } from '../types';
import { getTechnicalPlaceholder } from '../utils/technicalReference';

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
  onOpenImageManager,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.codigo);
    setCopied(true);
    onCopySuccess(item.codigo);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleImageManager = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenImageManager) onOpenImageManager(item);
  };

  const fallbackImg = getTechnicalPlaceholder(item);
  const displayImg = item.imagemUrl || fallbackImg;

  return (
    <div
      id={`item-card-${item.id}`}
      onClick={() => onSelect(item)}
      className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-150 cursor-pointer"
    >
      <div>
        {/* Technical Graphic / Image Container */}
        <div className="relative flex items-center justify-center w-full h-48 sm:h-52 mb-3 bg-[#f8fafc] border border-slate-200/90 rounded-sm overflow-hidden p-3 group-hover:border-slate-300 transition-colors">
          <img
            src={displayImg}
            alt={item.descricao}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = getTechnicalPlaceholder(item);
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />

          {/* Action badges top right */}
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
                <Heart
                  className={`w-3.5 h-3.5 ${
                    item.favorito ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>
            )}

            {onOpenImageManager && (
              <button
                type="button"
                onClick={handleImageManager}
                className="p-1 text-slate-300 hover:text-amber-600 hover:bg-white/80 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Alterar imagem deste componente"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reference watermark label */}
          <div className="absolute bottom-2 left-2 text-[9px] font-mono tracking-widest text-slate-400 select-none uppercase pointer-events-none">
            VISTA DE REFERÊNCIA
          </div>
        </div>

        {/* Categories Badges */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#1A3282] bg-[#eff6ff] border border-[#bfdbfe] rounded-xs uppercase font-mono">
            {item.categoria}
          </span>
          {item.subcategoria && (
            <span className="inline-block px-1.5 py-0.5 text-[9px] font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-xs">
              {item.subcategoria}
            </span>
          )}
        </div>

        {/* Code */}
        <div className="font-mono text-sm sm:text-base font-bold tracking-wide text-slate-900 group-hover:text-[#1A3282] transition-colors">
          {item.codigo}
        </div>

        {/* Description */}
        <p className="mt-1 text-xs text-slate-600 line-clamp-2 min-h-[34px] leading-relaxed uppercase font-medium">
          {item.descricao}
        </p>

        {/* Manufacturer and Dimensions */}
        {(item.fabricante || item.dimensao) && (
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            {item.fabricante && (
              <>
                <span>FABR:</span>
                <span className="font-semibold text-slate-600">{item.fabricante}</span>
              </>
            )}
            {item.dimensao && (
              <>
                <span className="text-slate-300">•</span>
                <span className="truncate">{item.dimensao}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Row */}
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

        <button
          id={`btn-view-${item.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className="flex items-center justify-center p-2 text-slate-500 bg-white hover:bg-slate-100 hover:text-slate-800 border border-slate-200 rounded-xs transition-colors"
          title="Ver detalhes do item"
          aria-label="Ver detalhes"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
