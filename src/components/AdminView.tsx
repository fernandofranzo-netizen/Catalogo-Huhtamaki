import React, { useState, useMemo } from 'react';
import { Plus, Upload, Download, Search, Edit2, Trash2, Eye, Filter, CheckCircle2, AlertTriangle, Layers, FileText, Lock, ShieldCheck, Share2, KeyRound, LogOut } from 'lucide-react';
import { CatalogItem, UserRole } from '../types';

interface AdminViewProps {
  items: CatalogItem[];
  categories: readonly string[];
  onOpenNewModal: () => void;
  onOpenImportModal: () => void;
  onExport: () => void;
  onEditItem: (item: CatalogItem) => void;
  onDeleteItem: (id: string) => void;
  onSelectItem: (item: CatalogItem) => void;
  onOpenDocuments?: (item: CatalogItem) => void;
  userRole: UserRole;
  onPromptGestor?: () => void;
  onOpenChangePin?: () => void;
  onLogoutGestor?: () => void;
  onShareLink?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  items,
  categories,
  onOpenNewModal,
  onOpenImportModal,
  onExport,
  onEditItem,
  onDeleteItem,
  onSelectItem,
  onOpenDocuments,
  userRole,
  onPromptGestor,
  onOpenChangePin,
  onLogoutGestor,
  onShareLink,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // If user is not gestor, show restricted view
  if (userRole !== 'gestor') {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-xl p-8 text-center shadow-lg space-y-4">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
          Acesso Restrito ao Gestor
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Esta área é destinada exclusivamente à supervisão para cadastro de novos itens, edição de códigos e gestão de data-sheets. Os manutentores têm acesso livre para consulta técnica e abertura de documentos na aba <strong>Consulta de Itens</strong>.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          {onPromptGestor && (
            <button
              type="button"
              onClick={onPromptGestor}
              className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded-lg shadow-sm transition-colors"
            >
              Digitar PIN do Gestor
            </button>
          )}
        </div>
      </div>
    );
  }

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === 'TODOS' || item.categoria === selectedCategory;
      if (!matchCat) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.codigo.toLowerCase().includes(term) ||
        item.descricao.toLowerCase().includes(term) ||
        item.categoria.toLowerCase().includes(term) ||
        item.fabricante?.toLowerCase().includes(term)
      );
    });
  }, [items, selectedCategory, searchTerm]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Category counts breakdown
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.categoria] = (counts[item.categoria] || 0) + 1;
    });
    return counts;
  }, [items]);

  const activeCategoriesCount = Object.keys(categoryCounts).length;
  const semFotoCount = items.filter((item) => !item.imagemUrl).length;

  const handleDeleteConfirm = (id: string, code: string) => {
    if (window.confirm(`Deseja realmente remover o item "${code}" do catálogo?`)) {
      onDeleteItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-cyan-700 uppercase font-mono mb-1">
            CONSULTA // CONTROLE DO CATÁLOGO
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
            ADMINISTRAÇÃO
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Monitore novos registros técnicos limpos, encontre erros e priorize para a próxima intervenção.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-admin-novo-item"
            type="button"
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold tracking-wider uppercase text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Item</span>
          </button>

          <button
            id="btn-admin-importar"
            type="button"
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            title="Importar catálogo em massa via planilha .xlsx ou .csv"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Importar (.xlsx / .csv)</span>
          </button>

          <button
            id="btn-admin-exportar"
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            title="Exportar base completa para Excel (.xlsx)"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Gestor Control & Access Panel */}
      <div className="bg-slate-900 text-slate-100 rounded-lg p-4 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono">
                Painel do Gestor Ativo
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Acesso Liberado para Manutenção
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Compartilhe o link com os manutentores para consulta técnica rápida no celular ou tablet (somente leitura).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onShareLink && (
            <button
              type="button"
              onClick={onShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-xs"
              title="Copiar link de acesso para os manutentores"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar Link</span>
            </button>
          )}

          {onOpenChangePin && (
            <button
              type="button"
              onClick={onOpenChangePin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Alterar PIN</span>
            </button>
          )}

          {onLogoutGestor && (
            <button
              type="button"
              onClick={onLogoutGestor}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
              title="Voltar para visualização de manutentor"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Sair do Gestor</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Metric Stat Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total de Itens */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
            TOTAL DE ITENS
          </div>
          <div className="mt-2 text-3xl sm:text-4xl font-black font-mono text-slate-900">
            {items.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">registrados no catálogo</div>
        </div>

        {/* Card 2: Sem Foto / Revisados */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
            PENDÊNCIAS TÉCNICAS
          </div>
          <div className="mt-2 text-3xl sm:text-4xl font-black font-mono text-slate-900">
            {semFotoCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">itens sem foto cadastrada</div>
        </div>

        {/* Card 3: Categorias Ativas (Dark Card matching screenshot) */}
        <div className="bg-[#0b1329] text-white border border-slate-800 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="text-[10px] font-bold tracking-wider text-amber-400 uppercase font-mono">
            CATEGORIAS ATIVAS
          </div>
          <div className="mt-2 text-3xl sm:text-4xl font-black font-mono text-white">
            {activeCategoriesCount}
          </div>
          <div className="mt-1 text-xs text-slate-400">famílias técnicas no sistema</div>
        </div>
      </div>

      {/* Two Column Section: Registers Table vs Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Table Column */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Table Header & Search */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                  REGISTROS
                </h2>
                <p className="text-[11px] text-slate-500 font-mono">
                  Edição direta de inventário técnico
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  id="input-admin-search-table"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filtrar tabela..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-[10px] uppercase font-mono font-bold text-slate-500">
                    <th className="py-2.5 px-4">CÓDIGO</th>
                    <th className="py-2.5 px-4">DESCRIÇÃO</th>
                    <th className="py-2.5 px-4">CATEGORIA</th>
                    <th className="py-2.5 px-4 text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        Nenhum registro encontrado nesta visualização.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {item.codigo}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 max-w-xs truncate" title={item.descricao}>
                          {item.descricao}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 text-[10px] font-bold text-cyan-800 bg-cyan-50 rounded uppercase font-mono">
                            {item.categoria}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            {/* Botão de Documentação Técnica */}
                            <button
                              id={`btn-admin-doc-${item.id}`}
                              type="button"
                              onClick={() => onOpenDocuments?.(item)}
                              className={`p-1 rounded transition-colors ${
                                item.documentos && item.documentos.length > 0
                                  ? 'text-cyan-700 bg-cyan-50 hover:bg-cyan-100'
                                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                              title={
                                item.documentos && item.documentos.length > 0
                                  ? `${item.documentos.length} documento(s) / data-sheet anexado(s)`
                                  : 'Anexar data-sheet / documentação técnica'
                              }
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-admin-view-${item.id}`}
                              type="button"
                              onClick={() => onSelectItem(item)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                              title="Ver detalhes"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-admin-edit-${item.id}`}
                              type="button"
                              onClick={() => onEditItem(item)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50"
                              title="Editar item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-admin-delete-${item.id}`}
                              type="button"
                              onClick={() => handleDeleteConfirm(item.id, item.codigo)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                              title="Remover item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Pagination */}
          <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <div>
              Mostrando <span className="font-bold text-slate-800">{paginatedItems.length}</span> de{' '}
              <span className="font-bold text-slate-800">{filteredItems.length}</span> registros
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 bg-white border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50 text-xs font-mono"
              >
                Anterior
              </button>
              <span className="px-2 font-mono text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 bg-white border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50 text-xs font-mono"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown by Category & Import Tip */}
        <div className="lg:col-span-4 space-y-4">
          {/* Por Categoria Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                POR CATEGORIA
              </h3>
              <span className="text-[10px] font-mono text-slate-400">ITENS</span>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto pr-1 scrollbar-thin text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('TODOS');
                  setCurrentPage(1);
                }}
                className={`w-full flex items-center justify-between py-1.5 px-2 rounded font-mono transition-colors ${
                  selectedCategory === 'TODOS'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>[TODAS AS CATEGORIAS]</span>
                <span className="font-bold">{items.length}</span>
              </button>

              {Object.entries(categoryCounts).map(([cat, count]) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between py-1.5 px-2 rounded font-mono transition-colors ${
                      isSelected
                        ? 'bg-cyan-700 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate mr-2 text-left">{cat}</span>
                    <span className="font-bold shrink-0">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dica de Importação / Backup */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-lg p-4 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-mono text-[11px] text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              FORMATO DE DADOS
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              Importações aceitam arquivo JSON padronizado com campos <code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded">codigo</code>, <code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded">descricao</code> e <code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded">categoria</code>.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenImportModal}
                className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950"
              >
                Abrir assistente de importação →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
