const fs = require('fs');
const path = require('path');

const CATEGORY_MAP = {
  'AU': 'MATERIAL AUXILIAR DE PRODUÇÃO',
  'EE': 'MATERIAL DE EMBALAGENS',
  'ES': 'MATERIAIS DE ESCRITÓRIO',
  'LP': 'MATERIAIS DE LIMPEZA',
  'MD': 'MATERIAL DIVERSO',
  'ME': 'MATERIAL ELÉTRICO',
  'MM': 'MATERIAL MECÂNICO',
  'SG': 'MATERIAIS DE SEGURANÇA',
  'UC': 'MATERIAL DE USO E CONSUMO',
  'UG': 'UTILITIES - GÁS',
  'UN': 'UNIFORMES',
  'NN': 'MATERIAL MECÂNICO'
};

const MATERIAL_GROUP_MAP = {
  'AU': 'MRO',
  'EE': 'Secondary packaging',
  'ES': 'Facilities Management',
  'LP': 'MRO',
  'MD': 'MRO',
  'ME': 'MRO',
  'MM': 'MRO',
  'SG': 'Personal Protection Equipment',
  'UC': 'MRO',
  'UG': 'MRO',
  'UN': 'Facilities Management'
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
  'ABARS': 'Discos Abrasivos, Lixas e Rebolos',
  'CPMEC': 'Componentes Mecânicos e Bombas',
  'VEDAC': 'Vedações, Retentores e O-Rings',
  'VEDC': 'Vedações, Retentores e O-Rings',
  'ALMOF': 'Almofadas Auriculares',
  'ABAF': 'Abafadores de Ruído',
  'BOTAS': 'Botas de Segurança',
  'BOTA': 'Botas de Segurança',
  'CARTU': 'Cartuchos para Respiradores',
  'CINTA': 'Cintas Ergonômicas',
  'CINTO': 'Cintos de Segurança',
  'COLET': 'Coletes Refletivos',
  'CREME': 'Cremes Protetores e Solar',
  'LUVAS': 'Luvas de Proteção e Anticorte',
  'LUVA': 'Luvas de Proteção e Anticorte',
  'MASCA': 'Máscaras e Respiradores',
  'MASC': 'Máscaras e Respiradores',
  'OCULO': 'Óculos de Proteção',
  'OCUL': 'Óculos de Proteção',
  'PROTE': 'Protetores Faciais e Auriculares',
  'RESPI': 'Respiradores Descartáveis',
  'SAPAT': 'Sapatos de Segurança',
  'TOUCA': 'Toucas Descartáveis',
  'ACETA': 'Acetato de Etila',
  'BOLSA': 'Bolsas Dessecantes Sílica',
  'CADEA': 'Cadeados de Segurança',
  'COPOS': 'Copos Descartáveis',
  'ESCOV': 'Escovas Manuais de Aço e Latão',
  'ESPAT': 'Espátulas de Latão Antifaiscante',
  'ESPON': 'Esponjas Metálicas',
  'ESTIL': 'Estiletes e Cortadores de Segurança',
  'FIBRA': 'Fibras de Limpeza Pesada',
  'LAMIN': 'Lâminas para Estiletes',
  'PARAF': 'Parafina Industrial',
  'TESOU': 'Tesouras de Segurança',
  'TRENA': 'Trenas de Medição',
  'GASES': 'Gases Refrigerantes',
  'CALCA': 'Calças Profissionais e Eletricista',
  'CAMIS': 'Camisas Polo e Sociais Huhtamaki',
  'JALEC': 'Jalecos Profissionais',
  'CAPAC': 'Capacetes de Proteção',
  'AVENT': 'Aventais de Proteção',
  'CORTE': 'Ferramentas de Corte',
  'FERRA': 'Ferramentas Manuais'
};

const catalogPath = path.join(__dirname, '../src/data/catalogItems.json');
const items = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log(`Carregados ${items.length} itens do banco de dados atual.`);

let updatedCount = 0;
const categorySummary = {};

for (const item of items) {
  // Correção de código OCR incorreto NN -> MM
  if (item.codigo.startsWith('NN-')) {
    item.codigo = item.codigo.replace('NN-', 'MM-');
  }

  const parts = item.codigo.split('-');
  const prefix = parts[0] || 'MM';
  const subcode = parts[1] || 'DVSOS';

  const novaCategoria = CATEGORY_MAP[prefix] || 'MATERIAL DIVERSO';
  const subcategoriaDesc = SUB_CATEGORIAS_MAP[subcode] || subcode;
  const materialGroup = MATERIAL_GROUP_MAP[prefix] || 'MRO';

  item.categoria = novaCategoria;
  item.subcategoria = subcategoriaDesc;
  item.materialStructure = subcode;
  item.materialGroup = materialGroup;

  categorySummary[novaCategoria] = (categorySummary[novaCategoria] || 0) + 1;
  updatedCount++;
}

fs.writeFileSync(catalogPath, JSON.stringify(items, null, 2), 'utf8');

console.log(`Banco de dados atualizado com sucesso! Total de itens: ${updatedCount}`);
console.log('Distribuição por Categoria Oficial Huhtamaki:');
for (const [cat, count] of Object.entries(categorySummary)) {
  console.log(`- ${cat}: ${count} itens`);
}
