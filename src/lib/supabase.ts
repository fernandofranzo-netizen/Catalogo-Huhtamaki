import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram encontradas. Verifique seu arquivo .env na raiz do projeto.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export interface SupabaseConfigInfo {
  url: string;
  isConfigured: boolean;
  keyLength: number;
  keyMasked: string;
}

export function getSupabaseConfigInfo(): SupabaseConfigInfo {
  const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
  const keyLength = supabaseAnonKey ? supabaseAnonKey.length : 0;
  const keyMasked = supabaseAnonKey
    ? `${supabaseAnonKey.slice(0, 12)}...${supabaseAnonKey.slice(-6)}`
    : 'Não configurada';

  return {
    url: supabaseUrl || 'Não configurada',
    isConfigured,
    keyLength,
    keyMasked,
  };
}

export interface SupabaseTestResult {
  success: boolean;
  latencyMs: number;
  data: any[] | null;
  count: number;
  error?: string;
  errorCode?: string;
  errorHint?: string;
  tableName: string;
}

/**
 * Função utilitária para testar a conexão básica com o Supabase.
 */
export async function checkSupabaseConnection(): Promise<{ success: boolean; error?: string; latencyMs: number }> {
  const start = performance.now();
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        error: 'Credenciais do Supabase ausentes no arquivo .env (VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY)',
        latencyMs: 0,
      };
    }

    const { error } = await supabase.auth.getSession();
    const duration = Math.round(performance.now() - start);

    if (error) {
      return { success: false, error: error.message, latencyMs: duration };
    }

    return { success: true, latencyMs: duration };
  } catch (err: any) {
    const duration = Math.round(performance.now() - start);
    return {
      success: false,
      error: err?.message || 'Falha ao conectar ao Supabase',
      latencyMs: duration,
    };
  }
}

/**
 * Busca dados de uma tabela específica no Supabase e mede latência e status detalhado.
 */
export async function testSupabaseTableQuery(
  tableName: string,
  limit: number = 10
): Promise<SupabaseTestResult> {
  const cleanTable = tableName.trim();
  const start = performance.now();

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      latencyMs: 0,
      data: null,
      count: 0,
      tableName: cleanTable,
      error: 'VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configuradas no .env',
      errorCode: 'MISSING_ENV',
      errorHint: 'Adicione suas credenciais no arquivo .env na raiz do projeto e reinicie o Vite.',
    };
  }

  if (!cleanTable) {
    return {
      success: false,
      latencyMs: 0,
      data: null,
      count: 0,
      tableName: '',
      error: 'Nome da tabela não informado',
      errorCode: 'EMPTY_TABLE_NAME',
      errorHint: 'Digite o nome de uma tabela criada no Supabase (ex: items, catalog_items, produtos).',
    };
  }

  try {
    const { data, error, status, statusText } = await supabase
      .from(cleanTable)
      .select('*')
      .limit(limit);

    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      let hint = error.hint || '';
      if (error.code === '42P01') {
        hint = `A tabela "${cleanTable}" não existe no schema public do banco de dados. Verifique o nome ou crie a tabela no Table Editor do Supabase.`;
      } else if (
        error.code === '42501' ||
        error.message?.toLowerCase().includes('row-level security') ||
        error.message?.toLowerCase().includes('permission denied')
      ) {
        hint = `Políticas de segurança RLS (Row Level Security) ativas na tabela "${cleanTable}" sem permissão de leitura pública (SELECT) para a role anon. Adicione uma RLS Policy permitindo SELECT.`;
      } else if (error.message?.toLowerCase().includes('api key') || status === 401) {
        hint = 'A chave anon (VITE_SUPABASE_ANON_KEY) está inválida ou expirou. Obtenha a chave pública no dashboard do Supabase (Project Settings > API).';
      }

      return {
        success: false,
        latencyMs,
        data: null,
        count: 0,
        tableName: cleanTable,
        error: error.message || statusText || 'Erro desconhecido ao consultar tabela',
        errorCode: error.code || String(status),
        errorHint: hint,
      };
    }

    return {
      success: true,
      latencyMs,
      data: data || [],
      count: Array.isArray(data) ? data.length : 0,
      tableName: cleanTable,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      success: false,
      latencyMs,
      data: null,
      count: 0,
      tableName: cleanTable,
      error: err?.message || 'Falha na requisição de rede com o Supabase',
      errorCode: 'NETWORK_ERROR',
      errorHint: 'Verifique sua conexão com a internet e se a URL do projeto Supabase está acessível.',
    };
  }
}

export interface UpsertResult {
  success: boolean;
  totalUpserted: number;
  totalFailed: number;
  batchesCount: number;
  errors: string[];
}

/**
 * Salva ou atualiza (upsert) registros de produtos em lote na tabela do Supabase.
 */
export async function upsertCatalogItemsToSupabase(
  tableName: string,
  items: Record<string, any>[],
  options?: {
    batchSize?: number;
    onConflict?: string;
    onProgress?: (progress: { current: number; total: number; percent: number }) => void;
  }
): Promise<UpsertResult> {
  const cleanTable = tableName.trim();
  const batchSize = options?.batchSize || 50;
  const onConflict = options?.onConflict || 'codigo';
  const total = items.length;

  if (!cleanTable) {
    return {
      success: false,
      totalUpserted: 0,
      totalFailed: total,
      batchesCount: 0,
      errors: ['Nome da tabela do Supabase não foi informado.'],
    };
  }

  if (total === 0) {
    return {
      success: true,
      totalUpserted: 0,
      totalFailed: 0,
      batchesCount: 0,
      errors: [],
    };
  }

  let totalUpserted = 0;
  let totalFailed = 0;
  let batchesCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < total; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    batchesCount++;

    try {
      // 1. Tenta fazer upsert com a coluna de conflito informada
      let { error } = await supabase
        .from(cleanTable)
        .upsert(batch, { onConflict, ignoreDuplicates: false });

      // Se falhar por falta de constraint única na coluna (código 42P10), tenta upsert padrão
      if (error && (error.code === '42P10' || error.message?.toLowerCase().includes('conflict') || error.message?.toLowerCase().includes('constraint'))) {
        const fallback = await supabase.from(cleanTable).upsert(batch);
        error = fallback.error;
      }

      // Se ainda falhar, tenta insert direto se for tabela simples
      if (error && (error.code === 'PGRST100' || error.message?.toLowerCase().includes('primary key'))) {
        const insertAttempt = await supabase.from(cleanTable).insert(batch);
        error = insertAttempt.error;
      }

      if (error) {
        totalFailed += batch.length;
        errors.push(`Lote ${batchesCount} (${batch.length} itens): ${error.message} (Código: ${error.code})`);
      } else {
        totalUpserted += batch.length;
      }
    } catch (err: any) {
      totalFailed += batch.length;
      errors.push(`Lote ${batchesCount}: ${err?.message || 'Erro inesperado na requisição'}`);
    }

    if (options?.onProgress) {
      const current = Math.min(i + batchSize, total);
      options.onProgress({
        current,
        total,
        percent: Math.round((current / total) * 100),
      });
    }
  }

  return {
    success: totalFailed === 0,
    totalUpserted,
    totalFailed,
    batchesCount,
    errors,
  };
}


