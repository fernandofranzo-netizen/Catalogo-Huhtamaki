import React, { useState, useMemo } from 'react';
import { Search, Plus, Star, X, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, FileText, Lock, ShieldCheck } from 'lucide-react';
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
  onOpenNewModal,
  onToggleFavorite,
  onCopySuccess,
  onOpenDocuments,
  userRole,
  onPromptGestor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'codigo-asc' | 'codigo-desc' | 'descricao' | 'recentes'>('codigo-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort items
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

        // Favorites filter
        if (onlyFavorites && !item.favorito) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'codigo-asc') return a.codigo.localeCompare(b.codigo);
        if (sortBy === 'codigo-desc') return b.codigo.localeCompare(a.codigo);
        if (sortBy === 'descricao') return a.descricao.localeCompare(b.descricao);
        if (sortBy === 'recentes') return (b.dataCriacao || '').localeCompare(a.dataCriacao || '');
        return 0;
      });
  }, [items, searchTerm, selectedCategory, onlyFavorites, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('TODOS');
    setOnlyFavorites(false);
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'TODOS' || onlyFavorites;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-cyan-700 uppercase font-mono mb-1">
            BUSCA OPERACIONAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
            LOCALIZAR ITEM
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Encontre o código certo antes de abrir o painel. Pesquise por código, descrição ou palavra-chave.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'gestor' ? (
            <button
              id="btn-novo-item-top"
              type="button"
              onClick={onOpenNewModal}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold tracking-wider text-slate-950 uppercase bg-[#f59e0b] hover:bg-[#d97706] rounded-md shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ NOVO ITEM</span>
            </button>
          ) : (
            <button
              id="btn-entrar-gestor-top"
              type="button"
              onClick={onPromptGestor}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-300 rounded-md shadow-xs transition-colors"
              title="Acesso restrito ao gestor para cadastrar ou editar itens"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Acesso Gestor</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Search & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-search-catalog"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Código, descrição ou palavra-chave..."
              className="w-full pl-9.5 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 font-sans"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-4">
            <select
              id="select-category-catalog"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 text-slate-700 font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'TODOS' ? 'Todas as categorias' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Favorites Toggle */}
          <div className="md:col-span-2 flex items-center gap-2">
            <button
              id="btn-filter-favorites"
              type="button"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold rounded-md border transition-colors ${
                onlyFavorites
                  ? 'bg-amber-500 text-slate-950 border-amber-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-slate-950' : 'text-amber-500'}`} />
              <span>Favoritos</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Chips */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`btn-cat-chip-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-md tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2 font-mono">
          <span className="font-bold text-slate-800 text-sm">{filteredItems.length}</span>
          <span>itens encontrados</span>
          {hasActiveFilters && (
            <button
              id="btn-clear-filters"
              type="button"
              onClick={clearFilters}
              className="ml-2 text-xs font-medium text-cyan-700 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Limpar filtros
            </button>
          )}
        </div>

        {/* Ordering & Grid/List view controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="select-sort-catalog"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="codigo-asc">Código (A-Z)</option>
              <option value="codigo-desc">Código (Z-A)</option>
              <option value="descricao">Descrição (A-Z)</option>
              <option value="recentes">Mais recentes</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-md p-0.5">
            <button
              id="btn-view-grid"
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="btn-view-list"
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Display */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-lg text-center">
          <div className="flex items-center justify-center w-12 h-12 mb-3 bg-slate-100 rounded-full text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Nenhum item encontrado</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Nenhum registro corresponde aos critérios pesquisados. Tente ajustar o termo de busca ou limpar os filtros.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-md hover:bg-cyan-100 transition-colors"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      ) : (
        /* List Mode */
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden shadow-xs">
          {filteredItems.map((item) => {
            const docCount = item.documentos ? item.documentos.length : 0;
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className="text-slate-300 hover:text-amber-500"
                  >
                    <Star className={`w-4 h-4 ${item.favorito ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {item.codigo}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold text-cyan-700 bg-cyan-50 rounded uppercase font-mono">
                        {item.categoria}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5">{item.descricao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Document button in list view */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDocuments?.(item);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded border transition-colors ${
                      docCount > 0
                        ? 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title={docCount > 0 ? `${docCount} documento(s) / data-sheet` : 'Incluir data-sheet'}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Data-sheet</span>
                    {docCount > 0 && (
                      <span className="px-1 py-0.2 text-[10px] font-mono font-bold bg-cyan-200 text-cyan-900 rounded">
                        {docCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(item.codigo);
                      onCopySuccess(item.codigo);
                    }}
                    className="px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded font-mono"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
