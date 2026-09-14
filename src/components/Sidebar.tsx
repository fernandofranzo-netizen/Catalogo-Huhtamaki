import React, { useState, useMemo } from 'react';
import {
  Search,
  Package,
  Wrench,
  Layers,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Lock,
  LogOut,
  Shield,
  X,
} from 'lucide-react';
import { ViewMode, UserRole, CatalogItem } from '../types';
import {
  CATEGORIAS_CONSUMO_GERAL,
  CATEGORIAS_CONSUMO_MANUTENCAO,
  formatCategoryName,
} from '../data/initialCatalog';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  items: CatalogItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  userRole: UserRole;
  onPromptGestor: () => void;
  onLogoutGestor: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onToggleMobile,
  items,
  selectedCategory,
  onSelectCategory,
  userRole,
  onPromptGestor,
  onLogoutGestor,
}) => {
  const [openGeral, setOpenGeral] = useState(true);
  const [openManutencao, setOpenManutencao] = useState(true);
  const [openOutras, setOpenOutras] = useState(false);

  const {
    countsByCategory,
    consumoGeralTotal,
    consumoManutencaoTotal,
    outrosTotal,
    outrosCategoriasList,
  } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const it of items) {
      let cat = it.categoria;
      if (cat === 'MATERIAL DIVERSO') cat = 'MATERIAIS DIVERSOS';
      if (cat === 'MATERIAIS DE USO/CONSUMO') cat = 'MATERIAL DE USO/CONSUMO';
      counts[cat] = (counts[cat] || 0) + 1;
    }

    const geralTotal = CATEGORIAS_CONSUMO_GERAL.reduce(
      (acc, cat) => acc + (counts[cat] || 0),
      0
    );
    const manutencaoTotal = CATEGORIAS_CONSUMO_MANUTENCAO.reduce(
      (acc, cat) => acc + (counts[cat] || 0),
      0
    );

    const outrasList: string[] = [];
    let outrasCount = 0;
    for (const cat of Object.keys(counts)) {
      if (!CATEGORIAS_CONSUMO_GERAL.includes(cat) && !CATEGORIAS_CONSUMO_MANUTENCAO.includes(cat)) {
        outrasList.push(cat);
        outrasCount += counts[cat];
      }
    }
    outrasList.sort();

    return {
      countsByCategory: counts,
      consumoGeralTotal: geralTotal,
      consumoManutencaoTotal: manutencaoTotal,
      outrosTotal: outrasCount,
      outrosCategoriasList: outrasList,
    };
  }, [items]);

  const handleSelect = (category: string) => {
    onSelectCategory(category);
    onNavigate('catalog');
    if (isOpenMobile) onToggleMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onToggleMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0b1329] text-slate-200 border-r border-slate-800/80 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top brand header matching screenshot */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-[#080e1f]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 font-black text-white bg-gradient-to-br from-[#3F78CC] to-[#1A3282] rounded-lg shadow-sm border border-[#3F78CC]/30 tracking-tight text-base select-none">
              CM
            </div>
            <div>
              <div className="text-base font-extrabold tracking-wider text-white uppercase font-sans">
                Catálogo
              </div>
              <div className="text-[10px] tracking-widest text-[#3F78CC] uppercase font-mono font-semibold">
                Manutenção // v2.4
              </div>
            </div>
          </div>

          <button
            id="btn-close-sidebar-mobile"
            type="button"
            className="p-1.5 text-slate-400 rounded-md md:hidden hover:text-white hover:bg-slate-800"
            onClick={onToggleMobile}
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable navigation area */}
        <div className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {userRole === 'gestor' && (
            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-center justify-between text-[11px] font-mono text-amber-300">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Modo Gestor
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">ATIVO</span>
            </div>
          )}

          {/* Navigation Section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono flex items-center justify-between">
              <span>NAVEGAÇÃO</span>
            </div>

            <nav className="space-y-2">
              {/* Consulta de Itens (All) */}
              <button
                id="nav-btn-consulta"
                type="button"
                onClick={() => handleSelect('TODOS')}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  currentView === 'catalog' && selectedCategory === 'TODOS'
                    ? 'bg-slate-800 text-white border-l-4 border-[#3f78cc] shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
                title="Consultar todos os itens do catálogo"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-[#3f78cc]" />
                  <span>Consulta de itens</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-300 bg-slate-800 rounded">
                  {items.length}
                </span>
              </button>

              {/* Consumo Geral */}
              <div className="rounded-lg bg-slate-900/40 border border-slate-800/60 p-1 space-y-1">
                <div
                  className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-bold rounded-md transition-colors ${
                    currentView === 'catalog' && selectedCategory === 'GRUPO:CONSUMO_GERAL'
                      ? 'bg-sky-950/80 text-sky-200 border-l-2 border-[#38bdf8]'
                      : 'text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <button
                    id="nav-btn-consumo-geral"
                    type="button"
                    onClick={() => handleSelect('GRUPO:CONSUMO_GERAL')}
                    className="flex items-center gap-2 flex-1 text-left"
                    title="Filtrar por todo o Consumo Geral"
                  >
                    <Package className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span className="tracking-wide">Consumo Geral</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-sky-300 bg-sky-950/90 border border-sky-800/50 rounded">
                      {consumoGeralTotal}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenGeral(!openGeral);
                      }}
                      className="p-0.5 text-slate-400 hover:text-white rounded"
                      title={openGeral ? 'Recolher categorias' : 'Expandir categorias'}
                    >
                      {openGeral ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {openGeral && (
                  <div className="pl-2 ml-2 border-l border-slate-800 space-y-0.5 pt-0.5">
                    {CATEGORIAS_CONSUMO_GERAL.map((cat) => {
                      const isActive = currentView === 'catalog' && selectedCategory === cat;
                      const count = countsByCategory[cat] || 0;
                      return (
                        <button
                          type="button"
                          key={cat}
                          id={`nav-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          onClick={() => handleSelect(cat)}
                          className={`flex items-center justify-between w-full px-2 py-1 text-[11px] font-medium rounded transition-colors text-left ${
                            isActive
                              ? 'bg-[#1A3282] text-white font-bold shadow-xs'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`}
                          title={`Filtrar por ${cat}`}
                        >
                          <span className="truncate pr-1">{formatCategoryName(cat)}</span>
                          <span className="font-mono text-[10px] text-slate-500 shrink-0">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Consumo Manutenção */}
              <div className="rounded-lg bg-slate-900/40 border border-slate-800/60 p-1 space-y-1">
                <div
                  className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-bold rounded-md transition-colors ${
                    currentView === 'catalog' && selectedCategory === 'GRUPO:CONSUMO_MANUTENCAO'
                      ? 'bg-amber-950/80 text-amber-200 border-l-2 border-amber-400'
                      : 'text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <button
                    id="nav-btn-consumo-manutencao"
                    type="button"
                    onClick={() => handleSelect('GRUPO:CONSUMO_MANUTENCAO')}
                    className="flex items-center gap-2 flex-1 text-left"
                    title="Filtrar por todo o Consumo Manutenção"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span className="tracking-wide">Consumo Manutenção</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/90 border border-amber-800/50 rounded">
                      {consumoManutencaoTotal}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenManutencao(!openManutencao);
                      }}
                      className="p-0.5 text-slate-400 hover:text-white rounded"
                      title={openManutencao ? 'Recolher categorias' : 'Expandir categorias'}
                    >
                      {openManutencao ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {openManutencao && (
                  <div className="pl-2 ml-2 border-l border-slate-800 space-y-0.5 pt-0.5">
                    {CATEGORIAS_CONSUMO_MANUTENCAO.map((cat) => {
                      const isActive = currentView === 'catalog' && selectedCategory === cat;
                      const count = countsByCategory[cat] || 0;
                      return (
                        <button
                          type="button"
                          key={cat}
                          id={`nav-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          onClick={() => handleSelect(cat)}
                          className={`flex items-center justify-between w-full px-2 py-1 text-[11px] font-medium rounded transition-colors text-left ${
                            isActive
                              ? 'bg-[#1A3282] text-white font-bold shadow-xs'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`}
                          title={`Filtrar por ${cat}`}
                        >
                          <span className="truncate pr-1">{formatCategoryName(cat)}</span>
                          <span className="font-mono text-[10px] text-slate-500 shrink-0">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Outras Categorias */}
              {outrosTotal > 0 && (
                <div className="pt-1">
                  <button
                    id="nav-btn-outras-categorias"
                    type="button"
                    onClick={() => setOpenOutras(!openOutras)}
                    className="flex items-center justify-between w-full px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3 h-3 text-slate-500" />
                      <span>Outras Categorias</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-500">{outrosTotal}</span>
                      {openOutras ? (
                        <ChevronDown className="w-3 h-3 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {openOutras && (
                    <div className="pl-2 ml-2 border-l border-slate-800 space-y-0.5 pt-0.5">
                      {outrosCategoriasList.map((cat) => {
                        const isActive = currentView === 'catalog' && selectedCategory === cat;
                        const count = countsByCategory[cat] || 0;
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => handleSelect(cat)}
                            className={`flex items-center justify-between w-full px-2 py-1 text-[11px] font-medium rounded transition-colors text-left ${
                              isActive
                                ? 'bg-[#1A3282] text-white font-bold shadow-xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            }`}
                          >
                            <span className="truncate pr-1">{formatCategoryName(cat)}</span>
                            <span className="font-mono text-[10px] text-slate-500 shrink-0">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Administration Section */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
              ADMINISTRAÇÃO
            </div>

            <nav className="space-y-1.5">
              <button
                id="nav-btn-admin"
                type="button"
                onClick={() => {
                  onNavigate('admin');
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  currentView === 'admin'
                    ? 'bg-slate-800 text-white border-l-4 border-[#f59e0b] shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
                  <span>Administração</span>
                </div>
                {userRole !== 'gestor' && (
                  <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    <Lock className="w-3 h-3 text-amber-400/80" />
                    <span>PIN</span>
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Gestor Switch Button */}
          <div className="pt-2 px-1">
            {userRole === 'gestor' ? (
              <button
                id="btn-sidebar-sair-gestor"
                type="button"
                onClick={() => {
                  onLogoutGestor();
                  if (isOpenMobile) onToggleMobile();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-lg border border-rose-800/50 transition-colors shadow-xs"
                title="Sair do modo gestor e retornar para consulta de manutentor"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sair do modo gestor</span>
              </button>
            ) : (
              <button
                id="btn-sidebar-prompt-gestor"
                type="button"
                onClick={() => {
                  onPromptGestor();
                  if (isOpenMobile) onToggleMobile();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-400 hover:text-amber-300 bg-slate-850/60 hover:bg-slate-850 rounded-lg border border-slate-800 transition-colors"
                title="Acessar painel de edição do gestor"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Acesso Gestor</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Brand Seal */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090f20]">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            <Shield className="w-3.5 h-3.5 text-[#3f78cc]" />
            <span>MANUTAMAKI // USO INTERNO</span>
          </div>
        </div>
      </aside>
    </>
  );
};
