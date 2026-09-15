import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, X, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, FileText, Lock, ShieldCheck, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { CatalogItem, UserRole } from '../types';
import { ItemCard } from './ItemCard';
import { resolveItemImage } from '../utils/technicalImages';
import {
  CONSUMO_GERAL_CATEGORIAS,
  CONSUMO_MANUTENCAO_CATEGORIAS,
} from '../data/initialCatalog';

interface CatalogSearchProps {
  items: CatalogItem[];
  categories: readonly string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onSelectItem: (item: CatalogItem) => void;
  onOpenNewModal: () => void;
  onToggleFavorite?: (id: string) => void;
  onCopySuccess: (code: string) => void;
  onOpenDocuments?: (item: CatalogItem) => void;
  userRole: UserRole;
  onPromptGestor?: () => void;
  onLogoutGestor?: () => void;
  onOpenImageManager?: (item: CatalogItem) => void;
}

export const CatalogSearch: React.FC<CatalogSearchProps> = ({
  items,
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectItem,
  onOpenNewModal,
  onToggleFavorite,
  onCopySuccess,
  onOpenDocuments,
  userRole,
  onPromptGestor,
  onLogoutGestor,
  onOpenImageManager,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [internalCategory, setInternalCategory] = useState('TODOS');
  const activeCategory = selectedCategory !== undefined ? selectedCategory : internalCategory;

  const setActiveCategory = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const [sortBy, setSortBy] = useState<'codigo-asc' | 'codigo-desc' | 'descricao' | 'recentes'>('codigo-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, sortBy]);

  // Compute category counts
  const { countsByCategory, consumoGeralTotal, consumoManutencaoTotal } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      let cat = item.categoria === 'MATERIAL DIVERSO' ? 'MATERIAIS DIVERSOS' : item.categoria;
      if (cat === 'MATERIAIS DE USO/CONSUMO') cat = 'MATERIAL DE USO/CONSUMO';
      if (cat === 'UTILITES-GÁS' || cat === 'UTILITIES-GÁS' || cat === 'UTILITIES GÁS' || cat === 'UTILITIES GAS') {
        cat = 'UTILITIES-GAS';
      }
      counts[cat] = (counts[cat] || 0) + 1;
    }
    const cGeral = CONSUMO_GERAL_CATEGORIAS.reduce((acc, cat) => acc + (counts[cat] || 0), 0);
    const cManut = CONSUMO_MANUTENCAO_CATEGORIAS.reduce((acc, cat) => acc + (counts[cat] || 0), 0);
    return {
      countsByCategory: counts,
      consumoGeralTotal: cGeral,
      consumoManutencaoTotal: cManut,
    };
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search term matching
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim();

          // Strict precision for key requested keywords
          if (term === 'fita' || term === 'fitas') {
            if (!item.palavrasChave?.includes('fita')) return false;
          } else if (term === 'adaptador' || term === 'adaptadores') {
            if (!item.palavrasChave?.includes('adaptador')) return false;
          } else {
            const matchCode = item.codigo.toLowerCase().includes(term);
            const matchDesc = item.descricao.toLowerCase().includes(term);
            const matchFabr = item.fabricante?.toLowerCase().includes(term);
            const matchDim = item.dimensao?.toLowerCase().includes(term);
            const matchLoc = item.localizacao?.toLowerCase().includes(term);
            const matchSubcat = item.subcategoria?.toLowerCase().includes(term);
            const matchCat = item.categoria?.toLowerCase().includes(term);
            const matchMatStruct = item.materialStructure?.toLowerCase().includes(term);
            const matchTags = item.palavrasChave?.some((tag) => tag.toLowerCase().includes(term));
            if (!matchCode && !matchDesc && !matchFabr && !matchDim && !matchLoc && !matchTags && !matchSubcat && !matchCat && !matchMatStruct) {
              return false;
            }
          }
        }

        // Category filter (Single category or Block)
        if (activeCategory !== 'TODOS') {
          let itemCat = item.categoria === 'MATERIAL DIVERSO' ? 'MATERIAIS DIVERSOS' : item.categoria;
          if (itemCat === 'MATERIAIS DE USO/CONSUMO') itemCat = 'MATERIAL DE USO/CONSUMO';
          if (itemCat === 'UTILITES-GÁS' || itemCat === 'UTILITIES-GÁS' || itemCat === 'UTILITIES GÁS' || itemCat === 'UTILITIES GAS') {
            itemCat = 'UTILITIES-GAS';
          }
          if (activeCategory === 'GRUPO:CONSUMO_GERAL') {
            if (!CONSUMO_GERAL_CATEGORIAS.includes(itemCat as any)) return false;
          } else if (activeCategory === 'GRUPO:CONSUMO_MANUTENCAO') {
            if (!CONSUMO_MANUTENCAO_CATEGORIAS.includes(itemCat as any)) return false;
          } else if (itemCat !== activeCategory) {
            return false;
          }
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
  }, [items, searchTerm, activeCategory, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('TODOS');
  };

  const hasActiveFilters = searchTerm !== '' || activeCategory !== 'TODOS';

  return (
    <div className="space-y-6">
      {/* Top Header with Manutamaki Branding */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#1A3282] uppercase font-mono mb-1">
            <span className="w-2 h-2 rounded-full bg-[#3F78CC] inline-block animate-pulse"></span>
            <span>MANUTAMAKI // MANUTENÇÃO INDUSTRIAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A3282] uppercase">
            LOCALIZAR ITEM TÉCNICO
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Encontre o código oficial, dimensões e localização física no almoxarifado antes de abrir a requisição.
          </p>
        </div>

        {/* Manutamaki Plant Tag */}
        <div className="hidden sm:flex items-center">
          <div className="bg-white border border-slate-200/90 rounded-lg px-4 py-2.5 shadow-xs flex items-center gap-4">
            <div className="flex items-center justify-center select-none py-0.5">
              <span className="font-extrabold text-[22px] sm:text-[24px] tracking-tight leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span className="text-[#1A3282]">Manuta</span>
                <span className="text-[#3F78CC]">maki</span>
              </span>
            </div>
            <div className="h-9 w-px bg-slate-200" aria-hidden="true" />
            <div className="text-right flex flex-col justify-center">
              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                UNIDADE INDUSTRIAL
              </div>
              <div className="text-[11px] font-mono font-bold text-[#1A3282] uppercase leading-tight mt-0.5">
                <div>ALMOXARIFADO</div>
                <div>MANUTENÇÃO</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* Search Input */}
          <div className="relative md:col-span-8 lg:col-span-9">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-search-catalog"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Código, descrição ou palavra-chave (ex: 6204, SKF, M8, Festo)..."
              className="w-full pl-9.5 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#3F78CC]/30 focus:border-[#1A3282] font-sans"
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

          {/* Category Dropdown with Consumo Geral and Consumo Manutenção Optgroups */}
          <div className="md:col-span-4 lg:col-span-3">
            <select
              id="select-category-catalog"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full py-2.5 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#3F78CC]/30 focus:border-[#1A3282] text-slate-700 font-medium"
            >
              <option value="TODOS">Todas as categorias ({items.length})</option>
              <optgroup label="Consumo Geral">
                <option value="GRUPO:CONSUMO_GERAL">Todos em Consumo Geral ({consumoGeralTotal})</option>
                {CONSUMO_GERAL_CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({countsByCategory[cat] || 0})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Consumo Manutenção">
                <option value="GRUPO:CONSUMO_MANUTENCAO">Todos em Consumo Manutenção ({consumoManutencaoTotal})</option>
                {CONSUMO_MANUTENCAO_CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({countsByCategory[cat] || 0})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Quick Keyword Pills (Palavras-Chave Frequentes) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">Palavras-chave:</span>
          {[
            { label: 'FITA (49)', term: 'FITA' },
            { label: 'ADAPTADOR (36)', term: 'ADAPTADOR' },
            { label: 'ROLAMENTO', term: 'ROLAMENTO' },
            { label: 'PARAFUSO', term: 'PARAFUSO' },
            { label: 'VÁLVULA', term: 'VALVULA' },
            { label: 'SENSOR', term: 'SENSOR' },
            { label: 'CORREIA', term: 'CORREIA' },
          ].map((kw) => {
            const isKwActive = searchTerm.toUpperCase().trim() === kw.term;
            return (
              <button
                key={kw.term}
                id={`btn-kw-${kw.term.toLowerCase()}`}
                type="button"
                onClick={() => {
                  if (isKwActive) {
                    setSearchTerm('');
                  } else {
                    setSearchTerm(kw.term);
                    setActiveCategory('TODOS');
                  }
                }}
                className={`px-2.5 py-0.5 text-[11px] font-mono rounded-full transition-all border ${
                  isKwActive
                    ? 'bg-[#1A3282] text-white border-[#1A3282] font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {kw.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1">
        <div>
          <div className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">
            RESULTADO DA CONSULTA
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="font-bold text-slate-900 text-sm">{filteredItems.length}</span>
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
          {paginatedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onToggleFavorite={onToggleFavorite}
              onCopySuccess={onCopySuccess}
              onOpenDocuments={onOpenDocuments}
              onOpenImageManager={onOpenImageManager}
            />
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden shadow-xs">
          {paginatedItems.map((item) => {
            const docCount = item.documentos ? item.documentos.length : 0;
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail */}
                  {userRole === 'gestor' && onOpenImageManager ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenImageManager(item);
                      }}
                      className="w-10 h-10 shrink-0 bg-slate-100 hover:bg-amber-100/50 border border-slate-200 hover:border-amber-300 rounded flex items-center justify-center overflow-hidden transition-colors"
                      title="Incluir ou alterar imagem"
                    >
                      <img
                        src={item.imagemUrl || resolveItemImage(item)}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </button>
                  ) : (
                    <div
                      className="w-10 h-10 shrink-0 bg-slate-100 border border-slate-200 rounded flex items-center justify-center overflow-hidden"
                      title="Vista técnica de referência"
                    >
                      <img
                        src={item.imagemUrl || resolveItemImage(item)}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                  )}

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
                  {/* Photo quick button - Gestor only */}
                  {userRole === 'gestor' && onOpenImageManager && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenImageManager(item);
                      }}
                      className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-600 hover:text-amber-700 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded transition-colors"
                      title="Incluir ou alterar foto do item"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.imagemUrl ? 'Foto' : '+ Foto'}</span>
                    </button>
                  )}
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

      {/* Pagination Footer */}
      {filteredItems.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-mono">
            Mostrando <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
            <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> de{' '}
            <span className="font-bold text-slate-900">{filteredItems.length}</span> itens
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-prev-page"
              type="button"
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            <span className="px-3 py-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 rounded-md">
              Página {currentPage} de {totalPages}
            </span>

            <button
              id="btn-next-page"
              type="button"
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Próxima</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
