const fs = require('fs');
const path = require('path');

// Master PDF files covering all 38 pages of the physical catalogue
const pdfFiles = [
  path.join(__dirname, '../src/data/raw/pdf_pages_01_10.txt'),
  path.join(__dirname, '../src/data/raw/pdf_pages_11_20.txt'),
  path.join(__dirname, '../src/data/raw/pdf_pages_21_30.txt'),
  path.join(__dirname, '../src/data/raw/pdf_pages_31_38.txt'),
];

// Load existing catalog items to preserve user customizations or existing documents/favoritos
const existingPath = path.join(__dirname, '../src/data/catalogItems.json');
let existingMap = new Map();
if (fs.existsSync(existingPath)) {
  try {
    const existingData = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
    if (Array.isArray(existingData)) {
      for (const item of existingData) {
        existingMap.set(item.codigo, item);
      }
    }
  } catch (e) {
    console.warn('Could not read existing catalog:', e.message);
  }
}

// Map raw class codes and descriptions to standard UI categories
function detectCategory(code, desc, classeDesc) {
  const c = (code || '').toUpperCase();
  const d = (desc || '').toUpperCase();
  const cd = (classeDesc || '').toUpperCase();

  if (c.includes('FIXAR') || /PARAFUSO|PORCA|ARRUELA|BARRA ROSCADA|CHAVETA|CHUMBADOR|REBITE/i.test(d)) return 'FIXAÇÃO';
  if (c.includes('PNEUM') || /CILINDRO PNEUM|VALVULA.*PNEUM|VALVULA SOLENOIDE|REGULADOR.*FLUXO|GERADOR.*VACUO|ENGATE RAPIDO|TUBO.*PU|PUN-H|SILENCIADOR PNEUM/i.test(d)) return 'PNEUMÁTICA';
  if (c.includes('LUBRI') || /GRAXA|OLEO LUBRIFICANTE|LUBRIFICANTE|KENDEX/i.test(d)) return 'FILTROS E LUBRIFICAÇÃO';
  if (c.includes('VEDAC') || c.includes('ANEIS') || /O-RING|GAXETA|RETENTOR|JUNTA|CHEVRON|QUAD-RING|VEDACAO/i.test(d)) return 'VEDAÇÃO';
  if (c.includes('CABOS') || /CABO.*PP|CABO FLEXIVEL|CONECTOR M12|CONECTOR MACHO RETO|BORNE|CONDULETE/i.test(d)) return 'CABOS E CONECTORES';
  if (c.includes('FUSIV') || /FUSIVEL|DISJUNTOR|MINIDISJUNTOR|DPS|RELE TERMICO|SECCIONADORA/i.test(d)) return 'FUSÍVEIS E PROTEÇÃO ELÉTRICA';
  if (c.includes('ILUMI') || /LAMPADA|LUMINARIA|PROJETOR LED|REATOR/i.test(d)) return 'ILUMINAÇÃO ELÉTRICA';
  if (c.includes('SENSO') || /SENSOR|ENCODER|TRANSMISSOR|TERMOELEMENTO|TERMOPAR|PRESSOSTATO/i.test(d)) return 'SENSORES E INSTRUMENTAÇÃO';
  if (c.includes('MOTOR') || /MOTOR ELETRICO|MOTOREDUTOR|INVERSOR DE FREQUENCIA|SERVO/i.test(d)) return 'MOTORES E TRANSMISSÃO';
  if (/ROLAMENTO|MANCAL/i.test(d) || (c.includes('REPOS') && /ROLAMENTO|MANCAL|ESFERAS|AGULHA/i.test(d))) return 'ROLAMENTOS';
  if (c.includes('FERRA') || c.includes('CORTE') || c.includes('ESPAT') || /CHAVE COMBINADA|CHAVE FIXA|ALICATE|MARTELO|TRENA|PAQUIMETRO|MICROMETRO|ESTILETE|SACADOR|ARCO DE SERRA/i.test(d)) return 'FERRAMENTAS E UTENSÍLIOS';
  if (c.startsWith('SG-') || c.startsWith('UN-') || /BOTINA|LUVAS?|CAPACETE|OCULOS|RESPIRADOR|PROTETOR AURICULAR|AVENTAL|CALCA|CAMISA|UNIFORME|JALECO|MASCARA/i.test(d)) return 'SEGURANÇA E ACESSÓRIOS';
  if (c.includes('CPELE')) {
    if (/CLP|CARTAO|MODULO|FONTE|CPU|INTERFACE|PROFIBUS/i.test(d)) return 'AUTOMAÇÃO E CONTROLE';
    if (/BOTAO|BOTOEIRA|CHAVE COMUTADORA|SINALEIRO|CONTATOR|RELE/i.test(d)) return 'COMANDO E SINALIZAÇÃO';
    return 'AUTOMAÇÃO E CONTROLE';
  }
  if (c.includes('HIDRA') || /REGISTRO DE ESFERA|VALVULA REDUTORA DE PRESSAO DE AGUA|FILTRO Y PARA AGUA|VALVULA RETENCAO/i.test(d)) return 'HIDRÁULICA';
  if (c.includes('ABRAS') || /LIXA|DISCO DE CORTE|REBOLO/i.test(d)) return 'FERRAMENTAS E UTENSÍLIOS';
  if (cd.includes('SEGURANCA')) return 'SEGURANÇA E ACESSÓRIOS';
  if (cd.includes('ELETRICO')) return 'AUTOMAÇÃO E CONTROLE';
  if (cd.includes('MECANICO')) return 'OUTROS / REPOSIÇÃO';
  return 'OUTROS / REPOSIÇÃO';
}

const KNOWN_BRANDS = [
  'FESTO', 'SMC', 'SICK', 'SKF', 'FAG', 'HYDAC', 'ALTUS', 'SIEMENS', 'DALMEC',
  'WURTH', 'KAMPF', 'WEIDMULLER', 'OEMER', 'PIOVAN', 'BALLUFF', 'SABO',
  'TRAPP', 'LOCTITE', 'SCHNEIDER', 'ABB', 'WEG', 'OMRON', 'PHOENIX CONTACT', 'PHOENIX',
  'DANFOSS', 'PARKER', 'REXROTH', 'IFM', 'BANNER', 'MOELLER', 'EATON', 'B&R', 'BeR',
  'GEDORE', 'BELZER', 'STARRETT', 'TRAMONTINA', 'MITUTOYO', '3M', 'TIGRE', 'DECA',
  'LORENZETTI', 'GATES', 'CONTITECH', 'OPTIBELT', 'VISE-GRIP', 'BOZZA', 'KLUBER',
  'MOBIL', 'KENDEX', 'ROCOL', 'TECFIL', 'MANN', 'PILZ', 'PEPPERL', 'PEPPERL+FUCHS',
  'TURCK', 'KEYENCE', 'FINDER', 'COEL', 'NOVUS', 'FLUKE', 'BILSTEIN', 'IRANI',
  'STYROPLAST', 'NORTON', 'CARBO'
];

function detectBrand(text, extra) {
  const combined = `${text} ${extra || ''}`.toUpperCase();
  for (const b of KNOWN_BRANDS) {
    const escaped = b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(combined)) {
      if (b === 'BeR') return 'B&R';
      return b;
    }
  }
  return undefined;
}

function detectDimension(text) {
  const t = text.toUpperCase();
  // Match M10X30, M6, 1/4", 1/2", 8MM, 1000X1000, 24V, 5500W, etc.
  const match = t.match(/\b(M\d+(?:[X,]\d+)?(?:\s*MM)?|\d+(?:\.\d+)?(?:\/\d+)?(?:"|''|POL)|\d+X\d+(?:X\d+)?(?:MM|CM)?|\d+\s*MM|\d+\s*V|\d+\s*W|\d+\s*KG|\d+\s*BAR)\b/);
  return match ? match[1].trim() : undefined;
}

// Component image resolver mapping to technical CAD assets in /assets/components/
function getComponentImageUrl(codigo, descricao, categoria) {
  const c = (codigo || '').toUpperCase();
  const d = (descricao || '').toUpperCase();
  const cat = (categoria || '').toUpperCase();
  const all = `${c} ${d} ${cat}`;

  // 1. Anel Elástico (Circlip / Seeger DIN 471 / DIN 472)
  if (/ANEL ELAST|ANEL.*EXTERNO|ANEL.*INTERNO|SEEGER|DIN 471|DIN 472|ANEIS/i.test(all)) {
    return '/assets/components/anel-elastico.svg';
  }

  // 2. Rolamentos
  if (/ROLAMENTO|6204|63\/28|MANCAL|BEARING|ESFERAS|CONICOS|AGULHA/i.test(all)) {
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

  // 7. Parafuso Allen Sem Cabeça
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

  // 10. Arruelas
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

  // 13. Cilindro Pneumático
  if (/CILINDRO.*PNEUM|CILINDRO.*COMPAC|CILINDRO.*GUIA|CDQ2|CQ2|DSBC|MGPL|MGPM/i.test(all)) {
    return '/assets/components/cilindro-pneumatico.svg';
  }

  // 14. Válvulas Pneumáticas e Solenoides
  if (/VALVULA.*SOLEN|VALVULA.*PNEUM|VUVG|SY[357]|VT307/i.test(all)) {
    return '/assets/components/valvula-solenoide.svg';
  }

  // 15. Regulador de Pressão / Filtro Regulador
  if (/REGULADOR.*PRESS|LFR|AW40|MS4-LR|MS6-LR/i.test(all)) {
    return '/assets/components/regulador-pressao.svg';
  }

  // 16. Conexões Pneumáticas
  if (/CONECTOR.*MACHO|ADAPTADOR.*RETO|UNIAO.*T|UNIAO.*Y|COTOVELO|REGULADOR.*FLUX|QS-|QSL-|QST-|KQ2/i.test(all)) {
    return '/assets/components/conexao-pneumatica.svg';
  }

  // 17. Tubos Pneumáticos
  if (/TUBO.*FLEX|TUBO.*PU|PUN-H|POLIURETANO/i.test(all)) {
    return '/assets/components/tubo-poliuretano.svg';
  }

  // 18. CLP / Módulos de I/O
  if (/CLP|CARTAO.*ANALOG|CARTAO.*DIGIT|MODULO.*IO|CPU|7AI|7DI|7DO/i.test(all)) {
    return '/assets/components/clp-modulo.svg';
  }

  // 19. Sensores Indutivos e Ópticos
  if (/SENSOR|FOTOCELULA|ENCODER|PROXIMIDADE/i.test(all)) {
    return '/assets/components/sensor-indutivo.svg';
  }

  // 20. Disjuntores e Mini-disjuntores
  if (/DISJUNTOR|MINIDISJUNTOR|MOTOR.*DISJUNTOR|3RV|5SY/i.test(all)) {
    return '/assets/components/disjuntor-motor.svg';
  }

  // 21. Contatores
  if (/CONTATOR|MINICONTATOR|3RT|LC1D|CWB/i.test(all)) {
    return '/assets/components/contator-eletrico.svg';
  }

  // 22. Relés Industriais
  if (/RELE.*ACOPLAD|RELE.*TEMPO|RELE.*SEGURANCA|RELE.*INTERFACE/i.test(all)) {
    return '/assets/components/rele-acoplador.svg';
  }

  // 23. Botões e Sinaleiros
  if (/BOTAO|BOTOEIRA|SINALEIRO|CHAVE.*COMUTAD|PULSADOR/i.test(all)) {
    return '/assets/components/botao-comando.svg';
  }

  // 24. Bornes de Passagem
  if (/BORNE|CONECTOR.*PARAF|TERMINAL.*PAS/i.test(all)) {
    return '/assets/components/borne-passagem.svg';
  }

  // 25. Fontes de Alimentação
  if (/FONTE.*CHAVEADA|FONTE.*ALIMENTACAO|POWER SUPPLY/i.test(all)) {
    return '/assets/components/fonte-chaveada.svg';
  }

  // 26. Fusíveis NH / D / Ultrarrápidos
  if (/FUSIVEL|NH00|NH1|FUS.*ULTRA/i.test(all)) {
    return '/assets/components/fusivel-nh.svg';
  }

  // 27. Cabos Elétricos e Industriais
  if (/CABO.*PP|CABO.*FLEX|CABO.*COMANDO|CORDAO/i.test(all)) {
    return '/assets/components/cabo-industrial.svg';
  }

  // 28. O-rings e Vedações
  if (/O-RING|ORING|VEDACAO|GAXETA|RETENTOR|QUAD-RING|CHEVRON/i.test(all)) {
    return '/assets/components/retentor-oring.svg';
  }

  // 29. Motores Elétricos
  if (/MOTOR.*ELETR|MOTOREDUTOR|SERVOMOTOR/i.test(all)) {
    return '/assets/components/motor-eletrico.svg';
  }

  // 30. Filtros Industriais
  if (/FILTRO.*OLEO|ELEMENTO.*FILTRANTE|HYDAC/i.test(all)) {
    return '/assets/components/filtro-industrial.svg';
  }

  // 31. Correias de Transmissão
  if (/CORREIA.*DENTADA|CORREIA.*V|SYNCHROFLEX|OPTIBELT|CONTITECH|GATES/i.test(all)) {
    return '/assets/components/correia-dentada.svg';
  }

  // 32. Gases Refrigerantes
  if (/GAS.*REFRIGERANTE|R-134|R-22|R-407|R-410/i.test(all)) {
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

function extractKeywords(codigo, descricao, fabricante, dimensao, categoria, extra) {
  const text = `${codigo} ${descricao} ${fabricante || ''} ${dimensao || ''} ${categoria} ${extra || ''}`.toLowerCase();
  const tokens = text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(/[\s,\.\/\-\_\(\)\:\;\*\+]+/)
    .filter(t => t.length >= 2 && !['de', 'da', 'do', 'em', 'para', 'com', 'sem', 'por', 'conf'].includes(t));
  return Array.from(new Set(tokens)).slice(0, 15);
}

// Units regex at end of line: e.g. " UN UN ANEIS" or " PC PC PNEUM"
const unitsRegex = /\s+(UN|PC|MT|RL|PAR|CX|PCT|KG|BR|TB|FR|JG|POT|BG|ML)\s+(UN|PC|MT|RL|PAR|CX|PCT|KG|BR|TB|FR|JG|POT|BG|ML)(\s+.*)?$/;

const allParsedItems = [];
const seenCodes = new Set();

let totalLinesProcessed = 0;

for (const f of pdfFiles) {
  if (!fs.existsSync(f)) {
    console.warn(`File not found: ${f}`);
    continue;
  }
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('==') || line.startsWith('Cod.Classe')) continue;
    totalLinesProcessed++;

    const codeMatch = line.match(/([A-Z]{2}-[A-Z0-9]+-\d{4,5}-\d{2})/);
    if (!codeMatch) continue;

    const itemNumber = codeMatch[1];
    if (seenCodes.has(itemNumber)) continue;
    seenCodes.add(itemNumber);

    const idx = line.indexOf(itemNumber);
    const prefix = line.substring(0, idx).trim();
    const suffix = line.substring(idx + itemNumber.length).trim();

    // Prefix contains class code and class name
    const prefixParts = prefix.split(/\s+/);
    const codClasse = prefixParts[0] ? prefixParts[0].slice(0, 2) : itemNumber.slice(0, 2);
    const descrClasse = prefixParts.length > 1 ? prefixParts.slice(1).join(' ') : prefix;

    // Suffix contains description + units + extra
    const unitMatch = suffix.match(unitsRegex);
    let rawDesc = suffix;
    let uomEstoque = '';
    let uomCompra = '';
    let extraDesc = '';
    if (unitMatch) {
      rawDesc = suffix.substring(0, unitMatch.index).trim();
      uomEstoque = unitMatch[1];
      uomCompra = unitMatch[2];
      extraDesc = (unitMatch[3] || '').trim();
    }

    const detectedCat = detectCategory(itemNumber, rawDesc, descrClasse);
    const detectedBrand = detectBrand(rawDesc, extraDesc);
    const detectedDim = detectDimension(rawDesc);

    // Check if we have an existing item to preserve user edits
    const existing = existingMap.get(itemNumber);

    const categoria = existing?.categoria || detectedCat;
    const fabricante = existing?.fabricante || detectedBrand;
    const dimensao = existing?.dimensao || detectedDim;
    const imagemUrl = existing?.imagemUrl || getComponentImageUrl(itemNumber, rawDesc, categoria);
    const favorito = existing?.favorito ?? false;
    const status = existing?.status || 'disponivel';
    const documentos = existing?.documentos || [];
    const dataCriacao = existing?.dataCriacao || '2025-01-15';

    // Build location
    let localizacao = existing?.localizacao;
    if (!localizacao) {
      // Deterministic box/gaveta based on code number
      const numMatch = itemNumber.match(/(\d{4,5})-\d{2}$/);
      const boxNum = numMatch ? parseInt(numMatch[1], 10) % 400 + 1 : 101;
      localizacao = `Almoxarifado Central - Gaveta / Box ${boxNum}`;
    }

    // Build observacoes
    const obsParts = [];
    if (descrClasse) obsParts.push(`Classe: ${descrClasse}`);
    if (fabricante) obsParts.push(`Fabricante: ${fabricante}`);
    if (dimensao) obsParts.push(`Dimensão: ${dimensao}`);
    if (uomEstoque) obsParts.push(`Unid. Estoque: ${uomEstoque}`);
    if (uomCompra && uomCompra !== uomEstoque) obsParts.push(`Unid. Compra: ${uomCompra}`);
    if (extraDesc) obsParts.push(`Especificação Extra: ${extraDesc}`);

    const observacoes = existing?.observacoes || obsParts.join(' | ');
    const palavrasChave = extractKeywords(itemNumber, rawDesc, fabricante, dimensao, categoria, extraDesc);

    allParsedItems.push({
      id: existing?.id || `item-${allParsedItems.length + 1}`,
      codigo: itemNumber,
      descricao: rawDesc,
      categoria,
      fabricante,
      dimensao,
      localizacao,
      palavrasChave,
      imagemUrl,
      favorito,
      status,
      observacoes,
      documentos,
      dataCriacao,
    });
  }
}

// Also include any items from existing that weren't in PDF (e.g. user manually created items)
for (const [code, item] of existingMap) {
  if (!seenCodes.has(code)) {
    allParsedItems.push(item);
  }
}

console.log(`Total items in updated catalogue: ${allParsedItems.length}`);

// Category distribution
const catCount = {};
allParsedItems.forEach(i => {
  catCount[i.categoria] = (catCount[i.categoria] || 0) + 1;
});
console.log('Category distribution:');
console.table(catCount);

// Save to catalogItems.json
fs.writeFileSync(existingPath, JSON.stringify(allParsedItems, null, 2), 'utf8');
console.log(`Updated ${existingPath} successfully!`);
