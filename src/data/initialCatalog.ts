import { CatalogItem } from '../types';
import catalogData from './catalogItems.json';

export const CATEGORIAS_PADRAO = [
  'TODOS',
  'MATERIAL AUXILIAR DE PRODUÇÃO',
  'MATERIAL DE EMBALAGENS',
  'MATERIAIS DE ESCRITÓRIO',
  'MATERIAIS DE LIMPEZA',
  'MATERIAL DIVERSO',
  'MATERIAL ELÉTRICO',
  'MATERIAL MECÂNICO',
] as const;

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = catalogData as CatalogItem[];
