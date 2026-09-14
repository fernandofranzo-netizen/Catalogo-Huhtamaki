import React, { useState, useRef } from 'react';
import { X, Upload, FileText, RotateCcw, AlertCircle, CheckCircle, FileSpreadsheet, Download, Layers, Loader2 } from 'lucide-react';
import { CatalogItem } from '../types';
import { parseExcelFile, parsePdfFile, downloadSampleExcel } from '../utils/importer';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newItems: CatalogItem[]) => void;
  onRestoreDefaults: () => void;
  currentItemsCount?: number;
}

const SAMPLE_JSON = `[
  {
    "codigo": "MM-REPOS-00999-00",
    "descricao": "ROLAMENTO AUTOCOMPENSADOR SKF 22210 - 50 x 90 x 23mm",
    "categoria": "MATERIAL MECÂNICO",
    "fabricante": "SKF",
    "dimensao": "50 x 90 x 23mm",
    "localizacao": "Almoxarifado Central - Prateleira B-09",
    "palavrasChave": ["rolamento", "autocompensador", "skf", "22210"]
  }
]`;

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onRestoreDefaults,
}) => {
  const [importMode, setImportMode] = useState<'file' | 'manual'>('file');
  const [jsonText, setJsonText] = useState(SAMPLE_JSON);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<{
    fileName: string;
    fileType: 'xlsx' | 'pdf' | 'json' | 'csv';
    items: CatalogItem[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelected = async (file: File) => {
    setError(null);
    setLoading(true);
    setParsedPreview(null);

    const fileName = file.name;
    const lowerName = fileName.toLowerCase();

    try {
      if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const items = parseExcelFile(buffer);
        setParsedPreview({ fileName, fileType: 'xlsx', items });
      } else if (lowerName.endsWith('.pdf')) {
        const buffer = await file.arrayBuffer();
        const items = await parsePdfFile(buffer);
        setParsedPreview({ fileName, fileType: 'pdf', items });
      } else if (lowerName.endsWith('.json')) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error('O arquivo JSON deve conter um array (lista) de itens.');
        }
        const items: CatalogItem[] = parsed.map((raw, idx) => ({
          id: raw.id || `item-import-json-${Date.now()}-${idx}`,
          codigo: String(raw.codigo || `ITEM-${idx + 1}`).toUpperCase(),
          descricao: String(raw.descricao || 'Item importado'),
          categoria: String(raw.categoria || 'OUTROS / REPOSIÇÃO').toUpperCase(),
          fabricante: raw.fabricante ? String(raw.fabricante) : undefined,
          dimensao: raw.dimensao ? String(raw.dimensao) : undefined,
          localizacao: raw.localizacao ? String(raw.localizacao) : undefined,
          palavrasChave: Array.isArray(raw.palavrasChave)
            ? raw.palavrasChave.map(String)
            : Array.isArray(raw.palavras_chave)
            ? raw.palavras_chave.map(String)
            : [],
          imagemUrl: raw.imagemUrl || raw.imagem_url || undefined,
          favorito: false,
          status: 'disponivel',
          dataCriacao: new Date().toISOString().split('T')[0],
        }));
        setParsedPreview({ fileName, fileType: 'json', items });
      } else if (lowerName.endsWith('.csv')) {
        const buffer = await file.arrayBuffer();
        const items = parseExcelFile(buffer); // SheetJS handles CSV gracefully
        setParsedPreview({ fileName, fileType: 'csv', items });
      } else {
        throw new Error('Formato de arquivo não suportado. Utilize arquivos .xlsx, .xls, .pdf, .json ou .csv.');
      }
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Erro ao processar o arquivo selecionado.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleConfirmImport = () => {
    if (parsedPreview && parsedPreview.items.length > 0) {
      onImport(parsedPreview.items);
      onClose();
      return;
    }

    // Manual JSON fallback
    if (importMode === 'manual') {
      try {
        const parsed = JSON.parse(jsonText);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          setError('O JSON deve ser uma lista válida de itens.');
          return;
        }

        const validItems: CatalogItem[] = parsed.map((raw: any, index: number) => ({
          id: raw.id || `item-manual-${Date.now()}-${index}`,
          codigo: String(raw.codigo || `ITEM-${index + 1}`).toUpperCase(),
          descricao: String(raw.descricao || 'Item'),
          categoria: String(raw.categoria || 'OUTROS / REPOSIÇÃO').toUpperCase(),
          fabricante: raw.fabricante ? String(raw.fabricante) : undefined,
          dimensao: raw.dimensao ? String(raw.dimensao) : undefined,
          localizacao: raw.localizacao ? String(raw.localizacao) : undefined,
          palavrasChave: Array.isArray(raw.palavrasChave)
            ? raw.palavrasChave.map(String)
            : [],
          imagemUrl: raw.imagemUrl || raw.imagem_url || undefined,
          favorito: false,
          status: 'disponivel',
          dataCriacao: new Date().toISOString().split('T')[0],
        }));

        onImport(validItems);
        onClose();
      } catch (err: any) {
        setError(err.message || 'JSON inválido.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="modal-import-catalog"
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-amber-400 uppercase">
              BASE DE DADOS // IMPORTAÇÃO
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase">
              IMPORTAR CATÁLOGO (.XLSX / .PDF / .JSON)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Carregue planilhas Excel, documentos PDF ou arquivos JSON para atualizar o catálogo.
            </p>
          </div>
          <button
            id="btn-close-import-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-200 bg-slate-50 text-xs">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setImportMode('file')}
              className={`pb-2.5 font-mono font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                importMode === 'file'
                  ? 'border-[#f59e0b] text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Arquivo Excel (.xlsx) / PDF (.pdf)</span>
            </button>
            <button
              type="button"
              onClick={() => setImportMode('manual')}
              className={`pb-2.5 font-mono font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                importMode === 'manual'
                  ? 'border-[#f59e0b] text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-600" />
              <span>JSON / Manual</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => downloadSampleExcel()}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline pb-2.5"
            title="Baixar planilha de exemplo no formato .xlsx"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar modelo .xlsx</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {importMode === 'file' ? (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .pdf, .json, .csv"
                onChange={handleInputChange}
                className="hidden"
              />

              {/* Drag and Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/20 rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center bg-slate-50/50"
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-3" />
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      Processando arquivo...
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Lendo tabelas e extraindo componentes
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <div className="w-11 h-11 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shadow-xs">
                        <FileText className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm font-mono">
                      Arraste ou clique para selecionar a base de dados
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">
                      Formatos aceitos: <strong>Excel (.xlsx, .xls)</strong>, <strong>PDF (.pdf)</strong>, <strong>JSON</strong> ou <strong>CSV</strong>.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      <span className="px-2.5 py-1 bg-emerald-100/80 text-emerald-800 font-mono font-bold text-[10px] rounded border border-emerald-300">
                        .XLSX (Planilha Excel)
                      </span>
                      <span className="px-2.5 py-1 bg-rose-100/80 text-rose-800 font-mono font-bold text-[10px] rounded border border-rose-300">
                        .PDF (Catálogo / Relatório)
                      </span>
                      <span className="px-2.5 py-1 bg-slate-200 text-slate-700 font-mono font-bold text-[10px] rounded border border-slate-300">
                        .JSON / .CSV
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Parsed Preview Card */}
              {parsedPreview && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold font-mono text-emerald-900 text-xs">
                          {parsedPreview.items.length} itens extraídos com sucesso!
                        </div>
                        <div className="text-[11px] text-emerald-700">
                          Arquivo: <span className="font-mono">{parsedPreview.fileName}</span> ({parsedPreview.fileType.toUpperCase()})
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-600 text-white font-mono font-bold text-xs rounded">
                      Pronto para importar
                    </span>
                  </div>

                  {/* Preview snippet table */}
                  <div className="bg-white border border-emerald-200 rounded overflow-hidden max-h-40 overflow-y-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-100 border-b border-slate-200 font-mono text-[10px] text-slate-600 uppercase">
                        <tr>
                          <th className="p-1.5 pl-2">Código</th>
                          <th className="p-1.5">Descrição</th>
                          <th className="p-1.5">Categoria</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedPreview.items.slice(0, 5).map((it, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-1.5 pl-2 font-mono font-bold text-slate-800 whitespace-nowrap">
                              {it.codigo}
                            </td>
                            <td className="p-1.5 text-slate-600 truncate max-w-xs">
                              {it.descricao}
                            </td>
                            <td className="p-1.5 text-slate-500 whitespace-nowrap">
                              {it.categoria}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedPreview.items.length > 5 && (
                    <div className="text-[10px] text-slate-500 text-center font-mono">
                      + {parsedPreview.items.length - 5} outros itens prontos para inclusão
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-600 leading-relaxed text-xs">
                Insira diretamente um array JSON com os registros técnicos do catálogo.
              </p>
              <textarea
                id="textarea-import-json"
                rows={9}
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setError(null);
                }}
                className="w-full p-3 font-mono text-[11px] bg-slate-900 text-cyan-300 rounded-md border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
                spellCheck={false}
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            id="btn-restore-defaults"
            type="button"
            onClick={() => {
              if (window.confirm('Restaurar o catálogo original completo com todos os itens técnicos de fábrica?')) {
                onRestoreDefaults();
                onClose();
              }
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold font-mono text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
            title="Restaurar catálogo inicial completo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão de Fábrica</span>
          </button>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-mono font-bold text-slate-600 hover:text-slate-800 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-confirm-import-data"
              type="button"
              onClick={handleConfirmImport}
              disabled={loading || (importMode === 'file' && !parsedPreview)}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-mono font-black uppercase tracking-wider rounded-md shadow-xs transition-colors ${
                loading || (importMode === 'file' && !parsedPreview)
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#f59e0b] hover:bg-[#d97706] text-slate-950'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>
                {parsedPreview
                  ? `Importar ${parsedPreview.items.length} Itens`
                  : 'Importar Base'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
