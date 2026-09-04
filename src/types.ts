export interface TechnicalDocument {
  id: string;
  nome: string;
  tipo: 'datasheet' | 'manual' | 'desenho' | 'certificado' | 'outro';
  url: string;
  dataUpload?: string;
  tamanho?: string;
}

export interface CatalogItem {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  fabricante?: string;
  dimensao?: string;
  localizacao?: string;
  palavrasChave: string[];
  imagemUrl?: string;
  favorito?: boolean;
  status?: 'disponivel' | 'baixo_estoque' | 'em_revisao';
  observacoes?: string;
  documentos?: TechnicalDocument[];
  dataCriacao?: string;
}

export type ViewMode = 'catalog' | 'detail' | 'admin';

export type UserRole = 'manutentor' | 'gestor';

export interface CatalogStats {
  totalItens: number;
  semFoto: number;
  categoriasAtivas: number;
}
