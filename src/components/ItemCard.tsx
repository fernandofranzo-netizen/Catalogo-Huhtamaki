import React, { useState } from 'react';
import { Copy, Check, ArrowRight, FileText, Camera } from 'lucide-react';
import { CatalogItem } from '../types';
import { TechnicalPlaceholder } from './TechnicalPlaceholder';

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

  return (
    <div
      id={`item-card-${item.id}`}
      onClick={() => onSelect(item)}
      className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-150 cursor-pointer"
    >
      <div>
        {/* Top bar: Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200/70 rounded uppercase font-mono">
            {item.categoria}
          </span>
        </div>

        {/* Image / Blueprint Graphic */}
        <div className="relative flex items-center justify-center w-full h-44 mb-3.5 bg-slate-50 bg-card-grid border border-slate-200/80 rounded-sm overflow-hidden p-3 group-hover:border-slate-300 transition-colors">
          {item.imagemUrl ? (
            <img
              src={item.imagemUrl}
              alt={item.descricao}
              referrerPolicy="no-referrer"
              className="object-contain w-full h-full transition-transform duration-200 group-hover:scale-105 mix-blend-multiply"
              loading="lazy"
              onError={(e) => {
                // If external image fails to load, gracefully hide it and let container show placeholder
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <TechnicalPlaceholder size="md" className="w-full h-full border-0 bg-transparent" />
          )}

          {/* Camera / Edit Image Quick Button */}
          {onOpenImageManager && (
            <button
              type="button"
              onClick={handleManageImage}
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-amber-600 border border-slate-200 rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
              title="Incluir ou alterar imagem deste componente"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-mono tracking-widest text-slate-400 uppercase pointer-events-none">
            VISTA DE REFERÊNCIA
          </div>
        </div>

        {/* Item Code (Prominent Monospace) */}
        <div className="font-mono text-sm font-bold tracking-wide text-slate-900 group-hover:text-blue-700 transition-colors">
          {item.codigo}
        </div>

        {/* Item Description */}
        <p className="mt-1 text-xs text-slate-600 line-clamp-2 min-h-[32px] leading-relaxed">
          {item.descricao}
        </p>

        {/* Optional Metadata snippet */}
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

      {/* Footer Actions */}
      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
        <button
          id={`btn-copy-${item.id}`}
          type="button"
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold tracking-wider uppercase rounded border transition-all ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-amber-50/70 hover:bg-amber-100/90 text-amber-900 border-amber-300/80 hover:border-amber-400'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-700" />
              <span className="truncate">Copiar Código</span>
            </>
          )}
        </button>

        {/* Botão de Documentação Técnica / Data-sheet */}
        <button
          id={`btn-doc-${item.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDocuments?.(item);
          }}
          className={`flex items-center justify-center gap-1 p-2 text-xs font-bold rounded border transition-colors ${
            docCount > 0
              ? 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
          }`}
          title={docCount > 0 ? `${docCount} documento(s) técnico(s) / data-sheet anexado(s)` : 'Anexar ou ver documentação técnica (Data-sheet)'}
          aria-label="Documentação técnica"
        >
          <FileText className="w-4 h-4" />
          {docCount > 0 && <span className="text-[10px] font-mono font-black text-cyan-700">{docCount}</span>}
        </button>

        <button
          id={`btn-view-${item.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className="flex items-center justify-center p-2 text-slate-500 bg-slate-50 hover:bg-slate-200/80 hover:text-slate-800 border border-slate-200 rounded transition-colors"
          title="Ver detalhes do item"
          aria-label="Ver detalhes"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
