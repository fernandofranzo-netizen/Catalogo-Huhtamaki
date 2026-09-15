import { CatalogItem } from '../types';
import catalogData from './catalogItems.json';

export const CONSUMO_GERAL_CATEGORIAS = [
  'MATERIAL AUXILIAR DE PRODUÇÃO',
  'MATERIAL DE EMBALAGENS',
  'MATERIAIS DE ESCRITÓRIO',
  'MATERIAIS DE LIMPEZA',
  'MATERIAIS DE SEGURANÇA',
  'MATERIAL DE USO/CONSUMO',
  'MATERIAIS DIVERSOS',
  'UNIFORMES',
] as const;

export const CONSUMO_MANUTENCAO_CATEGORIAS = [
  'MATERIAL ELÉTRICO',
  'MATERIAL MECÂNICO',
  'UTILITIES-GAS',
] as const;

export const CATEGORIAS_PADRAO = [
  'TODOS',
  ...CONSUMO_GERAL_CATEGORIAS,
  ...CONSUMO_MANUTENCAO_CATEGORIAS,
] as const;

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = (catalogData as CatalogItem[]).map((item) => {
  let cat = item.categoria;
  if (cat === 'MATERIAL DIVERSO') cat = 'MATERIAIS DIVERSOS';
  if (cat === 'MATERIAIS DE USO/CONSUMO') cat = 'MATERIAL DE USO/CONSUMO';
  if (cat === 'UTILITES-GÁS' || cat === 'UTILITIES-GÁS' || cat === 'UTILITIES GÁS' || cat === 'UTILITIES GAS') {
    cat = 'UTILITIES-GAS';
  }
  return {
    ...item,
    categoria: cat,
  };
});
