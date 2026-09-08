// Technical industrial component reference images
// Curated high quality CAD blueprints & photos from dedicated assets and reliable industrial CDNs

export interface TechnicalImageSuggestion {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
}

export const TECHNICAL_IMAGE_LIBRARY: TechnicalImageSuggestion[] = [
  // --- BLUEPRINTS CAD TÉCNICOS ESPECÍFICOS (VISTAS OFICIAIS) ---
  {
    id: 'cad-anel-elastico',
    title: 'Anel Elástico de Retenção Seeger (DIN 471 / 472)',
    url: '/assets/components/anel-elastico.svg',
    category: 'FIXAÇÃO',
    tags: ['anel elastico', 'seeger', 'din 471', 'din 472', 'trava', 'eixo', 'furo', 'aneis', 'retencao'],
  },
  {
    id: 'cad-parafuso-allen-cilindrico',
    title: 'Parafuso Allen Cabeça Cilíndrica (DIN 912 / ISO 4762)',
    url: '/assets/components/parafuso-allen-cilindrico.svg',
    category: 'FIXAÇÃO',
    tags: ['parafuso allen', 'cilindrico', 'din 912', 'iso 4762', 'aco 12.9', 'inox', 'm3', 'm4', 'm5', 'm6', 'm8', 'm10', 'm12', 'sextavado interno'],
  },
  {
    id: 'cad-parafuso-allen-escareado',
    title: 'Parafuso Allen Cabeça Escareada Plana (DIN 7991)',
    url: '/assets/components/parafuso-allen-escareado.svg',
    category: 'FIXAÇÃO',
    tags: ['parafuso allen escareado', 'escareado', 'din 7991', 'cone 90', 'faceado', 'aco', 'inox'],
  },
  {
    id: 'cad-parafuso-allen-abaulado',
    title: 'Parafuso Allen Cabeça Abaulada (ISO 7380 / DIN 7380)',
    url: '/assets/components/parafuso-allen-abaulado.svg',
    category: 'FIXAÇÃO',
    tags: ['parafuso allen abaulado', 'abaulado', 'iso 7380', 'din 7380', 'perfil baixo', 'painel'],
  },
  {
    id: 'cad-parafuso-sem-cabeca',
    title: 'Parafuso Allen Sem Cabeça / Bujão (DIN 913 / 916)',
    url: '/assets/components/parafuso-sem-cabeca.svg',
    category: 'FIXAÇÃO',
    tags: ['parafuso sem cabeca', 'bujao', 'din 913', 'din 916', 'set screw', 'ponta concava', 'trava'],
  },
  {
    id: 'cad-parafuso-sextavado',
    title: 'Parafuso Cabeça Sextavada Rosca Total/Parcial (DIN 933 / 931)',
    url: '/assets/components/parafuso-sextavado.svg',
    category: 'FIXAÇÃO',
    tags: ['parafuso sextavado', 'din 933', 'din 931', 'chave', 'grau 8.8', 'porca', 'fixacao'],
  },
  {
    id: 'cad-arruela',
    title: 'Arruelas de Pressão e Lisas (DIN 127 / DIN 125)',
    url: '/assets/components/arruela.svg',
    category: 'FIXAÇÃO',
    tags: ['arruela', 'pressao', 'lisa', 'din 127', 'din 125', 'travamento', 'distribuicao'],
  },
  {
    id: 'cad-porca',
    title: 'Porca Sextavada e Autotravante Nylon (DIN 934 / DIN 985)',
    url: '/assets/components/porca.svg',
    category: 'FIXAÇÃO',
    tags: ['porca', 'din 934', 'din 985', 'autotravante', 'nylon', 'torque', 'flangeada'],
  },
  {
    id: 'cad-pino-guia',
    title: 'Pinos Guia Temperados e Elásticos (DIN 6325 / DIN 1481)',
    url: '/assets/components/pino-guia.svg',
    category: 'FIXAÇÃO',
    tags: ['pino guia', 'pino elastico', 'din 6325', 'din 1481', 'temperado', 'retificado', 'posicionamento', 'molas'],
  },
  {
    id: 'cad-bucha-guia',
    title: 'Buchas de Guia e Centralização com Flange (DIN 9831)',
    url: '/assets/components/bucha-guia.svg',
    category: 'FIXAÇÃO',
    tags: ['bucha guia', 'bucha', 'din 9831', 'estampos', 'flange', 'retificada', 'bronze', 'aco'],
  },
  {
    id: 'cad-rolamento',
    title: 'Rolamento de Precisão SKF / NSK Blindado (6204-2Z / 6300)',
    url: '/assets/components/rolamento.svg',
    category: 'ROLAMENTOS',
    tags: ['rolamento', 'skf', 'nsk', 'fag', 'esferas', 'blindado', '6204', '63/28', 'mancal', 'eixo'],
  },
  {
    id: 'cad-clp-modulo',
    title: 'Controlador Lógico Programável (CLP) & Módulos I/O',
    url: '/assets/components/clp-modulo.svg',
    category: 'AUTOMAÇÃO E CONTROLE',
    tags: ['clp', 'plc', 'modulo', 'siemens s7', 'b&r x20', 'altus', 'rockwell', 'entradas digitais', 'ethernet'],
  },
  {
    id: 'cad-encoder',
    title: 'Encoder Rotativo Incremental / Absoluto (Sick DFS60)',
    url: '/assets/components/encoder.svg',
    category: 'AUTOMAÇÃO E CONTROLE',
    tags: ['encoder', 'sick', 'dfs60', 'pulsos', 'profibus', 'eixo', 'posicionamento', 'rotativo'],
  },
  {
    id: 'cad-inversor',
    title: 'Inversor de Frequência AC / Drive (Siemens Micromaster)',
    url: '/assets/components/inversor.svg',
    category: 'AUTOMAÇÃO E CONTROLE',
    tags: ['inversor', 'drive', 'vfd', 'micromaster', 'siemens', 'velocidade', 'motor', 'frequencia'],
  },
  {
    id: 'cad-fusivel-nh',
    title: 'Fusível Industrial Faca NH e Base Seccionadora (NH00 / 500V)',
    url: '/assets/components/fusivel-nh.svg',
    category: 'FUSÍVEIS E PROTEÇÃO ELÉTRICA',
    tags: ['fusivel', 'nh', 'nh00', 'nh1', 'faca', '500v', 'amperagem', 'curto circuito', 'diazed'],
  },
  {
    id: 'cad-disjuntor',
    title: 'Disjuntor Motor e Bipolar/Tripolar DIN (WEG MPW / Siemens)',
    url: '/assets/components/disjuntor.svg',
    category: 'FUSÍVEIS E PROTEÇÃO ELÉTRICA',
    tags: ['disjuntor', 'motor', 'tripolar', 'bipolar', 'curva c', 'weg', 'siemens', 'quadro eletrico'],
  },
  {
    id: 'cad-valvula-pneumatica',
    title: 'Válvula Solenoide Pneumática 5/2 Vias e Manifold (Festo / SMC)',
    url: '/assets/components/valvula-pneumatica.svg',
    category: 'PNEUMÁTICA',
    tags: ['valvula', 'solenoide', 'pneumatica', 'festo', 'smc', 'manifold', 'ar comprimido', '24vdc'],
  },
  {
    id: 'cad-cilindro-pneumatico',
    title: 'Cilindro Pneumático ISO Dupla Ação com Amortecimento',
    url: '/assets/components/cilindro-pneumatico.svg',
    category: 'PNEUMÁTICA',
    tags: ['cilindro', 'atuador', 'pneumatico', 'haste', 'dupla acao', 'festo dnc', 'smc', 'embolo'],
  },
  {
    id: 'cad-conexao-pneumatica',
    title: 'Conexões Rápidas Instantâneas e Tubo de Poliuretano (PU)',
    url: '/assets/components/conexao-pneumatica.svg',
    category: 'PNEUMÁTICA',
    tags: ['conexao', 'engate rapido', 'niple', 'tubo pu', 'mangueira', 'festo qs', 'smc kq2'],
  },
  {
    id: 'cad-sensor-indutivo',
    title: 'Sensor de Proximidade Indutivo Cilíndrico M12 / M18',
    url: '/assets/components/sensor-indutivo.svg',
    category: 'SENSORES E INSTRUMENTAÇÃO',
    tags: ['sensor', 'indutivo', 'proximidade', 'm12', 'm18', 'm8', 'balluff', 'omron', 'sick', 'pnp', 'na'],
  },
  {
    id: 'cad-manometro',
    title: 'Manômetro Industrial Caixa Inox com Banho de Glicerina',
    url: '/assets/components/manometro.svg',
    category: 'SENSORES E INSTRUMENTAÇÃO',
    tags: ['manometro', 'pressao', 'glicerina', 'bar', 'psi', 'wika', 'escala', 'ponteiro'],
  },
  {
    id: 'cad-cabo-industrial',
    title: 'Cabos Manga Blindados, Comando e Conectores M12 / Harting',
    url: '/assets/components/cabo-industrial.svg',
    category: 'CABOS E CONECTORES',
    tags: ['cabo', 'blindado', 'manga', 'comando', 'conector m12', 'harting', 'sinal', 'fio'],
  },
  {
    id: 'cad-motor-eletrico',
    title: 'Motor Elétrico de Indução Trifásico (WEG W22 / Siemens)',
    url: '/assets/components/motor-eletrico.svg',
    category: 'MOTORES E TRANSMISSÃO',
    tags: ['motor', 'trifasico', 'weg', 'siemens', 'potencia', 'cv', 'kw', 'eixo', 'bobinamento'],
  },
  {
    id: 'cad-correia-dentada',
    title: 'Correia Dentada Sincronizadora e Polia (Gates HTD / Optibelt)',
    url: '/assets/components/correia-dentada.svg',
    category: 'MOTORES E TRANSMISSÃO',
    tags: ['correia', 'dentada', 'sincronizadora', 'polia', 'htd 8m', 'gates', 'perfil t', 'redutor'],
  },
  {
    id: 'cad-disco-freio',
    title: 'Discos e Pastilhas de Freio Pneumático Industrial (Kampf / Dalmec)',
    url: '/assets/components/disco-freio.svg',
    category: 'MOTORES E TRANSMISSÃO',
    tags: ['disco freio', 'pastilha', 'kampf', 'dalmec', 'friccao', 'grafite', 'ventilado', 'freio'],
  },
  {
    id: 'cad-retentor-oring',
    title: 'Retentor Radial de Vedação com Mola e Anéis O-Ring NBR',
    url: '/assets/components/retentor-oring.svg',
    category: 'VEDAÇÃO',
    tags: ['retentor', 'o-ring', 'oring', 'vedacao', 'nitrilica', 'viton', 'sabo', 'gaxeta'],
  },
  {
    id: 'cad-filtro-industrial',
    title: 'Elementos Filtrantes de Óleo, Hidráulica e Arrefecimento',
    url: '/assets/components/filtro-industrial.svg',
    category: 'FILTROS E LUBRIFICAÇÃO',
    tags: ['filtro', 'lubrificacao', 'oleo hidraulico', 'elemento filtrante', 'cartucho', '10 um'],
  },
  {
    id: 'cad-adesivo-loctite',
    title: 'Travas Químicas Anaeróbicas, Adesivos e Loctite 242/271',
    url: '/assets/components/adesivo-loctite.svg',
    category: 'ÓLEOS E CONSUMÍVEIS',
    tags: ['adesivo', 'loctite', 'trava rosca', 'quimico', 'anaerobico', 'fixador', 'henkel'],
  },
  {
    id: 'cad-abracadeira',
    title: 'Abraçadeiras de Nylon Anti-UV e Abraçadeiras em Aço Inox',
    url: '/assets/components/abracadeira.svg',
    category: 'FIXAÇÃO',
    tags: ['abracadeira', 'hellermann', 'nylon', 'aco inox', 'rosca sem fim', 'mangueiras', 'amarracao'],
  },
  {
    id: 'cad-gas-refrigerante',
    title: 'Cilindros de Fluidos e Gases Refrigerantes (R-134a / R-404a)',
    url: '/assets/components/gas-refrigerante.svg',
    category: 'GASES E CONSUMÍVEIS',
    tags: ['gas refrigerante', 'r-134a', 'r-22', 'r-404a', 'cilindro', 'dac', 'chiller', 'ar condicionado'],
  },
  {
    id: 'cad-lampada-reator',
    title: 'Lâmpadas Tubulares Industriais e Reatores Eletrônicos (Philips)',
    url: '/assets/components/lampada-reator.svg',
    category: 'ILUMINAÇÃO ELÉTRICA',
    tags: ['lampada', 'reator', 'philips', 'tld 30w', 't8', 'fluorescente', 'bivolt', 'maquina'],
  },
  {
    id: 'cad-peca-geral',
    title: 'Componente Mecânico Usinado em Aço SAE 1045 / 4140',
    url: '/assets/components/peca-mecanica-geral.svg',
    category: 'OUTROS / REPOSIÇÃO',
    tags: ['peca', 'usinada', 'engrenagem', 'eixo', 'cad', 'mecanica', 'fabricada', 'desenho'],
  },
  {
    id: 'cad-faca-circular',
    title: 'Faca / Contra-Faca Circular Industrial (Bilstein / Kampf)',
    url: '/assets/components/faca-circular.svg',
    category: 'OUTROS / REPOSIÇÃO',
    tags: ['faca', 'contra faca', 'faca circular', 'bilstein', 'kampf', 'lamina', 'corte', 'slitter'],
  },

  // --- FOTOGRAFIAS TÉCNICAS INDUSTRIAIS ADICIONAIS ---
  {
    id: 'foto-rolamento-mancal',
    title: 'Foto Real: Mancal Pillow Block UCP com Rolamento',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    category: 'ROLAMENTOS',
    tags: ['mancal', 'pillow block', 'ucp', 'flange', 'eixo', 'transmissao', 'rolamento'],
  },
  {
    id: 'foto-sensor-laser',
    title: 'Foto Real: Sensor Óptico e Fotoelétrico de Alta Precisão',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    category: 'SENSORES E INSTRUMENTAÇÃO',
    tags: ['fotoeletrico', 'optico', 'laser', 'barreira', 'difuso', 'reflexivo', 'sensor'],
  },
  {
    id: 'foto-rele-contator',
    title: 'Foto Real: Contatores de Potência e Reles Térmicos WEG/Siemens',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    category: 'FUSÍVEIS E PROTEÇÃO ELÉTRICA',
    tags: ['contator', 'rele', 'termico', 'sobrecarga', 'bobina', 'weg', 'schneider'],
  },
];

/**
 * Deterministic rule-based resolver that maps ANY item to its precise CAD technical specification
 */
export function resolveItemImage(item: { codigo?: string; descricao?: string; categoria?: string }): string {
  const c = (item.codigo || '').toUpperCase();
  const d = (item.descricao || '').toUpperCase();
  const cat = (item.categoria || '').toUpperCase();
  const all = `${c} ${d} ${cat}`;

  // 0. Facas circulares / contra-facas industriais
  if (/CONTRA[- ]?FACA|FACA CIRCULAR|FACA ROTATIVA|LAMINA CIRCULAR|BILSTEIN/i.test(all)) {
    return '/assets/photos/faca-circular-rotativa.jpg';
  }

  // 1. Anel Elástico (Circlip / Seeger DIN 471 / DIN 472)
  if (/ANEL ELAST|ANEL.*EXTERNO|ANEL.*INTERNO|SEEGER|DIN 471|DIN 472|ANEIS/i.test(all)) {
    return '/assets/photos/anel-seeger-din471.jpg';
  }

  // 2. Rolamentos de Rolos Cônicos (SKF 30208 / Conicos)
  if (/ROLO.*CONIC|CONIC|30208|3200|3220/i.test(all)) {
    return '/assets/photos/skf-tapered-roller-30208.jpg';
  }

  // 3. Rolamentos Blindados Metálicos (SKF 6306 ZZ / 2Z)
  if (/(ZZ|2Z|6306|BLINDAD.*METAL)/i.test(all)) {
    return '/assets/photos/skf-shielded-bearing-6306.jpg';
  }

  // 4. Rolamentos Fixos de Esferas (SKF 6204 2RSL / 2RS / Esferas / Rolamento Geral)
  if (/ROLAMENTO|6204|63\/28|MANCAL|BEARING|ESFERA/i.test(all)) {
    return '/assets/photos/skf-ball-bearing-cutaway.jpg';
  }

  // 5. Buchas Guia
  if (/BUCHA.*GUIA|BUCHA/i.test(all)) {
    return '/assets/components/bucha-guia.svg';
  }

  // 6. Pinos Guia e Elásticos
  if (/PINO.*ELAST|PINO.*GUIA|PINO.*TEMPERAD|PINO.*CONICO|PINOS/i.test(all)) {
    return '/assets/components/pino-guia.svg';
  }

  // 7. Parafuso Allen Escareado
  if (/ESCAREAD|DIN 7991/i.test(all)) {
    return '/assets/components/parafuso-allen-escareado.svg';
  }

  // 8. Parafuso Allen Abaulado
  if (/ABAULAD|ISO 7380/i.test(all)) {
    return '/assets/components/parafuso-allen-abaulado.svg';
  }

  // 9. Parafuso Allen Sem Cabeça (Bujão / Set screw)
  if (/SEM CABECA|SEM\/CAB|BUJAO|DIN 913|DIN 914|DIN 916/i.test(all)) {
    return '/assets/components/parafuso-sem-cabeca.svg';
  }

  // 10. Parafuso Allen Cabeça Cilíndrica (DIN 912)
  if (/ALLEN|DIN 912|ISO 4762/i.test(all)) {
    return '/assets/photos/parafuso-allen-din912.jpg';
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
    return '/assets/photos/sensor-indutivo-m12.jpg';
  }

  // 20. Válvulas Solenoide e Manifolds
  if (/VALVULA.*SOLEN|VALVULA.*PNEUM|MANIFOLD|BLOCO DE VALVULA|PRE-SELETOR.*DALMEC/i.test(all)) {
    return '/assets/photos/valvula-solenoide-festo.jpg';
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
  if (/RETENTOR|O-RING|ORING|GAXETA|ANEL VEDA|VEDACAO/i.test(all)) {
    return '/assets/components/retentor-oring.svg';
  }

  // 24. Cabos Industriais e Conectores
  if (/CABO|CONECTOR|BORNE|HARTING|DSUB|D-SUB|ACOPLADOR.*REDE/i.test(all)) {
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
  if (/FREIO|DISCO DE FREIO|KAMPF.*8770/i.test(all)) {
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
  if (/ABRACADEIRA|FITA ISOLANTE|FITA AUTO/i.test(all)) {
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
  if (filtered.length >= 4) {
    return filtered;
  }

  // Complement with category matches or generic
  const remaining = TECHNICAL_IMAGE_LIBRARY.filter(img => !filtered.includes(img));
  return [...filtered, ...remaining].slice(0, 12);
}

/**
 * Gets a default suggested image URL for an item if none is configured or to resolve accurate CAD view
 */
export function getDefaultImageForItem(item: { codigo?: string; descricao: string; categoria: string; palavrasChave?: string[] }): string {
  return resolveItemImage(item);
}
