import re
import json
import glob
import os

known_categories = [
    'Automação e Controle',
    'Cabos e Conectores',
    'Comando e Manobra Elétrica',
    'Ferramentas e Utensílios',
    'Filtros',
    'Fixação',
    'Fontes e Eletrônica',
    'Fusíveis e Proteção Elétrica',
    'Graxas e Consumíveis',
    'Gases e Consumíveis',
    'Hidráulica',
    'Iluminação',
    'Motores e Transmissão',
    'Outros / Reposição',
    'Peças de Máquina / Reposição',
    'Pneumática',
    'Resistências e Aquecimento',
    'Rolamentos',
    'Sensores e Instrumentação',
    'Vedações / O-Rings',
    'Vedações',
    'Vedação',
    'Abrasivos',
    'Abraçadeiras',
    'Eletropneumática'
]

cat_patterns = sorted(known_categories, key=lambda c: len(c), reverse=True)

category_map = {
    'AUTOMAÇÃO E CONTROLE': 'AUTOMAÇÃO E CONTROLE',
    'CABOS E CONECTORES': 'CABOS E CONECTORES',
    'COMANDO E MANOBRA ELÉTRICA': 'COMANDO E MANOBRA ELÉTRICA',
    'FERRAMENTAS E UTENSÍLIOS': 'FERRAMENTAS E UTENSÍLIOS',
    'FILTROS': 'FILTROS',
    'FIXAÇÃO': 'FIXAÇÃO',
    'FONTES E ELETRÔNICA': 'FONTES E ELETRÔNICA',
    'FUSÍVEIS E PROTEÇÃO ELÉTRICA': 'FUSÍVEIS E PROTEÇÃO ELÉTRICA',
    'GRAXAS E CONSUMÍVEIS': 'GRAXAS E CONSUMÍVEIS',
    'GASES E CONSUMÍVEIS': 'GRAXAS E CONSUMÍVEIS',
    'HIDRÁULICA': 'HIDRÁULICA',
    'ILUMINAÇÃO': 'ILUMINAÇÃO',
    'MOTORES E TRANSMISSÃO': 'MOTORES E TRANSMISSÃO',
    'OUTROS / REPOSIÇÃO': 'OUTROS / REPOSIÇÃO',
    'PEÇAS DE MÁQUINA / REPOSIÇÃO': 'PEÇAS DE MÁQUINA / REPOSIÇÃO',
    'PNEUMÁTICA': 'PNEUMÁTICA',
    'RESISTÊNCIAS E AQUECIMENTO': 'RESISTÊNCIAS E AQUECIMENTO',
    'ROLAMENTOS': 'ROLAMENTOS',
    'SENSORES E INSTRUMENTAÇÃO': 'SENSORES E INSTRUMENTAÇÃO',
    'VEDAÇÕES / O-RINGS': 'VEDAÇÃO',
    'VEDAÇÕES': 'VEDAÇÃO',
    'VEDAÇÃO': 'VEDAÇÃO',
    'ABRASIVOS': 'FERRAMENTAS E UTENSÍLIOS',
    'ABRAÇADEIRAS': 'FIXAÇÃO',
    'ELETROPNEUMÁTICA': 'PNEUMÁTICA'
}

known_manufacturers = [
    'SKF', 'FESTO', 'SMC', 'SIEMENS', 'B&R', 'BOBST', 'WINDMOELLER', 'WINDMÖLLER', 'WINDMOLLER',
    'KAMPF', 'PARKER', 'PIOVAN', 'REXROTH', 'DEUBLIN', 'HYDAC', 'MOBIL', 'WURTH', '3M', 'GATES',
    'GOODYEAR', 'OPTIBELT', 'HABASIT', 'QUIMATIC', 'KLINGSPOR', 'STARRETT', 'STARRET', 'ROCOL',
    'LEYBOLD', 'SARGENT-WELCH', 'LUBRAX', 'WEG', 'IFM', 'SICK', 'ALTUS', 'SCHNEIDER', 'OMRON',
    'TIGRE', 'MARIO COTTA', 'PRONATEC', 'DALMEC', 'KUNDIG', 'KÜNDIG', 'BELIMO', 'OEMER', 'CORONA'
]

# Image mappings
item_images = {
    'MM-REPOS-00127-00': '/assets/images/skf_6204_bearing_cutaway_1788574687535.jpg',
    'MM-REPOS-00136-00': '/assets/images/bearing_skf_6306_1788569563132.jpg',
    'MM-REPOS-00196-00': '/assets/images/bearing_skf_conical_1788569576376.jpg',
    'MM-REPOS-00213-00': '/assets/images/kampf_brake_disc_1788575763351.jpg',
    'MM-PNEUM-00135-00': '/assets/images/hex_aluminum_sleeve_1788574705717.jpg',
    'MD-DVSOS-00003-00': '/assets/images/nylon_cable_ties_1788574717612.jpg',
    'MD-DVSOS-00004-00': '/assets/images/nylon_cable_ties_1788574717612.jpg',
    'MD-DVSOS-00009-00': '/assets/images/hose_clamp_inox_1788574730900.jpg',
    'ME-CPELE-00081-00': '/assets/images/siemens_plc_s71200_1788574800893.jpg',
    'MM-PNEUM-00040-00': '/assets/images/shaft_coupling_spider_1788574756499.jpg',
    'MM-PNEUM-00185-00': '/assets/images/pneumatic_air_regulator_1788574768997.jpg',
    'ME-CPELE-00248-00': '/assets/images/inductive_sensor_m18_1788574787992.jpg',
    'ME-CPELE-00246-00': '/assets/images/inductive_sensor_m18_1788574787992.jpg',
}

# Special item documents
item_docs = {
    'MM-REPOS-00127-00': [
        {
            'id': 'doc-127-1',
            'nome': 'Data-sheet Técnico SKF 6204 2RSL',
            'tipo': 'datasheet',
            'url': 'https://www.skf.com/binary/30-316279/SKF-rolling-bearings.pdf',
            'tamanho': '1.2 MB',
            'dataUpload': '15/01/2025'
        }
    ],
    'MM-REPOS-00136-00': [
        {
            'id': 'doc-136-1',
            'nome': 'Manual de Instalação e Tolerâncias SKF 6306',
            'tipo': 'manual',
            'url': 'https://www.skf.com/binary/30-316279/SKF-rolling-bearings.pdf',
            'tamanho': '2.4 MB',
            'dataUpload': '18/01/2025'
        }
    ],
    'MM-REPOS-00213-00': [
        {
            'id': 'doc-213-1',
            'nome': 'Desenho Técnico Kampf 877041685',
            'tipo': 'desenho',
            'url': 'https://example.com/docs/kampf_877041685_drawing.pdf',
            'tamanho': '1.8 MB',
            'dataUpload': '20/01/2025'
        }
    ]
}

ocr_files = sorted(glob.glob('scripts/ocr_pages_*.txt'))
catalog_items = []
seen_codes = set()
item_counter = 1

for fpath in ocr_files:
    with open(fpath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('==') or line.startswith('Código'):
                continue
            
            parts = line.split(maxsplit=1)
            if len(parts) < 2:
                continue
            code = parts[0].strip()
            rest = parts[1].strip()

            found_cat_raw = None
            found_idx = -1
            for cat in cat_patterns:
                idx = rest.lower().find(cat.lower())
                if idx != -1:
                    found_cat_raw = cat
                    found_idx = idx
                    break
            
            if not found_cat_raw:
                continue
            
            desc = rest[:found_idx].strip()
            after_cat = rest[found_idx + len(found_cat_raw):].strip()
            
            cat_upper = found_cat_raw.upper()
            standard_cat = category_map.get(cat_upper, 'OUTROS / REPOSIÇÃO')
            
            if desc.startswith("00 "):
                desc = desc[3:].strip()
            
            # Parse manufacturer & dimension
            tokens = after_cat.split()
            family = tokens[0] if tokens else ""
            rem = " ".join(tokens[1:]) if len(tokens) > 1 else ""
            
            found_mfg = None
            dim_part = ""
            for mfg in known_manufacturers:
                m = re.search(r'\b' + re.escape(mfg) + r'\b', rem, re.IGNORECASE)
                if m:
                    found_mfg = mfg
                    dim_part = (rem[:m.start()] + " " + rem[m.end():]).strip()
                    dim_part = dim_part.replace('N/A', '').strip()
                    break
            
            if not found_mfg:
                dim_part = rem.replace('N/A', '').strip()
            
            # Fallback desc if empty
            if not desc:
                desc = f"{standard_cat} ({code})"

            # Specific fix for Kampf brake disc
            if code == 'MM-REPOS-00213-00':
                desc = 'DISCO DE FREIO COMPLETO KAMPF 877041685'
                standard_cat = 'PEÇAS DE MÁQUINA / REPOSIÇÃO'
                found_mfg = 'KAMPF'
                dim_part = 'P/N 877041685'

            code_upper = code.upper()
            if code_upper in seen_codes:
                continue
            seen_codes.add(code_upper)

            # Generate keywords
            kw_set = set()
            for piece in [code, desc, standard_cat, found_mfg, dim_part, family]:
                if piece:
                    for tok in re.split(r'[\s\-_/,\.:;()]+', piece.lower()):
                        if len(tok) > 1:
                            kw_set.add(tok)

            item = {
                'id': f'item-{item_counter}',
                'codigo': code,
                'descricao': desc,
                'categoria': standard_cat,
                'palavrasChave': sorted(list(kw_set)),
                'status': 'disponivel',
                'dataCriacao': '2025-01-15'
            }
            item_counter += 1

            if found_mfg:
                item['fabricante'] = found_mfg
            if dim_part:
                item['dimensao'] = dim_part

            # Check if we have image or docs
            if code in item_images:
                item['imagemUrl'] = item_images[code]
            if code in item_docs:
                item['documentos'] = item_docs[code]
            else:
                item['documentos'] = []

            # Set a few favorites
            if code in ['MM-REPOS-00127-00', 'MM-REPOS-00136-00', 'MM-REPOS-00213-00', 'MM-PNEUM-00135-00']:
                item['favorito'] = True

            catalog_items.append(item)

print(f"Generated {len(catalog_items)} total catalog items!")

# Write to src/data/initialCatalog.ts
out_ts = """import { CatalogItem } from '../types';

export const CATEGORIAS_PADRAO = [
  'TODOS',
  'AUTOMAÇÃO E CONTROLE',
  'CABOS E CONECTORES',
  'COMANDO E MANOBRA ELÉTRICA',
  'FERRAMENTAS E UTENSÍLIOS',
  'FILTROS',
  'FIXAÇÃO',
  'FONTES E ELETRÔNICA',
  'FUSÍVEIS E PROTEÇÃO ELÉTRICA',
  'GRAXAS E CONSUMÍVEIS',
  'HIDRÁULICA',
  'ILUMINAÇÃO',
  'MOTORES E TRANSMISSÃO',
  'OUTROS / REPOSIÇÃO',
  'PEÇAS DE MÁQUINA / REPOSIÇÃO',
  'PNEUMÁTICA',
  'RESISTÊNCIAS E AQUECIMENTO',
  'ROLAMENTOS',
  'SENSORES E INSTRUMENTAÇÃO',
  'VEDAÇÃO',
] as const;

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = """ + json.dumps(catalog_items, ensure_ascii=False, indent=2) + ";\n"

with open('src/data/initialCatalog.ts', 'w', encoding='utf-8') as f:
    f.write(out_ts)

print("Saved src/data/initialCatalog.ts!")
