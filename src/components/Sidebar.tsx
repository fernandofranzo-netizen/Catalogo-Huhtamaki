import React from 'react';
import { Search, SlidersHorizontal, Menu, X, Shield, LogOut, Lock, Database } from 'lucide-react';
import { ViewMode, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  itemCount: number;
  userRole?: UserRole;
  onPromptGestor?: () => void;
  onLogoutGestor?: () => void;
  onOpenSupabaseTest?: () => void;
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
  onOpenSupabaseTest,
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
        {/* Header with Logo restored to CM badge converted to Huhtamaki colors */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-[#080e1f]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 font-black text-white bg-gradient-to-br from-[#3F78CC] to-[#1A3282] rounded-lg shadow-sm border border-[#3F78CC]/30 tracking-tight text-base">
              CM
            </div>
            <div>
              <div className="text-base font-extrabold tracking-wider text-white uppercase">
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

        {/* Navigation items */}
        <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
          {userRole === 'gestor' && (
            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-center justify-between text-[11px] font-mono text-amber-300">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Modo Gestor
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">ATIVO</span>
            </div>
          )}

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
              NAVEGAÇÃO
            </div>
            <nav className="space-y-1.5">
              <button
                id="nav-btn-consulta"
                type="button"
                onClick={() => {
                  onNavigate('catalog');
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  currentView === 'catalog' || currentView === 'detail'
                    ? 'bg-slate-850 text-white border-l-4 border-[#3f78cc] shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-[#3f78cc]" />
                  <span>Consulta de itens</span>
                </div>
                <span className="px-1.5 py-0.5 text-[11px] font-mono font-medium text-slate-400 bg-slate-800 rounded">
                  {itemCount}
                </span>
              </button>

              <button
                id="nav-btn-admin"
                type="button"
                onClick={() => {
                  onNavigate('admin');
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  currentView === 'admin'
                    ? 'bg-slate-850 text-white border-l-4 border-[#f59e0b] shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-4 h-4 text-[#f59e0b]" />
                  <span>Administração</span>
                </div>
                {userRole !== 'gestor' && (
                  <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    <Lock className="w-3 h-3 text-amber-400/80" />
                    <span>PIN</span>
                  </span>
                )}
              </button>

              {onOpenSupabaseTest && (
                <button
                  id="nav-btn-supabase-test"
                  type="button"
                  onClick={() => {
                    onOpenSupabaseTest();
                    if (isOpenMobile) onToggleMobile();
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors border border-slate-800/80 bg-slate-900/40"
                  title="Testar conexão em tempo real com o banco de dados Supabase"
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-3.5 h-3.5 text-[#3f78cc]" />
                    <span>Teste Supabase</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Conexão</span>
                  </span>
                </button>
              )}
            </nav>
          </div>

          <div className="pt-2 px-1 space-y-2">
            {userRole === 'gestor' ? (
              <button
                id="btn-sidebar-sair-gestor"
                type="button"
                onClick={() => {
                  onLogoutGestor?.();
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
                  onPromptGestor?.();
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

        {/* Footer Status - AMBIENTE INTERNO HUHTAMAKI */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090f20]">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            <Shield className="w-3.5 h-3.5 text-[#3f78cc]" />
            <span>HUHTAMAKI // USO INTERNO</span>
          </div>
        </div>
      </aside>
    </>
  );
};

