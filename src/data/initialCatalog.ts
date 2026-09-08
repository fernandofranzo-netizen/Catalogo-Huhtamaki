import { CatalogItem } from '../types';
import catalogData from './catalogItems.json';

export const CATEGORIAS_PADRAO = [
  'TODOS',
  'AUTOMAÇÃO E CONTROLE',
  'CABOS E CONECTORES',
  'COMANDO E SINALIZAÇÃO',
  'FERRAMENTAS E UTENSÍLIOS',
  'FILTROS E LUBRIFICAÇÃO',
  'FIXAÇÃO',
  'FONTES E ELETRÔNICA',
  'FUSÍVEIS E PROTEÇÃO ELÉTRICA',
  'GASES E CONSUMÍVEIS',
  'HIDRÁULICA',
  'ILUMINAÇÃO ELÉTRICA',
  'MOTORES E TRANSMISSÃO',
  'ÓLEOS E CONSUMÍVEIS',
  'PNEUMÁTICA',
  'ROLAMENTOS',
  'SEGURANÇA E ACESSÓRIOS',
  'SENSORES E INSTRUMENTAÇÃO',
  'VEDAÇÃO',
  'OUTROS / REPOSIÇÃO',
] as const;

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = catalogData as CatalogItem[];
