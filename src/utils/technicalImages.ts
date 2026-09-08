// Technical industrial component reference images
// Curated high quality photos from reliable CDNs

export interface TechnicalImageSuggestion {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
}

export const TECHNICAL_IMAGE_LIBRARY: TechnicalImageSuggestion[] = [
  // Rolamentos
  {
    id: 'rol-1',
    title: 'Rolamento de Esferas SKF / NSK Blindado',
    url: 'https://images.unsplash.com/photo-1599818499218-b5e400329329?auto=format&fit=crop&w=800&q=80',
    category: 'ROLAMENTOS',
    tags: ['rolamento', 'skf', 'nsk', 'esferas', 'blindado', '6204', '63/28', 'zz', '2rs1', 'mancal'],
  },
  {
    id: 'rol-2',
    title: 'Rolamento Autocompensador de Rolos',
    url: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=800&q=80',
    category: 'ROLAMENTOS',
    tags: ['rolamento', 'rolos', 'autocompensador', 'pesado', 'industrial', 'skf', 'fag', 'timken'],
  },
  {
    id: 'rol-3',
    title: 'Mancal e Rolamento com Caixa Pillow Block',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    category: 'ROLAMENTOS',
    tags: ['mancal', 'pillow block', 'ucp', 'flange', 'eixo', 'transmissao', 'rolamento'],
  },

  // Pneumática
  {
    id: 'pneu-1',
    title: 'Válvula Solenoide Pneumática e Bloco Manifold',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    category: 'PNEUMÁTICA',
    tags: ['valvula', 'solenoide', 'pneumatica', 'festo', 'smc', 'manifold', 'cilindro', 'ar comprimido', 'bobina'],
  },
  {
    id: 'pneu-2',
    title: 'Cilindro Pneumático de Dupla Ação / Atuador',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    category: 'PNEUMÁTICA',
    tags: ['cilindro', 'atuador', 'pneumatico', 'haste', 'curso', 'dupla acao', 'festo', 'smc'],
  },
  {
    id: 'pneu-3',
    title: 'Conexões Rápidas e Tubo PU Pneumático',
    url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    category: 'PNEUMÁTICA',
    tags: ['conexao', 'engate rapido', 'mangueira', 'tubo pu', 'niple', 'espigao', 'pneumatica'],
  },

  // Sensores e Instrumentação
  {
    id: 'sens-1',
    title: 'Sensor Indutivo / Proximidade M12 / M18',
    url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
    category: 'SENSORES E INSTRUMENTAÇÃO',
    tags: ['sensor', 'indutivo', 'proximidade', 'm12', 'm18', 'm8', 'pnp', 'npn', 'balluff', 'omron', 'sick'],
  },
  {
    id: 'sens-2',
    title: 'Manômetro Industrial Analógico com Glicerina',
    url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80',
    category: 'SENSORES E INSTRUMENTAÇÃO',
    tags: ['manometro', 'pressao', 'glicerina', 'bar', 'psi', 'instrumentacao', 'wika', 'valvula'],
  },
  {
    id: 'sens-3',
    title: 'Sensor Fotoelétrico / Laser / Óptico',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    category: 'SENSORES E INSTRUMENTAÇÃO',
    tags: ['fotoeletrico', 'optico', 'laser', 'barreira', 'difuso', 'reflexivo', 'sensor', 'fibra'],
  },

  // Motores e Transmissão
  {
    id: 'mot-1',
    title: 'Motor Elétrico Trifásico de Indução',
    url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80',
    category: 'MOTORES E TRANSMISSÃO',
    tags: ['motor', 'trifasico', 'weg', 'siemens', 'inducao', 'potencia', 'cv', 'kw', 'eixo', 'rotacao'],
  },
  {
    id: 'mot-2',
    title: 'Polia e Correia Sincronizadora / Dentada',
    url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
    category: 'MOTORES E TRANSMISSÃO',
    tags: ['correia', 'dentada', 'sincronizadora', 'polia', 'transmissao', 'gates', 'perfil', 'redutor'],
  },
  {
    id: 'mot-3',
    title: 'Engrenagens Cônicas e Helicoidais Industriais',
    url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    category: 'MOTORES E TRANSMISSÃO',
    tags: ['engrenagem', 'redutor', 'pinhao', 'coroa', 'dentes', 'aco', 'transmissao'],
  },

  // Automação e Controle / Eletrônica
  {
    id: 'aut-1',
    title: 'Controlador Lógico Programável (CLP) / Módulos I/O',
    url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    category: 'AUTOMAÇÃO E CONTROLE',
    tags: ['clp', 'plc', 'siemens', 'rockwell', 'allen bradley', 'schneider', 'modulo', 'automacao'],
  },
  {
    id: 'aut-2',
    title: 'Contator de Potência e Relé Térmico',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    category: 'FUSÍVEIS E PROTEÇÃO ELÉTRICA',
    tags: ['contator', 'rele', 'termico', 'sobrecarga', 'bobina', 'weg', 'schneider', 'disjuntor'],
  },
  {
    id: 'aut-3',
    title: 'Disjuntor Caixa Moldada e Fusíveis Diazed/NH',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    category: 'FUSÍVEIS E PROTEÇÃO ELÉTRICA',
    tags: ['fusivel', 'disjuntor', 'nh', 'diazed', 'protecao', 'eletrica', 'amperagem', 'curto circuito'],
  },

  // Cabos e Conectores
  {
    id: 'cab-1',
    title: 'Cabos de Comando, Sinal e Força Flexíveis',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    category: 'CABOS E CONECTORES',
    tags: ['cabo', 'fio', 'conector', 'chicote', 'blindagem', 'manga', 'eletrico', 'vias'],
  },
  {
    id: 'cab-2',
    title: 'Conector Industrial Tipo Harting / Circular M12',
    url: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80',
    category: 'CABOS E CONECTORES',
    tags: ['conector', 'harting', 'bornes', 'm12', 'engate', 'tomada industrial', 'borneira'],
  },

  // Hidráulica e Filtros
  {
    id: 'hid-1',
    title: 'Mangueira Hidráulica com Trama de Aço e Terminais',
    url: 'https://images.unsplash.com/photo-1581092160533-317b3558c42a?auto=format&fit=crop&w=800&q=80',
    category: 'HIDRÁULICA',
    tags: ['hidraulica', 'mangueira', 'trama', 'alta pressao', 'terminal', 'oleo', 'cilindro'],
  },
  {
    id: 'hid-2',
    title: 'Filtro de Óleo e Arrefecimento Industrial',
    url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80',
    category: 'FILTROS E LUBRIFICAÇÃO',
    tags: ['filtro', 'lubrificacao', 'oleo', 'elemento filtrante', 'separador', 'hidraulico'],
  },

  // Vedação
  {
    id: 'ved-1',
    title: 'Retentor de Vedação com Mola e Anéis O-Ring',
    url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    category: 'VEDAÇÃO',
    tags: ['retentor', 'o-ring', 'oring', 'vedacao', 'nitrilica', 'viton', 'gaxeta', 'junta'],
  },

  // Fixação
  {
    id: 'fix-1',
    title: 'Parafusos Allen Aço Inox e Porcas Travantes',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    category: 'FIXAÇÃO',
    tags: ['parafuso', 'allen', 'porca', 'arruela', 'fixacao', 'inox', 'aco carbono', 'rosca'],
  },
];

/**
 * Searches the technical library for image recommendations based on query keywords or category
 */
export function searchTechnicalImages(query: string, category?: string): TechnicalImageSuggestion[] {
  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/[\s,/\-_]+/).filter(t => t.length >= 2);

  const scored = TECHNICAL_IMAGE_LIBRARY.map((item) => {
    let score = 0;

    // Match category
    if (category && item.category.toLowerCase().includes(category.toLowerCase())) {
      score += 5;
    }

    // Match title
    const itemTitle = item.title.toLowerCase();
    if (cleanQuery && itemTitle.includes(cleanQuery)) {
      score += 10;
    }

    // Match tags
    for (const token of queryTokens) {
      if (itemTitle.includes(token)) score += 4;
      for (const tag of item.tags) {
        if (tag.includes(token) || token.includes(tag)) {
          score += 3;
        }
      }
    }

    return { item, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return items, falling back to diverse list if no specific match
  const filtered = scored.filter(s => s.score > 0).map(s => s.item);
  if (filtered.length >= 3) {
    return filtered;
  }

  // Complement with category matches or generic
  const remaining = TECHNICAL_IMAGE_LIBRARY.filter(img => !filtered.includes(img));
  return [...filtered, ...remaining].slice(0, 8);
}

/**
 * Gets a default suggested image URL for an item if none is configured
 */
export function getDefaultImageForItem(item: { descricao: string; categoria: string; palavrasChave?: string[] }): string | undefined {
  const query = `${item.categoria} ${item.descricao} ${(item.palavrasChave || []).join(' ')}`;
  const matches = searchTechnicalImages(query, item.categoria);
  return matches.length > 0 ? matches[0].url : undefined;
}
