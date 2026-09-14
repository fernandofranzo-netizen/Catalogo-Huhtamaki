import { CatalogItem } from '../types';
import catalogData from './catalogItems.json';

export const CONSUMO_GERAL_CATEGORIAS = [
  'MATERIAL AUXILIAR DE PRODUÇÃO',
  'MATERIAL DE EMBALAGENS',
  'MATERIAIS DE ESCRITÓRIO',
  'MATERIAIS DE LIMPEZA',
  'MATERIAIS DE SEGURANÇA',
  'MATERIAIS DE USO/CONSUMO',
  'MATERIAIS DIVERSOS',
  'UNIFORMES',
] as const;

export const CONSUMO_MANUTENCAO_CATEGORIAS = [
  'MATERIAL ELÉTRICO',
  'MATERIAL MECÂNICO',
  'UTILITES-GÁS',
] as const;

export const OUTRAS_CATEGORIAS = [] as const;

export const CATEGORIAS_PADRAO = [
  'TODOS',
  ...CONSUMO_GERAL_CATEGORIAS,
  ...CONSUMO_MANUTENCAO_CATEGORIAS,
] as const;

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = (catalogData as CatalogItem[]).map((item) => ({
  ...item,
  categoria: item.categoria === 'MATERIAL DIVERSO' ? 'MATERIAIS DIVERSOS' : item.categoria,
}));
