import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram encontradas. Verifique seu arquivo .env na raiz do projeto.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Função utilitária para testar a conexão com o Supabase.
 */
export async function checkSupabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        error: 'Credenciais do Supabase ausentes no arquivo .env',
      };
    }

    // Faz um ping leve para validar autenticação e conectividade com a API
    const { error } = await supabase.auth.getSession();
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Falha ao conectar ao Supabase',
    };
  }
}
