const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../src/data/catalogItems.json');
const currentCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const UTILITIES_GAS_ITEMS = [
  {
    codigo: 'UG-GASES-00001-00',
    descricao: 'GAS REFRIG R-22 EMB 13,6KG',
    descricaoExtra: '',
    materialSubGroup: 'Consumables',
    materialStructure: 'Industrial gases',
    dimensao: '13,6 kg (Embalagem DAC)',
    fabricante: 'Genetron / Chemours',
    subcategoria: 'Gases Refrigerantes Industriais',
    localizacao: 'Depósito de Gases / Utilidades - Box G-01',
  },
  {
    codigo: 'UG-GASES-00002-00',
    descricao: 'GAS REFRIG R-407C CIL 11,35KG',
    descricaoExtra: '',
    materialSubGroup: 'Consumables',
    materialStructure: 'Industrial gases',
    dimensao: '11,35 kg (Cilindro)',
    fabricante: 'Chemours / Freon',
    subcategoria: 'Gases Refrigerantes Industriais',
    localizacao: 'Depósito de Gases / Utilidades - Box G-02',
  },
  {
    codigo: 'UG-GASES-00003-00',
    descricao: 'GAS REFRIGERANTE R-410A CILINDRO 11,34KG',
    descricaoExtra: '',
    materialSubGroup: 'Consumables',
    materialStructure: 'Industrial gases',
    dimensao: '11,34 kg (Cilindro)',
    fabricante: 'Suva / Chemours / Honeywell',
    subcategoria: 'Gases Refrigerantes Industriais',
    localizacao: 'Depósito de Gases / Utilidades - Box G-03',
  },
  {
    codigo: 'UG-GASES-00004-00',
    descricao: 'GAS REFRIGERANTE R-141B CILINDRO 13,6 KG',
    descricaoExtra: '',
    materialSubGroup: 'Consumables',
    materialStructure: 'Industrial gases',
    dimensao: '13,6 kg (Cilindro)',
    fabricante: 'Forane / Chemours',
    subcategoria: 'Gases Refrigerantes Industriais',
    localizacao: 'Depósito de Gases / Utilidades - Box G-04',
  },
  {
    codigo: 'UG-GASES-00005-00',
    descricao: 'GAS REFRIGERANTE 134A CILINDRO 13,62KG',
    descricaoExtra: '',
    materialSubGroup: 'Consumables',
    materialStructure: 'Industrial gases',
    dimensao: '13,62 kg (Cilindro)',
    fabricante: 'Freon / Chemours / DuPont',
    subcategoria: 'Gases Refrigerantes Industriais',
    localizacao: 'Depósito de Gases / Utilidades - Box G-05',
  },
  {
    codigo: 'UG-GASES-00006-00',
    descricao: 'GAS REFRI DUGOLD ECOMATE FORMIATO DE METILA 10,5KG',
    descricaoExtra: '',
    materialSubGroup: 'Consumables',
    materialStructure: 'Industrial gases',
    dimensao: '10,5 kg (Cilindro)',
    fabricante: 'Dugold',
    subcategoria: 'Gases Refrigerantes Industriais',
    localizacao: 'Depósito de Gases / Utilidades - Box G-06',
  },
  {
    codigo: 'UG-GASES-00007-00',
    descricao: 'GAS REFRIGERANTE R32 3KG CHEMOURS D15444483',
    descricaoExtra: '',
    materialSubGroup: 'Consumables',
    materialStructure: 'Industrial gases',
    dimensao: '3 kg (Cilindro)',
    fabricante: 'Chemours',
    subcategoria: 'Gases Refrigerantes Industriais',
    localizacao: 'Depósito de Gases / Utilidades - Box G-07',
  },
];

const catalogMap = new Map();
for (const item of currentCatalog) {
  // Normalize old or miscategorized items if any
  let cat = item.categoria;
  if (cat === 'UTILITES-GÁS' || cat === 'UTILITIES-GÁS' || cat === 'UTILITIES GÁS' || cat === 'UTILITIES GAS') {
    cat = 'UTILITIES-GAS';
  }
  catalogMap.set(item.codigo, { ...item, categoria: cat });
}

for (const raw of UTILITIES_GAS_ITEMS) {
  const existing = catalogMap.get(raw.codigo);
  const keywords = Array.from(
    new Set([
      'ug',
      'gases',
      raw.codigo.toLowerCase(),
      ...raw.codigo.toLowerCase().split(/[^a-z0-9]+/),
      ...raw.descricao.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 2),
      'utilities',
      'gas',
      'gás',
      'refrigerante',
      'cilindro',
      'consumables',
      'industrial',
      raw.fabricante.toLowerCase(),
      'consumo manutenção',
    ])
  ).filter(Boolean);

  const formattedItem = {
    id: existing?.id || `item-${raw.codigo.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    codigo: raw.codigo,
    descricao: raw.descricao,
    categoria: 'UTILITIES-GAS',
    subcategoria: raw.subcategoria,
    materialGroup: raw.materialSubGroup,
    materialStructure: raw.materialStructure,
    fabricante: raw.fabricante,
    dimensao: raw.dimensao,
    localizacao: raw.localizacao,
    imagemUrl: '/assets/components/gas-refrigerante.svg',
    favorito: existing?.favorito || false,
    status: 'disponivel',
    documentos: existing?.documentos || [],
    observacoes: `Grupo: ${raw.materialSubGroup} | Estrutura: ${raw.materialStructure} | Embalagem: ${raw.dimensao}`,
    palavrasChave: keywords,
  };

  catalogMap.set(raw.codigo, formattedItem);
}

const updatedList = Array.from(catalogMap.values());
fs.writeFileSync(catalogPath, JSON.stringify(updatedList, null, 2), 'utf8');

console.log(`Successfully updated catalog! Total items: ${updatedList.length}`);
const gasItems = updatedList.filter((i) => i.categoria === 'UTILITIES-GAS');
console.log(`UTILITIES-GAS items count: ${gasItems.length}`);
console.log(gasItems.map((i) => `${i.codigo} -> ${i.descricao}`));
