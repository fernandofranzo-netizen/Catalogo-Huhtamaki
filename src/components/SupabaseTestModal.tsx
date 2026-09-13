import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Table,
  Code2,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
  PlusCircle,
  Clock,
  KeyRound
} from 'lucide-react';
import {
  supabase,
  getSupabaseConfigInfo,
  checkSupabaseConnection,
  testSupabaseTableQuery,
  SupabaseTestResult,
  SupabaseConfigInfo
} from '../lib/supabase';

interface SupabaseTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTableName?: string;
}

const COMMON_TABLE_SUGGESTIONS = [
  'items',
  'catalog_items',
  'produtos',
  'catalogo',
  'pecas'
];

export const SupabaseTestModal: React.FC<SupabaseTestModalProps> = ({
  isOpen,
  onClose,
  defaultTableName = 'items',
}) => {
  const [tableName, setTableName] = useState(defaultTableName);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [insertingSample, setInsertingSample] = useState<boolean>(false);
  const [configInfo, setConfigInfo] = useState<SupabaseConfigInfo | null>(null);
  const [authStatus, setAuthStatus] = useState<{ checked: boolean; success: boolean; latencyMs: number; error?: string } | null>(null);
  const [testResult, setTestResult] = useState<SupabaseTestResult | null>(null);
  const [activeTab, setActiveTab] = useState<'table' | 'json'>('table');
  const [copied, setCopied] = useState<boolean>(false);
  const [insertFeedback, setInsertFeedback] = useState<string | null>(null);

  // Executa o diagnóstico completo (ping + busca da tabela)
  const runDiagnostic = useCallback(
    async (targetTable: string = tableName, targetLimit: number = limit) => {
      setLoading(true);
      setInsertFeedback(null);

      // 1. Carrega informações de configuração
      const cfg = getSupabaseConfigInfo();
      setConfigInfo(cfg);

      // 2. Ping de autenticação/sessão
      const auth = await checkSupabaseConnection();
      setAuthStatus({
        checked: true,
        success: auth.success,
        latencyMs: auth.latencyMs,
        error: auth.error,
      });

      // 3. Consulta da tabela especificada
      const queryResult = await testSupabaseTableQuery(targetTable, targetLimit);
      setTestResult(queryResult);
      setLoading(false);
    },
    [tableName, limit]
  );

  // Executa teste automático ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      runDiagnostic(tableName, limit);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Copia o JSON para a área de transferência
  const handleCopyJson = () => {
    if (!testResult?.data) return;
    navigator.clipboard.writeText(JSON.stringify(testResult.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inserir registro de teste simples na tabela (se vazia ou para testar escrita)
  const handleInsertSampleRow = async () => {
    if (!tableName.trim()) return;
    setInsertingSample(true);
    setInsertFeedback(null);

    const testItemPayload = {
      codigo: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      descricao: `Item de Teste de Conexão Supabase - ${new Date().toLocaleTimeString('pt-BR')}`,
      categoria: 'TESTE',
      fabricante: 'Huhtamaki Test Runner',
      localizacao: 'Bancada de Diagnóstico',
      palavrasChave: ['teste', 'supabase', 'diagnostico']
    };

    try {
      const { data, error } = await supabase
        .from(tableName.trim())
        .insert([testItemPayload])
        .select();

      if (error) {
        setInsertFeedback(`Falha ao inserir: ${error.message} (Código: ${error.code})`);
      } else {
        setInsertFeedback(`Sucesso! Registro de teste inserido com sucesso na tabela "${tableName}".`);
        // Recarrega os dados da tabela
        await runDiagnostic(tableName, limit);
      }
    } catch (err: any) {
      setInsertFeedback(`Erro inesperado: ${err?.message || 'Falha de comunicação'}`);
    } finally {
      setInsertingSample(false);
    }
  };

  // Determina o status geral da conexão
  const is100PercentActive = Boolean(
    configInfo?.isConfigured &&
    authStatus?.success &&
    testResult?.success
  );

  const hasConfigError = Boolean(
    !configInfo?.isConfigured ||
    (authStatus?.checked && !authStatus.success)
  );

  const tableColumns = testResult?.data && testResult.data.length > 0
    ? Object.keys(testResult.data[0])
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-5xl my-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com estilo industrial Huhtamaki */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0b1329] border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F78CC] to-[#1A3282] border border-[#3F78CC]/40 text-white shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                  Diagnóstico de Conexão Supabase
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-[#1A3282]/80 text-[#93c5fd] rounded border border-[#3F78CC]/30">
                  PostgreSQL Realtime
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verificação de credenciais, latência em tempo real e busca de dados da tabela
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => runDiagnostic()}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-mono text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
              title="Testar novamente a conexão e recarregar dados"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#3F78CC]' : ''}`} />
              <span className="hidden sm:inline">Atualizar Teste</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Banner Principal */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card de Status Geral */}
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3.5 ${
                loading
                  ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                  : is100PercentActive
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : hasConfigError
                  ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                  : 'bg-amber-50/90 border-amber-300 text-amber-950'
              }`}
            >
              <div className="shrink-0">
                {loading ? (
                  <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
                ) : is100PercentActive ? (
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                ) : hasConfigError ? (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500 text-white shadow-sm">
                    <XCircle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white shadow-sm">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">
                  Status da Conexão
                </div>
                <div className="text-sm font-extrabold tracking-tight">
                  {loading
                    ? 'Testando conexão...'
                    : is100PercentActive
                    ? 'Conexão 100% Ativa'
                    : hasConfigError
                    ? 'Falha nas Credenciais'
                    : 'Atenção na Tabela'}
                </div>
                <div className="text-[11px] text-slate-600">
                  {loading
                    ? 'Consultando servidor do Supabase'
                    : is100PercentActive
                    ? 'API online, autenticada e respondendo'
                    : hasConfigError
                    ? 'Verifique a chave ou URL no .env'
                    : 'Conexão OK, verifique o nome da tabela'}
                </div>
              </div>
            </div>

            {/* Card de Latência */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
                  Tempo de Resposta
                </div>
                <div className="text-base font-extrabold text-slate-900 font-mono">
                  {testResult?.latencyMs ? `${testResult.latencyMs} ms` : authStatus?.latencyMs ? `${authStatus.latencyMs} ms` : '--'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Latência de requisição HTTPS
                </div>
              </div>
            </div>

            {/* Card de Linhas Retornadas */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
                  Registros na Tabela
                </div>
                <div className="text-base font-extrabold text-slate-900 font-mono">
                  {testResult?.count !== undefined ? `${testResult.count} ${testResult.count === 1 ? 'linha' : 'linhas'}` : '--'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {testResult?.tableName ? `Tabela: "${testResult.tableName}"` : 'Aguardando busca'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corpo com Configuração e Busca */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Seção 1: Configurações do Ambiente */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-slate-400">
                <KeyRound className="w-4 h-4 text-[#3F78CC]" />
                <span>Credenciais do Projeto (.env)</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                configInfo?.isConfigured
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                  : 'bg-rose-950/80 text-rose-400 border border-rose-700/50'
              }`}>
                {configInfo?.isConfigured ? 'VARIÁVEIS PRESENTES' : 'CONFIGURAÇÃO INCOMPLETA'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block mb-0.5">VITE_SUPABASE_URL</span>
                <span className="text-slate-200 select-all break-all">
                  {configInfo?.url || 'Não configurada'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block mb-0.5">VITE_SUPABASE_ANON_KEY</span>
                <span className="text-slate-200 select-all break-all">
                  {configInfo?.keyMasked || 'Não configurada'}
                </span>
              </div>
            </div>
          </div>

          {/* Seção 2: Painel de Busca da Tabela */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Consultar Tabela no Supabase
                </h3>
                <p className="text-xs text-slate-500">
                  Informe o nome da tabela que você criou ou deseja validar no seu banco
                </p>
              </div>

              {/* Limite de linhas */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <label htmlFor="select-limit" className="text-xs text-slate-500 font-mono">
                  Limite:
                </label>
                <select
                  id="select-limit"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3F78CC]"
                >
                  <option value={5}>5 linhas</option>
                  <option value={10}>10 linhas</option>
                  <option value={20}>20 linhas</option>
                  <option value={50}>50 linhas</option>
                </select>
              </div>
            </div>

            {/* Input e Ação de Consulta */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runDiagnostic(tableName, limit);
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder="Nome da tabela (ex: items, produtos, catalog_items)..."
                  className="w-full px-4 py-2.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3F78CC] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !tableName.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-extrabold tracking-wider uppercase text-white bg-[#1A3282] hover:bg-[#152763] rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Buscando...' : 'Buscar Dados'}</span>
              </button>
            </form>

            {/* Sugestões de tabelas para 1 clique */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-mono mr-1">
                Tabelas sugeridas:
              </span>
              {COMMON_TABLE_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    setTableName(sug);
                    runDiagnostic(sug, limit);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors ${
                    tableName === sug
                      ? 'bg-[#3F78CC] text-white border-[#3F78CC]'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback de inserção de teste */}
          {insertFeedback && (
            <div
              className={`p-3.5 rounded-xl text-xs font-mono border ${
                insertFeedback.startsWith('Sucesso')
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {insertFeedback}
            </div>
          )}

          {/* Seção 3: Erro / Alerta com orientações amigáveis */}
          {testResult && !testResult.success && (
            <div className="p-5 rounded-xl border border-rose-200 bg-rose-50 text-rose-950 space-y-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-rose-900">
                      Não foi possível buscar os dados da tabela
                    </h4>
                    {testResult.errorCode && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono bg-rose-200 text-rose-800 rounded font-bold">
                        Código: {testResult.errorCode}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-rose-800 font-mono break-all">
                    {testResult.error}
                  </p>

                  {testResult.errorHint && (
                    <div className="mt-3 p-3 rounded-lg bg-white/80 border border-rose-200 text-xs text-slate-800 space-y-1">
                      <span className="font-bold text-rose-900 block font-mono text-[11px] uppercase">
                        Como resolver:
                      </span>
                      <p className="leading-relaxed">{testResult.errorHint}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Seção 4: Resultados da Consulta (Tabela ou JSON) */}
          {testResult && testResult.success && (
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
              {/* Header da Visualização */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700">
                    Dados Retornados da Tabela:
                  </span>
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">
                    {testResult.count} {testResult.count === 1 ? 'registro' : 'registros'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Abas Tabela vs JSON */}
                  <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setActiveTab('table')}
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                        activeTab === 'table'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>Visual Tabela</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('json')}
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                        activeTab === 'json'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>JSON Bruto</span>
                    </button>
                  </div>

                  {/* Copiar JSON */}
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Copiar dados em JSON"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Conteúdo: Se vazio */}
              {testResult.count === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Conexão Ativa! Tabela "{testResult.tableName}" está acessível, mas vazia.
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    A requisição ao Supabase respondeu com status 200 (sucesso). Isso confirma que as credenciais e as permissões de leitura (RLS) estão funcionando perfeitamente!
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleInsertSampleRow}
                      disabled={insertingSample}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded-xl transition-colors shadow-2xs disabled:opacity-50"
                    >
                      <PlusCircle className={`w-4 h-4 ${insertingSample ? 'animate-spin' : ''}`} />
                      <span>{insertingSample ? 'Inserindo...' : 'Inserir Registro de Teste na Tabela'}</span>
                    </button>
                  </div>
                </div>
              ) : activeTab === 'table' ? (
                /* Visualização em Tabela com scroll horizontal suave */
                <div className="overflow-x-auto max-h-[380px]">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead className="sticky top-0 bg-slate-100 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 font-bold uppercase text-[10px] tracking-wider text-slate-400">#</th>
                        {tableColumns.map((col) => (
                          <th key={col} className="py-2.5 px-3 font-bold uppercase text-[10px] tracking-wider text-slate-700">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {testResult.data?.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-slate-400 font-bold">{idx + 1}</td>
                          {tableColumns.map((col) => {
                            const val = row[col];
                            const isObj = typeof val === 'object' && val !== null;
                            const textVal = isObj ? JSON.stringify(val) : String(val ?? '');

                            return (
                              <td key={col} className="py-2.5 px-3 text-slate-700 max-w-xs truncate" title={textVal}>
                                {isObj ? (
                                  <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded">
                                    {Array.isArray(val) ? `[Array: ${val.length}]` : '{Objeto}'}
                                  </span>
                                ) : (
                                  <span>{textVal || <span className="text-slate-300 italic">null</span>}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Visualização JSON Bruto */
                <div className="p-4 bg-slate-950 text-emerald-400 max-h-[380px] overflow-auto font-mono text-xs leading-relaxed">
                  <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer com Ações */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verificação Supabase v2 // Huhtamaki Manutenção</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold font-mono tracking-wider uppercase text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
