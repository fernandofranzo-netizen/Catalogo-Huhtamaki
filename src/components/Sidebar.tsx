import React from 'react';
import { Search, ShieldCheck, X } from 'lucide-react';
import { ViewMode, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  itemCount: number;
  userRole: UserRole;
  onPromptGestor: () => void;
  onLogoutGestor: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onToggleMobile,
  userRole,
  onPromptGestor,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={onToggleMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-56 bg-[#0c1322] text-slate-200 border-r border-slate-800/80 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with Logo matching screenshot */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 font-black text-xs text-slate-950 bg-[#f59e0b] rounded-xs shadow-xs">
              CM
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-wider text-white uppercase font-sans">
                Catálogo
              </div>
              <div className="text-[9px] tracking-widest text-slate-400 uppercase font-mono">
                Manutenção // v2.5
              </div>
            </div>
          </div>

          <button
            id="btn-close-sidebar-mobile"
            type="button"
            className="p-1 text-slate-400 rounded-xs md:hidden hover:text-white hover:bg-slate-800"
            onClick={onToggleMobile}
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation items matching screenshot */}
        <div className="flex-1 px-2.5 py-4 space-y-4 overflow-y-auto">
          <div>
            <div className="px-2.5 mb-2 text-[9.5px] font-bold tracking-widest text-slate-500 uppercase font-mono">
              NAVEGAÇÃO
            </div>

            <nav className="space-y-1">
              <button
                id="nav-btn-consulta"
                type="button"
                onClick={() => {
                  onNavigate('catalog');
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium rounded-xs transition-colors ${
                  currentView === 'catalog' || currentView === 'detail'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Consulta de Itens</span>
              </button>

              <button
                id="nav-btn-admin"
                type="button"
                onClick={() => {
                  if (userRole === 'gestor') {
                    onNavigate('admin');
                  } else {
                    onPromptGestor();
                  }
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium rounded-xs transition-colors ${
                  currentView === 'admin'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Administração</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Footer Status */}
        <div className="p-3 border-t border-slate-800/70 bg-[#090f1a]">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-2 h-2 bg-emerald-500 rounded-full"></span>
            </span>
            <div className="flex flex-col text-[9.5px] font-mono leading-tight">
              <span className="text-slate-300">Serviço operacional</span>
              <span className="text-slate-500">v2.4 conectado</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
