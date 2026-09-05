import * as XLSX from 'xlsx';
import { CatalogItem } from '../types';

export interface ColumnMapping {
  codigoCol: string;
  descricaoCol: string;
  categoriaCol?: string;
  fabricanteCol?: string;
  dimensaoCol?: string;
  localizacaoCol?: string;
  palavrasChaveCol?: string;
  observacoesCol?: string;
  statusCol?: string;
  imagemUrlCol?: string;
}

export interface ParseResult {
  items: CatalogItem[];
  availableColumns: string[];
  rawRows: Record<string, any>[];
  mapping: ColumnMapping;
  hasDescriptionWarning: boolean;
  warningCount: number;
}

/**
 * Normalizes any string: lowercase, remove accents and non-alphanumerics
 */
export function normalizeKey(str: string): string {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Comprehensive aliases for CÓDIGO (SAP, TOTVS, ERPs, Excel)
const CODIGO_ALIASES = [
  'codigo',
  'cod',
  'code',
  'material',
  'matnr',
  'b1cod',
  'codigodomaterial',
  'codmaterial',
  'codigodoitem',
  'coditem',
  'nummaterial',
  'nmaterial',
  'ndomaterial',
  'partnumber',
  'partno',
  'part_no',
  'pn',
  'referencia',
  'ref',
  'item',
  'patrimonio',
  'tag',
  'sku',
];

// Comprehensive aliases for DESCRIÇÃO (SAP Texto Breve, Denominação, Discriminação, TOTVS, etc.)
const DESCRICAO_ALIASES = [
  'descricaooriginal',
  'descricaodetalhada',
  'descricaocompleta',
  'descricaopadrao',
  'descricao',
  'desc',
  'description',
  'descr',
  'descri',
  'textobreve',
  'textobrevedomaterial',
  'txtbreve',
  'texto',
  'denominacao',
  'denominacaodomaterial',
  'denominacaodoobjeto',
  'denominacaobreve',
  'descricaodomaterial',
  'descricaodoproduto',
  'descricaodoitem',
  'descmaterial',
  'descproduto',
  'descitem',
  'especificacao',
  'especificacaotecnica',
  'discriminacao',
  'discriminacaodoproduto',
  'discriminacaodomaterial',
  'narrativa',
  'nome',
  'nomedoitem',
  'nomedoproduto',
  'nomedomaterial',
  'produto',
  'detalhe',
  'detalhamento',
  'detalhes',
  'titulo',
  'mercadoria',
  'itemdescricao',
  'maktx',
  'b1desc',
  'resumo',
  'identificacao',
];

// Aliases for CATEGORIA / GRUPO
const CATEGORIA_ALIASES = [
  'categoria',
  'category',
  'grupo',
  'grupomercadoria',
  'grupodemercadorias',
  'grpmercadorias',
  'familia',
  'familiadoproduto',
  'subgrupo',
  'tipo',
  'classe',
  'linha',
  'classificacao',
  'setor',
];

// Aliases for FABRICANTE
const FABRICANTE_ALIASES = [
  'fabricante',
  'marca',
  'fabr',
  'fornecedor',
  'manufacturer',
  'brand',
  'produtor',
];

// Aliases for DIMENSÕES / MEDIDAS
const DIMENSAO_ALIASES = [
  'dimensao',
  'dimensoes',
  'medida',
  'medidas',
  'tamanho',
  'dimension',
  'unidade',
  'um',
  'bitola',
];

// Aliases for LOCALIZAÇÃO
const LOCALIZACAO_ALIASES = [
  'localizacao',
  'local',
  'almoxarifado',
  'prateleira',
  'posicao',
  'gaveta',
  'deposito',
  'armazem',
  'rua',
  'box',
  'predio',
];

// Aliases for OBSERVAÇÕES
const OBSERVACOES_ALIASES = [
  'observacoes',
  'observacao',
  'obs',
  'detalhes',
  'notas',
  'anotacoes',
  'comentarios',
];

// Aliases for PALAVRAS-CHAVE
const PALAVRAS_ALIASES = ['palavraschave', 'palavras', 'tags', 'keywords'];

// Aliases for STATUS
const STATUS_ALIASES = ['status', 'situacao', 'estado', 'condicao'];

// Aliases for IMAGEM
const IMAGEM_ALIASES = ['imagemurl', 'imagem', 'url', 'foto', 'linkimagem', 'imagem_url'];

/**
 * Finds the best matching column name from a list of available columns
 */
function findBestColumnMatch(
  availableColumns: string[],
  aliases: string[],
  excludeCols: string[] = []
): string | undefined {
  const normalizedCols = availableColumns.map((c) => ({
    original: c,
    norm: normalizeKey(c),
  }));

  // 1. Exact match with an alias
  for (const alias of aliases) {
    const found = normalizedCols.find(
      (c) => c.norm === alias && !excludeCols.includes(c.original)
    );
    if (found) return found.original;
  }

  // 2. Starts with or ends with alias
  for (const alias of aliases) {
    const found = normalizedCols.find(
      (c) =>
        (c.norm.startsWith(alias) || c.norm.endsWith(alias) || c.norm.includes(alias)) &&
        !excludeCols.includes(c.original)
    );
    if (found) return found.original;
  }

  return undefined;
}

/**
 * Automatically detects the best column mapping for a given set of columns and sample rows
 */
export function autoDetectColumnMapping(
  availableColumns: string[],
  sampleRows: Record<string, any>[] = []
): ColumnMapping {
  // 1. Match Código
  const codigoCol = findBestColumnMatch(availableColumns, CODIGO_ALIASES) || availableColumns[0] || '';

  // 2. Match Descrição (cannot be the same column as Código if alternatives exist)
  let descricaoCol = findBestColumnMatch(availableColumns, DESCRICAO_ALIASES, [codigoCol]);

  // If no description column matched by alias, inspect sample row content
  if (!descricaoCol && availableColumns.length > 1) {
    // Find column with longest text strings that is NOT codigoCol
    let bestCol = '';
    let maxAvgLength = 0;

    for (const col of availableColumns) {
      if (col === codigoCol) continue;
      let totalLen = 0;
      let count = 0;
      for (const row of sampleRows.slice(0, 10)) {
        const val = String(row[col] || '').trim();
        // Skip numbers and short codes
        if (val && isNaN(Number(val))) {
          totalLen += val.length;
          count++;
        }
      }
      const avg = count > 0 ? totalLen / count : 0;
      if (avg > maxAvgLength) {
        maxAvgLength = avg;
        bestCol = col;
      }
    }

    if (bestCol) {
      descricaoCol = bestCol;
    } else {
      // Positional fallback: second column
      descricaoCol = availableColumns[1] || codigoCol;
    }
  }

  const categoriaCol = findBestColumnMatch(availableColumns, CATEGORIA_ALIASES, [codigoCol, descricaoCol || '']);
  const fabricanteCol = findBestColumnMatch(availableColumns, FABRICANTE_ALIASES, [codigoCol, descricaoCol || '']);
  const dimensaoCol = findBestColumnMatch(availableColumns, DIMENSAO_ALIASES, [codigoCol, descricaoCol || '']);
  const localizacaoCol = findBestColumnMatch(availableColumns, LOCALIZACAO_ALIASES, [codigoCol, descricaoCol || '']);
  const observacoesCol = findBestColumnMatch(availableColumns, OBSERVACOES_ALIASES, [codigoCol, descricaoCol || '']);
  const palavrasChaveCol = findBestColumnMatch(availableColumns, PALAVRAS_ALIASES, [codigoCol, descricaoCol || '']);
  const statusCol = findBestColumnMatch(availableColumns, STATUS_ALIASES, [codigoCol, descricaoCol || '']);
  const imagemUrlCol = findBestColumnMatch(availableColumns, IMAGEM_ALIASES, [codigoCol, descricaoCol || '']);

  return {
    codigoCol,
    descricaoCol: descricaoCol || codigoCol,
    categoriaCol,
    fabricanteCol,
    dimensaoCol,
    localizacaoCol,
    observacoesCol,
    palavrasChaveCol,
    statusCol,
    imagemUrlCol,
  };
}

/**
 * Maps a single row to CatalogItem using an explicit or detected column mapping.
 * GUARANTEES that if a description is available, it is NEVER silently replaced by the code.
 */
export function mapRowWithMapping(
  row: Record<string, any>,
  mapping: ColumnMapping,
  index: number
): CatalogItem | null {
  const rawCodigo = row[mapping.codigoCol] !== undefined ? String(row[mapping.codigoCol]).trim() : '';
  let rawDescricao =
    mapping.descricaoCol && row[mapping.descricaoCol] !== undefined
      ? String(row[mapping.descricaoCol]).trim()
      : '';

  if (!rawCodigo && !rawDescricao) {
    return null;
  }

  const finalCodigo = (rawCodigo || `ITEM-${Date.now()}-${index + 1}`).toUpperCase();

  // If rawDescricao is missing OR is identical to the code:
  // Inspect other columns in this row to see if a real text description was placed in another column!
  if (!rawDescricao || rawDescricao.toUpperCase() === finalCodigo) {
    const candidateTexts: string[] = [];

    for (const [colName, val] of Object.entries(row)) {
      if (colName === mapping.codigoCol) continue;
      const strVal = String(val || '').trim();
      // Must not be empty, must not equal the code, must not be a pure number
      if (strVal && strVal.toUpperCase() !== finalCodigo && isNaN(Number(strVal))) {
        // Skip short units like 'UN', 'PC', 'KG'
        if (strVal.length > 3) {
          candidateTexts.push(strVal);
        }
      }
    }

    // Pick candidate with greatest length (most descriptive)
    if (candidateTexts.length > 0) {
      candidateTexts.sort((a, b) => b.length - a.length);
      rawDescricao = candidateTexts[0];
    }
  }

  // If even after searching other columns, rawDescricao is STILL identical to the code:
  // Provide a clean placeholder indicating the description needs registration,
  // so the user visually distinguishes the Code from the Description.
  let finalDescricao = rawDescricao;
  if (!finalDescricao || finalDescricao.toUpperCase() === finalCodigo) {
    finalDescricao = `ITEM ${finalCodigo} (SEM DESCRIÇÃO INFORMADA NA PLANILHA)`;
  } else {
    finalDescricao = finalDescricao.toUpperCase();
  }

  // Categoria
  let rawCategoria = mapping.categoriaCol ? String(row[mapping.categoriaCol] || '').trim() : '';
  if (!rawCategoria) {
    // If not mapped, check if any column matches category aliases
    for (const [col, val] of Object.entries(row)) {
      const normC = normalizeKey(col);
      if (CATEGORIA_ALIASES.some((a) => normC.includes(a))) {
        rawCategoria = String(val || '').trim();
        if (rawCategoria) break;
      }
    }
  }
  const categoria = (rawCategoria || 'OUTROS / REPOSIÇÃO').toUpperCase();

  // Fabricante
  const fabricante = mapping.fabricanteCol && row[mapping.fabricanteCol]
    ? String(row[mapping.fabricanteCol]).trim()
    : undefined;

  // Dimensão
  const dimensao = mapping.dimensaoCol && row[mapping.dimensaoCol]
    ? String(row[mapping.dimensaoCol]).trim()
    : undefined;

  // Localização
  const localizacao = mapping.localizacaoCol && row[mapping.localizacaoCol]
    ? String(row[mapping.localizacaoCol]).trim()
    : undefined;

  // Observações
  const observacoes = mapping.observacoesCol && row[mapping.observacoesCol]
    ? String(row[mapping.observacoesCol]).trim()
    : undefined;

  // Palavras-chave
  let palavrasChave: string[] = [];
  const rawTags = mapping.palavrasChaveCol ? row[mapping.palavrasChaveCol] : undefined;
  if (Array.isArray(rawTags)) {
    palavrasChave = rawTags.map(String);
  } else if (typeof rawTags === 'string') {
    palavrasChave = rawTags
      .split(/[,;|]/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }

  // Imagem URL
  const imagemUrl = mapping.imagemUrlCol && row[mapping.imagemUrlCol]
    ? String(row[mapping.imagemUrlCol]).trim()
    : undefined;

  // Status
  let status: 'disponivel' | 'baixo_estoque' | 'em_revisao' = 'disponivel';
  const rawStatus = mapping.statusCol ? String(row[mapping.statusCol] || '').toLowerCase() : '';
  if (rawStatus.includes('baixo') || rawStatus.includes('alerta') || rawStatus.includes('critico')) {
    status = 'baixo_estoque';
  } else if (rawStatus.includes('revisao') || rawStatus.includes('analise') || rawStatus.includes('bloqueado')) {
    status = 'em_revisao';
  }

  return {
    id: `item-import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    codigo: finalCodigo,
    descricao: finalDescricao,
    categoria,
    fabricante,
    dimensao,
    localizacao,
    palavrasChave,
    imagemUrl,
    favorito: false,
    status,
    observacoes,
    dataCriacao: new Date().toISOString().split('T')[0],
  };
}

/**
 * Re-applies a custom mapping to raw rows
 */
export function applyMappingToRows(
  rawRows: Record<string, any>[],
  mapping: ColumnMapping
): { items: CatalogItem[]; warningCount: number } {
  const items: CatalogItem[] = [];
  let warningCount = 0;

  rawRows.forEach((row, i) => {
    const item = mapRowWithMapping(row, mapping, i);
    if (item) {
      // Check if description is repetitive
      if (
        item.descricao.includes('(SEM DESCRIÇÃO INFORMADA NA PLANILHA)') ||
        item.descricao.toUpperCase() === item.codigo.toUpperCase()
      ) {
        warningCount++;
      }
      items.push(item);
    }
  });

  return { items, warningCount };
}

/**
 * Intelligent sheet extraction:
 * Scans the first 8 rows to find the true header row (bypassing title banners and blank rows)
 */
function extractSheetData(worksheet: XLSX.WorkSheet): {
  availableColumns: string[];
  rawRows: Record<string, any>[];
} {
  const rawMatrix: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
  });

  if (!rawMatrix || rawMatrix.length === 0) {
    throw new Error('A planilha selecionada não contém linhas de dados.');
  }

  // Find the row that best matches known column keywords (Código, Descrição, Material, etc.)
  let bestHeaderRowIndex = 0;
  let bestScore = -1;

  const allKeyAliases = [
    ...CODIGO_ALIASES,
    ...DESCRICAO_ALIASES,
    ...CATEGORIA_ALIASES,
    ...FABRICANTE_ALIASES,
    ...LOCALIZACAO_ALIASES,
  ];

  for (let r = 0; r < Math.min(rawMatrix.length, 8); r++) {
    const row = rawMatrix[r];
    if (!Array.isArray(row) || row.length === 0) continue;

    let score = 0;
    for (const cell of row) {
      const norm = normalizeKey(String(cell));
      if (!norm) continue;
      if (allKeyAliases.includes(norm)) {
        score += 3;
      } else if (allKeyAliases.some((a) => norm.includes(a))) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestHeaderRowIndex = r;
    }
  }

  // Header row
  const headerRow = rawMatrix[bestHeaderRowIndex] || [];
  const availableColumns: string[] = [];

  headerRow.forEach((cell: any, colIdx: number) => {
    const colName = String(cell || '').trim();
    if (colName) {
      // Ensure uniqueness
      let uniqueName = colName;
      let counter = 1;
      while (availableColumns.includes(uniqueName)) {
        uniqueName = `${colName}_${counter++}`;
      }
      availableColumns.push(uniqueName);
    } else {
      availableColumns.push(`Coluna_${colIdx + 1}`);
    }
  });

  // Data rows
  const rawRows: Record<string, any>[] = [];
  for (let r = bestHeaderRowIndex + 1; r < rawMatrix.length; r++) {
    const row = rawMatrix[r];
    if (!Array.isArray(row) || row.every((c) => String(c || '').trim() === '')) {
      continue; // skip completely empty rows
    }

    const rowObj: Record<string, any> = {};
    availableColumns.forEach((colName, colIdx) => {
      rowObj[colName] = row[colIdx] !== undefined ? row[colIdx] : '';
    });
    rawRows.push(rowObj);
  }

  return { availableColumns, rawRows };
}

/**
 * Detailed parser for Excel Buffer (.xlsx, .xls)
 */
export function parseExcelDetailed(buffer: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('O arquivo de planilha está vazio (nenhuma aba encontrada).');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const { availableColumns, rawRows } = extractSheetData(worksheet);

  if (rawRows.length === 0) {
    throw new Error('Nenhuma linha de dados identificada após a linha de cabeçalho.');
  }

  const mapping = autoDetectColumnMapping(availableColumns, rawRows);
  const { items, warningCount } = applyMappingToRows(rawRows, mapping);

  if (items.length === 0) {
    throw new Error('Não foi possível identificar itens válidos na planilha.');
  }

  return {
    items,
    availableColumns,
    rawRows,
    mapping,
    hasDescriptionWarning: warningCount > 0,
    warningCount,
  };
}

/**
 * Detailed parser for CSV string
 */
export function parseCsvDetailed(csvText: string): ParseResult {
  const workbook = XLSX.read(csvText, { type: 'string' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('O arquivo CSV está vazio.');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const { availableColumns, rawRows } = extractSheetData(worksheet);

  if (rawRows.length === 0) {
    throw new Error('O arquivo CSV não contém linhas de dados.');
  }

  const mapping = autoDetectColumnMapping(availableColumns, rawRows);
  const { items, warningCount } = applyMappingToRows(rawRows, mapping);

  if (items.length === 0) {
    throw new Error('Não foi possível identificar itens válidos no arquivo CSV.');
  }

  return {
    items,
    availableColumns,
    rawRows,
    mapping,
    hasDescriptionWarning: warningCount > 0,
    warningCount,
  };
}

/**
 * Backward-compatible parseExcelBuffer
 */
export function parseExcelBuffer(buffer: ArrayBuffer): CatalogItem[] {
  return parseExcelDetailed(buffer).items;
}

/**
 * Backward-compatible parseCsvText
 */
export function parseCsvText(csvText: string): CatalogItem[] {
  return parseCsvDetailed(csvText).items;
}

/**
 * Backward-compatible mapRowToCatalogItem
 */
export function mapRowToCatalogItem(row: Record<string, any>, index: number): CatalogItem | null {
  const cols = Object.keys(row);
  const mapping = autoDetectColumnMapping(cols, [row]);
  return mapRowWithMapping(row, mapping, index);
}

/**
 * Generates and downloads a sample .xlsx template
 */
export function downloadExcelTemplate(): void {
  const sampleData = [
    {
      CODIGO: 'MM-REPOS-00127-00',
      DESCRICAO: '00 ROLAMENTO FIXO ESFERAS SKF/6204 2RSL - 20 x 47 x 14mm',
      CATEGORIA: 'ROLAMENTOS',
      FABRICANTE: 'SKF',
      DIMENSAO: '20 x 47 x 14mm',
      LOCALIZACAO: 'Almoxarifado Central - Prateleira B-04',
      PALAVRAS_CHAVE: 'rolamento, esferas, 6204, skf, vedado',
      STATUS: 'disponivel',
      OBSERVACOES: 'Vedação de borracha sintética 2RSL dos dois lados',
      IMAGEM_URL: '',
    },
    {
      CODIGO: 'MM-REPOS-00213-00',
      DESCRICAO: 'ACOPLAMENTO ELASTICO ROTEX 28/38 92SH A AMARELO',
      CATEGORIA: 'MOTORES E TRANSMISSÃO',
      FABRICANTE: 'KTR ROTEX',
      DIMENSAO: 'Tamanho 28/38 - 92 Sh A',
      LOCALIZACAO: 'Almoxarifado Transmissão - Prateleira D-02',
      PALAVRAS_CHAVE: 'acoplamento, elastico, ktr, rotex, amarelo',
      STATUS: 'disponivel',
      OBSERVACOES: 'Elemento elástico tipo aranha em poliuretano',
      IMAGEM_URL: '',
    },
    {
      CODIGO: 'MM-PNEUM-00135-00',
      DESCRICAO: 'A LUVA SEXTAVADA ALUMINIO ANOD',
      CATEGORIA: 'AUTOMAÇÃO E CONTROLE',
      FABRICANTE: 'AVADA',
      DIMENSAO: 'Ø 36.31mm ext.',
      LOCALIZACAO: 'Almoxarifado Mecânica - Gaveta C-11',
      PALAVRAS_CHAVE: 'luva, aluminio, anodizado, sensor',
      STATUS: 'disponivel',
      OBSERVACOES: 'Tratamento de anodização dura',
      IMAGEM_URL: '',
    },
    {
      CODIGO: 'MD-DVS05-00004-00',
      DESCRICAO: 'ABRACADEIRA AMARRACAO NYLON 200 x 4.8MM PRETA',
      CATEGORIA: 'OUTROS / REPOSIÇÃO',
      FABRICANTE: 'HELLERMANN',
      DIMENSAO: '200 x 4.8mm',
      LOCALIZACAO: 'Almoxarifado Elétrica - Prateleira F-01',
      PALAVRAS_CHAVE: 'abracadeira, nylon, hellermann, chicote',
      STATUS: 'disponivel',
      OBSERVACOES: 'Pacote com 100 unidades com proteção UV',
      IMAGEM_URL: '',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 52 },
    { wch: 25 },
    { wch: 16 },
    { wch: 22 },
    { wch: 38 },
    { wch: 35 },
    { wch: 14 },
    { wch: 38 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Itens do Catalogo');
  XLSX.writeFile(workbook, 'modelo_catalogo_manutencao.xlsx');
}

/**
 * Generates and downloads a sample .csv template
 */
export function downloadCsvTemplate(): void {
  const csvContent =
    `CODIGO;DESCRICAO;CATEGORIA;FABRICANTE;DIMENSAO;LOCALIZACAO;PALAVRAS_CHAVE;STATUS;OBSERVACOES\n` +
    `MM-REPOS-00127-00;00 ROLAMENTO FIXO ESFERAS SKF/6204 2RSL - 20 x 47 x 14mm;ROLAMENTOS;SKF;20 x 47 x 14mm;Almoxarifado Central - Prateleira B-04;rolamento, esferas, 6204, skf;disponivel;Vedacao de borracha 2RSL\n` +
    `MM-REPOS-00213-00;ACOPLAMENTO ELASTICO ROTEX 28/38 92SH A AMARELO;MOTORES E TRANSMISSÃO;KTR ROTEX;Tamanho 28/38 - 92 Sh A;Almoxarifado Transmissão - Prateleira D-02;acoplamento, elastico, ktr;disponivel;Elemento flexivel\n` +
    `MM-PNEUM-00135-00;A LUVA SEXTAVADA ALUMINIO ANOD;AUTOMAÇÃO E CONTROLE;AVADA;Ø 36.31mm ext.;Almoxarifado Mecânica - Gaveta C-11;luva, aluminio, anodizado;disponivel;Tratamento de anodizacao dura\n` +
    `MD-DVS05-00004-00;ABRACADEIRA AMARRACAO NYLON 200 x 4.8MM;OUTROS / REPOSIÇÃO;HELLERMANN;200 x 4.8mm;Almoxarifado Elétrica - Prateleira F-01;abracadeira, nylon, hellermann;disponivel;Pacote com 100 unidades\n`;

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'modelo_catalogo_manutencao.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

