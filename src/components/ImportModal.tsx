import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Download,
  Database,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { CatalogItem } from '../types';
import {
  parseExcelDetailed,
  parseCsvDetailed,
  applyMappingToRows,
  mapRowToCatalogItem,
  downloadExcelTemplate,
  downloadCsvTemplate,
  ColumnMapping,
} from '../utils/excelParser';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newItems: CatalogItem[], mode: 'merge' | 'replace') => void;
  onRestoreDefaults: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onRestoreDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'json'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<CatalogItem[] | null>(null);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [warningCount, setWarningCount] = useState<number>(0);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [jsonText, setJsonText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setFileName(null);
    setFileSize(null);
    setParsedItems(null);
    setAvailableColumns([]);
    setRawRows([]);
    setColumnMapping(null);
    setWarningCount(0);
    setShowColumnConfig(false);
    setError(null);
    setJsonText('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const processFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    setFileSize(formatBytes(file.size));

    const lowerName = file.name.toLowerCase();

    try {
      if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const result = parseExcelDetailed(buffer);
        setParsedItems(result.items);
        setAvailableColumns(result.availableColumns);
        setRawRows(result.rawRows);
        setColumnMapping(result.mapping);
        setWarningCount(result.warningCount);
        if (result.warningCount > 0) {
          setShowColumnConfig(true);
        }
      } else if (lowerName.endsWith('.csv')) {
        const text = await file.text();
        const result = parseCsvDetailed(text);
        setParsedItems(result.items);
        setAvailableColumns(result.availableColumns);
        setRawRows(result.rawRows);
        setColumnMapping(result.mapping);
        setWarningCount(result.warningCount);
        if (result.warningCount > 0) {
          setShowColumnConfig(true);
        }
      } else if (lowerName.endsWith('.json')) {
        const text = await file.text();
        const raw = JSON.parse(text);
        if (!Array.isArray(raw)) {
          throw new Error('O arquivo JSON deve conter uma lista (array) de itens.');
        }
        const items: CatalogItem[] = [];
        raw.forEach((r, i) => {
          const item = mapRowToCatalogItem(r, i);
          if (item) items.push(item);
        });
        if (items.length === 0) {
          throw new Error('Nenhum item válido identificado no JSON.');
        }
        setParsedItems(items);
        setAvailableColumns([]);
        setRawRows([]);
        setColumnMapping(null);
        setWarningCount(0);
      } else {
        throw new Error('Formato não suportado. Envie um arquivo .xlsx, .csv ou .json.');
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao processar o arquivo selecionado.');
      setParsedItems(null);
    }
  };

  const handleColumnChange = (field: keyof ColumnMapping, colName: string) => {
    if (!columnMapping || rawRows.length === 0) return;
    const newMapping: ColumnMapping = {
      ...columnMapping,
      [field]: colName === '__NONE__' ? undefined : colName,
    };
    setColumnMapping(newMapping);
    const { items, warningCount: newWarnings } = applyMappingToRows(rawRows, newMapping);
    setParsedItems(items);
    setWarningCount(newWarnings);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset file input value to allow re-upload of same file name
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleProcessJsonText = () => {
    setError(null);
    if (!jsonText.trim()) {
      setError('Por favor, cole os dados em JSON no campo de texto.');
      return;
    }
    try {
      const raw = JSON.parse(jsonText);
      if (!Array.isArray(raw)) {
        setError('O JSON deve ser uma lista (array) de objetos.');
        return;
      }
      const items: CatalogItem[] = [];
      raw.forEach((r, i) => {
        const item = mapRowToCatalogItem(r, i);
        if (item) items.push(item);
      });
      if (items.length === 0) {
        setError('Nenhum item válido identificado no JSON fornecido.');
        return;
      }
      onImport(items, importMode);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'JSON inválido. Verifique a formatação.');
    }
  };

  const handleConfirmImport = () => {
    if (!parsedItems || parsedItems.length === 0) {
      setError('Nenhum item carregado para importação.');
      return;
    }
    onImport(parsedItems, importMode);
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="modal-import-catalog"
        className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-md border border-amber-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-700 uppercase">
                ENTRADA DE DADOS // ATUALIZAÇÃO EM MASSA
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase font-sans">
                IMPORTAR / ATUALIZAR CATÁLOGO
              </h2>
            </div>
          </div>
          <button
            id="btn-close-import-modal"
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-200 bg-white">
          <div className="flex gap-4">
            <button
              id="tab-import-file"
              type="button"
              onClick={() => {
                setActiveTab('file');
                setError(null);
              }}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'file'
                  ? 'border-cyan-600 text-cyan-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Planilha (.xlsx / .csv)</span>
            </button>

            <button
              id="tab-import-json"
              type="button"
              onClick={() => {
                setActiveTab('json');
                setError(null);
              }}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'json'
                  ? 'border-cyan-600 text-cyan-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Texto JSON</span>
            </button>
          </div>

          {/* Download Templates */}
          <div className="flex items-center gap-2 pb-2">
            <button
              id="btn-download-template-xlsx"
              type="button"
              onClick={downloadExcelTemplate}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xs transition-colors cursor-pointer"
              title="Baixar modelo Excel (.xlsx) com colunas prontas"
            >
              <Download className="w-3 h-3 text-emerald-700" />
              <span>Modelo .xlsx</span>
            </button>

            <button
              id="btn-download-template-csv"
              type="button"
              onClick={downloadCsvTemplate}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xs transition-colors cursor-pointer"
              title="Baixar modelo CSV (.csv) com colunas prontas"
            >
              <Download className="w-3 h-3 text-slate-600" />
              <span>Modelo .csv</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'file' ? (
            <>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv, .json"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Drag and Drop Zone */}
              {!parsedItems ? (
                <div
                  id="dropzone-import"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all cursor-pointer select-none text-center ${
                    isDragging
                      ? 'border-cyan-500 bg-cyan-50/60 scale-[1.01]'
                      : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center w-14 h-14 mb-3 rounded-full bg-cyan-100 text-cyan-800 shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>

                  <p className="text-sm font-bold text-slate-800 uppercase">
                    Clique ou arraste o arquivo aqui
                  </p>
                  <p className="mt-1 text-xs text-slate-500 max-w-md">
                    Formatos aceitos:{' '}
                    <span className="font-mono font-bold text-emerald-700">.xlsx</span>,{' '}
                    <span className="font-mono font-bold text-blue-700">.xls</span>,{' '}
                    <span className="font-mono font-bold text-amber-700">.csv</span> ou{' '}
                    <span className="font-mono font-bold text-slate-700">.json</span>
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                      CÓDIGO
                    </span>
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                      DESCRIÇÃO
                    </span>
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                      CATEGORIA
                    </span>
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                      FABRICANTE
                    </span>
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                      LOCALIZAÇÃO
                    </span>
                  </div>
                </div>
              ) : (
                /* File Loaded & Preview Card */
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-md gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950 font-mono">
                          {fileName}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-mono">
                          {fileSize} • {parsedItems.length} itens identificados com sucesso
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={resetState}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline self-start sm:self-auto cursor-pointer"
                    >
                      Escolher outro arquivo
                    </button>
                  </div>

                  {/* Column Mapping Section & Warnings */}
                  {warningCount > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-md text-amber-950 text-xs flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="font-bold text-[11px] tracking-wide uppercase text-amber-900 flex items-center gap-1.5">
                          <span>Atenção: Validação de Descrição dos Itens</span>
                          <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-xs text-[10px]">
                            {warningCount} item(ns)
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-snug">
                          Identificamos que alguns itens na planilha estão sem descrição ou com a descrição repetindo o código.
                          Selecione abaixo qual coluna da planilha contém o texto descritivo real (ex: <em>Texto Breve</em>, <em>Denominação</em>, <em>Descrição Técnica</em> ou <em>Produto</em>).
                        </p>
                      </div>
                    </div>
                  )}

                  {availableColumns.length > 0 && columnMapping && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-slate-700 uppercase">
                          <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Mapeamento de Colunas da Planilha</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowColumnConfig(!showColumnConfig)}
                          className="text-[11px] font-mono font-bold text-cyan-700 hover:text-cyan-900 underline cursor-pointer"
                        >
                          {showColumnConfig ? 'Recolher Ajustes' : 'Ajustar Colunas Selecionadas'}
                        </button>
                      </div>

                      {showColumnConfig ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-200 text-xs font-mono">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Coluna de Código (Material / P/N) *
                            </label>
                            <select
                              value={columnMapping.codigoCol}
                              onChange={(e) => handleColumnChange('codigoCol', e.target.value)}
                              className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            >
                              {availableColumns.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-cyan-800 uppercase mb-1 flex items-center justify-between">
                              <span>Coluna de Descrição (Texto Breve) *</span>
                              <span className="text-[9px] bg-cyan-100 text-cyan-800 px-1 py-0.2 rounded font-sans">
                                Campo Principal
                              </span>
                            </label>
                            <select
                              value={columnMapping.descricaoCol}
                              onChange={(e) => handleColumnChange('descricaoCol', e.target.value)}
                              className="w-full text-xs p-1.5 bg-white border-2 border-cyan-500 rounded font-mono text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-cyan-600"
                            >
                              {availableColumns.map((col) => (
                                <option key={col} value={col}>
                                  {col} {col === columnMapping.codigoCol ? '(Mesma do Código - Evitar)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Coluna de Categoria / Grupo
                            </label>
                            <select
                              value={columnMapping.categoriaCol || '__NONE__'}
                              onChange={(e) => handleColumnChange('categoriaCol', e.target.value)}
                              className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                            >
                              <option value="__NONE__">— Não mapear (Usar 'OUTROS') —</option>
                              {availableColumns.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Coluna de Fabricante / Marca
                            </label>
                            <select
                              value={columnMapping.fabricanteCol || '__NONE__'}
                              onChange={(e) => handleColumnChange('fabricanteCol', e.target.value)}
                              className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                            >
                              <option value="__NONE__">— Opcional —</option>
                              {availableColumns.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Coluna de Dimensões / Medidas
                            </label>
                            <select
                              value={columnMapping.dimensaoCol || '__NONE__'}
                              onChange={(e) => handleColumnChange('dimensaoCol', e.target.value)}
                              className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                            >
                              <option value="__NONE__">— Opcional —</option>
                              {availableColumns.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Coluna de Localização / Almoxarifado
                            </label>
                            <select
                              value={columnMapping.localizacaoCol || '__NONE__'}
                              onChange={(e) => handleColumnChange('localizacaoCol', e.target.value)}
                              className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                            >
                              <option value="__NONE__">— Opcional —</option>
                              {availableColumns.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] font-mono text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 bg-white p-2 border border-slate-200 rounded">
                          <div>
                            <span className="text-slate-400">Código:</span>{' '}
                            <strong className="text-slate-800">{columnMapping.codigoCol}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400">Descrição:</span>{' '}
                            <strong className="text-cyan-800">{columnMapping.descricaoCol}</strong>
                          </div>
                          {columnMapping.categoriaCol && (
                            <div>
                              <span className="text-slate-400">Categoria:</span>{' '}
                              <strong className="text-slate-800">{columnMapping.categoriaCol}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode Selector */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                    <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                      COMO DESEJA ATUALIZAR O BANCO DE DADOS?
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label
                        className={`flex items-start gap-2.5 p-2.5 border rounded-xs cursor-pointer transition-all ${
                          importMode === 'merge'
                            ? 'bg-amber-50/60 border-amber-400 text-amber-950'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          value="merge"
                          checked={importMode === 'merge'}
                          onChange={() => setImportMode('merge')}
                          className="mt-0.5 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                          <div className="text-xs font-bold uppercase">
                            Mesclar / Atualizar (Recomendado)
                          </div>
                          <div className="text-[10.5px] text-slate-500 leading-tight mt-0.5">
                            Atualiza os itens existentes com o mesmo código e adiciona novos itens.
                          </div>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-2.5 p-2.5 border rounded-xs cursor-pointer transition-all ${
                          importMode === 'replace'
                            ? 'bg-rose-50/60 border-rose-400 text-rose-950'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="mt-0.5 text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <div className="text-xs font-bold uppercase text-rose-900">
                            Substituir Catálogo Completo
                          </div>
                          <div className="text-[10.5px] text-slate-500 leading-tight mt-0.5">
                            Apaga os itens atuais e grava exclusivamente os itens desta planilha.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Data Preview Table */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5 px-0.5">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                        PRÉ-VISUALIZAÇÃO DOS DADOS (PRIMEIROS ITENS)
                      </span>
                      <span className="text-[10px] font-mono text-cyan-700 font-bold">
                        TOTAL: {parsedItems.length} ITENS
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-md overflow-x-auto bg-white max-h-48">
                      <table className="w-full text-left text-[11px] font-mono">
                        <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                          <tr>
                            <th className="p-2">CÓDIGO</th>
                            <th className="p-2">DESCRIÇÃO</th>
                            <th className="p-2">CATEGORIA</th>
                            <th className="p-2">FABRICANTE</th>
                            <th className="p-2">LOCAL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {parsedItems.slice(0, 6).map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="p-2 font-bold text-slate-900 whitespace-nowrap">
                                {item.codigo}
                              </td>
                              <td className="p-2 text-slate-700 max-w-xs truncate">
                                {item.descricao}
                              </td>
                              <td className="p-2 text-cyan-800 whitespace-nowrap">
                                {item.categoria}
                              </td>
                              <td className="p-2 text-slate-600 whitespace-nowrap">
                                {item.fabricante || '—'}
                              </td>
                              <td className="p-2 text-slate-600 whitespace-nowrap">
                                {item.localizacao || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {parsedItems.length > 6 && (
                      <p className="mt-1 text-[10px] text-slate-400 font-mono text-right">
                        + {parsedItems.length - 6} outros itens serão importados...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* JSON Tab */
            <div className="space-y-3">
              <p className="text-slate-600 text-xs">
                Cole uma lista JSON contendo objetos com os campos{' '}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">codigo</code>,{' '}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">descricao</code>,{' '}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">categoria</code>.
              </p>

              <textarea
                id="textarea-import-json"
                rows={9}
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setError(null);
                }}
                placeholder={`[\n  {\n    "codigo": "MM-REPOS-00999-00",\n    "descricao": "ROLAMENTO AUTOCOMPENSADOR SKF 22210",\n    "categoria": "ROLAMENTOS",\n    "fabricante": "SKF",\n    "dimensao": "50 x 90 x 23mm"\n  }\n]`}
                className="w-full p-3 font-mono text-[11px] bg-slate-900 text-cyan-300 rounded-md border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
                spellCheck={false}
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              id="btn-restore-defaults"
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Deseja restaurar o catálogo padrão de fábrica original com todos os itens técnicos e fotos?'
                  )
                ) {
                  onRestoreDefaults();
                  handleClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xs transition-colors cursor-pointer"
              title="Restaurar catálogo inicial completo com itens originais"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão de Fábrica</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              id="btn-cancel-import"
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            {activeTab === 'file' ? (
              <button
                id="btn-confirm-import-file"
                type="button"
                disabled={!parsedItems || parsedItems.length === 0}
                onClick={handleConfirmImport}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xs shadow-xs transition-all cursor-pointer ${
                  parsedItems && parsedItems.length > 0
                    ? 'bg-[#f59e0b] hover:bg-[#d97706] text-slate-950'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>
                  {parsedItems && parsedItems.length > 0
                    ? `Importar ${parsedItems.length} Itens`
                    : 'Selecione uma Planilha'}
                </span>
              </button>
            ) : (
              <button
                id="btn-confirm-import-json"
                type="button"
                onClick={handleProcessJsonText}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded-xs shadow-xs transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Processar JSON</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
