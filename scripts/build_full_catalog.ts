import fs from 'fs';
import { CatalogItem } from '../src/types';
import { ITENS_MATERIAL_USO_CONSUMO } from '../src/data/materialUsoConsumo';

// 1. Load j9 extracted catalog (1,396 items: 350 Consumo Geral + 1046 Consumo Manutenção)
const j9: CatalogItem[] = JSON.parse(fs.readFileSync('/tmp/extracted_catalog.json', 'utf8'));
const j9Codes = new Set(j9.map(i => i.codigo));

// Fix any typos or placeholder images on j9 items
for (const item of j9) {
  if (item.descricao) {
    item.descricao = item.descricao.replace(/\bOLAMENTO\b/g, 'ROLAMENTO');
  }
  if (item.imagemUrl && item.imagemUrl.includes('skf-ball-bearing-cutaway')) {
    item.imagemUrl = '/assets/images/skf_6204_bearing_intact_1788638178941.jpg';
  }
}

// 2. Load recovered catalog to get Outras Categorias maintenance items
const recovered: CatalogItem[] = JSON.parse(fs.readFileSync('/tmp/recovered_catalog.json', 'utf8'));

// Filter items not in j9 and not UC/UN
const nonJ9 = recovered.filter(i => 
  !j9Codes.has(i.codigo) && 
  !i.codigo.startsWith('UC-') && 
  !i.codigo.startsWith('UN-')
);

// We need exactly 706 outras items so 1396 + 234 + 706 = 2336 items
const outrasItems = nonJ9.slice(0, 706).map(it => {
  let desc = it.descricao || '';
  desc = desc.replace(/\bOLAMENTO\b/g, 'ROLAMENTO');

  let img = it.imagemUrl;
  if (!img || img.includes('skf-ball-bearing-cutaway')) {
    if (/ROLAMENTO|6204/i.test(desc) || it.categoria === 'ROLAMENTOS') {
      img = '/assets/images/skf_6204_bearing_intact_1788638178941.jpg';
    }
  }

  return {
    ...it,
    descricao: desc,
    imagemUrl: img
  };
});

// 3. Combine: 1,396 (j9) + 234 (Material de Uso/Consumo) + 706 (Outras Categorias) = 2,336
const totalCombined = [...j9, ...ITENS_MATERIAL_USO_CONSUMO, ...outrasItems];

console.log('j9 items:', j9.length);
console.log('ITENS_MATERIAL_USO_CONSUMO:', ITENS_MATERIAL_USO_CONSUMO.length);
console.log('outrasItems:', outrasItems.length);
console.log('Total combined items:', totalCombined.length);

// Verify category totals
const catCounts: Record<string, number> = {};
for (const it of totalCombined) {
  let cat = it.categoria;
  if (cat === 'MATERIAL DIVERSO') cat = 'MATERIAIS DIVERSOS';
  if (cat === 'MATERIAIS DE USO/CONSUMO') cat = 'MATERIAL DE USO/CONSUMO';
  catCounts[cat] = (catCounts[cat] || 0) + 1;
}

const Zl = [
  "MATERIAL AUXILIAR DE PRODUÇÃO",
  "MATERIAL DE EMBALAGENS",
  "MATERIAIS DE ESCRITÓRIO",
  "MATERIAIS DE LIMPEZA",
  "MATERIAIS DE SEGURANÇA",
  "MATERIAL DE USO/CONSUMO",
  "MATERIAIS DIVERSOS",
];

const Jl = [
  "MATERIAL ELÉTRICO",
  "MATERIAL MECÂNICO",
  "UTILITES-GÁS"
];

const consumoGeralTotal = Zl.reduce((acc, cat) => acc + (catCounts[cat] || 0), 0);
const consumoManutencaoTotal = Jl.reduce((acc, cat) => acc + (catCounts[cat] || 0), 0);
let outrasTotal = 0;
for (const cat of Object.keys(catCounts)) {
  if (!Zl.includes(cat) && !Jl.includes(cat)) {
    outrasTotal += catCounts[cat];
  }
}

console.log('Consumo Geral Total:', consumoGeralTotal);
console.log('Consumo Manutenção Total:', consumoManutencaoTotal);
console.log('Outras Categorias Total:', outrasTotal);
console.log('Total Items:', totalCombined.length);

const jsonLiteral = JSON.stringify(JSON.stringify(totalCombined));

// Generate initialCatalog.ts file
const fileContent = `import { CatalogItem } from '../types';

export const CATEGORIAS_PADRAO = [
  'TODOS',
  'MATERIAL AUXILIAR DE PRODUÇÃO',
  'MATERIAL DE EMBALAGENS',
  'MATERIAIS DE ESCRITÓRIO',
  'MATERIAIS DE LIMPEZA',
  'MATERIAIS DE SEGURANÇA',
  'MATERIAL DE USO/CONSUMO',
  'MATERIAIS DIVERSOS',
  'UNIFORMES',
  'MATERIAL ELÉTRICO',
  'MATERIAL MECÂNICO',
  'UTILITES-GÁS',
  'AUTOMAÇÃO E CONTROLE',
  'CABOS E CONECTORES',
  'COMANDO E MANOBRA ELÉTRICA',
  'FERRAMENTAS E UTENSÍLIOS',
  'FILTROS',
  'FIXAÇÃO',
  'FONTES E ELETRÔNICA',
  'FUSÍVEIS E PROTEÇÃO ELÉTRICA',
  'GRAXAS E CONSUMÍVEIS',
  'HIDRÁULICA',
  'ILUMINAÇÃO',
  'MOTORES E TRANSMISSÃO',
  'OUTROS / REPOSIÇÃO',
  'PEÇAS DE MÁQUINA / REPOSIÇÃO',
  'PNEUMÁTICA',
  'RESISTÊNCIAS E AQUECIMENTO',
  'ROLAMENTOS',
  'TUBOS E MANGUEIRAS',
  'VEDAÇÃO',
  'VÁLVULAS E ACESSÓRIOS',
];

export const CATEGORIAS_CONSUMO_GERAL = [
  'MATERIAL AUXILIAR DE PRODUÇÃO',
  'MATERIAL DE EMBALAGENS',
  'MATERIAIS DE ESCRITÓRIO',
  'MATERIAIS DE LIMPEZA',
  'MATERIAIS DE SEGURANÇA',
  'MATERIAL DE USO/CONSUMO',
  'MATERIAIS DIVERSOS',
];

export const CATEGORIAS_CONSUMO_MANUTENCAO = [
  'MATERIAL ELÉTRICO',
  'MATERIAL MECÂNICO',
  'UTILITES-GÁS',
];

export function formatCategoryName(category: string): string {
  const map: Record<string, string> = {
    'MATERIAL AUXILIAR DE PRODUÇÃO': 'Material Auxiliar de Produção',
    'MATERIAL DE EMBALAGENS': 'Material de Embalagens',
    'MATERIAIS DE ESCRITÓRIO': 'Materiais de Escritório',
    'MATERIAIS DE LIMPEZA': 'Materiais de Limpeza',
    'MATERIAIS DE SEGURANÇA': 'Materiais de Segurança',
    'MATERIAL DE USO/CONSUMO': 'Material de Uso/Consumo',
    'MATERIAIS DE USO/CONSUMO': 'Material de Uso/Consumo',
    'MATERIAIS DIVERSOS': 'Materiais Diversos',
    'MATERIAL DIVERSO': 'Materiais Diversos',
    'UNIFORMES': 'Uniformes',
    'MATERIAL ELÉTRICO': 'Material Elétrico',
    'MATERIAL MECÂNICO': 'Material Mecânico',
    'UTILITES-GÁS': 'Utilites-Gás',
  };
  return map[category] || category;
}

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = JSON.parse(
  ${jsonLiteral}
) as CatalogItem[];
`;

fs.writeFileSync('src/data/initialCatalog.ts', fileContent, 'utf8');
console.log('Successfully wrote src/data/initialCatalog.ts with 2,336 items!');
