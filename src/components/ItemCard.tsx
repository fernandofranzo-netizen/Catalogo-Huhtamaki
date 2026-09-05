import React, { useState } from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { CatalogItem } from '../types';
import { TechnicalPlaceholder } from './TechnicalPlaceholder';

interface ItemCardProps {
  item: CatalogItem;
  onSelect: (item: CatalogItem) => void;
  onToggleFavorite: (id: string) => void;
  onCopySuccess: (code: string) => void;
  onOpenDocuments?: (item: CatalogItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onSelect,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.codigo);
    setCopied(true);
    onCopySuccess(item.codigo);
    setTimeout(() => setCopied(false), 1800);
  };

  // Determine placeholder type
  const isSensor =
    item.categoria.includes('SENSOR') ||
    item.codigo.includes('PNEUM') ||
    item.palavrasChave?.includes('sensor');

  return (
    <div
      id={`item-card-${item.id}`}
      onClick={() => onSelect(item)}
      className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-md p-3 sm:p-3.5 hover:shadow-sm hover:border-slate-300 transition-all duration-150 cursor-pointer"
    >
      <div>
        {/* Image / Technical Graphic Area */}
        <div className="relative flex items-center justify-center w-full h-44 mb-3 bg-[#f8fafc] border border-slate-200/80 rounded-xs overflow-hidden">
          {item.imagemUrl ? (
            <>
              {/* Subtle technical corner ticks */}
              <span className="absolute top-1 left-1.5 text-[9px] font-mono text-slate-300 pointer-events-none select-none">
                ┌
              </span>
              <span className="absolute top-1 right-1.5 text-[9px] font-mono text-slate-300 pointer-events-none select-none">
                ┐
              </span>
              <span className="absolute bottom-1 left-1.5 text-[9px] font-mono text-slate-300 pointer-events-none select-none">
                └
              </span>
              <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-slate-300 pointer-events-none select-none">
                ┘
              </span>

              <img
                src={item.imagemUrl}
                alt={item.descricao}
                referrerPolicy="no-referrer"
                className="object-contain w-full h-full p-2 transition-transform duration-200 group-hover:scale-102"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Vista de referência label */}
              <span className="absolute bottom-1.5 left-2 text-[8px] font-mono tracking-widest text-slate-400 uppercase select-none">
                VISTA DE REFERÊNCIA
              </span>
            </>
          ) : (
            <TechnicalPlaceholder
              type={isSensor ? 'sensor' : 'componente'}
              label={isSensor ? 'SENSOR' : 'COMPONENTE'}
              showUnregisteredText={true}
            />
          )}
        </div>

        {/* Category Pill */}
        <div className="mb-1">
          <span className="inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider text-cyan-700 bg-cyan-50/60 border border-cyan-300/70 rounded-xs uppercase font-mono">
            {item.categoria}
          </span>
        </div>

        {/* Item Code */}
        <div className="font-mono text-sm sm:text-[15px] font-bold tracking-tight text-slate-900 group-hover:text-cyan-800 transition-colors">
          {item.codigo}
        </div>

        {/* Item Description */}
        <p className="mt-1 text-xs text-slate-600 uppercase font-medium leading-snug line-clamp-2 min-h-[32px]">
          {item.descricao}
        </p>
      </div>

      {/* Card Action Row matching screenshot */}
      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
        <button
          id={`btn-copy-${item.id}`}
          type="button"
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold tracking-wider uppercase rounded-xs border transition-all font-mono ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-amber-50/40 hover:bg-amber-100/70 text-amber-800 border-amber-400/90'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-700" />
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
