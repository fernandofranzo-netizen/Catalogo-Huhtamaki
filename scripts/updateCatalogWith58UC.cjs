const fs = require('fs');
const path = require('path');

// Path references
const catalogPath = path.join(__dirname, '../src/data/catalogItems.json');
const currentItems = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// 1. Official 58 Items from user prompt
const raw58List = `MATERIAL DE USO/CONSUMO	UC-ACETA-00001-00	ACETATO DE ETILA C/180 KG		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-BOLSA-00001-00	BOLSA DESSECANTE SILICA CDSAFETY/SACHE DESSECANTE		 	 
MATERIAL DE USO/CONSUMO	UC-BOLSA-00002-00	BOLSA DESSECANTE ALL DRI T6 750G COD. 28272090		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-CADEA-00001-00	CADEADO LAT 25MM HAST PADR 17MM UNID		Office supplies                                   	Office supplies                                                  
MATERIAL DE USO/CONSUMO	UC-CADEA-00002-00	CADEADO LAT 50MM DOURAD 31,66MM UNID		Office supplies                                   	Office supplies                                                  
MATERIAL DE USO/CONSUMO	UC-COPOS-00001-00	COPO DESCART PP 200ML BR CX COM25 PCT 2500 P/ CX		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-ESCOV-00001-00	ESCOVA MANUAL DE LATAO C/CABO DE MADEIRA		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESPAT-00001-00	ESPATULA DE LATAO C/CABO DE TECNYL 250MM		 	 
MATERIAL DE USO/CONSUMO	UC-ESPAT-00002-00	ESPATULA DE LATAO C/PONTA DE CHAPA 0,7MM		Tools                                             	Hand tools                                                       
MATERIAL DE USO/CONSUMO	UC-ESPAT-00003-00	ESPATULA DE LATAO CHAPA 1,00MM COM PONTA		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESPAT-00004-00	ESPATULA DE LATAO CHAPA 0,9 MM COM PONTA		 	 
MATERIAL DE USO/CONSUMO	UC-ESPAT-00005-00	ESPATULA DE LATAO CHAPA 0,8MM COM PONTA		Tools                                             	Hand tools                                                       
MATERIAL DE USO/CONSUMO	UC-ESPAT-00006-00	ESPATULA DE LATAO CHAPA 0,6MM COM PONTA		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESPAT-00007-00	ESPATULA DE LATAO RETANGULAR 300MM X 60MM X 0,7MM		Tools                                             	Hand tools                                                       
MATERIAL DE USO/CONSUMO	UC-ESPAT-00008-00	ESPATULA DE LATAO RETANGULAR 300MM X 60MM X 0,8		 	 
MATERIAL DE USO/CONSUMO	UC-ESPAT-00009-00	ESPATULA DE LATAO C/CABO DE TECNYL 300MM		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESPON-00001-00	ESPONJA DE COBRE CG-100 P/LIMPEZA DE MAQUINA		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESPON-00002-00	ESPONJA ESP MET P/LIMP LAT UNID		 	 
MATERIAL DE USO/CONSUMO	UC-ESTIL-00001-00	ESTILETE FIX LARG PT/AZ MARTOR/121001		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESTIL-00002-00	ESTILETE RETR ESTR PT/AZ MARTOR/119001		 	 
MATERIAL DE USO/CONSUMO	UC-ESTIL-00003-00	ESTILETE RETR LARG PT AL MARTOR/14152		 	 
MATERIAL DE USO/CONSUMO	UC-ESTIL-00004-00	ESTILETE RETR LARG PT PS MARTOR/101899		 	 
MATERIAL DE USO/CONSUMO	UC-ESTIL-00005-00	ESTILETE LAMINA CERAMICA PEN CUTTER - SLICE		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESTIL-00006-00	ESTILETE LAM OCULTA PT MARTOR/145000116		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESTIL-00007-00	ESTILETE RETR LARG SLICE PRODUCTS/10558		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESTIL-00008-00	ESTILETE AUTO-RETR ESTR AL MARTOR/625001		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESTIL-00009-00	ESTILETE AUTO-RETR CABO METAL SLICE/10491		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESTIL-00010-00	BISTURI CRAFT PRECISAO TAMPA DE SEG SLICE/10589		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-ESTIL-00011-00	CORTADOR DE SEGURANCA KLEVER KUTTER AMARELO	CODIGO:20.01.123	Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-FIBRA-00001-00	FIBRA LIMP NY AZ 125X87MM SERV ULTR PES		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-FIBRA-00002-00	FIBRA LIMP NY VD 102X260MM SERV PES		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-FIBRA-00003-00	FOLHA ACABAMENTO S-UF 134X240X10MM HC000589388 3M		Premises maintenance services                     	Industry cleaning incl supplies                                  
MATERIAL DE USO/CONSUMO	UC-FITAS-00001-00	FITA FELTRO COD:883015863 B=016 S=02 L=2000		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LAMIN-00001-00	LAMINA CORT INOX 19MM STEELSERV/RB023ASS		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LAMIN-00002-00	LAMINA REGELSAFE 5232 0,63MM - MARTOR		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LAMIN-00003-00	LAMINA PARA ESTILETE MAXISAFE REF.250-99.70 - MART		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LAMIN-00004-00	LAMINA 45.60 MARTOR APRESENTACAO CX COM 10		Tools                                             	Hand tools                                                       
MATERIAL DE USO/CONSUMO	UC-LAMIN-00005-00	LAMINA CERAMICA 10404-SLICE P/ ESTILETE PEN CUTTER		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LAMIN-00006-00	LAMINA P/ESTIL CERAM LARG 65X12X1,30MM		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LAMIN-00007-00	LAMINA DE ACO REFERENCIA 64100-78  100MM X 22MM X	0,2MM CAIXA COM 10 LAMINAS FABRICANTE MARTOR	Doctor blades                                     	Doctor blades                                                    
MATERIAL DE USO/CONSUMO	UC-LAMIN-00008-00	LAMINA CERAMICA SLICE 10524 P/ESTILETE 10490/10491		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LAMIN-00009-00	LAMINA CERAM P/BISTURI CRAFT PRECISAO SLICE/10519		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LAMIN-00010-00	LAMINA DE CERAMICA N.60099C FAB: MARTOR		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LIMPE-00001-00	ALCOOL ETILICO ABSTO 99,5% PA C2H60 PM46,07 FAB. A	TRIOM	Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-LIMPE-00002-00	ALCOOL ETILICO HIDRATADO 70GRAUS EMB 1L FAB DELTA		 	 
MATERIAL DE USO/CONSUMO	UC-LIMPE-00003-00	RESERVATORIO PARA SABONETEIRA PREMISSE 800ML		 	 
MATERIAL DE USO/CONSUMO	UC-LIMPE-00015-00	SILICONE LIQ VM ELASTOSILE6025KG		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-LIMPE-00020-00	ALCOOL ANTISSEPT 70GR INPM GEL EMB 5L		 	 
MATERIAL DE USO/CONSUMO	UC-LIMPE-00021-00	PANO P/LIMP CELUL BR 30243064 X-70 1X1X750		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-LIMPE-00022-00	CABO P/MOP/PA/RODO/VASS AC CZ/PT 1020MM		Consumables                                       	Cleaning supplies                                                
MATERIAL DE USO/CONSUMO	UC-LIMPE-00023-00	PANO WYPALL X70 PLUS 6X88HJ KIMBERLY-CLARK		Personal Protection Equipment                     	Disposable cloths                                                
MATERIAL DE USO/CONSUMO	UC-LIMPE-00024-00	TRAVESSEIRO ABSORV BRANCO 23X23CM POLIPROPILENO		Personal Protection Equipment                     	Disposable cloths                                                
MATERIAL DE USO/CONSUMO	UC-LIMPE-00025-00	CORDAO ABSORV BRANCO TAM 7,6X1,20CM POLIPROPILENO		Personal Protection Equipment                     	Disposable cloths                                                
MATERIAL DE USO/CONSUMO	UC-LIMPE-00026-00	MANTA ABSOR BRANCA TM 50CMX40CMX4MM POLIPROPILENO		Personal Protection Equipment                     	Disposable cloths                                                
MATERIAL DE USO/CONSUMO	UC-LIMPE-00027-00	TURFA ABSORVENTE NATURAL SACO 10KG		Personal Protection Equipment                     	Disposable cloths                                                
MATERIAL DE USO/CONSUMO	UC-PARAF-00001-00	PARAFINA SOLIDA BARRA C/1KG		Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-TESOU-00001-00	TESOURA DE SEGURANCA SB-EASY 25 - REF. 25125	CODIGO:20.03.011	Consumables                                       	Consumables                                                      
MATERIAL DE USO/CONSUMO	UC-TRENA-00001-00	TRENA  TRU-LOK 63MM/3M-10' - STARRET		Tools                                             	Hand tools`;

const subcatMap = {
  'UC-ACETA': 'Solventes e Químicos Industriais',
  'UC-BOLSA': 'Dessecantes e Sílica Gel',
  'UC-CADEA': 'Cadeados e Dispositivos de Bloqueio',
  'UC-COPOS': 'Copos e Descartáveis',
  'UC-ESCOV': 'Escovas Manuais e Abrasivas',
  'UC-ESPAT': 'Espátulas Industriais de Latão',
  'UC-ESPON': 'Esponjas e Telas de Limpeza',
  'UC-ESTIL': 'Estiletes e Cortadores de Segurança',
  'UC-FIBRA': 'Fibras e Folhas Abrasivas',
  'UC-FITAS': 'Feltros e Fitas Especiais',
  'UC-LAMIN': 'Lâminas de Precisão e Cerâmica',
  'UC-LIMPE': 'Higiene, Limpeza e Absorventes Industriais',
  'UC-PARAF': 'Parafinas e Ceras Industriais',
  'UC-TESOU': 'Tesouras Industriais de Segurança',
  'UC-TRENA': 'Trena e Instrumentos de Medição',
};

const user58Items = raw58List.trim().split('\n').map((l) => {
  const parts = l.split('\t');
  const cat = parts[0]?.trim();
  const codigo = parts[1]?.trim();
  const descricao = parts[2]?.trim();
  const descricaoExtra = parts[3]?.trim() || '';
  const materialGroup = parts[4]?.trim() || 'Consumables';
  const materialStructure = parts[5]?.trim() || 'Consumables';

  const pfx = codigo.slice(0, 8);
  const subcategoria = subcatMap[pfx] || 'Consumíveis Diversos';

  // Manufacturer extraction
  let fabricante = '';
  if (/MARTOR/i.test(descricao + descricaoExtra)) fabricante = 'MARTOR';
  else if (/SLICE/i.test(descricao + descricaoExtra)) fabricante = 'SLICE';
  else if (/3M/i.test(descricao + descricaoExtra)) fabricante = '3M';
  else if (/KIMBERLY|WYPALL/i.test(descricao + descricaoExtra)) fabricante = 'KIMBERLY-CLARK';
  else if (/STARRET/i.test(descricao + descricaoExtra)) fabricante = 'STARRETT';
  else if (/DELTA/i.test(descricao + descricaoExtra)) fabricante = 'DELTA';
  else if (/PREMISSE/i.test(descricao + descricaoExtra)) fabricante = 'PREMISSE';
  else if (/ELASTOSIL/i.test(descricao + descricaoExtra)) fabricante = 'WACKER';
  else if (/KLEVER/i.test(descricao + descricaoExtra)) fabricante = 'KLEVER';
  else if (/CDSAFETY/i.test(descricao + descricaoExtra)) fabricante = 'CDSAFETY';
  else if (/ALL DRI/i.test(descricao + descricaoExtra)) fabricante = 'ALL DRI';
  else if (/STEELSERV/i.test(descricao + descricaoExtra)) fabricante = 'STEELSERV';
  else if (/TRIOM/i.test(descricao + descricaoExtra)) fabricante = 'TRIOM';

  // Dimension extraction if present
  let dimensao = '';
  const dimMatch = (descricao + ' ' + descricaoExtra).match(/(\d+[\.,]?\d*\s*(MM|CM|M|KG|GRS|G|L|ML|'|")(\s*X\s*\d+[\.,]?\d*\s*(MM|CM|M|')*)?)/i);
  if (dimMatch) dimensao = dimMatch[0].trim();

  const words = `${descricao} ${descricaoExtra} ${subcategoria} ${fabricante} ${codigo}`
    .toLowerCase()
    .split(/[^a-z0-9áàâãéêíóôõúç]+/)
    .filter((w) => w.length >= 2);

  const palavrasChave = Array.from(
    new Set([
      ...codigo.toLowerCase().split('-'),
      ...words,
      'material de uso/consumo',
      'material uso/consumo',
      'consumo',
      'uso',
      'consumíveis',
      'utensílios',
    ])
  );

  let imagemUrl = '/assets/components/estilete-lamina.svg';
  if (codigo.startsWith('UC-FITAS')) {
    imagemUrl = '/assets/components/peca-mecanica-geral.svg';
  } else if (codigo.startsWith('UC-CADEA') || codigo.startsWith('UC-TRENA')) {
    imagemUrl = '/assets/components/estilete-lamina.svg';
  }

  return {
    id: `item-${codigo.toLowerCase()}`,
    codigo,
    descricao,
    descricaoExtra,
    categoria: 'MATERIAL DE USO/CONSUMO',
    subcategoria,
    materialGroup,
    materialStructure,
    fabricante: fabricante || undefined,
    dimensao: dimensao || undefined,
    localizacao: 'Almoxarifado Central - Prateleira Consumíveis',
    status: 'disponivel',
    documentos: [],
    palavrasChave,
    imagemUrl,
  };
});

console.log(`Parsed ${user58Items.length} official items for MATERIAL DE USO/CONSUMO.`);

// Map of items by code
const finalCatalogMap = new Map();

// Put current items (preserving their rich curation)
currentItems.forEach((item) => {
  if (item.codigo === 'UC-FITAS-00001-00') return; // will be replaced with user version
  finalCatalogMap.set(item.codigo, item);
});

// Add/overwrite with the 58 official user items
user58Items.forEach((item) => {
  finalCatalogMap.set(item.codigo, item);
});

// Now parse missing mechanical and electrical items from pdf_pages_01_10, 11_20, 21_30, 31_38
const pdfFiles = [
  path.join(__dirname, '../src/data/raw/pdf_pages_01_10.txt'),
  path.join(__dirname, '../src/data/raw/pdf_pages_11_20.txt'),
  path.join(__dirname, '../src/data/raw/pdf_pages_21_30.txt'),
  path.join(__dirname, '../src/data/raw/pdf_pages_31_38.txt'),
];

const categoryCleanMap = {
  'MATERIAL AUXILIAR DE PRODUCAO': 'MATERIAL AUXILIAR DE PRODUÇÃO',
  'MATERIAL AUXILIAR DE PRODUÇÃO': 'MATERIAL AUXILIAR DE PRODUÇÃO',
  'MATERIAL DE EMBALAGENS': 'MATERIAL DE EMBALAGENS',
  'MATERIAIS ESCRITORIO': 'MATERIAIS DE ESCRITÓRIO',
  'MATERIAIS DE ESCRITÓRIO': 'MATERIAIS DE ESCRITÓRIO',
  'MATERIAIS LIMPEZA': 'MATERIAIS DE LIMPEZA',
  'MATERIAIS DE LIMPEZA': 'MATERIAIS DE LIMPEZA',
  'MATERIAL DIVERSO': 'MATERIAIS DIVERSOS',
  'MATERIAIS DIVERSOS': 'MATERIAIS DIVERSOS',
  'MATERIAL ELETRICO': 'MATERIAL ELÉTRICO',
  'MATERIAL ELÉTRICO': 'MATERIAL ELÉTRICO',
  'MATERIAL MECANICO': 'MATERIAL MECÂNICO',
  'MATERIAL MECÂNICO': 'MATERIAL MECÂNICO',
  'MATERIAIS DE SEGURANCA': 'MATERIAIS DE SEGURANÇA',
  'MATERIAIS DE SEGURANÇA': 'MATERIAIS DE SEGURANÇA',
  'UNIFORMES': 'UNIFORMES',
  'UTENSILIOS E CONSUMIVEIS': 'MATERIAL DE USO/CONSUMO',
  'UTILITES-GAS': 'UTILITES-GÁS',
  'UTILITES-GÁS': 'UTILITES-GÁS',
};

const subcatPrefixMap = {
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
  'DVSOS': 'Materiais Diversos',
  'ANEIS': 'Anéis e Facas de Corte',
  'DISCO': 'Discos e Telas Filtrantes',
  'FITAS': 'Fitas Adesivas e Isolantes',
};

let addedFromPdf = 0;

pdfFiles.forEach((file) => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((l) => {
    const m = l.match(/([A-Z]{2})\s+([A-Z\s]+?)\s+([A-Z]{2}-[A-Z0-9]+-\d{4,5}-\d{2})\s+(.+)/);
    if (!m) return;

    const clsName = m[2].trim();
    const code = m[3];
    const rest = m[4].trim();

    // Do not add services or dummy codes or UC codes (UC handled officially above)
    if (code.startsWith('SE-') || code.includes('XXXXX') || code.startsWith('UC-')) return;
    if (code === 'MM-PNEUM-00110-00') return; // explicit deletion requirement

    if (finalCatalogMap.has(code)) return; // already preserved with rich curation

    const descParts = rest.split(/\s+(UN|PC|MT|CX|KG|LT|RL|PR|CJ|TB|GL|FD|JG|BL)\s+/i);
    const descricao = descParts[0]?.trim() || rest;
    const categoria = categoryCleanMap[clsName] || (clsName.includes('MECAN') ? 'MATERIAL MECÂNICO' : clsName);

    const pfx = code.split('-')[1] || '';
    const subcategoria = subcatPrefixMap[pfx] || 'Componentes Industriais';

    let fabricante = '';
    if (/SKF/i.test(descricao)) fabricante = 'SKF';
    else if (/FESTO/i.test(descricao)) fabricante = 'FESTO';
    else if (/SMC/i.test(descricao)) fabricante = 'SMC';
    else if (/SIEMENS/i.test(descricao)) fabricante = 'SIEMENS';
    else if (/WEG/i.test(descricao)) fabricante = 'WEG';
    else if (/SCHNEIDER/i.test(descricao)) fabricante = 'SCHNEIDER ELECTRIC';
    else if (/LOCTITE/i.test(descricao)) fabricante = 'LOCTITE';
    else if (/3M/i.test(descricao)) fabricante = '3M';
    else if (/REXROTH|BOSCH/i.test(descricao)) fabricante = 'BOSCH REXROTH';
    else if (/PARKER/i.test(descricao)) fabricante = 'PARKER';

    const words = `${descricao} ${categoria} ${subcategoria} ${fabricante} ${code}`
      .toLowerCase()
      .split(/[^a-z0-9áàâãéêíóôõúç]+/)
      .filter((w) => w.length >= 2);

    let imagemUrl = '/assets/components/peca-mecanica-geral.svg';
    if (pfx === 'PNEUM' || pfx === 'PENUM') imagemUrl = '/assets/components/valvula-pneumatica.svg';
    else if (pfx === 'FIXAR') imagemUrl = '/assets/components/parafuso-sextavado.svg';
    else if (pfx === 'ROLAM' || pfx === 'REPOS') imagemUrl = '/assets/components/rolamento.svg';
    else if (pfx === 'VEDAC') imagemUrl = '/assets/components/retentor-oring.svg';
    else if (pfx === 'CPELE' || categoria.includes('ELÉTRICO')) imagemUrl = '/assets/components/clp-modulo.svg';

    finalCatalogMap.set(code, {
      id: `item-${code.toLowerCase()}`,
      codigo: code,
      descricao,
      categoria,
      subcategoria,
      materialGroup: 'MRO',
      materialStructure: pfx || 'GERAL',
      fabricante: fabricante || undefined,
      localizacao: 'Almoxarifado Central',
      status: 'disponivel',
      documentos: [],
      palavrasChave: Array.from(new Set([...code.toLowerCase().split('-'), ...words])),
      imagemUrl,
    });

    addedFromPdf++;
  });
});

console.log(`Added ${addedFromPdf} missing items from full PDF base.`);

// Reapply the exact keyword curation rules for FITA and ADAPTADOR
const EXACT_FITA_CODES = new Set([
  'AU-FITAS-00001-00', 'AU-FITAS-00002-00', 'AU-FITAS-00003-00', 'AU-FITAS-00004-00', 'AU-FITAS-00005-00',
  'AU-FITAS-00006-00', 'AU-FITAS-00007-00', 'AU-FITAS-00008-00', 'AU-FITAS-00009-00', 'AU-FITAS-00010-00',
  'AU-FITAS-00011-00', 'AU-FITAS-00012-00', 'AU-FITAS-00013-00', 'AU-FITAS-00014-00', 'AU-FITAS-00015-00',
  'AU-FITAS-00016-00', 'AU-FITAS-00017-00', 'AU-FITAS-00018-00', 'AU-FITAS-00019-00', 'AU-FITAS-00020-00',
  'AU-FITAS-00021-00', 'AU-FITAS-00022-00', 'EE-FITAS-00001-00', 'EE-SELOS-00001-00', 'ES-ETIQUE-00004-00',
  'ES-FITAS-00001-00', 'ES-FITAS-00002-00', 'ES-FITAS-00003-00', 'MD-DVSOS-00033-00', 'MD-DVSOS-00034-00',
  'MD-DVSOS-00035-00', 'MD-DVSOS-00036-00', 'MD-DVSOS-00037-00', 'MD-DVSOS-00058-00', 'MM-DVSOS-00066-00',
  'MM-DVSOS-00067-00', 'MM-DVSOS-00070-00', 'MM-DVSOS-00077-00', 'MM-REPOS-00214-00', 'MM-VEDAC-00106-00',
  'MM-VEDAC-00107-00', 'SG-CINTO-00005-00', 'UC-FITAS-00001-00', 'MM-DVSOS-00074-00', 'SG-FITAS-00001-00',
  'SG-FITAS-00002-00', 'SG-FITAS-00003-00', 'SG-FITAS-00004-00', 'SG-FITAS-00005-00'
]);

// Exact adaptor codes from curateCatalog
const EXACT_ADAPT_CODES = new Set();
currentItems.forEach(i => {
  if (i.palavrasChave && i.palavrasChave.includes('adaptador')) {
    if (i.codigo !== 'MM-PNEUM-00079-00' && i.codigo !== 'MM-PNEUM-00110-00' && i.codigo !== 'MM-PNEUM-00143-00') {
      EXACT_ADAPT_CODES.add(i.codigo);
    }
  }
});

for (const [code, item] of finalCatalogMap) {
  const pkw = new Set(item.palavrasChave || []);

  if (EXACT_FITA_CODES.has(code)) {
    pkw.add('fita');
    pkw.add('fitas');
  } else {
    pkw.delete('fita');
    pkw.delete('fitas');
  }

  if (EXACT_ADAPT_CODES.has(code)) {
    pkw.add('adaptador');
    pkw.add('adaptadores');
  } else {
    pkw.delete('adaptador');
    pkw.delete('adaptadores');
  }

  item.palavrasChave = Array.from(pkw);
}

const finalCatalog = Array.from(finalCatalogMap.values());
fs.writeFileSync(catalogPath, JSON.stringify(finalCatalog, null, 2), 'utf8');

console.log(`\n=== Update Summary ===`);
console.log(`Final total catalog items: ${finalCatalog.length}`);
const ucItemsCount = finalCatalog.filter(i => i.categoria === 'MATERIAL DE USO/CONSUMO').length;
console.log(`MATERIAL DE USO/CONSUMO items: ${ucItemsCount} (Expected: 58)`);
console.log(`FITA keyword count: ${finalCatalog.filter(i => i.palavrasChave.includes('fita')).length}`);
console.log(`ADAPTADOR keyword count: ${finalCatalog.filter(i => i.palavrasChave.includes('adaptador')).length}`);
console.log(`SERVICOS count: ${finalCatalog.filter(i => i.codigo.startsWith('SE-')).length}`);
