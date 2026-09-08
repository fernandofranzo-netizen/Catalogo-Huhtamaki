const fs = require('fs');
const path = require('path');

const ocrFiles = [
  path.join(__dirname, '../src/data/raw/ocr_pages_01_06.txt'),
  path.join(__dirname, '../src/data/raw/ocr_pages_07_12.txt'),
  path.join(__dirname, '../src/data/raw/ocr_pages_13_18.txt'),
  path.join(__dirname, '../src/data/raw/ocr_pages_19_24.txt')
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

// High-precision component image resolver mapping to technical CAD assets in /assets/components/
function getComponentImageUrl(codigo, descricao, categoria) {
  const c = (codigo || '').toUpperCase();
  const d = (descricao || '').toUpperCase();
  const cat = (categoria || '').toUpperCase();
  const all = `${c} ${d} ${cat}`;

  // 1. Anel Elástico (Circlip / Seeger DIN 471 / DIN 472)
  if (/ANEL ELAST|ANEL.*EXTERNO|ANEL.*INTERNO|SEEGER|DIN 471|DIN 472|ANEIS/i.test(all)) {
    return '/assets/components/anel-elastico.svg';
  }

  // 2. Rolamentos de esferas e rolos
  if (/ROLAMENTO|6204|63\/28|MANCAL|BEARING/i.test(all)) {
    return '/assets/components/rolamento.svg';
  }

  // 3. Buchas Guia
  if (/BUCHA.*GUIA|BUCHA/i.test(all)) {
    return '/assets/components/bucha-guia.svg';
  }

  // 4. Pinos Guia e Elásticos
  if (/PINO.*ELAST|PINO.*GUIA|PINO.*TEMPERAD|PINO.*CONICO|PINOS/i.test(all)) {
    return '/assets/components/pino-guia.svg';
  }

  // 5. Parafuso Allen Escareado
  if (/ESCAREAD|DIN 7991/i.test(all)) {
    return '/assets/components/parafuso-allen-escareado.svg';
  }

  // 6. Parafuso Allen Abaulado
  if (/ABAULAD|ISO 7380/i.test(all)) {
    return '/assets/components/parafuso-allen-abaulado.svg';
  }

  // 7. Parafuso Allen Sem Cabeça (Bujão / Set screw)
  if (/SEM CABECA|SEM\/CAB|BUJAO|DIN 913|DIN 914|DIN 916/i.test(all)) {
    return '/assets/components/parafuso-sem-cabeca.svg';
  }

  // 8. Parafuso Allen Cabeça Cilíndrica
  if (/ALLEN|DIN 912|ISO 4762/i.test(all)) {
    return '/assets/components/parafuso-allen-cilindrico.svg';
  }

  // 9. Parafuso Cabeça Sextavada
  if (/PARAFUSO.*SEXTAVAD|SEXTAVAD/i.test(all)) {
    return '/assets/components/parafuso-sextavado.svg';
  }

  // 10. Arruelas de pressão e lisas
  if (/ARRUELA/i.test(all)) {
    return '/assets/components/arruela.svg';
  }

  // 11. Porcas
  if (/PORCA/i.test(all)) {
    return '/assets/components/porca.svg';
  }

  // 12. Parafusos em geral
  if (/PARAFUSO/i.test(all)) {
    return '/assets/components/parafuso-sextavado.svg';
  }

  // 13. CLP / Módulos de Automação
  if (/CLP|PLC|EXPANSAO.*ETHERNET|ALTUS|CONTROLADOR|6ES7|X20|MODULO ELETRONICO|MODULO DIGITALIZACAO|MODULO DE ENTRADA|MODULO DE SAIDA|RACK MOD|IO MUX/i.test(all)) {
    return '/assets/components/clp-modulo.svg';
  }

  // 14. Encoders
  if (/ENCODER|DFS60|SICK.*AD-/i.test(all)) {
    return '/assets/components/encoder.svg';
  }

  // 15. Inversores e Soft-starters
  if (/INVERSOR|MICROMASTER|DRIVE|VFD|SOFT.*STARTER|SSW05/i.test(all)) {
    return '/assets/components/inversor.svg';
  }

  // 16. Disjuntores e Contatores
  if (/DISJUNTOR|CONTATOR|RELE/i.test(all)) {
    return '/assets/components/disjuntor.svg';
  }

  // 17. Fusíveis NH
  if (/FUSIVEL.*NH|NH00|NH-00|NH1|NH2|NH3|500V.*100A|500V.*160A/i.test(all) || (/FUS/i.test(all) && /NH/i.test(all))) {
    return '/assets/components/fusivel-nh.svg';
  }

  // 18. Outros fusíveis e proteção
  if (/FUSIVEL|DIAZED/i.test(all)) {
    return '/assets/components/fusivel-nh.svg';
  }

  // 19. Sensores Indutivos e Instrumentação
  if (/SENSOR.*INDUT|SENSOR.*PROX|BALLUFF|M12.*PNP|M18/i.test(all)) {
    return '/assets/components/sensor-indutivo.svg';
  }

  // 20. Válvulas Solenoide e Manifolds
  if (/VALVULA.*SOLEN|VALVULA.*PNEUM|MANIFOLD|BLOCO DE VALVULA|PRE-SELETOR.*DALMEC/i.test(all)) {
    return '/assets/components/valvula-pneumatica.svg';
  }

  // 21. Cilindros e Atuadores Pneumáticos
  if (/CILINDRO.*PNEUM|ATUADOR.*PNEUM/i.test(all)) {
    return '/assets/components/cilindro-pneumatico.svg';
  }

  // 22. Conexões Instantâneas e Mangueiras PU
  if (/CONEXAO|ADAPTADOR.*TUB|ADAPTADOR.*RET|ENGATE.*RAPID|TUBO.*PU|MANGUEIRA.*PU|FESTO.*QS|KQ2H|PBT.*PC/i.test(all)) {
    return '/assets/components/conexao-pneumatica.svg';
  }

  // 23. Retentores, O-rings e Gaxetas
  if (/RETENTOR|O-RING|ORING|GAXETA|ANEL VEDA|VEDACAO|SELO MECANICO/i.test(all)) {
    return '/assets/components/retentor-oring.svg';
  }

  // 24. Cabos Industriais e Conectores
  if (/CABO|CONECTOR|BORNE|HARTING|DSUB|D-SUB|ACOPLADOR.*REDE|PLUG/i.test(all)) {
    return '/assets/components/cabo-industrial.svg';
  }

  // 25. Motores Elétricos e Redutores
  if (/MOTOR.*ELETR|MOTOR.*TRIF|REDUTOR/i.test(all)) {
    return '/assets/components/motor-eletrico.svg';
  }

  // 26. Correias e Polias
  if (/CORREIA|POLIA|ENGRENAGEM|SINCRONIZAD/i.test(all)) {
    return '/assets/components/correia-dentada.svg';
  }

  // 27. Discos e Pastilhas de Freio
  if (/FREIO|DISCO DE FREIO|KAMPF.*8770|PASTILHA.*FREIO|ASTILHA.*FREIO/i.test(all)) {
    return '/assets/components/disco-freio.svg';
  }

  // 28. Manômetros e Instrumentação
  if (/MANOMETRO|TERMOPAR|TRANSMISSOR.*PRESSAO|BAR.*PSI/i.test(all)) {
    return '/assets/components/manometro.svg';
  }

  // 29. Adesivos e Loctite
  if (/ADESIVO|TRAVA.*ROSCA|LOCTITE|W742|ACETATO.*ETILA/i.test(all)) {
    return '/assets/components/adesivo-loctite.svg';
  }

  // 30. Filtros e Lubrificação
  if (/FILTRO|LUBRIFIC|OLEO/i.test(all)) {
    return '/assets/components/filtro-industrial.svg';
  }

  // 31. Abraçadeiras e Fitas
  if (/ABRACADEIRA|FITA ISOLANTE|FITA AUTO|FITA.*TEFLON/i.test(all)) {
    return '/assets/components/abracadeira.svg';
  }

  // 32. Gases Refrigerantes
  if (/GAS REFRIGERANTE|R-134|R-22|R-407|R-410/i.test(all)) {
    return '/assets/components/gas-refrigerante.svg';
  }

  // 33. Lâmpadas e Reatores
  if (/LAMPADA|REATOR.*ELETRONICO|TLD30W|BA15/i.test(all)) {
    return '/assets/components/lampada-reator.svg';
  }

  // Fallback por categoria
  if (cat.includes('FIXAÇÃO')) return '/assets/components/parafuso-sextavado.svg';
  if (cat.includes('PNEUMÁTICA')) return '/assets/components/conexao-pneumatica.svg';
  if (cat.includes('FUSÍVEIS')) return '/assets/components/fusivel-nh.svg';
  if (cat.includes('AUTOMAÇÃO')) return '/assets/components/clp-modulo.svg';
  if (cat.includes('CABOS')) return '/assets/components/cabo-industrial.svg';
  if (cat.includes('VEDAÇÃO')) return '/assets/components/retentor-oring.svg';
  if (cat.includes('MOTORES')) return '/assets/components/motor-eletrico.svg';
  if (cat.includes('FILTROS')) return '/assets/components/filtro-industrial.svg';
  if (cat.includes('SENSORES')) return '/assets/components/sensor-indutivo.svg';
  if (cat.includes('GASES')) return '/assets/components/gas-refrigerante.svg';
  if (cat.includes('ILUMINAÇÃO')) return '/assets/components/lampada-reator.svg';

  return '/assets/components/peca-mecanica-geral.svg';
}

// Generate comprehensive search keywords
function extractKeywords(codigo, descricao, fabricante, dimensao, categoria) {
  const text = `${codigo} ${descricao} ${fabricante || ''} ${dimensao || ''} ${categoria}`.toLowerCase();
  const tokens = text
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .split(/[\s,\.\/\-\_\(\)\:\;\*\+]+/)
    .filter(t => t.length >= 2 && !['de', 'da', 'do', 'em', 'para', 'com', 'sem', 'por'].includes(t));
  return Array.from(new Set(tokens)).slice(0, 15);
}

const recognizedCategories = [
  'Peças de Máquina / Reposição',
  'Comando e Manobra Elétrica',
  'Ferramentas e Utensílios',
  'Fusíveis e Proteção Elétrica',
  'Automação e Controle',
  'Sensores e Instrumentação',
  'Resistências e Aquecimento',
  'Motores e Transmissão',
  'Fontes e Eletrônica',
  'Gases e Consumíveis',
  'Cabos e Conectores',
  'Outros / Reposição',
  'Filtros',
  'Rolamentos',
  'Pneumática',
  'Hidráulica',
  'Iluminação',
  'Fixação',
  'Vedação'
];

const KNOWN_BRANDS = [
  'FESTO', 'SMC', 'SICK', 'SKF', 'HYDAC', 'ALTUS', 'SIEMENS', 'DALMEC',
  'WURTH', 'KAMPF', 'WEIDMULLER', 'OEMER', 'PIOVAN', 'BALLUFF', 'SABO',
  'TRAPP', 'LOCTITE', 'SCHNEIDER', 'ABB', 'WEG', 'OMRON', 'PHOENIX CONTACT',
  'DANFOSS', 'PARKER', 'REXROTH', 'IFM', 'BANNER', 'MOELLER', 'EATON', 'B&R'
];

let rawLines = [];
for (const f of ocrFiles) {
  if (fs.existsSync(f)) {
    const lines = fs.readFileSync(f, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
    rawLines.push(...lines);
  }
}

console.log(`Loaded ${rawLines.length} lines from OCR source files.`);

const allItems = [];

rawLines.forEach((line, index) => {
  const codeMatch = line.match(/^([A-Z0-9]{2}-[A-Z0-9]{4,5}-[A-Z0-9]{5}-[A-Z0-9]{2})\s+(.*)$/);
  if (!codeMatch) {
    console.warn(`Unmatched line format at index ${index}: ${line.slice(0, 40)}`);
    return;
  }

  const codigo = codeMatch[1];
  const rest = codeMatch[2];

  // Match category
  let catFound = '';
  let catIdx = -1;
  for (const c of recognizedCategories) {
    const pos = rest.indexOf(c);
    if (pos !== -1) {
      if (!catFound || c.length > catFound.length) {
        catFound = c;
        catIdx = pos;
      }
    }
  }

  const rawDescricao = (catIdx !== -1 ? rest.substring(0, catIdx) : rest).trim();
  const afterCat = catIdx !== -1 ? rest.substring(catIdx + catFound.length).trim() : '';

  // Extract page/gaveta at the end
  const pageMatch = afterCat.match(/(?:_{3,}\s*)?(\d{1,4})$/);
  const gaveta = pageMatch ? pageMatch[1] : '';
  const middle = pageMatch ? afterCat.substring(0, pageMatch.index).trim() : afterCat;

  // Middle might have subgrupo and details
  const middleTokens = middle.split(/\s+/);
  const subcat = middleTokens[0] || '';
  const details = middleTokens.slice(1).join(' ').replace(/_{3,}/g, '').trim();

  // Try to detect brand and dimension from details and description
  let detectedBrand = '';
  const uppercaseRest = `${rawDescricao} ${details}`.toUpperCase();
  for (const brand of KNOWN_BRANDS) {
    if (new RegExp(`\\b${brand}\\b`, 'i').test(uppercaseRest)) {
      detectedBrand = brand;
      break;
    }
  }

  let detectedDim = '';
  const dimRegex = /(?:M\d+[\s,xX\.\d]+MM|\d+[\s,xX\.\d]+MM|\d+[\s,xX\.\d]+ pol|\d+\/\d+"?|\b\d+G\b|\b\d+KG\b|\b\d+V\b|\b\d+W\b)/i;
  const dimMatch = `${details} ${rawDescricao}`.match(dimRegex);
  if (dimMatch) {
    detectedDim = dimMatch[0].trim();
  }

  const normalizedCat = normalizeCategory(catFound);
  const location = gaveta ? `Almoxarifado Central - Gaveta / Box ${gaveta}` : 'Almoxarifado Central - Prateleira Geral';
  
  const obsParts = [];
  if (detectedBrand) obsParts.push(`Fabricante: ${detectedBrand}`);
  if (detectedDim) obsParts.push(`Dimensão / Especificação: ${detectedDim}`);
  if (details && details !== 'N/A' && details !== detectedBrand && details !== detectedDim) {
    obsParts.push(`Detalhes: ${details}`);
  }
  if (gaveta) obsParts.push(`Endereço físico: Gaveta ${gaveta}`);
  if (subcat) obsParts.push(`Subcategoria: ${subcat}`);

  const observacoes = obsParts.join(' | ') || 'Item cadastrado no catálogo técnico Huhtamaki.';
  const keywords = extractKeywords(codigo, rawDescricao, detectedBrand, detectedDim, normalizedCat);
  const imagemUrl = getComponentImageUrl(codigo, rawDescricao, normalizedCat);

  allItems.push({
    id: `item-${index + 1}`,
    codigo,
    descricao: rawDescricao,
    categoria: normalizedCat,
    fabricante: detectedBrand || undefined,
    dimensao: detectedDim || undefined,
    localizacao: location,
    palavrasChave: keywords,
    imagemUrl,
    favorito: false,
    status: 'disponivel',
    observacoes,
    documentos: [],
    dataCriacao: '2025-01-15'
  });
});

console.log(`Generated exactly ${allItems.length} catalog items!`);

// Print category distribution
const dist = {};
allItems.forEach(i => { dist[i.categoria] = (dist[i.categoria] || 0) + 1; });
console.log('Category distribution:', dist);

// Print image distribution
const imgDist = {};
allItems.forEach(i => { imgDist[i.imagemUrl] = (imgDist[i.imagemUrl] || 0) + 1; });
console.log('Image distribution across items:', Object.keys(imgDist).length, 'distinct images used.');

// Save to JSON
const outputPath = path.join(__dirname, '../src/data/catalogItems.json');
fs.writeFileSync(outputPath, JSON.stringify(allItems, null, 2), 'utf8');
console.log(`Successfully saved ${allItems.length} items to ${outputPath}`);
