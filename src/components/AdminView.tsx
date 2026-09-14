import React, { useState, useMemo } from 'react';
import { Plus, Upload, Download, Search, Edit2, Trash2, Eye, ArrowLeft, FileText, LogOut, Camera, Database } from 'lucide-react';
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
  userRole?: UserRole;
  onPromptGestor?: () => void;
  onOpenChangePin?: () => void;
  onLogoutGestor?: () => void;
  onShareLink?: () => void;
  onBackToCatalog?: () => void;
  onOpenImageManager?: (item: CatalogItem) => void;
  onOpenSupabaseTest?: () => void;
  onOpenDataImporter?: () => void;
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
  onLogoutGestor,
  onBackToCatalog,
  onOpenImageManager,
  onOpenSupabaseTest,
  onOpenDataImporter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  const uniqueLocationsCount = useMemo(() => {
    const locs = new Set<string>();
    items.forEach((item) => {
      if (item.localizacao && item.localizacao.trim()) {
        locs.add(item.localizacao.trim());
      }
    });
    return locs.size;
  }, [items]);

  // Top 4 categories for the right column
  const top4Categories = useMemo(() => {
    return (Object.entries(categoryCounts) as [string, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [categoryCounts]);

  const maxTopCount = top4Categories[0]?.[1] || 1;

  const handleDeleteConfirm = (id: string, code: string) => {
    if (window.confirm(`Deseja realmente remover o item "${code}" do catálogo?`)) {
      onDeleteItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching reference screenshot */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          {onBackToCatalog && (
            <button
              type="button"
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase font-mono tracking-wider mb-2.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>CONSULTA</span>
            </button>
          )}

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono tracking-widest text-[#1A3282] bg-[#eff6ff] border border-[#bfdbfe] rounded uppercase">
              HUHTAMAKI // CONSOLE DE GESTÃO DO CATÁLOGO
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A3282] uppercase">
            ADMINISTRAÇÃO
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Mantenha os registros técnicos limpos, encontráveis e prontos para a próxima intervenção.
          </p>
        </div>

        {/* Top Actions matching reference screenshot */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            id="btn-admin-novo-item"
            type="button"
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold tracking-wider uppercase text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Item</span>
          </button>

          <button
            id="btn-admin-importar"
            type="button"
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold font-mono uppercase tracking-wider text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
            title="Importar catálogo em formato Excel (.xlsx), PDF (.pdf) ou JSON"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Importar (.xlsx/.pdf)</span>
          </button>

          <button
            id="btn-admin-exportar"
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold font-mono uppercase tracking-wider text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar</span>
          </button>

          {onOpenDataImporter && (
            <button
              id="btn-admin-importar-supabase"
              type="button"
              onClick={onOpenDataImporter}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold font-mono uppercase tracking-wider text-[#1A3282] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors shadow-xs"
              title="Importar dados de planilhas Excel/CSV/PDF para o Supabase (Upsert)"
            >
              <Upload className="w-3.5 h-3.5 text-[#3F78CC]" />
              <span>Importar Supabase (Upsert)</span>
            </button>
          )}

          {onOpenSupabaseTest && (
            <button
              id="btn-admin-testar-supabase"
              type="button"
              onClick={onOpenSupabaseTest}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold font-mono uppercase tracking-wider text-white bg-[#1A3282] hover:bg-[#152763] rounded-md transition-colors shadow-xs border border-[#3F78CC]/40"
              title="Testar conexão em tempo real com o banco de dados Supabase"
            >
              <Database className="w-3.5 h-3.5 text-[#93c5fd]" />
              <span>Testar Supabase</span>
            </button>
          )}

          {onLogoutGestor && (
            <button
              id="btn-admin-sair-gestor"
              type="button"
              onClick={onLogoutGestor}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold font-mono uppercase tracking-wider text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
              title="Sair do modo gestor e retornar para modo consulta"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
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
          <div className="mt-1 text-xs text-slate-500">registros no catálogo</div>
        </div>

        {/* Card 2: Localizações / Gavetas */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
            LOCALIZAÇÕES / GAVETAS
          </div>
          <div className="mt-2 text-3xl sm:text-4xl font-black font-mono text-slate-900">
            {uniqueLocationsCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">endereços cadastrados</div>
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
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                    REGISTROS
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded">
                    {filteredItems.length} VISÍVEIS
                  </span>
                </div>
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
                    <th className="py-2.5 px-3 w-12 text-center">FOTO</th>
                    <th className="py-2.5 px-4">CÓDIGO</th>
                    <th className="py-2.5 px-4">DESCRIÇÃO</th>
                    <th className="py-2.5 px-4">CATEGORIA</th>
                    <th className="py-2.5 px-4 text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Nenhum registro encontrado nesta visualização.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => onOpenImageManager?.(item)}
                            className="w-8 h-8 rounded bg-slate-100 border border-slate-200 hover:border-amber-400 hover:bg-amber-50 flex items-center justify-center overflow-hidden transition-colors mx-auto"
                            title="Alterar ou incluir imagem do item"
                          >
                            {item.imagemUrl ? (
                              <img
                                src={item.imagemUrl}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            ) : (
                              <Camera className="w-3.5 h-3.5 text-slate-400 hover:text-amber-600" />
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {item.codigo}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 max-w-xs truncate" title={item.descricao}>
                          {item.descricao}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <span className="px-2 py-0.5 text-[10px] font-bold text-[#1A3282] bg-blue-50 border border-blue-100 rounded uppercase font-mono w-fit">
                              {item.categoria}
                            </span>
                            {item.subcategoria && (
                              <span className="text-[10px] text-slate-500 font-medium">
                                {item.subcategoria}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            {/* Botão de Foto / Imagem */}
                            {onOpenImageManager && (
                              <button
                                id={`btn-admin-image-${item.id}`}
                                type="button"
                                onClick={() => onOpenImageManager(item)}
                                className="p-1 text-slate-400 hover:text-amber-600 rounded hover:bg-amber-50"
                                title="Incluir, alterar ou substituir imagem"
                              >
                                <Camera className="w-3.5 h-3.5" />
                              </button>
                            )}
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
          {/* Por Categoria Card - Top 04 matching screenshot */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono">
                  POR CATEGORIA
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">• TOP 04</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">ITENS</span>
            </div>

            <div className="space-y-3">
              {top4Categories.map(([cat, count]) => {
                const percentage = Math.round((count / (maxTopCount || 1)) * 100);
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(isSelected ? 'TODOS' : cat);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left p-2 rounded-md transition-all group ${
                      isSelected ? 'bg-cyan-50 border border-cyan-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-slate-800 truncate mr-2">{cat}</span>
                      <span className="font-mono text-slate-600 font-bold">{count}</span>
                    </div>
                    {/* Subtle progress bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-cyan-600' : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick filter toggle for all categories */}
            <div className="pt-3 mt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('TODOS');
                  setCurrentPage(1);
                }}
                className={`w-full flex items-center justify-between py-1.5 px-2.5 text-xs font-mono rounded transition-colors ${
                  selectedCategory === 'TODOS'
                    ? 'bg-[#247d8f] text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>VER TODAS AS CATEGORIAS</span>
                <span className="font-bold">{items.length}</span>
              </button>
            </div>
          </div>

          {/* Dica de Importação / Backup matching reference image */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-4 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-mono text-[11px] text-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              BASE DE DADOS // .XLSX & .PDF
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              Importação com suporte a planilhas <strong>Excel (.xlsx, .xls)</strong>, relatórios em <strong>PDF (.pdf)</strong> ou arquivos <strong>JSON</strong>. Mapeamento automático de códigos, descrições e categorias.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenImportModal}
                className="text-[11px] font-bold text-amber-900 hover:underline inline-flex items-center gap-1 font-mono"
              >
                <span>Abrir Importador (.xlsx / .pdf)</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
