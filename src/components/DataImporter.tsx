import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  FileText,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Table,
  Code2,
  Download,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info,
  Server
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { CatalogItem } from '../types';
import { parseExcelFile, parsePdfFile, downloadSampleExcel } from '../utils/importer';
import {
  supabase,
  upsertCatalogItemsToSupabase,
  UpsertResult,
  getSupabaseConfigInfo
} from '../lib/supabase';

interface DataImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (importedItems: CatalogItem[]) => void;
  defaultTableName?: string;
}

const COMMON_TABLES = ['items', 'produtos', 'catalog_items', 'pecas'];

export const DataImporter: React.FC<DataImporterProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  defaultTableName = 'items',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'xlsx' | 'csv' | 'pdf' | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<CatalogItem[]>([]);

  // Configurações de envio ao Supabase
  const [tableName, setTableName] = useState(defaultTableName);
  const [conflictColumn, setConflictColumn] = useState<'codigo' | 'id'>('codigo');
  const [syncLocalCatalog, setSyncLocalCatalog] = useState(true);

  // Status de execução do Upsert
  const [isUpserting, setIsUpserting] = useState(false);
  const [upsertProgress, setUpsertProgress] = useState<{ current: number; total: number; percent: number }>({
    current: 0,
    total: 0,
    percent: 0,
  });
  const [upsertResult, setUpsertResult] = useState<UpsertResult | null>(null);
  const [activeTab, setActiveTab] = useState<'table' | 'json'>('table');
  const [jsonCopied, setJsonCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const configInfo = getSupabaseConfigInfo();

  if (!isOpen) return null;

  // Processa o arquivo selecionado
  const processFile = async (selectedFile: File) => {
    setParseError(null);
    setParsing(true);
    setParsedItems([]);
    setUpsertResult(null);

    const name = selectedFile.name.toLowerCase();
    let detectedType: 'xlsx' | 'csv' | 'pdf' | null = null;

    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      detectedType = 'xlsx';
    } else if (name.endsWith('.csv')) {
      detectedType = 'csv';
    } else if (name.endsWith('.pdf')) {
      detectedType = 'pdf';
    } else {
      setParseError('Formato não suportado. Selecione um arquivo Excel (.xlsx, .xls), CSV (.csv) ou PDF (.pdf).');
      setParsing(false);
      return;
    }

    setFile(selectedFile);
    setFileType(detectedType);

    try {
      const buffer = await selectedFile.arrayBuffer();
      let items: CatalogItem[] = [];

      if (detectedType === 'xlsx' || detectedType === 'csv') {
        items = parseExcelFile(buffer);
      } else if (detectedType === 'pdf') {
        items = await parsePdfFile(buffer);
      }

      if (!items || items.length === 0) {
        throw new Error('Nenhum item válido com código ou descrição foi encontrado no arquivo.');
      }

      setParsedItems(items);
    } catch (err: any) {
      setParseError(err?.message || 'Falha ao processar o arquivo selecionado.');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Dispara o Upsert dos dados no Supabase
  const handleExecuteUpsert = async () => {
    if (!tableName.trim() || parsedItems.length === 0) return;

    setIsUpserting(true);
    setUpsertResult(null);
    setUpsertProgress({ current: 0, total: parsedItems.length, percent: 0 });

    // Prepara payload em formato compatível com banco
    const payload = parsedItems.map((item) => ({
      id: item.id,
      codigo: item.codigo,
      descricao: item.descricao,
      categoria: item.categoria,
      fabricante: item.fabricante || null,
      dimensao: item.dimensao || null,
      localizacao: item.localizacao || null,
      palavras_chave: item.palavrasChave || [],
      palavrasChave: item.palavrasChave || [],
      imagem_url: item.imagemUrl || null,
      imagemUrl: item.imagemUrl || null,
      status: item.status || 'disponivel',
      data_criacao: item.dataCriacao || new Date().toISOString().split('T')[0],
      dataCriacao: item.dataCriacao || new Date().toISOString().split('T')[0],
    }));

    try {
      const result = await upsertCatalogItemsToSupabase(tableName.trim(), payload, {
        batchSize: 50,
        onConflict: conflictColumn,
        onProgress: (p) => setUpsertProgress(p),
      });

      setUpsertResult(result);

      // Se configurado, sincroniza com o catálogo local do sistema
      if (result.totalUpserted > 0 && syncLocalCatalog && onImportSuccess) {
        onImportSuccess(parsedItems);
      }
    } catch (err: any) {
      setUpsertResult({
        success: false,
        totalUpserted: 0,
        totalFailed: parsedItems.length,
        batchesCount: 1,
        errors: [err?.message || 'Erro inesperado na comunicação com o Supabase'],
      });
    } finally {
      setIsUpserting(false);
    }
  };

  const handleCopyJson = () => {
    if (parsedItems.length === 0) return;
    navigator.clipboard.writeText(JSON.stringify(parsedItems, null, 2));
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const handleReset = () => {
    setFile(null);
    setFileType(null);
    setParsedItems([]);
    setParseError(null);
    setUpsertResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-5xl my-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header no padrão industrial Huhtamaki */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0b1329] border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F78CC] to-[#1A3282] border border-[#3F78CC]/40 text-white shadow-md">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                  Importador de Dados para Supabase
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-[#1A3282] text-[#93c5fd] rounded border border-[#3F78CC]/30">
                  DataImporter // XLSX • CSV • PDF
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transformação automática de planilhas para JSON e sincronização em lote (upsert) no banco
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fechar modal de importação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações da Conexão Supabase */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Server className="w-3.5 h-3.5 text-[#3F78CC]" />
            <span>Destino Supabase:</span>
            <span className="text-[#93c5fd] font-semibold">{configInfo.url}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${configInfo.isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className={configInfo.isConfigured ? 'text-emerald-400' : 'text-rose-400'}>
              {configInfo.isConfigured ? 'Pronto para Gravação' : 'Credenciais Ausentes (.env)'}
            </span>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Seção 1: Área de Upload */}
          {!parsedItems.length ? (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  parsing
                    ? 'border-[#3F78CC] bg-blue-50/50'
                    : 'border-slate-300 hover:border-[#3F78CC] bg-slate-50 hover:bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv, .pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processFile(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 text-[#1A3282] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {parsing ? (
                    <RefreshCw className="w-8 h-8 text-[#3F78CC] animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-8 h-8" />
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-800">
                  {parsing
                    ? 'Lendo planilha e convertendo dados...'
                    : 'Arraste sua planilha ou clique para selecionar'}
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                  Formatos aceitos: <strong>.XLSX</strong>, <strong>.XLS</strong>, <strong>.CSV</strong> ou <strong>.PDF</strong> (catálogo com códigos e descrições)
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-mono font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-2xs">
                    Colunas automáticas: Código, Descrição, Categoria, Fabricante, Dimensão, Localização
                  </span>
                </div>
              </div>

              {/* Botão de download do modelo de exemplo */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Info className="w-4 h-4 text-[#3F78CC] shrink-0" />
                  <span>Deseja testar com um modelo pronto? Baixe nossa planilha padrão (.xlsx).</span>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleExcel}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-[#1A3282] hover:text-[#152763] bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors shrink-0 font-mono shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Modelo Excel</span>
                </button>
              </div>

              {/* Mensagem de erro de parsing */}
              {parseError && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block mb-0.5">Erro ao ler o arquivo:</span>
                    <p>{parseError}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Seção 2: Visualização dos dados e Configuração de Upsert */
            <div className="space-y-5">
              {/* Card Resumo do Arquivo */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-[#1A3282]">
                    {fileType === 'pdf' ? <FileText className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 font-mono">
                        {file?.name}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-800 rounded">
                        {fileType?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      <strong>{parsedItems.length}</strong> produtos transformados com sucesso em JSON
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 text-xs font-mono font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Trocar Arquivo
                  </button>
                </div>
              </div>

              {/* Configurações do Upsert Supabase */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#3F78CC]" />
                    <span>Configuração do Destino no Supabase</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    Ação: <strong>UPSERT</strong> (Insere novos ou atualiza existentes)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome da Tabela */}
                  <div>
                    <label className="text-xs font-mono font-medium text-slate-700 block mb-1">
                      Tabela de Produtos no Supabase:
                    </label>
                    <input
                      type="text"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      placeholder="Ex: items, produtos..."
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3F78CC]"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-mono">Tabelas rápidas:</span>
                      {COMMON_TABLES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTableName(t)}
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                            tableName === t ? 'bg-[#3F78CC] text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chave de Conflito (onConflict) */}
                  <div>
                    <label className="text-xs font-mono font-medium text-slate-700 block mb-1">
                      Coluna para identificar duplicados (onConflict):
                    </label>
                    <select
                      value={conflictColumn}
                      onChange={(e) => setConflictColumn(e.target.value as 'codigo' | 'id')}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3F78CC]"
                    >
                      <option value="codigo">código do item (Recomendado)</option>
                      <option value="id">id primário (UUID / String)</option>
                    </select>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      Se o código já existir na tabela, os dados serão atualizados em vez de duplicados.
                    </span>
                  </div>
                </div>

                {/* Checkbox de sincronização local */}
                <label className="flex items-center gap-2 text-xs text-slate-700 font-mono cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={syncLocalCatalog}
                    onChange={(e) => setSyncLocalCatalog(e.target.checked)}
                    className="rounded border-slate-300 text-[#3F78CC] focus:ring-[#3F78CC]"
                  />
                  <span>Sincronizar também o catálogo da aplicação imediatamente após o envio</span>
                </label>
              </div>

              {/* Abas de Prévia: Tabela vs JSON */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700">
                      Pré-visualização da Transformação ({parsedItems.length} registros)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setActiveTab('table')}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          activeTab === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Table className="w-3.5 h-3.5" />
                        <span>Visual Tabela</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('json')}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          activeTab === 'json' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>JSON Transformado</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Copiar JSON transformado"
                    >
                      {jsonCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{jsonCopied ? 'Copiado!' : 'Copiar JSON'}</span>
                    </button>
                  </div>
                </div>

                {activeTab === 'table' ? (
                  <div className="overflow-x-auto max-h-[280px]">
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead className="sticky top-0 bg-slate-100 text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 font-bold uppercase text-[10px] text-slate-400">#</th>
                          <th className="py-2.5 px-3 font-bold uppercase text-[10px] text-slate-700">Código</th>
                          <th className="py-2.5 px-3 font-bold uppercase text-[10px] text-slate-700">Descrição</th>
                          <th className="py-2.5 px-3 font-bold uppercase text-[10px] text-slate-700">Categoria</th>
                          <th className="py-2.5 px-3 font-bold uppercase text-[10px] text-slate-700">Fabricante</th>
                          <th className="py-2.5 px-3 font-bold uppercase text-[10px] text-slate-700">Localização</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedItems.slice(0, 30).map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2 px-3 text-slate-400 font-bold">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-[#1A3282]">{item.codigo}</td>
                            <td className="py-2 px-3 text-slate-800 max-w-xs truncate" title={item.descricao}>
                              {item.descricao}
                            </td>
                            <td className="py-2 px-3 text-slate-600">{item.categoria}</td>
                            <td className="py-2 px-3 text-slate-500">{item.fabricante || '-'}</td>
                            <td className="py-2 px-3 text-slate-500">{item.localizacao || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedItems.length > 30 && (
                      <div className="p-2 text-center text-[11px] font-mono text-slate-400 bg-slate-50 border-t border-slate-100">
                        ...e mais {parsedItems.length - 30} itens na planilha (todos serão enviados).
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 text-emerald-400 max-h-[280px] overflow-auto font-mono text-xs leading-relaxed">
                    <pre>{JSON.stringify(parsedItems.slice(0, 10), null, 2)}</pre>
                    {parsedItems.length > 10 && (
                      <div className="text-slate-500 italic mt-2">
                        // ... exibindo amostra de 10 de {parsedItems.length} registros
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Progresso de Envio */}
              {isUpserting && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-blue-900 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#3F78CC]" />
                      <span>Gravando no Supabase em lotes...</span>
                    </span>
                    <span className="text-blue-800 font-extrabold">
                      {upsertProgress.current} de {upsertProgress.total} ({upsertProgress.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#3F78CC] to-[#1A3282] transition-all duration-300"
                      style={{ width: `${upsertProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Resultado do Upsert */}
              {upsertResult && (
                <div
                  className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
                    upsertResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : upsertResult.totalUpserted > 0
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {upsertResult.success ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Sincronização Concluída com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        <span>Sincronização com Alertas</span>
                      </>
                    )}
                  </div>

                  <p>
                    Foram salvos/atualizados <strong>{upsertResult.totalUpserted}</strong> de <strong>{parsedItems.length}</strong> produtos na tabela <strong>"{tableName}"</strong> do Supabase.
                  </p>

                  {upsertResult.errors.length > 0 && (
                    <div className="mt-2 p-2.5 bg-white/80 rounded-lg border border-rose-200 text-rose-900 space-y-1">
                      <span className="font-bold block">Detalhes dos erros reportados pelo Supabase:</span>
                      {upsertResult.errors.map((err, i) => (
                        <div key={i} className="text-[11px] font-mono">
                          • {err}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer com Ações */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Supabase Upsert Engine // Catalogo-Huhtamaki</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
            >
              Fechar
            </button>

            {parsedItems.length > 0 && (
              <button
                type="button"
                onClick={handleExecuteUpsert}
                disabled={isUpserting || !tableName.trim()}
                className="flex items-center gap-2 px-5 py-2 text-xs font-extrabold font-mono tracking-wider uppercase text-white bg-gradient-to-r from-[#3F78CC] to-[#1A3282] hover:from-[#3262a8] hover:to-[#152763] rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {isUpserting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gravando ({upsertProgress.percent}%)...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Salvar no Supabase (Upsert {parsedItems.length} Itens)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
