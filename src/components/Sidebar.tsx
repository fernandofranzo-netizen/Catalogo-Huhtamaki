import React from 'react';
import { Search, ShieldCheck, Database, Menu, X, Activity, Lock, Unlock, LogOut, UserCheck } from 'lucide-react';
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
  itemCount,
  userRole,
  onPromptGestor,
  onLogoutGestor,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
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
        {/* Header with Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 font-black text-slate-950 bg-[#f59e0b] rounded-md shadow-sm">
              CM
            </div>
            <div>
              <div className="text-base font-extrabold tracking-wider text-white uppercase">
                Catálogo
              </div>
              <div className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
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

        {/* Navigation items */}
        <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {/* User Profile / Access Mode Box */}
          <div className="p-3 bg-slate-850/90 border border-slate-750 rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Perfil de Acesso
              </span>
              {userRole === 'gestor' ? (
                <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                  <Unlock className="w-2.5 h-2.5" /> Gestor
                </span>
              ) : (
                <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  <UserCheck className="w-2.5 h-2.5" /> Manutentor
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-300 leading-tight">
              {userRole === 'gestor'
                ? 'Acesso total para cadastrar peças, editar dados e anexar data-sheets.'
                : 'Modo consulta livre: busca rápida de códigos e abertura de data-sheets.'}
            </p>

            {userRole === 'gestor' ? (
              <button
                type="button"
                onClick={onLogoutGestor}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded border border-slate-700 transition-colors"
              >
                <LogOut className="w-3 h-3 text-slate-400" />
                <span>Bloquear / Sair do Gestor</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPromptGestor}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-[11px] font-bold text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded shadow-xs transition-colors"
              >
                <Lock className="w-3 h-3 text-slate-950" />
                <span>Acessar como Gestor</span>
              </button>
            )}
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Navegação
            </div>
            <nav className="space-y-1">
              <button
                id="nav-btn-consulta"
                type="button"
                onClick={() => {
                  onNavigate('catalog');
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  currentView === 'catalog' || currentView === 'detail'
                    ? 'bg-slate-800/90 text-white border-l-4 border-cyan-400'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Consulta de Itens</span>
                </div>
                <span className="px-1.5 py-0.5 text-[11px] font-mono font-medium text-slate-400 bg-slate-850 rounded">
                  {itemCount}
                </span>
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
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  currentView === 'admin'
                    ? 'bg-slate-800/90 text-white border-l-4 border-[#f59e0b]'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
                  <span>Administração</span>
                </div>
                {userRole === 'gestor' ? (
                  <span className="text-[10px] font-medium text-amber-400/90 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                    Gestão
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    <Lock className="w-2.5 h-2.5 text-amber-500" />
                    PIN
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Footer Status */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090f20]">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">Serviço operacional</span>
              <span className="text-[10px] text-slate-400">Banco de dados sincronizado</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
