import React, { useState, useMemo } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { CatalogItem, UserRole } from '../types';
import { ItemCard } from './ItemCard';

interface CatalogSearchProps {
  items: CatalogItem[];
  categories: readonly string[];
  onSelectItem: (item: CatalogItem) => void;
  onOpenNewModal: () => void;
  onToggleFavorite: (id: string) => void;
  onCopySuccess: (code: string) => void;
  onOpenDocuments?: (item: CatalogItem) => void;
  userRole: UserRole;
  onPromptGestor?: () => void;
}

export const CatalogSearch: React.FC<CatalogSearchProps> = ({
  items,
  categories,
  onSelectItem,
  onToggleFavorite,
  onCopySuccess,
  onOpenDocuments,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [sortBy, setSortBy] = useState<'relevancia' | 'codigo-asc' | 'descricao'>('relevancia');

  // Filter items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search term matching
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchCode = item.codigo.toLowerCase().includes(term);
          const matchDesc = item.descricao.toLowerCase().includes(term);
          const matchFabr = item.fabricante?.toLowerCase().includes(term);
          const matchDim = item.dimensao?.toLowerCase().includes(term);
          const matchLoc = item.localizacao?.toLowerCase().includes(term);
          const matchTags = item.palavrasChave?.some((tag) => tag.toLowerCase().includes(term));
          if (!matchCode && !matchDesc && !matchFabr && !matchDim && !matchLoc && !matchTags) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'TODOS' && item.categoria !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'codigo-asc') return a.codigo.localeCompare(b.codigo);
        if (sortBy === 'descricao') return a.descricao.localeCompare(b.descricao);
        return 0; // default order
      });
  }, [items, searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('TODOS');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'TODOS';

  return (
    <div className="space-y-4">
      {/* Top Header matching reference image */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          {/* Eyebrow: ■ BUSCA OPERACIONAL */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 bg-cyan-600 inline-block"></span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-cyan-700 uppercase font-mono">
              BUSCA OPERACIONAL
            </span>
          </div>

          {/* Heading: LOCALIZAR ITEM */}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase font-sans">
            LOCALIZAR ITEM
          </h1>

          {/* Description */}
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Encontre o código certo antes de abrir o painel. Pesquise por código, descrição ou palavra-chave.
          </p>
        </div>

        {/* Top Right Badges */}
        <div className="self-start sm:self-auto shrink-0">
          <div
            id="badge-total-items"
            className="px-2.5 py-1 text-[10.5px] font-mono font-bold text-slate-600 bg-white border border-slate-200 rounded-xs shadow-2xs select-none"
          >
            {items.length} ITENS
          </div>
        </div>
      </div>

      {/* Main Search & Category Controls Box */}
      <div className="bg-white border border-slate-200 rounded-md p-3 sm:p-4 shadow-2xs space-y-3">
        {/* Top Input Row: Search bar + Category Select */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* Search Input */}
          <div className="relative md:col-span-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-search-catalog"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Código, descrição ou palavra-chave..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xs focus:outline-hidden focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 font-sans"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative md:col-span-4">
            <select
              id="select-category-catalog"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none py-2 px-3 pr-8 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xs focus:outline-hidden focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 text-slate-700 font-medium cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'TODOS' ? 'Todas as categorias' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Categories Chips Layout matching screenshot */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`btn-cat-chip-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 text-[9.5px] font-bold uppercase rounded-xs tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#0e7490] hover:bg-[#0c667e] text-white border border-[#0e7490] shadow-2xs'
                      : 'bg-white hover:bg-slate-50 text-cyan-900/80 hover:text-cyan-950 border border-cyan-700/30'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header Line matching screenshot */}
      <div className="flex items-center justify-between pt-1 px-0.5">
        <div>
          <div className="text-[9.5px] font-bold tracking-widest text-cyan-700 uppercase font-mono">
            RESULTADO DA CONSULTA
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 font-mono">
            <span>{filteredItems.length} itens encontrados</span>
            {hasActiveFilters && (
              <button
                id="btn-clear-filters"
                type="button"
                onClick={clearFilters}
                className="text-[11px] font-normal text-cyan-700 hover:underline flex items-center gap-0.5"
              >
                <X className="w-3 h-3" /> Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Sort indicator matching screenshot: ORDENADO POR: RELEVÂNCIA */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          <span>ORDENADO POR:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-slate-600 font-bold uppercase cursor-pointer focus:outline-hidden hover:text-slate-900"
          >
            <option value="relevancia">RELEVÂNCIA</option>
            <option value="codigo-asc">CÓDIGO (A-Z)</option>
            <option value="descricao">DESCRIÇÃO</option>
          </select>
        </div>
      </div>

      {/* Grid of Cards (3 Columns) */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-md text-center">
          <div className="flex items-center justify-center w-12 h-12 mb-3 bg-slate-100 rounded-full text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 uppercase">Nenhum item encontrado</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Nenhum registro corresponde aos critérios pesquisados. Tente ajustar o termo de busca ou limpar os filtros.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 px-3.5 py-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-xs hover:bg-cyan-100 transition-colors uppercase font-mono"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onToggleFavorite={onToggleFavorite}
              onCopySuccess={onCopySuccess}
              onOpenDocuments={onOpenDocuments}
            />
          ))}
        </div>
      )}
    </div>
  );
};
