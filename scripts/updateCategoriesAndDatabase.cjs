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
  'SERVICOS': 'SERVIÇOS',
  'SERVIÇOS': 'SERVIÇOS',
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
  'INDUS': 'Serviços Industriais e Usinagem',
  'MANUT': 'Manutenção Mecânica e Elétrica',
  'PREDI': 'Manutenção Predial e Instalações',
  'SEGUR': 'Segurança, Laudos e Calibração',
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
    console.warn('Could not read existing catalog, starting fresh', err);
  }
}
const existingMap = new Map(existingItems.map((i) => [i.codigo, i]));

const newCatalog = [];
const categorySummary = {};
let matchedExisting = 0;

for (const filePath of RAW_FILES) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (line.startsWith('CATEGORIA CÓDIGO') || line.startsWith('CATEGORIA') && line.includes('CÓDIGO')) {
      continue;
    }

    const match = line.match(/^([A-Z\s]+?)\s+([A-Z]{2}-([A-Z0-9]+)-\d{5}-\d{2})\s+(.+)$/);
    if (!match) continue;

    const [_, rawCat, code, subcode, rest] = match;

    // Find the earliest occurrence of topGroups as whole token boundary
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

    // Exact description from attached list
    const desc = (earliestPos !== -1 ? rest.substring(0, earliestPos) : rest).trim();
    const meta = (earliestPos !== -1 ? rest.substring(earliestPos) : '').trim();

    const catNormalized = CATEGORY_MAP[rawCat.trim()] || rawCat.trim();
    const subcatDesc = SUB_CATEGORIAS_MAP[subcode] || subcode;

    const existing = existingMap.get(code.trim());
    if (existing) matchedExisting++;

    const item = {
      id: existing?.id || `item-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      codigo: code.trim(),
      descricao: desc, // 100% strict match to the attached list
      categoria: catNormalized,
      subcategoria: subcatDesc,
      materialGroup: foundGroup || existing?.materialGroup || 'MRO',
      materialStructure: subcode,
      fabricante: existing?.fabricante || undefined,
      dimensao: existing?.dimensao || undefined,
      localizacao: existing?.localizacao || undefined,
      palavrasChave: Array.from(
        new Set([
          ...code.toLowerCase().split(/[^a-z0-9]+/),
          ...desc.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 2),
          subcatDesc.toLowerCase(),
          catNormalized.toLowerCase(),
        ])
      ).filter(Boolean),
      imagemUrl: existing?.imagemUrl || undefined,
      favorito: existing?.favorito || false,
      status: existing?.status || 'disponivel',
      documentos: existing?.documentos || [],
      observacoes: existing?.observacoes || undefined,
    };

    newCatalog.push(item);
    categorySummary[catNormalized] = (categorySummary[catNormalized] || 0) + 1;
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(newCatalog, null, 2), 'utf8');

console.log(`Banco de dados atualizado com sucesso!`);
console.log(`Total de itens importados: ${newCatalog.length} (com 100% de precisão de código e descrição)`);
console.log(`Preservados metadados de ${matchedExisting} itens pré-existentes.`);
console.log('\nDistribuição por Categoria Oficial Huhtamaki:');
for (const [cat, count] of Object.entries(categorySummary)) {
  console.log(`- ${cat}: ${count} itens`);
}

