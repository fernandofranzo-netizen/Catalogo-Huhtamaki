const fs = require('fs');
const path = require('path');

const RAW_FILES = [
  path.join(__dirname, '../src/data/raw/attached_pages_01_05.txt'),
  path.join(__dirname, '../src/data/raw/attached_pages_06_10.txt'),
  path.join(__dirname, '../src/data/raw/attached_pages_11_15.txt'),
  path.join(__dirname, '../src/data/raw/attached_pages_16_20.txt'),
];

const CATEGORY_MAP = {
  'MATERIAL AUXILIAR DE PRODUCAO': 'MATERIAL AUXILIAR DE PRODUÇÃO',
  'MATERIAL AUXILIAR DE PRODUÇÃO': 'MATERIAL AUXILIAR DE PRODUÇÃO',
  'MATERIAL DE EMBALAGENS': 'MATERIAL DE EMBALAGENS',
  'MATERIAIS ESCRITORIO': 'MATERIAIS DE ESCRITÓRIO',
  'MATERIAIS DE ESCRITÓRIO': 'MATERIAIS DE ESCRITÓRIO',
  'MATERIAIS LIMPEZA': 'MATERIAIS DE LIMPEZA',
  'MATERIAIS DE LIMPEZA': 'MATERIAIS DE LIMPEZA',
  'MATERIAL DIVERSO': 'MATERIAL DIVERSO',
  'MATERIAL ELETRICO': 'MATERIAL ELÉTRICO',
  'MATERIAL ELÉTRICO': 'MATERIAL ELÉTRICO',
  'MATERIAL MECANICO': 'MATERIAL MECÂNICO',
  'MATERIAL MECÂNICO': 'MATERIAL MECÂNICO',
  'MATERIAIS DE SEGURANÇA': 'MATERIAIS DE SEGURANÇA',
  'MATERIAIS SEGURANCA': 'MATERIAIS DE SEGURANÇA',
};

const SUB_CATEGORIAS_MAP = {
  'ANEIS': 'Anéis e Facas de Corte',
  'DISCO': 'Discos e Telas Filtrantes',
  'FITAS': 'Fitas Adesivas e Isolantes',
  'GUIAS': 'Guias e Decklins',
  'PAPEL': 'Papéis e Cantoneiras',
  'BANDE': 'Bandejas de Papelão',
  'CALCO': 'Calços de Madeira',
  'DVSOS': 'Materiais Diversos',
  'ETIQU': 'Etiquetas e Rótulos',
  'ETIQUE': 'Etiquetas e Rótulos',
  'FILME': 'Filmes Stretch e PE',
  'FITIL': 'Fitilhos de Amarração',
  'MANTA': 'Mantas EPE Protetoras',
  'PALLE': 'Paletes de Madeira e Plástico',
  'PERFI': 'Perfis Styroplast',
  'PERFIL': 'Perfis Styroplast',
  'SACOS': 'Sacos e Big Bags',
  'SELOS': 'Selos de Aço para Arquear',
  'TAMPA': 'Tampas de Madeira e Plástico',
  'BATER': 'Baterias Industriais',
  'ESCRI': 'Material de Escritório',
  'FICHA': 'Fichas e Documentos EPI',
  'FORMU': 'Formulários e Requisições',
  'GRAMP': 'Grampos Industriais',
  'PILHA': 'Pilhas Alcalinas',
  'RIBBO': 'Ribbons de Impressão Térmica',
  'ROTUL': 'Rotuladoras Portáteis',
  'TIELE': 'Telecom e Headsets',
  'TONER': 'Toners e Cartuchos',
  'LIMPE': 'Produtos e Utensílios de Limpeza',
  'FIXAR': 'Parafusos, Porcas e Fixadores',
  'LUBRI': 'Lubrificantes, Óleos e Graxas',
  'PNEUM': 'Válvulas, Cilindros e Conexões Pneumáticas',
  'PENUM': 'Válvulas, Cilindros e Conexões Pneumáticas',
  'REPAR': 'Peças de Reparo, Correias e Freios',
  'CPELE': 'Componentes Elétricos e Sensores',
  'REPOS': 'Rolamentos, Mancais e Resistências',
  'ABRAS': 'Discos Abrasivos, Lixas e Rebolos',
  'CPMEC': 'Componentes Mecânicos e Bombas',
  'ROLAM': 'Rolamentos e Mancais de Precisão',
  'VEDAC': 'Vedações, Juntas e Retentores',
  'CINTO': 'EPIs e Cintos de Segurança',
};

const topGroups = [
  'Facilities Management',
  'IT and Telecom',
  'Secondary packaging',
  'Personal Protection Equipment',
  'Services',
  'MRO',
];

const catalogPath = path.join(__dirname, '../src/data/catalogItems.json');
let existingItems = [];
if (fs.existsSync(catalogPath)) {
  try {
    existingItems = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  } catch (err) {
    console.warn('Could not read existing catalog', err);
  }
}
const existingMap = new Map(existingItems.map((i) => [i.codigo, i]));

const baseItems = [];
const seenCodes = new Set();

// 1. Process the 4 attached raw files (excluding SE- items and SERVIÇOS)
for (const filePath of RAW_FILES) {
  if (!fs.existsSync(filePath)) continue;
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (line.startsWith('CATEGORIA CÓDIGO') || (line.startsWith('CATEGORIA') && line.includes('CÓDIGO'))) {
      continue;
    }

    const match = line.match(/^([A-Z\s]+?)\s+([A-Z]{2}-([A-Z0-9]+)-\d{5}-\d{2})\s+(.+)$/);
    if (!match) continue;

    const [_, rawCat, code, subcode, rest] = match;

    // Strict removal of SERVIÇOS and SE- codes
    if (code.startsWith('SE-') || rawCat.toUpperCase().includes('SERVIC')) {
      continue;
    }

    if (seenCodes.has(code)) continue;
    seenCodes.add(code);

    let earliestPos = -1;
    let foundGroup = '';
    for (const g of topGroups) {
      const regex = new RegExp(`\\s+${g.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\$&')}(\\s+|$)`);
      const m = rest.match(regex);
      if (m && (earliestPos === -1 || m.index < earliestPos)) {
        earliestPos = m.index;
        foundGroup = g;
      }
    }

    const desc = (earliestPos !== -1 ? rest.substring(0, earliestPos) : rest).trim();
    const catNormalized = CATEGORY_MAP[rawCat.trim()] || rawCat.trim();
    const subcatDesc = SUB_CATEGORIAS_MAP[subcode] || subcode;

    const existing = existingMap.get(code.trim());

    baseItems.push({
      id: existing?.id || `item-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      codigo: code.trim(),
      descricao: desc, // 100% strict match
      categoria: catNormalized,
      subcategoria: subcatDesc,
      materialGroup: foundGroup || existing?.materialGroup || 'MRO',
      materialStructure: subcode,
      fabricante: existing?.fabricante || undefined,
      dimensao: existing?.dimensao || undefined,
      localizacao: existing?.localizacao || undefined,
      imagemUrl: existing?.imagemUrl || undefined,
      favorito: existing?.favorito || false,
      status: 'disponivel',
      documentos: existing?.documentos || [],
      observacoes: existing?.observacoes || undefined,
    });
  }
}

console.log(`Base items from attached files without SERVIÇOS: ${baseItems.length}`);

// 2. Extra 9 FITA items needed + 5 new SG-FITAS items from user image
const extraFitas = [
  {
    codigo: 'MM-DVSOS-00066-00',
    descricao: 'FITA CORTIC EMBORRAC PT AM 50,00 3,00 873070213 KA MT MT',
    categoria: 'MATERIAL MECÂNICO',
    subcategoria: 'Materiais Diversos',
    materialStructure: 'DVSOS',
    materialGroup: 'MRO',
    localizacao: 'Almoxarifado Central - Prateleira DVSOS',
    dimensao: '50MM X 3MM',
  },
  {
    codigo: 'MM-DVSOS-00067-00',
    descricao: 'FITA PROT PU 15MM EIXO MACCO MT MT',
    categoria: 'MATERIAL MECÂNICO',
    subcategoria: 'Materiais Diversos',
    materialStructure: 'DVSOS',
    materialGroup: 'MRO',
    fabricante: 'MACCO',
    dimensao: '15MM',
    localizacao: 'Almoxarifado Central - Prateleira DVSOS',
  },
  {
    codigo: 'MM-DVSOS-00070-00',
    descricao: 'FITA DE PROTECAO TIPO B 20MM RPLH00020 FAB: MACCO MT MT',
    categoria: 'MATERIAL MECÂNICO',
    subcategoria: 'Materiais Diversos',
    materialStructure: 'DVSOS',
    materialGroup: 'MRO',
    fabricante: 'MACCO',
    dimensao: '20MM',
    localizacao: 'Almoxarifado Central - Prateleira DVSOS',
  },
  {
    codigo: 'MM-DVSOS-00077-00',
    descricao: 'FITA ISOLANTE ELETRICA 12,00 MM ROLO 20M SCOTCH 27 UN UN',
    categoria: 'MATERIAL MECÂNICO',
    subcategoria: 'Materiais Diversos',
    materialStructure: 'DVSOS',
    materialGroup: 'MRO',
    fabricante: '3M / SCOTCH',
    dimensao: '12MM X 20M',
    localizacao: 'Almoxarifado Central - Prateleira DVSOS',
  },
  {
    codigo: 'MM-REPOS-00214-00',
    descricao: 'FITA VEDA ROSCA 18MM X 25M TIGRE PC PC',
    categoria: 'MATERIAL MECÂNICO',
    subcategoria: 'Rolamentos, Mancais e Resistências',
    materialStructure: 'REPOS',
    materialGroup: 'MRO',
    fabricante: 'TIGRE',
    dimensao: '18MM X 25M',
    localizacao: 'Almoxarifado Central - Box Vedações',
  },
  {
    codigo: 'MM-VEDAC-00106-00',
    descricao: 'FITA DE TEFLON PURA 0,10MM X 19MM X 15M PC PC',
    categoria: 'MATERIAL MECÂNICO',
    subcategoria: 'Vedações, Juntas e Retentores',
    materialStructure: 'VEDAC',
    materialGroup: 'MRO',
    dimensao: '0,10MM X 19MM X 15M',
    localizacao: 'Almoxarifado Central - Box Vedações',
  },
  {
    codigo: 'MM-VEDAC-00107-00',
    descricao: 'FITA DE TEFLON PURA 0,20MM X 25MM X 15M PC PC',
    categoria: 'MATERIAL MECÂNICO',
    subcategoria: 'Vedações, Juntas e Retentores',
    materialStructure: 'VEDAC',
    materialGroup: 'MRO',
    dimensao: '0,20MM X 25MM X 15M',
    localizacao: 'Almoxarifado Central - Box Vedações',
  },
  {
    codigo: 'SG-CINTO-00005-00',
    descricao: 'TRAVA-QUEDAS RETRATIL FITA 6M PC PC',
    categoria: 'MATERIAIS DE SEGURANÇA',
    subcategoria: 'EPIs e Cintos de Segurança',
    materialStructure: 'CINTO',
    materialGroup: 'Personal Protection Equipment',
    dimensao: '6M',
    localizacao: 'Almoxarifado Central - Armário EPIs',
  },
  {
    codigo: 'UC-FITAS-00001-00',
    descricao: 'FITA FELTRO PARA CORTADEIRAS 16 X 2MM',
    categoria: 'MATERIAL AUXILIAR DE PRODUÇÃO',
    subcategoria: 'Fitas Adesivas e Isolantes',
    materialStructure: 'FITAS',
    materialGroup: 'MRO',
    dimensao: '16 X 2MM',
    localizacao: 'Almoxarifado Central - Box 160',
  },
  // 5 New items from user attachment image
  {
    codigo: 'SG-FITAS-00001-00',
    descricao: 'FITA DEMARC PISO AM PVC 110MM 30M',
    categoria: 'MATERIAIS DE SEGURANÇA',
    subcategoria: 'Fitas Adesivas e Isolantes',
    materialStructure: 'FITAS',
    materialGroup: 'Personal Protection Equipment',
    dimensao: '110MM X 30M',
    localizacao: 'Almoxarifado Central - Demarcação e Segurança',
  },
  {
    codigo: 'SG-FITAS-00002-00',
    descricao: 'FITA DEMARC PISO AM PVC 50MM 30M',
    categoria: 'MATERIAIS DE SEGURANÇA',
    subcategoria: 'Fitas Adesivas e Isolantes',
    materialStructure: 'FITAS',
    materialGroup: 'Personal Protection Equipment',
    dimensao: '50MM X 30M',
    localizacao: 'Almoxarifado Central - Demarcação e Segurança',
  },
  {
    codigo: 'SG-FITAS-00003-00',
    descricao: 'FITA DEMARC PISO VM PVC 100MM 30M',
    categoria: 'MATERIAIS DE SEGURANÇA',
    subcategoria: 'Fitas Adesivas e Isolantes',
    materialStructure: 'FITAS',
    materialGroup: 'Personal Protection Equipment',
    dimensao: '100MM X 30M',
    localizacao: 'Almoxarifado Central - Demarcação e Segurança',
  },
  {
    codigo: 'SG-FITAS-00004-00',
    descricao: 'FITA DEMARC SOLO ADES AM/PT PE 100MM 30M',
    categoria: 'MATERIAIS DE SEGURANÇA',
    subcategoria: 'Fitas Adesivas e Isolantes',
    materialStructure: 'FITAS',
    materialGroup: 'Personal Protection Equipment',
    dimensao: '100MM X 30M',
    localizacao: 'Almoxarifado Central - Demarcação e Segurança',
  },
  {
    codigo: 'SG-FITAS-00005-00',
    descricao: 'FITA DEMARC AREA AM/PT PE 70MM 200M',
    categoria: 'MATERIAIS DE SEGURANÇA',
    subcategoria: 'Fitas Adesivas e Isolantes',
    materialStructure: 'FITAS',
    materialGroup: 'Personal Protection Equipment',
    dimensao: '70MM X 200M',
    localizacao: 'Almoxarifado Central - Demarcação e Segurança',
  },
];

for (const ef of extraFitas) {
  if (!seenCodes.has(ef.codigo)) {
    seenCodes.add(ef.codigo);
    baseItems.push({
      id: `item-${ef.codigo.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      ...ef,
      status: 'disponivel',
      documentos: [],
    });
  }
}

// 3. The pneumatic adaptors from pages_11_20.txt
const p11_20_raw = fs.readFileSync(path.join(__dirname, '../src/data/raw/pages_11_20.txt'), 'utf8');
const adaptLines = p11_20_raw.split('\n').filter((l) => l.includes('ADAPTADOR'));

const adaptItemsToAdd = [];
for (const line of adaptLines) {
  const parts = line.split('|').map((s) => s.trim());
  const code = parts[0];
  let desc = parts[1];
  const subcat = parts[2] || 'Válvulas, Cilindros e Conexões Pneumáticas';
  const subcode = parts[3] || 'PNEUM';
  let fabr = parts[4] || 'SMC/FESTO';
  let dim = parts[5] || undefined;
  const loc = parts[6] ? `Almoxarifado Central - Gaveta / Box ${parts[6]}` : 'Almoxarifado Central - Pneumática';

  // Rule: MM-PNEUM-00110-00 DOES NOT EXIST IN THE CATALOG
  if (code === 'MM-PNEUM-00110-00') {
    continue;
  }

  // Rule: MM-PNEUM-00079-00 description is "CONEXAO RAPIDA ORIENTAVEL QSR-3/8-12 FESTO"
  if (code === 'MM-PNEUM-00079-00') {
    desc = 'CONEXAO RAPIDA ORIENTAVEL QSR-3/8-12 FESTO';
    fabr = 'FESTO';
  }

  if (!seenCodes.has(code)) {
    seenCodes.add(code);
    adaptItemsToAdd.push({
      id: `item-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      codigo: code,
      descricao: desc,
      categoria: 'MATERIAL MECÂNICO',
      subcategoria: SUB_CATEGORIAS_MAP[subcode] || subcat,
      materialGroup: 'MRO',
      materialStructure: subcode,
      fabricante: fabr,
      dimensao: dim,
      localizacao: loc,
      status: 'disponivel',
      documentos: [],
    });
  }
}

console.log(`Pneumatic items added: ${adaptItemsToAdd.length}`);
baseItems.push(...adaptItemsToAdd);

// Ensure MM-PNEUM-00143-00 is in the catalog as SILENCIADOR PNEUM ESCAP PVF S
if (!seenCodes.has('MM-PNEUM-00143-00')) {
  seenCodes.add('MM-PNEUM-00143-00');
  baseItems.push({
    id: 'item-mm-pneum-00143-00',
    codigo: 'MM-PNEUM-00143-00',
    descricao: 'SILENCIADOR PNEUM ESCAP PVF S',
    categoria: 'MATERIAL MECÂNICO',
    subcategoria: 'Válvulas, Cilindros e Conexões Pneumáticas',
    materialStructure: 'PNEUM',
    materialGroup: 'MRO',
    fabricante: 'FESTO / SMC',
    dimensao: '3/8"',
    localizacao: 'Almoxarifado Central - Gaveta / Box 50',
    status: 'disponivel',
    documentos: [],
  });
}

// Ensure MM-PNEUM-00079-00 has updated description even if it existed in baseItems
const item00079 = baseItems.find((i) => i.codigo === 'MM-PNEUM-00079-00');
if (item00079) {
  item00079.descricao = 'CONEXAO RAPIDA ORIENTAVEL QSR-3/8-12 FESTO';
  item00079.fabricante = 'FESTO';
}

// Remove MM-PNEUM-00110-00 from baseItems if present anywhere
const filteredBaseItems = baseItems.filter((i) => i.codigo !== 'MM-PNEUM-00110-00');
baseItems.length = 0;
baseItems.push(...filteredBaseItems);

// List of exact 49 codes for FITA (original 44 + 5 new SG-FITAS)
const EXACT_FITA_CODES = new Set([
  'AU-FITAS-00001-00',
  'AU-FITAS-00002-00',
  'AU-FITAS-00003-00',
  'AU-FITAS-00004-00',
  'AU-FITAS-00005-00',
  'AU-FITAS-00006-00',
  'AU-FITAS-00007-00',
  'AU-FITAS-00008-00',
  'AU-FITAS-00009-00',
  'AU-FITAS-00010-00',
  'AU-FITAS-00011-00',
  'AU-FITAS-00012-00',
  'AU-FITAS-00013-00',
  'AU-FITAS-00014-00',
  'AU-FITAS-00015-00',
  'AU-FITAS-00016-00',
  'AU-FITAS-00017-00',
  'AU-FITAS-00018-00',
  'AU-FITAS-00019-00',
  'AU-FITAS-00020-00',
  'AU-FITAS-00021-00',
  'AU-FITAS-00022-00',
  'EE-FITAS-00001-00',
  'EE-SELOS-00001-00',
  'ES-ETIQUE-00004-00',
  'ES-FITAS-00001-00',
  'ES-FITAS-00002-00',
  'ES-FITAS-00003-00',
  'MD-DVSOS-00033-00',
  'MD-DVSOS-00034-00',
  'MD-DVSOS-00035-00',
  'MD-DVSOS-00036-00',
  'MD-DVSOS-00037-00',
  'MD-DVSOS-00058-00',
  'MM-DVSOS-00066-00',
  'MM-DVSOS-00067-00',
  'MM-DVSOS-00070-00',
  'MM-DVSOS-00077-00',
  'MM-REPOS-00214-00',
  'MM-VEDAC-00106-00',
  'MM-VEDAC-00107-00',
  'SG-CINTO-00005-00',
  'UC-FITAS-00001-00',
  'MM-DVSOS-00074-00',
  // 5 New Items from user attachment
  'SG-FITAS-00001-00',
  'SG-FITAS-00002-00',
  'SG-FITAS-00003-00',
  'SG-FITAS-00004-00',
  'SG-FITAS-00005-00',
]);

// If MM-DVSOS-00074-00 is not in baseItems yet, add it
if (!seenCodes.has('MM-DVSOS-00074-00')) {
  seenCodes.add('MM-DVSOS-00074-00');
  baseItems.push({
    id: 'item-mm-dvsos-00074-00',
    codigo: 'MM-DVSOS-00074-00',
    descricao: 'FITA DE VEDACAO PARA ROSCA 18MM X 50M',
    categoria: 'MATERIAL MECÂNICO',
    subcategoria: 'Materiais Diversos',
    materialStructure: 'DVSOS',
    materialGroup: 'MRO',
    dimensao: '18MM X 50M',
    localizacao: 'Almoxarifado Central - Box 236',
    status: 'disponivel',
    documentos: [],
  });
}

// List of exact codes for ADAPTADOR
// MM-PNEUM-00079-00 does NOT belong to ADAPTADOR
// MM-PNEUM-00110-00 does NOT exist in catalog
// MM-PNEUM-00143-00 does NOT belong to ADAPTADOR
const EXACT_ADAPT_CODES = new Set(
  adaptLines
    .map((l) => l.split('|')[0].trim())
    .filter((c) => c !== 'MM-PNEUM-00079-00' && c !== 'MM-PNEUM-00110-00' && c !== 'MM-PNEUM-00143-00')
);

console.log(`Total exact adapt codes: ${EXACT_ADAPT_CODES.size}`);
console.log(`Total exact fita codes: ${EXACT_FITA_CODES.size}`);

// Now curate keywords (palavrasChave)
for (const item of baseItems) {
  const code = item.codigo;
  const desc = item.descricao;
  const subcat = item.subcategoria || '';
  const cat = item.categoria || '';

  // Base keywords from code, words in desc (>=2 chars)
  const words = desc.toLowerCase().split(/[^a-z0-9áàâãéêíóôõúç]+/).filter((w) => w.length >= 2);
  const codeParts = code.toLowerCase().split(/[^a-z0-9]+/);

  let keywords = new Set([...codeParts, ...words, subcat.toLowerCase(), cat.toLowerCase()]);

  // Handle "fita"
  if (EXACT_FITA_CODES.has(code)) {
    keywords.add('fita');
    keywords.add('fitas');
  } else {
    keywords.delete('fita');
    keywords.delete('fitas');
  }

  // Handle "adaptador"
  if (EXACT_ADAPT_CODES.has(code)) {
    keywords.add('adaptador');
    keywords.add('adaptadores');
  } else {
    keywords.delete('adaptador');
    keywords.delete('adaptadores');
  }

  item.palavrasChave = Array.from(keywords).filter(Boolean);

  // Preserve or set technical images
  if (!item.imagemUrl) {
    if (code.includes('FITAS') || item.palavrasChave.includes('fita')) {
      item.imagemUrl = '/assets/components/peca-mecanica-geral.svg';
    } else if (code.includes('PNEUM') || item.palavrasChave.includes('adaptador')) {
      item.imagemUrl = '/assets/components/valvula-pneumatica.svg';
    } else {
      item.imagemUrl = '/assets/components/peca-mecanica-geral.svg';
    }
  }
}

// Write to catalogItems.json
fs.writeFileSync(catalogPath, JSON.stringify(baseItems, null, 2), 'utf8');

console.log(`Catalog successfully saved with ${baseItems.length} items.`);

// Verify counts
const fitaCheck = baseItems.filter((i) => i.palavrasChave.includes('fita'));
const adaptCheck = baseItems.filter((i) => i.palavrasChave.includes('adaptador'));
const servicosCheck = baseItems.filter((i) => i.categoria === 'SERVIÇOS' || i.categoria === 'SERVICOS' || i.codigo.startsWith('SE-'));
const item110Check = baseItems.filter((i) => i.codigo === 'MM-PNEUM-00110-00');
const item79Check = baseItems.find((i) => i.codigo === 'MM-PNEUM-00079-00');
const item143Check = baseItems.find((i) => i.codigo === 'MM-PNEUM-00143-00');

console.log(`\n=== Verification Results ===`);
console.log(`Keyword "FITA" items: ${fitaCheck.length} (Target: 49)`);
console.log(`Keyword "ADAPTADOR" items: ${adaptCheck.length} (Target: 36)`);
console.log(`SERVIÇOS items: ${servicosCheck.length} (Target: 0)`);
console.log(`MM-PNEUM-00110-00 present: ${item110Check.length} (Target: 0)`);
console.log(`MM-PNEUM-00079-00 desc: "${item79Check?.descricao}" | has adapt: ${item79Check?.palavrasChave.includes('adaptador')}`);
console.log(`MM-PNEUM-00143-00 desc: "${item143Check?.descricao}" | has adapt: ${item143Check?.palavrasChave.includes('adaptador')}`);
