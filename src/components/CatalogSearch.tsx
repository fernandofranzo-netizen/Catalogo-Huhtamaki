import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  ChevronDown,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  FileText,
  Copy,
  Camera,
} from 'lucide-react';
import { CatalogItem, UserRole } from '../types';
import { ItemCard } from './ItemCard';
import {
  CATEGORIAS_CONSUMO_GERAL,
  CATEGORIAS_CONSUMO_MANUTENCAO,
  formatCategoryName,
} from '../data/initialCatalog';
import { getTechnicalPlaceholder } from '../utils/technicalReference';

interface CatalogSearchProps {
  items: CatalogItem[];
  categories?: readonly string[];
  selectedCategory: string;
  onSelectCategory?: (category: string) => void;
  onSelectItem: (item: CatalogItem) => void;
  onOpenNewModal?: () => void;
  onToggleFavorite?: (id: string) => void;
  onCopySuccess: (code: string) => void;
  onOpenDocuments?: (item: CatalogItem) => void;
  userRole?: UserRole;
  onPromptGestor?: () => void;
  onLogoutGestor?: () => void;
  onOpenImageManager?: (item: CatalogItem) => void;
}

export const CatalogSearch: React.FC<CatalogSearchProps> = ({
  items,
  selectedCategory: propCategory,
  onSelectCategory,
  onSelectItem,
  onToggleFavorite,
  onCopySuccess,
  onOpenDocuments,
  userRole = 'manutentor',
  onOpenImageManager,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localCategory, setLocalCategory] = useState('TODOS');
  const activeCategory = propCategory !== undefined ? propCategory : localCategory;

  const handleCategoryChange = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setLocalCategory(cat);
    }
  };

  const [sortBy, setSortBy] = useState('codigo-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, sortBy]);

  // Category counts and groups
  const {
    countsByCategory,
    consumoGeralTotal,
    consumoManutencaoTotal,
    outrasCategoriasList,
  } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const it of items) {
      let cat = it.categoria;
      if (cat === 'MATERIAL DIVERSO') cat = 'MATERIAIS DIVERSOS';
      if (cat === 'MATERIAIS DE USO/CONSUMO') cat = 'MATERIAL DE USO/CONSUMO';
      counts[cat] = (counts[cat] || 0) + 1;
    }

    const cGeral = CATEGORIAS_CONSUMO_GERAL.reduce((acc, c) => acc + (counts[c] || 0), 0);
    const cManut = CATEGORIAS_CONSUMO_MANUTENCAO.reduce((acc, c) => acc + (counts[c] || 0), 0);

    const outras: string[] = [];
    for (const c of Object.keys(counts)) {
      if (!CATEGORIAS_CONSUMO_GERAL.includes(c) && !CATEGORIAS_CONSUMO_MANUTENCAO.includes(c)) {
        outras.push(c);
      }
    }
    outras.sort();

    return {
      countsByCategory: counts,
      consumoGeralTotal: cGeral,
      consumoManutencaoTotal: cManut,
      outrasCategoriasList: outras,
    };
  }, [items]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search term matching
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim();
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
            const matchSub = item.subcategoria?.toLowerCase().includes(term);
            const matchCat = item.categoria?.toLowerCase().includes(term);
            const matchMat = item.materialStructure?.toLowerCase().includes(term);
            const matchTags = item.palavrasChave?.some((tag) => tag.toLowerCase().includes(term));

            if (
              !matchCode &&
              !matchDesc &&
              !matchFabr &&
              !matchDim &&
              !matchLoc &&
              !matchSub &&
              !matchCat &&
              !matchMat &&
              !matchTags
            ) {
              return false;
            }
          }
        }

        // Category filter
        if (activeCategory !== 'TODOS') {
          let itemCat = item.categoria;
          if (itemCat === 'MATERIAL DIVERSO') itemCat = 'MATERIAIS DIVERSOS';
          if (itemCat === 'MATERIAIS DE USO/CONSUMO') itemCat = 'MATERIAL DE USO/CONSUMO';
          const normActive =
            activeCategory === 'MATERIAIS DE USO/CONSUMO'
              ? 'MATERIAL DE USO/CONSUMO'
              : activeCategory;

          if (normActive === 'GRUPO:CONSUMO_GERAL') {
            if (!CATEGORIAS_CONSUMO_GERAL.includes(itemCat)) return false;
          } else if (normActive === 'GRUPO:CONSUMO_MANUTENCAO') {
            if (!CATEGORIAS_CONSUMO_MANUTENCAO.includes(itemCat)) return false;
          } else if (normActive === 'UNIFORMES') {
            const isUniforme =
              itemCat === 'UNIFORMES' ||
              item.codigo.startsWith('UN-') ||
              item.subcategoria?.toLowerCase().includes('uniform') ||
              item.palavrasChave?.includes('UNIFORMES');
            if (!isUniforme) return false;
          } else if (itemCat !== normActive && item.categoria !== normActive) {
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

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const clearFilters = () => {
    setSearchTerm('');
    handleCategoryChange('TODOS');
  };

  const hasActiveFilters = searchTerm !== '' || activeCategory !== 'TODOS';

  const quickKeywords = [
    { label: 'FITA (49)', term: 'FITA' },
    { label: 'ADAPTADOR (36)', term: 'ADAPTADOR' },
    { label: 'ROLAMENTO', term: 'ROLAMENTO' },
    { label: 'PARAFUSO', term: 'PARAFUSO' },
    { label: 'VÁLVULA', term: 'VALVULA' },
    { label: 'SENSOR', term: 'SENSOR' },
    { label: 'CORREIA', term: 'CORREIA' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header matching exact screenshot */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#1A3282] uppercase font-mono mb-1">
            <span className="w-2 h-2 rounded-full bg-[#3F78CC] inline-block animate-pulse" />
            <span>MANUTAMAKI // MANUTENÇÃO INDUSTRIAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A3282] uppercase">
            LOCALIZAR ITEM TÉCNICO
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Encontre o código oficial, dimensões e localização física no almoxarifado antes de abrir a requisição.
          </p>
        </div>

        {/* Brand Card Top Right */}
        <div className="hidden sm:flex items-center">
          <div className="bg-white border border-slate-200/90 rounded-lg px-4 py-2.5 shadow-xs flex items-center gap-4">
            <div className="flex items-center justify-center select-none py-0.5">
              <span
                className="font-extrabold text-[22px] sm:text-[24px] tracking-tight leading-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <span className="text-[#1A3282]">Manuta</span>
                <span className="text-[#3F78CC]">maki</span>
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase leading-tight">
              <span className="text-[#3F78CC]">UNIDADE INDUSTRIAL</span>
              <br />
              <span>ALMOXARIFADO / MANUTENÇÃO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search and Filtering Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-search-catalog"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Código, descrição ou palavra-chave (ex: 6204, SKF, M8, Festo)..."
              className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#3F78CC]/30 focus:border-[#3F78CC] transition-all font-sans"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grouped Category Select */}
          <div className="relative md:col-span-4">
            <select
              id="select-category-catalog"
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full appearance-none py-2.5 px-3 pr-8 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#3F78CC]/30 focus:border-[#3F78CC] text-slate-700 font-medium cursor-pointer"
            >
              <option value="TODOS">Todas as categorias ({items.length})</option>

              <optgroup label="Consumo Geral">
                <option value="GRUPO:CONSUMO_GERAL">
                  Todos em Consumo Geral ({consumoGeralTotal})
                </option>
                {CATEGORIAS_CONSUMO_GERAL.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategoryName(cat)} ({countsByCategory[cat] || 0})
                  </option>
                ))}
              </optgroup>

              <optgroup label="Consumo Manutenção">
                <option value="GRUPO:CONSUMO_MANUTENCAO">
                  Todos em Consumo Manutenção ({consumoManutencaoTotal})
                </option>
                {CATEGORIAS_CONSUMO_MANUTENCAO.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategoryName(cat)} ({countsByCategory[cat] || 0})
                  </option>
                ))}
              </optgroup>

              {outrasCategoriasList.length > 0 && (
                <optgroup label="Outras Categorias">
                  {outrasCategoriasList.map((cat) => (
                    <option key={cat} value={cat}>
                      {formatCategoryName(cat)} ({countsByCategory[cat] || 0})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Quick Keyword Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">
            Palavras-chave:
          </span>
          {quickKeywords.map((kw) => {
            const isActive = searchTerm.toUpperCase().trim() === kw.term;
            return (
              <button
                key={kw.term}
                id={`btn-kw-${kw.term.toLowerCase()}`}
                type="button"
                onClick={() => {
                  if (isActive) {
                    setSearchTerm('');
                  } else {
                    setSearchTerm(kw.term);
                    handleCategoryChange('TODOS');
                  }
                }}
                className={`px-2.5 py-0.5 text-[11px] font-mono rounded-full transition-all border ${
                  isActive
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

      {/* Results Header Line & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1">
        <div>
          <div className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">
            RESULTADO DA CONSULTA
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="font-bold text-slate-900 text-sm">
              {filteredItems.length}
            </span>
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

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sort Select */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-2 py-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="select-sort-catalog"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="codigo-asc">Código (A-Z)</option>
              <option value="codigo-desc">Código (Z-A)</option>
              <option value="descricao">Descrição (A-Z)</option>
              <option value="recentes">Mais recentes</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-md p-0.5">
            <button
              id="btn-view-grid"
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid'
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="btn-view-list"
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list'
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Item Display Container */}
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
        /* List View */
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden shadow-xs">
          {paginatedItems.map((item) => {
            const docsCount = item.documentos ? item.documentos.length : 0;
            const imgSrc = item.imagemUrl || getTechnicalPlaceholder(item);
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 shrink-0 bg-slate-100 border border-slate-200 rounded flex items-center justify-center overflow-hidden"
                    title="Vista técnica de referência"
                  >
                    <img
                      src={imgSrc}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

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

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenDocuments) onOpenDocuments(item);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded border transition-colors ${
                      docsCount > 0
                        ? 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title={
                      docsCount > 0
                        ? `${docsCount} documento(s) / data-sheet`
                        : 'Incluir data-sheet'
                    }
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Data-sheet</span>
                    {docsCount > 0 && (
                      <span className="px-1 py-0.5 text-[10px] font-mono font-bold bg-cyan-200 text-cyan-900 rounded">
                        {docsCount}
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
                    className="px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded font-mono flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3 text-amber-800" />
                    <span>Copiar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredItems.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-mono">
            Mostrando{' '}
            <span className="font-bold text-slate-900">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            a{' '}
            <span className="font-bold text-slate-900">
              {Math.min(currentPage * pageSize, filteredItems.length)}
            </span>{' '}
            de{' '}
            <span className="font-bold text-slate-900">{filteredItems.length}</span>{' '}
            itens
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
