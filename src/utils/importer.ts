import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { CatalogItem } from '../types';
import { resolveItemImage } from './technicalImages';

// Configure pdfjs worker for browser environments if available
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    // Set fallback workerSrc from cdnjs or local if needed
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
  } catch (e) {
    console.warn('PDF.js worker initialization notice:', e);
  }
}

/**
 * Normalizes header keys (e.g. "CÓDIGO" -> "codigo", "Descrição do Item" -> "descricao")
 */
function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Parses an Excel (.xlsx or .xls) file from an ArrayBuffer
 */
export function parseExcelFile(data: ArrayBuffer): CatalogItem[] {
  const workbook = XLSX.read(data, { type: 'array' });
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('A planilha Excel não contém nenhuma aba com dados.');
  }

  // Use the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (rawRows.length === 0) {
    throw new Error('A planilha selecionada está vazia.');
  }

  const items: CatalogItem[] = [];

  rawRows.forEach((row, index) => {
    // Map normalized keys
    const rowNormalized: Record<string, any> = {};
    Object.keys(row).forEach((k) => {
      rowNormalized[normalizeKey(k)] = row[k];
    });

    // Flexible column mapping
    const codigo =
      rowNormalized['codigo'] ||
      rowNormalized['cod'] ||
      rowNormalized['code'] ||
      rowNormalized['part_number'] ||
      rowNormalized['pn'] ||
      rowNormalized['id'];

    const descricao =
      rowNormalized['descricao'] ||
      rowNormalized['desc'] ||
      rowNormalized['description'] ||
      rowNormalized['item'] ||
      rowNormalized['nome'] ||
      rowNormalized['produto'];

    if (!codigo && !descricao) {
      return; // skip completely empty rows
    }

    const categoria =
      rowNormalized['categoria'] ||
      rowNormalized['category'] ||
      rowNormalized['grupo'] ||
      rowNormalized['classe'] ||
      'OUTROS / REPOSIÇÃO';

    const fabricante =
      rowNormalized['fabricante'] ||
      rowNormalized['marca'] ||
      rowNormalized['manufacturer'] ||
      undefined;

    const dimensao =
      rowNormalized['dimensao'] ||
      rowNormalized['medida'] ||
      rowNormalized['medidas'] ||
      rowNormalized['tamanho'] ||
      undefined;

    const localizacao =
      rowNormalized['localizacao'] ||
      rowNormalized['local'] ||
      rowNormalized['posicao'] ||
      rowNormalized['prateleira'] ||
      undefined;

    const imagemUrl =
      rowNormalized['imagem_url'] ||
      rowNormalized['imagemurl'] ||
      rowNormalized['imagem'] ||
      rowNormalized['foto'] ||
      undefined;

    // Palavras-chave
    const rawKeywords =
      rowNormalized['palavras_chave'] ||
      rowNormalized['palavraschave'] ||
      rowNormalized['tags'] ||
      rowNormalized['keywords'] ||
      '';

    let palavrasChave: string[] = [];
    if (typeof rawKeywords === 'string' && rawKeywords.trim()) {
      palavrasChave = rawKeywords
        .split(/[,;\/]+/)
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
    } else if (Array.isArray(rawKeywords)) {
      palavrasChave = rawKeywords.map((k) => String(k).trim().toLowerCase());
    }

    items.push({
      id: `item-xlsx-${Date.now()}-${index}`,
      codigo: String(codigo || `ITEM-${index + 1}`).trim().toUpperCase(),
      descricao: String(descricao || 'Item importado via Excel').trim(),
      categoria: String(categoria).trim().toUpperCase(),
      fabricante: fabricante ? String(fabricante).trim() : undefined,
      dimensao: dimensao ? String(dimensao).trim() : undefined,
      localizacao: localizacao ? String(localizacao).trim() : undefined,
      imagemUrl: imagemUrl ? String(imagemUrl).trim() : resolveItemImage({ codigo: String(codigo), descricao: String(descricao), categoria: String(categoria) }),
      palavrasChave,
      favorito: false,
      status: 'disponivel',
      dataCriacao: new Date().toISOString().split('T')[0],
    });
  });

  if (items.length === 0) {
    throw new Error('Nenhum item com código ou descrição válida foi encontrado na planilha.');
  }

  return items;
}

/**
 * Parses a PDF file extracting textual catalogue items
 */
export async function parsePdfFile(data: ArrayBuffer): Promise<CatalogItem[]> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;

    const fullLines: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Group tokens roughly by line based on Y coordinate
      const lineMap: { [y: number]: string[] } = {};
      
      for (const item of textContent.items as any[]) {
        if ('str' in item && item.str.trim()) {
          const y = Math.round(item.transform[5]);
          if (!lineMap[y]) {
            lineMap[y] = [];
          }
          lineMap[y].push(item.str.trim());
        }
      }

      // Sort lines by Y descending (top to bottom of page)
      const sortedYs = Object.keys(lineMap)
        .map(Number)
        .sort((a, b) => b - a);

      for (const y of sortedYs) {
        const lineText = lineMap[y].join(' ');
        if (lineText.trim().length > 0) {
          fullLines.push(lineText.trim());
        }
      }
    }

    if (fullLines.length === 0) {
      throw new Error('Não foi possível extrair texto legível do arquivo PDF.');
    }

    // Heuristic parser: find lines containing code pattern or delimiters (semicolon, tab, pipe)
    const items: CatalogItem[] = [];

    for (let i = 0; i < fullLines.length; i++) {
      const line = fullLines[i];

      // If line has delimiters like pipe | or tab or semicolon
      if (line.includes('|') || line.includes(';') || line.includes('\t')) {
        const parts = line.split(/[|;\t]+/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const codigo = parts[0];
          const descricao = parts[1];
          const categoria = parts[2] || 'OUTROS / REPOSIÇÃO';
          const fabricante = parts[3] || undefined;

          if (codigo.length >= 3 && descricao.length >= 3) {
            items.push({
              id: `item-pdf-${Date.now()}-${items.length}`,
              codigo: codigo.toUpperCase(),
              descricao,
              categoria: categoria.toUpperCase(),
              fabricante,
              imagemUrl: resolveItemImage({ codigo, descricao, categoria }),
              palavrasChave: [codigo.toLowerCase(), ...descricao.toLowerCase().split(' ').slice(0, 3)],
              favorito: false,
              status: 'disponivel',
              dataCriacao: new Date().toISOString().split('T')[0],
            });
            continue;
          }
        }
      }

      // Pattern: Code at start (e.g. MM-REPOS-00127-00 or SKF-6204 or 100234)
      const match = line.match(/^([A-Za-z0-9\-\.\/]{3,24})\s+(.+)$/);
      if (match) {
        const codigo = match[1].trim();
        const remainder = match[2].trim();

        // Ignore common header lines
        if (codigo.toLowerCase().includes('codigo') || codigo.toLowerCase().includes('página')) {
          continue;
        }

        items.push({
          id: `item-pdf-${Date.now()}-${items.length}`,
          codigo: codigo.toUpperCase(),
          descricao: remainder,
          categoria: 'OUTROS / REPOSIÇÃO',
          imagemUrl: resolveItemImage({ codigo, descricao: remainder, categoria: 'OUTROS / REPOSIÇÃO' }),
          palavrasChave: [codigo.toLowerCase(), ...remainder.toLowerCase().split(' ').slice(0, 3)],
          favorito: false,
          status: 'disponivel',
          dataCriacao: new Date().toISOString().split('T')[0],
        });
      }
    }

    if (items.length === 0) {
      // Fallback: If no structured regex matched, treat each non-empty line as an item record
      fullLines.slice(0, 100).forEach((line, idx) => {
        if (line.length > 5) {
          items.push({
            id: `item-pdf-${Date.now()}-${idx}`,
            codigo: `PDF-${idx + 1}`.toUpperCase(),
            descricao: line,
            categoria: 'OUTROS / REPOSIÇÃO',
            palavrasChave: line.toLowerCase().split(' ').slice(0, 3),
            favorito: false,
            status: 'disponivel',
            dataCriacao: new Date().toISOString().split('T')[0],
          });
        }
      });
    }

    return items;
  } catch (err: any) {
    console.error('Error parsing PDF:', err);
    throw new Error(`Falha ao ler PDF: ${err.message || 'Formato não suportado ou arquivo protegido'}`);
  }
}

/**
 * Generates and downloads a sample Excel (.xlsx) spreadsheet template
 */
export function downloadSampleExcel() {
  const sampleData = [
    {
      'CÓDIGO': 'MM-REPOS-00127-00',
      'DESCRIÇÃO': 'ROLAMENTO FIXO ESFERAS SKF 6204 2RS1 - 20 x 47 x 14mm',
      'CATEGORIA': 'ROLAMENTOS',
      'FABRICANTE': 'SKF',
      'DIMENSÃO': '20 x 47 x 14mm',
      'LOCALIZAÇÃO': 'Almoxarifado Central - Prateleira B-04',
      'PALAVRAS_CHAVE': 'rolamento, 6204, esferas, 2rs1, skf',
      'IMAGEM_URL': 'https://images.unsplash.com/photo-1599818499218-b5e400329329?auto=format&fit=crop&w=800&q=80',
    },
    {
      'CÓDIGO': 'PN-VALV-00042-01',
      'DESCRIÇÃO': 'VÁLVULA SOLENOIDE PNEUMÁTICA FESTO 5/2 VIAS 24VDC G1/8',
      'CATEGORIA': 'PNEUMÁTICA',
      'FABRICANTE': 'FESTO',
      'DIMENSÃO': 'G 1/8 pol',
      'LOCALIZAÇÃO': 'Prateleira Pneumática C-02',
      'PALAVRAS_CHAVE': 'valvula, solenoide, 5/2, festo, 24vdc, ar comprimido',
      'IMAGEM_URL': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    },
    {
      'CÓDIGO': 'EL-SENS-00088-00',
      'DESCRIÇÃO': 'SENSOR DE PROXIMIDADE INDUTIVO M12 PNP NA 4mm ALCANCE',
      'CATEGORIA': 'SENSORES E INSTRUMENTAÇÃO',
      'FABRICANTE': 'BALLUFF',
      'DIMENSÃO': 'M12 x 50mm',
      'LOCALIZAÇÃO': 'Gaveta Eletrônica E-01',
      'PALAVRAS_CHAVE': 'sensor, indutivo, m12, pnp, na, balluff',
      'IMAGEM_URL': 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Itens do Catálogo');

  // Auto-width columns
  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 55 },
    { wch: 28 },
    { wch: 15 },
    { wch: 20 },
    { wch: 35 },
    { wch: 40 },
    { wch: 45 },
  ];

  XLSX.writeFile(workbook, 'modelo_catalogo_manutencao.xlsx');
}
