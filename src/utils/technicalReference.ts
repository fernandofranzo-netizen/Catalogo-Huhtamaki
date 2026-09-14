import { CatalogItem } from '../types';

export function getTechnicalPlaceholder(item: CatalogItem): string {
  const code = (item.codigo || '').toUpperCase();
  const desc = (item.descricao || '').toUpperCase();
  const cat = (item.categoria || '').toUpperCase();
  const sub = (item.subcategoria || '').toUpperCase();
  const combined = `${code} ${desc} ${cat} ${sub}`;

  // Facas de corte
  if (/CONTRA[- ]?FACA|FACA CIRCULAR|FACA ROTATIVA|LAMINA CIRCULAR|BILSTEIN/i.test(combined)) {
    return '/assets/photos/faca-circular-rotativa.jpg';
  }

  // Anéis elásticos / Seeger
  if (/ANEL ELAST|ANEL.*EXTERNO|ANEL.*INTERNO|SEEGER|DIN 471|DIN 472|ANEIS/i.test(combined)) {
    return '/assets/photos/anel-seeger-din471.jpg';
  }

  // Rolamentos de rolos cônicos
  if (/ROLO.*CONIC|CONIC|30208|3200|3220/i.test(combined)) {
    return '/assets/photos/skf-tapered-roller-30208.jpg';
  }

  // Rolamentos blindados
  if (/(ZZ|2Z|6306|BLINDAD.*METAL)/i.test(combined)) {
    return '/assets/photos/skf-shielded-bearing-6306.jpg';
  }

  // Rolamentos esferas / gerais (using intact photo, never cutaway!)
  if (/ROLAMENTO|6204|63\/28|MANCAL|BEARING|ESFERA/i.test(combined)) {
    return '/assets/images/skf_6204_bearing_intact_1788638178941.jpg';
  }

  // Buchas
  if (/BUCHA.*GUIA|BUCHA/i.test(combined)) {
    return '/assets/components/bucha-guia.svg';
  }

  // Pinos
  if (/PINO.*ELAST|PINO.*GUIA|PINO.*TEMPERAD|PINO.*CONICO|PINOS/i.test(combined)) {
    return '/assets/components/pino-guia.svg';
  }

  // Parafusos Allen Escareado
  if (/ESCAREAD|DIN 7991/i.test(combined)) {
    return '/assets/components/parafuso-allen-escareado.svg';
  }

  // Parafusos Allen Abaulado
  if (/ABAULAD|ISO 7380/i.test(combined)) {
    return '/assets/components/parafuso-allen-abaulado.svg';
  }

  // Parafusos Sem Cabeça
  if (/SEM CABECA|SEM\/CAB|BUJAO|DIN 913|DIN 914|DIN 916/i.test(combined)) {
    return '/assets/components/parafuso-sem-cabeca.svg';
  }

  // Allen Cilindrico
  if (/ALLEN|DIN 912|ISO 4762/i.test(combined)) {
    return '/assets/photos/parafuso-allen-din912.jpg';
  }

  // Parafuso Sextavado
  if (/PARAFUSO.*SEXTAVAD|SEXTAVAD/i.test(combined)) {
    return '/assets/components/parafuso-sextavado.svg';
  }

  // Arruelas
  if (/ARRUELA/i.test(combined)) {
    return '/assets/components/arruela.svg';
  }

  // Porcas
  if (/PORCA/i.test(combined)) {
    return '/assets/components/porca.svg';
  }

  // Parafuso geral
  if (/PARAFUSO/i.test(combined)) {
    return '/assets/components/parafuso-sextavado.svg';
  }

  // CLP / Módulos
  if (/CLP|PLC|EXPANSAO.*ETHERNET|ALTUS|CONTROLADOR|6ES7|X20|MODULO ELETRONICO|MODULO DIGITALIZACAO|MODULO DE ENTRADA|MODULO DE SAIDA|RACK MOD|IO MUX/i.test(combined)) {
    return '/assets/components/clp-modulo.svg';
  }

  // Encoders
  if (/ENCODER|DFS60|SICK.*AD-/i.test(combined)) {
    return '/assets/components/encoder.svg';
  }

  // Inversores
  if (/INVERSOR|MICROMASTER|DRIVE|VFD|SOFT.*STARTER|SSW05/i.test(combined)) {
    return '/assets/components/inversor.svg';
  }

  // Disjuntores
  if (/DISJUNTOR|CONTATOR|RELE/i.test(combined)) {
    return '/assets/components/disjuntor.svg';
  }

  // Fusíveis NH
  if (/FUSIVEL.*NH|NH00|NH-00|NH1|NH2|NH3|500V.*100A|500V.*160A/i.test(combined) || (/FUS/i.test(combined) && /NH/i.test(combined)) || /FUSIVEL|DIAZED/i.test(combined)) {
    return '/assets/components/fusivel-nh.svg';
  }

  // Sensores
  if (/SENSOR.*INDUT|SENSOR.*PROX|BALLUFF|M12.*PNP|M18/i.test(combined)) {
    return '/assets/photos/sensor-indutivo-m12.jpg';
  }

  // Válvulas
  if (/VALVULA.*SOLEN|VALVULA.*PNEUM|MANIFOLD|BLOCO DE VALVULA|PRE-SELETOR.*DALMEC/i.test(combined)) {
    return '/assets/photos/valvula-solenoide-festo.jpg';
  }

  // Cilindros pneumáticos
  if (/CILINDRO.*PNEUM|ATUADOR.*PNEUM/i.test(combined)) {
    return '/assets/components/cilindro-pneumatico.svg';
  }

  // Conexões e adaptadores pneumáticos
  if (/CONEXAO|ADAPTADOR.*TUB|ADAPTADOR.*RET|ENGATE.*RAPID|TUBO.*PU|MANGUEIRA.*PU|FESTO.*QS|KQ2H|PBT.*PC/i.test(combined)) {
    return '/assets/components/conexao-pneumatica.svg';
  }

  // Retentores e O-rings
  if (/RETENTOR|O-RING|ORING|GAXETA|ANEL VEDA|VEDACAO/i.test(combined)) {
    return '/assets/components/retentor-oring.svg';
  }

  // Cabos
  if (/CABO|CONECTOR|BORNE|HARTING|DSUB|D-SUB|ACOPLADOR.*REDE/i.test(combined)) {
    return '/assets/components/cabo-industrial.svg';
  }

  // Motores
  if (/MOTOR.*ELETR|MOTOR.*TRIF|REDUTOR/i.test(combined)) {
    return '/assets/components/motor-eletrico.svg';
  }

  // Correias
  if (/CORREIA|POLIA|ENGRENAGEM|SINCRONIZAD/i.test(combined)) {
    return '/assets/components/correia-dentada.svg';
  }

  // Freios
  if (/FREIO|DISCO DE FREIO|KAMPF.*8770/i.test(combined)) {
    return '/assets/components/disco-freio.svg';
  }

  // Manômetros
  if (/MANOMETRO|TERMOPAR|TRANSMISSOR.*PRESSAO|BAR.*PSI/i.test(combined)) {
    return '/assets/components/manometro.svg';
  }

  // Adesivos Loctite
  if (/ADESIVO|TRAVA.*ROSCA|LOCTITE|W742|ACETATO.*ETILA/i.test(combined)) {
    return '/assets/components/adesivo-loctite.svg';
  }

  // Filtros
  if (/FILTRO|LUBRIFIC|OLEO/i.test(combined)) {
    return '/assets/components/filtro-industrial.svg';
  }

  // Abraçadeiras
  if (/ABRACADEIRA|FITA ISOLANTE|FITA AUTO/i.test(combined)) {
    return '/assets/components/abracadeira.svg';
  }

  // Gás refrigerante
  if (/GAS REFRIGERANTE|R-134|R-22|R-407|R-410/i.test(combined)) {
    return '/assets/components/gas-refrigerante.svg';
  }

  // Lâmpadas
  if (/LAMPADA|REATOR.*ELETRONICO|TLD30W|BA15/i.test(combined)) {
    return '/assets/components/lampada-reator.svg';
  }

  if (cat.includes('ELÉTRICO') || cat.includes('ELETRICA') || cat.includes('AUTOMAÇÃO') || cat.includes('COMANDO')) {
    return '/assets/components/clp-modulo.svg';
  }

  return '/assets/components/peca-mecanica-geral.svg';
}
