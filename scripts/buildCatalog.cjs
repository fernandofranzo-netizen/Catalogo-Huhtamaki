const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../src/data/raw/pages_01_10.txt'),
  path.join(__dirname, '../src/data/raw/pages_11_20.txt'),
  path.join(__dirname, '../src/data/raw/pages_21_28.txt')
];

// Map raw categories to standard categories
function normalizeCategory(raw) {
  const c = (raw || '').trim().toLowerCase();
  if (c.includes('automação') || c.includes('automacao')) return 'AUTOMAÇÃO E CONTROLE';
  if (c.includes('cabos') || c.includes('conector')) return 'CABOS E CONECTORES';
  if (c.includes('comando') || c.includes('manobra')) return 'COMANDO E SINALIZAÇÃO';
  if (c.includes('ferramenta')) return 'FERRAMENTAS E UTENSÍLIOS';
  if (c.includes('filtro')) return 'FILTROS E LUBRIFICAÇÃO';
  if (c.includes('fixa') || c.includes('fixar')) return 'FIXAÇÃO';
  if (c.includes('fonte') || c.includes('eletr')) return 'FONTES E ELETRÔNICA';
  if (c.includes('fus') || c.includes('prote')) return 'FUSÍVEIS E PROTEÇÃO ELÉTRICA';
  if (c.includes('gas') || c.includes('gases')) return 'GASES E CONSUMÍVEIS';
  if (c.includes('hidr')) return 'HIDRÁULICA';
  if (c.includes('ilum')) return 'ILUMINAÇÃO ELÉTRICA';
  if (c.includes('motor') || c.includes('transmiss')) return 'MOTORES E TRANSMISSÃO';
  if (c.includes('pneum')) return 'PNEUMÁTICA';
  if (c.includes('rolamento')) return 'ROLAMENTOS';
  if (c.includes('ved')) return 'VEDAÇÃO';
  if (c.includes('sensor') || c.includes('instrum')) return 'SENSORES E INSTRUMENTAÇÃO';
  if (c.includes('seguran')) return 'SEGURANÇA E ACESSÓRIOS';
  if (c.includes('óleo') || c.includes('oleo')) return 'ÓLEOS E CONSUMÍVEIS';
  return 'OUTROS / REPOSIÇÃO';
}

// Category image presets (industrial, modern, crisp)
const CATEGORY_IMAGES = {
  'FIXAÇÃO': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  'FUSÍVEIS E PROTEÇÃO ELÉTRICA': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'MOTORES E TRANSMISSÃO': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
  'ILUMINAÇÃO ELÉTRICA': 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80',
  'PNEUMÁTICA': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  'HIDRÁULICA': 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=600&q=80',
  'ROLAMENTOS': 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=600&q=80',
  'AUTOMAÇÃO E CONTROLE': 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80',
  'CABOS E CONECTORES': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  'COMANDO E SINALIZAÇÃO': 'https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=600&q=80',
  'FERRAMENTAS E UTENSÍLIOS': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
  'FONTES E ELETRÔNICA': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'GASES E CONSUMÍVEIS': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
  'FILTROS E LUBRIFICAÇÃO': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  'OUTROS / REPOSIÇÃO': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  'SENSORES E INSTRUMENTAÇÃO': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'VEDAÇÃO': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
};

// Generate comprehensive search keywords
function extractKeywords(codigo, descricao, fabricante, dimensao, categoria) {
  const text = `${codigo} ${descricao} ${fabricante || ''} ${dimensao || ''} ${categoria}`.toLowerCase();
  const tokens = text
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents for normalized matching
    .split(/[\s,\.\/\-\_\(\)\:\;\*\+]+/)
    .filter(t => t.length >= 2 && !['de', 'da', 'do', 'em', 'para', 'com', 'sem', 'por'].includes(t));
  return Array.from(new Set(tokens)).slice(0, 15);
}

// Read existing initialCatalog.ts to keep any custom rich data (docs, custom images)
const existingCatalogPath = path.join(__dirname, '../src/data/initialCatalog.ts');
let existingItems = [];
try {
  const content = fs.readFileSync(existingCatalogPath, 'utf8');
  // Match code and documents
  const codeRegex = /codigo:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = codeRegex.exec(content)) !== null) {
    // found code
  }
} catch (e) {
  console.log('Error reading existing:', e);
}

const allItems = [];
const seenCodes = new Set();
let idCounter = 1;

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    const parts = line.split('|').map(s => s.trim());
    if (parts.length < 2) continue;

    const codigo = parts[0];
    const descricao = parts[1];
    const categoriaRaw = parts[2] || '';
    const subcat = parts[3] || '';
    const fabricante = parts[4] || '';
    const dimensao = parts[5] || '';
    const gaveta = parts[6] || '';

    if (seenCodes.has(codigo)) {
      continue;
    }
    seenCodes.add(codigo);

    const categoria = normalizeCategory(categoriaRaw);
    const keywords = extractKeywords(codigo, descricao, fabricante, dimensao, categoria);
    const location = gaveta ? `Almoxarifado Central - Gaveta / Box ${gaveta}` : 'Almoxarifado Central - Prateleira Geral';
    const observacoes = [
      fabricante ? `Fabricante: ${fabricante}` : '',
      dimensao ? `Dimensão / Especificação: ${dimensao}` : '',
      gaveta ? `Endereço físico: Gaveta ${gaveta}` : '',
      subcat ? `Subcategoria: ${subcat}` : ''
    ].filter(Boolean).join(' | ') || 'Item cadastrado no catálogo técnico Huhtamaki.';

    allItems.push({
      id: `item-${idCounter++}`,
      codigo,
      descricao,
      categoria,
      fabricante: fabricante || undefined,
      dimensao: dimensao || undefined,
      localizacao: location,
      palavrasChave: keywords,
      imagemUrl: CATEGORY_IMAGES[categoria] || CATEGORY_IMAGES['OUTROS / REPOSIÇÃO'],
      favorito: false,
      status: 'disponivel',
      observacoes,
      documentos: [],
      dataCriacao: '2025-01-15'
    });
  }
}

console.log(`Generated ${allItems.length} unique catalog items!`);

// Let's print category distribution
const dist = {};
allItems.forEach(i => { dist[i.categoria] = (dist[i.categoria] || 0) + 1; });
console.log('Category distribution:', dist);

// Save to JSON
const outputPath = path.join(__dirname, '../src/data/catalogItems.json');
fs.writeFileSync(outputPath, JSON.stringify(allItems, null, 2), 'utf8');
console.log(`Saved catalog JSON to ${outputPath}`);
