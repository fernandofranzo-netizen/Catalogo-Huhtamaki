const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/assets/components');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function wrapSvg(title, standard, graphicContent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.8" />
    </pattern>
    <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#e2e8f0" />
      <stop offset="70%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    <linearGradient id="steel-light" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="50%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <linearGradient id="dark-steel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="brass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#eab308" />
      <stop offset="80%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#854d0e" />
    </linearGradient>
    <linearGradient id="blue-ind" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <linearGradient id="amber-accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Background CAD Grid -->
  <rect width="400" height="300" fill="#f8fafc" />
  <rect width="400" height="300" fill="url(#cad-grid)" />
  
  <!-- Outer border -->
  <rect x="10" y="10" width="380" height="280" rx="6" fill="none" stroke="#cbd5e1" stroke-width="1.5" />

  <!-- Technical Header watermark -->
  <text x="24" y="34" font-family="monospace" font-weight="bold" font-size="11" fill="#0284c7" letter-spacing="1.5">ESPECIFICAÇÃO TÉCNICA // CAD</text>
  <text x="376" y="34" text-anchor="end" font-family="monospace" font-weight="bold" font-size="11" fill="#64748b">${standard}</text>
  <line x1="24" y1="42" x2="376" y2="42" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 2" />

  <!-- Component Graphic -->
  <g transform="translate(0, 0)" filter="url(#shadow)">
    ${graphicContent}
  </g>

  <!-- Title footer badge -->
  <rect x="24" y="246" width="352" height="30" rx="4" fill="#0f172a" />
  <text x="36" y="266" font-family="sans-serif" font-weight="bold" font-size="11" fill="#f8fafc" letter-spacing="0.8">${title}</text>
  <text x="364" y="266" text-anchor="end" font-family="monospace" font-weight="bold" font-size="10" fill="#38bdf8">REF. INDUSTRIAL</text>
</svg>`;
}

const SVGS = {
  'anel-elastico.svg': {
    title: 'ANEL ELÁSTICO SEEGER',
    standard: 'DIN 471 / 472',
    graphic: `
      <!-- Anel elástico externo Seeger -->
      <g transform="translate(200, 138)">
        <!-- Outer ring path with opening at top -->
        <path d="M -24,-70 A 74,74 0 1,0 24,-70 L 32,-76 C 42,-84 54,-72 44,-60 L 38,-54 A 58,58 0 1,1 -38,-54 L -44,-60 C -54,-72 -42,-84 -32,-76 Z" 
              fill="url(#dark-steel)" stroke="#0f172a" stroke-width="2.5" />
        <!-- Highlights on ring bevel -->
        <path d="M -18,-66 A 69,69 0 1,0 18,-66" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" />
        <!-- Pinhole left ear -->
        <circle cx="-38" cy="-68" r="5.5" fill="#f8fafc" stroke="#0f172a" stroke-width="2" />
        <!-- Pinhole right ear -->
        <circle cx="38" cy="-68" r="5.5" fill="#f8fafc" stroke="#0f172a" stroke-width="2" />
        <!-- Center reference axes -->
        <line x1="-85" y1="0" x2="85" y2="0" stroke="#0284c7" stroke-width="1" stroke-dasharray="6 3 2 3" opacity="0.6" />
        <line x1="0" y1="-85" x2="0" y2="85" stroke="#0284c7" stroke-width="1" stroke-dasharray="6 3 2 3" opacity="0.6" />
        <!-- Dimension arrow -->
        <line x1="74" y1="0" x2="105" y2="0" stroke="#64748b" stroke-width="1.2" />
        <text x="110" y="4" font-family="monospace" font-size="9" fill="#475569" font-weight="bold">Ø EIXO</text>
      </g>
    `
  },

  'rolamento.svg': {
    title: 'ROLAMENTO RIGIDO DE ESFERAS',
    standard: 'ISO 15 / DIN 625',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Outer ring -->
        <circle cx="0" cy="0" r="76" fill="url(#metal-grad)" stroke="#334155" stroke-width="3" />
        <circle cx="0" cy="0" r="64" fill="#334155" stroke="#1e293b" stroke-width="1.5" />
        
        <!-- Cage raceway background -->
        <circle cx="0" cy="0" r="52" fill="#e2e8f0" />
        
        <!-- Inner ring -->
        <circle cx="0" cy="0" r="40" fill="url(#metal-grad)" stroke="#334155" stroke-width="2.5" />
        <circle cx="0" cy="0" r="28" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />

        <!-- Esferas de aço com brilho -->
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const cx = Math.round(Math.cos(rad) * 52);
          const cy = Math.round(Math.sin(rad) * 52);
          return `
            <circle cx="${cx}" cy="${cy}" r="11" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="1.5" />
            <circle cx="${cx - 3}" cy="${cy - 3}" r="3.5" fill="#ffffff" opacity="0.8" />
          `;
        }).join('')}

        <!-- Center bore text -->
        <circle cx="0" cy="0" r="1.5" fill="#0284c7" />
        <text x="0" y="3" text-anchor="middle" font-family="monospace" font-size="8" fill="#64748b" font-weight="bold">2RS</text>
      </g>
    `
  },

  'retentor-oring.svg': {
    title: 'RETENTOR RADIAL / O-RING',
    standard: 'DIN 3760 / ISO 3601',
    graphic: `
      <g transform="translate(145, 138)">
        <!-- Retentor radial com mola -->
        <circle cx="0" cy="0" r="62" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
        <circle cx="0" cy="0" r="54" fill="#334155" stroke="#475569" stroke-width="1.5" />
        <circle cx="0" cy="0" r="42" fill="#1e293b" />
        <circle cx="0" cy="0" r="34" fill="#0f172a" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="3 2" />
        <circle cx="0" cy="0" r="28" fill="#f8fafc" stroke="#334155" stroke-width="2" />
        <!-- Spring reflection -->
        <text x="0" y="3" text-anchor="middle" font-family="monospace" font-size="8" fill="#94a3b8">NBR / VITON</text>
      </g>
      <!-- O-ring adjacent -->
      <g transform="translate(285, 138)">
        <ellipse cx="0" cy="0" rx="42" ry="42" fill="none" stroke="#0f172a" stroke-width="18" />
        <ellipse cx="0" cy="0" rx="42" ry="42" fill="none" stroke="#334155" stroke-width="14" />
        <ellipse cx="-2" cy="-2" rx="41" ry="41" fill="none" stroke="#64748b" stroke-width="3" opacity="0.6" />
        <text x="0" y="3" text-anchor="middle" font-family="monospace" font-size="9" fill="#0284c7" font-weight="bold">O-RING</text>
      </g>
    `
  },

  'parafuso-allen-cilindrico.svg': {
    title: 'PARAFUSO ALLEN CABEÇA CILÍNDRICA',
    standard: 'DIN 912 / ISO 4762',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Head -->
        <rect x="-85" y="-32" width="48" height="64" rx="2" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <!-- Knurling ridges on head -->
        <line x1="-75" y1="-32" x2="-75" y2="32" stroke="#475569" stroke-width="1.5" />
        <line x1="-65" y1="-32" x2="-65" y2="32" stroke="#475569" stroke-width="1.5" />
        <line x1="-55" y1="-32" x2="-55" y2="32" stroke="#475569" stroke-width="1.5" />
        <!-- Shank / Unthreaded body -->
        <rect x="-37" y="-20" width="30" height="40" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
        <!-- Threaded portion -->
        <rect x="-7" y="-20" width="85" height="40" fill="#cbd5e1" stroke="#1e293b" stroke-width="2" />
        <!-- Threads -->
        ${[0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70].map(x => `
          <line x1="${x - 7}" y1="-20" x2="${x}" y2="20" stroke="#334155" stroke-width="2" />
          <line x1="${x - 4}" y1="-20" x2="${x + 3}" y2="20" stroke="#ffffff" stroke-width="1" opacity="0.7" />
        `).join('')}
        <!-- Chamfered end -->
        <polygon points="78,-20 88,-14 88,14 78,20" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
        <!-- Hex socket view inset on left -->
        <g transform="translate(-130, 0)">
          <circle cx="0" cy="0" r="24" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
          <!-- Hexagon -->
          <polygon points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
        </g>
      </g>
    `
  },

  'parafuso-allen-escareado.svg': {
    title: 'PARAFUSO ALLEN CABEÇA ESCAREADA',
    standard: 'DIN 7991 / ISO 10642',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Countersunk head 90 deg cone -->
        <polygon points="-85,-36 -50,-18 -50,18 -85,36" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <line x1="-85" y1="-36" x2="-85" y2="36" stroke="#1e293b" stroke-width="3" />
        <!-- Threaded body -->
        <rect x="-50" y="-18" width="115" height="36" fill="#cbd5e1" stroke="#1e293b" stroke-width="2" />
        ${[0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104].map(x => `
          <line x1="${x - 50}" y1="-18" x2="${x - 42}" y2="18" stroke="#334155" stroke-width="2" />
        `).join('')}
        <polygon points="65,-18 75,-12 75,12 65,18" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
        <!-- Hex socket inset -->
        <g transform="translate(-125, 0)">
          <circle cx="0" cy="0" r="22" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
          <polygon points="0,-12 10.5,-6 10.5,6 0,12 -10.5,6 -10.5,-6" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
        </g>
      </g>
    `
  },

  'parafuso-allen-abaulado.svg': {
    title: 'PARAFUSO ALLEN CABEÇA ABAULADA',
    standard: 'ISO 7380 / DIN 7380',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Dome head -->
        <path d="M -50,-20 C -75,-20 -85,-10 -85,0 C -85,10 -75,20 -50,20 Z" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <!-- Threaded shank -->
        <rect x="-50" y="-18" width="115" height="36" fill="#cbd5e1" stroke="#1e293b" stroke-width="2" />
        ${[0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104].map(x => `
          <line x1="${x - 50}" y1="-18" x2="${x - 42}" y2="18" stroke="#334155" stroke-width="2" />
        `).join('')}
        <polygon points="65,-18 75,-12 75,12 65,18" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
        <!-- Hex socket inset -->
        <g transform="translate(-125, 0)">
          <circle cx="0" cy="0" r="22" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
          <polygon points="0,-12 10.5,-6 10.5,6 0,12 -10.5,6 -10.5,-6" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
        </g>
      </g>
    `
  },

  'parafuso-sem-cabeca.svg': {
    title: 'PARAFUSO SEM CABEÇA / BUJÃO',
    standard: 'DIN 913 / 914 / 916',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Total threaded cylinder -->
        <rect x="-65" y="-22" width="130" height="44" rx="2" fill="#cbd5e1" stroke="#1e293b" stroke-width="2.5" />
        ${[-55, -45, -35, -25, -15, -5, 5, 15, 25, 35, 45].map(x => `
          <line x1="${x}" y1="-22" x2="${x + 9}" y2="22" stroke="#334155" stroke-width="2.2" />
          <line x1="${x + 3}" y1="-22" x2="${x + 12}" y2="22" stroke="#ffffff" stroke-width="1" opacity="0.6" />
        `).join('')}
        <!-- Concave cup point at right -->
        <path d="M 65,-22 Q 55,0 65,22" fill="none" stroke="#1e293b" stroke-width="2.5" />
        <!-- Hex socket inset on left -->
        <g transform="translate(-115, 0)">
          <circle cx="0" cy="0" r="20" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
          <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
        </g>
      </g>
    `
  },

  'parafuso-sextavado.svg': {
    title: 'PARAFUSO CABEÇA SEXTAVADA',
    standard: 'DIN 933 / DIN 931',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Hexagon head view (isometric representation) -->
        <polygon points="-85,-34 -45,-34 -45,34 -85,34" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <line x1="-85" y1="-12" x2="-45" y2="-12" stroke="#334155" stroke-width="2" />
        <line x1="-85" y1="12" x2="-45" y2="12" stroke="#334155" stroke-width="2" />
        <!-- Hex head facet shading -->
        <rect x="-85" y="-12" width="40" height="24" fill="url(#metal-grad)" opacity="0.9" />
        <!-- Flange / collar ring -->
        <rect x="-45" y="-36" width="6" height="72" rx="1" fill="#94a3b8" stroke="#1e293b" stroke-width="1.5" />
        <!-- Threaded body -->
        <rect x="-39" y="-20" width="115" height="40" fill="#cbd5e1" stroke="#1e293b" stroke-width="2" />
        ${[0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104].map(x => `
          <line x1="${x - 39}" y1="-20" x2="${x - 31}" y2="20" stroke="#334155" stroke-width="2" />
        `).join('')}
        <polygon points="76,-20 86,-14 86,14 76,20" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
      </g>
    `
  },

  'porca.svg': {
    title: 'PORCA SEXTAVADA / AUTOTRAVANTE',
    standard: 'DIN 934 / DIN 985',
    graphic: `
      <g transform="translate(150, 138)">
        <!-- Front view DIN 934 -->
        <polygon points="0,-48 42,-24 42,24 0,48 -42,24 -42,-24" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="3" />
        <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#475569" stroke-width="2" />
        <!-- Internal threads spiral -->
        <circle cx="0" cy="0" r="18" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 4" />
        <text x="0" y="3" text-anchor="middle" font-family="monospace" font-size="8" fill="#f8fafc">M8 / M10</text>
      </g>
      <!-- Side view DIN 985 with nylon collar -->
      <g transform="translate(275, 138)">
        <rect x="-30" y="-35" width="60" height="70" rx="3" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <line x1="-30" y1="-12" x2="30" y2="-12" stroke="#475569" stroke-width="1.5" />
        <line x1="-30" y1="12" x2="30" y2="12" stroke="#475569" stroke-width="1.5" />
        <!-- Blue nylon ring -->
        <rect x="-24" y="-45" width="48" height="10" rx="3" fill="#0284c7" stroke="#0369a1" stroke-width="1.5" />
        <text x="0" y="-48" text-anchor="middle" font-family="monospace" font-size="8" fill="#0284c7" font-weight="bold">NYLON</text>
      </g>
    `
  },

  'arruela.svg': {
    title: 'ARRUELA LISA / PRESSÃO',
    standard: 'DIN 125 / DIN 127',
    graphic: `
      <g transform="translate(150, 138)">
        <!-- Flat washer DIN 125 -->
        <circle cx="0" cy="0" r="50" fill="url(#metal-grad)" stroke="#334155" stroke-width="2.5" />
        <circle cx="0" cy="0" r="24" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />
        <circle cx="0" cy="0" r="44" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.6" />
        <text x="0" y="4" text-anchor="middle" font-family="monospace" font-size="9" fill="#475569" font-weight="bold">DIN 125</text>
      </g>
      <!-- Spring washer DIN 127 with split -->
      <g transform="translate(275, 138)">
        <path d="M 0,-48 A 48,48 0 1,0 12,-46 L 6,-24 A 24,24 0 1,1 -6,-24 Z" fill="url(#metal-grad)" stroke="#0f172a" stroke-width="2.5" />
        <!-- Split offset -->
        <line x1="0" y1="-48" x2="0" y2="-24" stroke="#0f172a" stroke-width="3" />
        <text x="0" y="4" text-anchor="middle" font-family="monospace" font-size="9" fill="#0284c7" font-weight="bold">DIN 127</text>
      </g>
    `
  },

  'pino-guia.svg': {
    title: 'PINO GUIA / PINO ELÁSTICO',
    standard: 'DIN 6325 / DIN 1481',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Ground dowel pin (DIN 6325) -->
        <rect x="-105" y="-35" width="210" height="30" rx="3" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <polygon points="-105,-35 -97,-35 -105,-27" fill="#64748b" />
        <polygon points="105,-35 97,-35 105,-27" fill="#64748b" />
        <line x1="-90" y1="-20" x2="90" y2="-20" stroke="#ffffff" stroke-width="2" opacity="0.7" />
        
        <!-- Spring pin with slot (DIN 1481) -->
        <rect x="-105" y="8" width="210" height="28" rx="2" fill="url(#dark-steel)" stroke="#0f172a" stroke-width="2.5" />
        <!-- Longitudinal slot -->
        <line x1="-105" y1="22" x2="105" y2="22" stroke="#f8fafc" stroke-width="3.5" />
        <line x1="-105" y1="22" x2="105" y2="22" stroke="#0284c7" stroke-width="1.5" />
      </g>
    `
  },

  'bucha-guia.svg': {
    title: 'BUCHA GUIA INDUSTRIAL',
    standard: 'DIN 179 / DIN 172',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Flange head -->
        <rect x="-65" y="-45" width="24" height="90" rx="3" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <!-- Main body cylinder -->
        <rect x="-41" y="-32" width="115" height="64" fill="url(#steel-light)" stroke="#1e293b" stroke-width="2" />
        <!-- Inner bore dashed lines -->
        <line x1="-65" y1="-18" x2="74" y2="-18" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="6 3" />
        <line x1="-65" y1="18" x2="74" y2="18" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="6 3" />
        <!-- Lubrication oil groove / hole -->
        <circle cx="15" cy="0" r="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
        <!-- Chamfer on entry -->
        <polygon points="74,-32 82,-26 82,26 74,32" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
      </g>
    `
  },

  'conexao-pneumatica.svg': {
    title: 'CONEXÃO INSTANTÂNEA PNEUMÁTICA',
    standard: 'FESTO QS / SMC KQ2',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Blue release ring (push-in collar) -->
        <rect x="-90" y="-22" width="22" height="44" rx="4" fill="#0284c7" stroke="#0369a1" stroke-width="2" />
        <!-- Internal teeth hint -->
        <line x1="-80" y1="-16" x2="-80" y2="16" stroke="#ffffff" stroke-width="2" />
        <!-- Nickel plated body with hex -->
        <rect x="-68" y="-28" width="55" height="56" rx="2" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <line x1="-48" y1="-28" x2="-48" y2="28" stroke="#475569" stroke-width="2" />
        <line x1="-28" y1="-28" x2="-28" y2="28" stroke="#475569" stroke-width="2" />
        <!-- Male thread BSP -->
        <rect x="-13" y="-18" width="85" height="36" fill="url(#brass)" stroke="#854d0e" stroke-width="2" />
        ${[0, 8, 16, 24, 32, 40, 48, 56, 64, 72].map(x => `
          <line x1="${x - 13}" y1="-18" x2="${x - 5}" y2="18" stroke="#713f12" stroke-width="2" />
        `).join('')}
        <!-- Pre-applied thread sealant (Teflon blue/white) -->
        <rect x="25" y="-19" width="30" height="38" fill="#38bdf8" opacity="0.4" />
      </g>
    `
  },

  'cilindro-pneumatico.svg': {
    title: 'CILINDRO PNEUMÁTICO ISO',
    standard: 'ISO 15552 / ISO 6432',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Rear end cap -->
        <rect x="-105" y="-36" width="30" height="72" rx="3" fill="#334155" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="-90" cy="-18" r="5" fill="#0284c7" stroke="#0f172a" stroke-width="1.5" />
        <!-- Aluminum profile barrel with sensor slots -->
        <rect x="-75" y="-34" width="105" height="68" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
        <line x1="-75" y1="-16" x2="30" y2="-16" stroke="#475569" stroke-width="3" />
        <line x1="-75" y1="16" x2="30" y2="16" stroke="#475569" stroke-width="3" />
        <!-- Front end cap with port -->
        <rect x="30" y="-36" width="30" height="72" rx="3" fill="#334155" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="45" cy="-18" r="5" fill="#0284c7" stroke="#0f172a" stroke-width="1.5" />
        <!-- Chrome piston rod -->
        <rect x="60" y="-14" width="65" height="28" fill="url(#steel-light)" stroke="#0f172a" stroke-width="2" />
        <line x1="60" y1="-4" x2="125" y2="-4" stroke="#ffffff" stroke-width="2" />
        <!-- Rod thread & nut -->
        <rect x="125" y="-10" width="18" height="20" fill="url(#brass)" stroke="#854d0e" stroke-width="1.5" />
      </g>
    `
  },

  'valvula-pneumatica.svg': {
    title: 'VÁLVULA SOLENÓIDE 5/2 VIAS',
    standard: 'NAMUR / ISO 5599',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Valve body block -->
        <rect x="-55" y="-38" width="90" height="76" rx="4" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <!-- Pneumatic ports with brass threads -->
        <circle cx="-30" cy="16" r="8" fill="url(#brass)" stroke="#713f12" stroke-width="1.5" />
        <circle cx="-10" cy="-16" r="8" fill="url(#brass)" stroke="#713f12" stroke-width="1.5" />
        <circle cx="10" cy="16" r="8" fill="url(#brass)" stroke="#713f12" stroke-width="1.5" />
        <!-- Solenoid coil body left -->
        <rect x="-105" y="-30" width="50" height="60" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
        <rect x="-115" y="-15" width="10" height="30" rx="2" fill="#0284c7" />
        <!-- Manual override button -->
        <circle cx="-42" cy="-24" r="4" fill="#f59e0b" stroke="#b45309" stroke-width="1" />
        <!-- DIN connector terminal top -->
        <polygon points="-90,-30 -70,-30 -65,-52 -95,-52" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
        <!-- Schematic symbol hint -->
        <rect x="42" y="-25" width="45" height="50" fill="#f8fafc" stroke="#64748b" stroke-width="1" />
        <path d="M 47,-15 L 60,10 M 60,-15 L 75,10" stroke="#0284c7" stroke-width="1.5" />
      </g>
    `
  },

  'fusivel-nh.svg': {
    title: 'FUSÍVEL INDUSTRIAL NH',
    standard: 'IEC 60269 / DIN 43620',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Ceramic steatite body -->
        <rect x="-55" y="-45" width="110" height="90" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2.5" />
        <!-- Cooling ceramic ribs -->
        <line x1="-55" y1="-20" x2="55" y2="-20" stroke="#fde68a" stroke-width="2" />
        <line x1="-55" y1="20" x2="55" y2="20" stroke="#fde68a" stroke-width="2" />
        <!-- Top contact blade -->
        <rect x="-12" y="-90" width="24" height="45" rx="2" fill="url(#metal-grad)" stroke="#334155" stroke-width="2" />
        <circle cx="0" cy="-72" r="4" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />
        <!-- Bottom contact blade -->
        <rect x="-12" y="45" width="24" height="45" rx="2" fill="url(#metal-grad)" stroke="#334155" stroke-width="2" />
        <circle cx="0" cy="72" r="4" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />
        <!-- Blown fuse indicator tag -->
        <rect x="-8" y="-48" width="16" height="8" rx="1" fill="#ef4444" stroke="#991b1b" stroke-width="1" />
        <!-- Rating label -->
        <text x="0" y="-2" text-anchor="middle" font-family="monospace" font-size="11" fill="#78350f" font-weight="black">NH00</text>
        <text x="0" y="12" text-anchor="middle" font-family="monospace" font-size="9" fill="#92400e">500V 100A</text>
        <text x="0" y="24" text-anchor="middle" font-family="monospace" font-size="7" fill="#b45309">gL / gG</text>
      </g>
    `
  },

  'disjuntor.svg': {
    title: 'DISJUNTOR MOTOR / CONTATOR',
    standard: 'IEC 60947 / DIN RAIL',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- DIN rail housing -->
        <rect x="-65" y="-60" width="130" height="120" rx="5" fill="#f1f5f9" stroke="#334155" stroke-width="2.5" />
        <!-- Terminal screws top -->
        <circle cx="-40" cy="-45" r="7" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="1.5" />
        <circle cx="0" cy="-45" r="7" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="1.5" />
        <circle cx="40" cy="-45" r="7" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="1.5" />
        <!-- Terminal screws bottom -->
        <circle cx="-40" cy="45" r="7" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="1.5" />
        <circle cx="0" cy="45" r="7" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="1.5" />
        <circle cx="40" cy="45" r="7" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="1.5" />
        <!-- Toggle switch lever -->
        <rect x="-24" y="-16" width="48" height="32" rx="4" fill="#0f172a" stroke="#0284c7" stroke-width="1.5" />
        <rect x="-16" y="-8" width="32" height="16" rx="2" fill="#ef4444" />
        <!-- Indicator window -->
        <circle cx="36" cy="0" r="5" fill="#22c55e" stroke="#15803d" stroke-width="1.5" />
        <text x="0" y="28" text-anchor="middle" font-family="monospace" font-size="8" fill="#475569" font-weight="bold">3P 400V</text>
      </g>
    `
  },

  'clp-modulo.svg': {
    title: 'CLP / MÓDULO DE AUTOMAÇÃO',
    standard: 'PROFINET / MODBUS',
    graphic: `
      <g transform="translate(200, 138)">
        <rect x="-85" y="-55" width="170" height="110" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2.5" />
        <!-- Status LEDs -->
        <circle cx="-65" cy="-35" r="4" fill="#22c55e" />
        <text x="-56" y="-32" font-family="monospace" font-size="7" fill="#94a3b8">RUN</text>
        <circle cx="-65" cy="-22" r="4" fill="#f59e0b" />
        <text x="-56" y="-19" font-family="monospace" font-size="7" fill="#94a3b8">ERR</text>
        <circle cx="-65" cy="-9" r="4" fill="#0284c7" />
        <text x="-56" y="-6" font-family="monospace" font-size="7" fill="#94a3b8">TX/RX</text>
        <!-- I/O channel LED matrix -->
        <g transform="translate(0, -32)">
          ${[-20, -6, 8, 22, 36, 50].map(x => `
            <circle cx="${x}" cy="0" r="3" fill="#22c55e" />
            <circle cx="${x}" cy="10" r="3" fill="#22c55e" />
          `).join('')}
        </g>
        <!-- Ethernet Port RJ45 -->
        <rect x="-45" y="10" width="38" height="34" rx="2" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5" />
        <path d="M -37,30 L -17,30 L -17,40 L -37,40 Z" fill="#64748b" />
        <!-- Removable terminal block on right -->
        <rect x="15" y="5" width="55" height="42" rx="2" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />
        <line x1="25" y1="5" x2="25" y2="47" stroke="#cbd5e1" stroke-width="1" />
        <line x1="38" y1="5" x2="38" y2="47" stroke="#cbd5e1" stroke-width="1" />
        <line x1="51" y1="5" x2="51" y2="47" stroke="#cbd5e1" stroke-width="1" />
      </g>
    `
  },

  'motor-eletrico.svg': {
    title: 'MOTOR ELÉTRICO TRIFÁSICO',
    standard: 'ABNT NBR 17094 / IEC',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Finned stator housing -->
        <rect x="-60" y="-45" width="105" height="90" rx="4" fill="url(#steel-light)" stroke="#1e293b" stroke-width="2.5" />
        <!-- Cooling ribs -->
        ${[-32, -18, -4, 10, 24].map(y => `
          <line x1="-60" y1="${y}" x2="45" y2="${y}" stroke="#334155" stroke-width="2.5" />
        `).join('')}
        <!-- Terminal box top -->
        <rect x="-35" y="-62" width="45" height="18" rx="2" fill="#334155" stroke="#0f172a" stroke-width="2" />
        <!-- Fan cover rear -->
        <path d="M -60,-42 C -78,-42 -85,-20 -85,0 C -85,20 -78,42 -60,42 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
        <!-- Front drive flange -->
        <rect x="45" y="-40" width="16" height="80" fill="#64748b" stroke="#1e293b" stroke-width="2" />
        <!-- Output shaft with keyway -->
        <rect x="61" y="-12" width="45" height="24" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
        <rect x="70" y="-12" width="22" height="6" fill="#1e293b" />
        <!-- Mounting feet -->
        <polygon points="-45,45 -35,58 -10,58 -5,45" fill="#334155" />
        <polygon points="15,45 25,58 45,58 45,45" fill="#334155" />
      </g>
    `
  },

  'correia-dentada.svg': {
    title: 'CORREIA SINCRONIZADORA DENTADA',
    standard: 'HTD / T5 / T10 / AT10',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Loop band -->
        <rect x="-105" y="-30" width="210" height="60" rx="30" fill="none" stroke="#1e293b" stroke-width="20" />
        <!-- Inner gear teeth -->
        <rect x="-105" y="-30" width="210" height="60" rx="30" fill="none" stroke="#475569" stroke-width="12" />
        <!-- Sprocket / pulley center left -->
        <circle cx="-65" cy="0" r="26" fill="url(#metal-grad)" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="-65" cy="0" r="10" fill="#f8fafc" stroke="#0f172a" stroke-width="2" />
        <!-- Sprocket / pulley center right -->
        <circle cx="65" cy="0" r="26" fill="url(#metal-grad)" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="65" cy="0" r="10" fill="#f8fafc" stroke="#0f172a" stroke-width="2" />
        <text x="0" y="4" text-anchor="middle" font-family="monospace" font-size="10" fill="#0284c7" font-weight="bold">HTD 8M</text>
      </g>
    `
  },

  'disco-freio.svg': {
    title: 'DISCO DE FREIO / PASTILHA',
    standard: 'SISTEMA PNEUMÁTICO KAMPF',
    graphic: `
      <g transform="translate(160, 138)">
        <!-- Rotor disk -->
        <circle cx="0" cy="0" r="68" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="3" />
        <circle cx="0" cy="0" r="48" fill="#e2e8f0" stroke="#64748b" stroke-width="1" />
        <!-- Ventilation slots/holes -->
        ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return `<circle cx="${Math.round(Math.cos(rad) * 58)}" cy="${Math.round(Math.sin(rad) * 58)}" r="3" fill="#334155" />`;
        }).join('')}
        <!-- Center hub -->
        <circle cx="0" cy="0" r="28" fill="#334155" stroke="#0f172a" stroke-width="2" />
        <circle cx="0" cy="0" r="14" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5" />
      </g>
      <!-- Brake pad caliper adjacent -->
      <g transform="translate(285, 138)">
        <rect x="-35" y="-45" width="65" height="90" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="2.5" />
        <rect x="-42" y="-35" width="10" height="70" rx="2" fill="#ca8a04" stroke="#713f12" stroke-width="1.5" />
        <circle cx="0" cy="-20" r="6" fill="#64748b" />
        <circle cx="0" cy="20" r="6" fill="#64748b" />
        <text x="0" y="3" text-anchor="middle" font-family="monospace" font-size="8" fill="#f8fafc">CALIPER</text>
      </g>
    `
  },

  'sensor-indutivo.svg': {
    title: 'SENSOR INDUTIVO DE PROXIMIDADE',
    standard: 'M12 / M18 PNP DC',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Threaded barrel M12 -->
        <rect x="-55" y="-18" width="110" height="36" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2" />
        ${[0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98].map(x => `
          <line x1="${x - 55}" y1="-18" x2="${x - 49}" y2="18" stroke="#475569" stroke-width="1.8" />
        `).join('')}
        <!-- Blue sensing face -->
        <polygon points="-75,-16 -55,-18 -55,18 -75,16" fill="#0284c7" stroke="#0369a1" stroke-width="2" />
        <!-- Two lock nuts -->
        <rect x="-30" y="-26" width="14" height="52" rx="2" fill="url(#brass)" stroke="#713f12" stroke-width="2" />
        <rect x="15" y="-26" width="14" height="52" rx="2" fill="url(#brass)" stroke="#713f12" stroke-width="2" />
        <!-- Rear body sleeve & LED -->
        <rect x="55" y="-14" width="30" height="28" rx="2" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
        <circle cx="68" cy="0" r="4" fill="#ef4444" stroke="#991b1b" stroke-width="1" />
        <!-- Output cable with strain relief -->
        <path d="M 85,0 Q 110,0 120,20" fill="none" stroke="#334155" stroke-width="8" stroke-linecap="round" />
      </g>
    `
  },

  'encoder.svg': {
    title: 'ENCODER ROTATIVO INCREMENTAL',
    standard: 'SICK DFS60 / 1024 PPR',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Solid cylinder body -->
        <rect x="-45" y="-45" width="85" height="90" rx="4" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <!-- Synchro / servo flange -->
        <rect x="-60" y="-52" width="15" height="104" rx="2" fill="#64748b" stroke="#1e293b" stroke-width="2" />
        <!-- Solid steel shaft -->
        <rect x="-95" y="-12" width="35" height="24" fill="url(#steel-light)" stroke="#1e293b" stroke-width="2" />
        <!-- Flat keyway on shaft -->
        <line x1="-90" y1="-5" x2="-65" y2="-5" stroke="#334155" stroke-width="2" />
        <!-- M12/M23 rear circular connector -->
        <rect x="40" y="-22" width="28" height="44" rx="2" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
        <!-- Rating label on body -->
        <rect x="-35" y="-30" width="65" height="60" rx="2" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
        <text x="-2" y="-12" text-anchor="middle" font-family="monospace" font-size="8" fill="#0284c7" font-weight="bold">SICK // DFS60</text>
        <text x="-2" y="3" text-anchor="middle" font-family="monospace" font-size="7" fill="#475569">HTL / 10-30V</text>
        <text x="-2" y="16" text-anchor="middle" font-family="monospace" font-size="7" fill="#15803d">1024 PULSOS</text>
      </g>
    `
  },

  'manometro.svg': {
    title: 'MANÔMETRO INDUSTRIAL DE PRESSÃO',
    standard: 'EN 837-1 / 0-10 BAR',
    graphic: `
      <g transform="translate(200, 125)">
        <!-- Stainless steel outer casing -->
        <circle cx="0" cy="0" r="65" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="3" />
        <circle cx="0" cy="0" r="56" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" />
        <!-- Dial dial markings -->
        ${[-135, -90, -45, 0, 45, 90, 135].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const x1 = Math.cos(rad) * 44;
          const y1 = Math.sin(rad) * 44;
          const x2 = Math.cos(rad) * 52;
          const y2 = Math.sin(rad) * 52;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#0f172a" stroke-width="2" />`;
        }).join('')}
        <!-- Red indicator zone -->
        <path d="M 31,31 A 44,44 0 0,1 0,44" fill="none" stroke="#ef4444" stroke-width="4" />
        <!-- Indicator needle pointing to 6 bar -->
        <polygon points="0,0 -3,-5 0,-42 3,-5" fill="#ef4444" stroke="#991b1b" stroke-width="1" />
        <circle cx="0" cy="0" r="6" fill="#0f172a" />
        <!-- Units text -->
        <text x="0" y="24" text-anchor="middle" font-family="monospace" font-size="9" fill="#0284c7" font-weight="bold">BAR / PSI</text>
        <!-- Brass stem bottom -->
        <rect x="-10" y="65" width="20" height="35" fill="url(#brass)" stroke="#713f12" stroke-width="2" />
        <rect x="-14" y="75" width="28" height="15" fill="url(#brass)" stroke="#713f12" stroke-width="1.5" />
      </g>
    `
  },

  'cabo-industrial.svg': {
    title: 'CABO INDUSTRIAL & CONECTOR',
    standard: 'HARTING / ÖLFLEX',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Industrial heavy duty connector hood (Harting Han) -->
        <rect x="-105" y="-35" width="70" height="70" rx="4" fill="#64748b" stroke="#1e293b" stroke-width="2.5" />
        <!-- Locking lever -->
        <path d="M -95,-42 L -45,-42 L -40,-35" fill="none" stroke="#0284c7" stroke-width="4" stroke-linecap="round" />
        <!-- Pin insert block -->
        <rect x="-115" y="-22" width="10" height="44" rx="2" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
        <!-- Cable gland -->
        <rect x="-35" y="-18" width="25" height="36" rx="2" fill="#334155" stroke="#0f172a" stroke-width="2" />
        <!-- Stripped industrial cable -->
        <rect x="-10" y="-12" width="60" height="24" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
        <!-- Braided shield wire mesh -->
        <rect x="50" y="-9" width="25" height="18" fill="#94a3b8" stroke="#475569" stroke-width="1" stroke-dasharray="2 2" />
        <!-- Colored internal wire conductors -->
        <line x1="75" y1="-7" x2="115" y2="-16" stroke="#991b1b" stroke-width="4" stroke-linecap="round" />
        <line x1="75" y1="-2" x2="118" y2="-6" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round" />
        <line x1="75" y1="3" x2="118" y2="6" stroke="#047857" stroke-width="4" stroke-linecap="round" />
        <line x1="75" y1="8" x2="115" y2="16" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      </g>
    `
  },

  'filtro-industrial.svg': {
    title: 'FILTRO & LUBRIFICADOR FRL',
    standard: 'SMC AC40 / HYDAC',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Center manifold body -->
        <rect x="-40" y="-55" width="80" height="45" rx="3" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <!-- Adjustment knob top -->
        <rect x="-18" y="-75" width="36" height="20" rx="3" fill="#0f172a" stroke="#334155" stroke-width="2" />
        <!-- Mini pressure gauge front -->
        <circle cx="0" cy="-32" r="16" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />
        <line x1="0" y1="-32" x2="8" y2="-40" stroke="#ef4444" stroke-width="1.5" />
        <!-- Transparent filter bowl with metal guard -->
        <rect x="-35" y="-10" width="70" height="85" rx="6" fill="#38bdf8" fill-opacity="0.25" stroke="#334155" stroke-width="2.5" />
        <!-- Internal filter sintered element -->
        <rect x="-22" y="5" width="44" height="48" rx="2" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3 2" />
        <!-- Metal bowl guard ribs -->
        <line x1="-15" y1="-10" x2="-15" y2="75" stroke="#475569" stroke-width="3" />
        <line x1="15" y1="-10" x2="15" y2="75" stroke="#475569" stroke-width="3" />
        <!-- Drain valve bottom -->
        <rect x="-10" y="75" width="20" height="15" rx="2" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
      </g>
    `
  },

  'abracadeira.svg': {
    title: 'ABRAÇADEIRA INOX ROSCA SEM FIM',
    standard: 'DIN 3017 / TIPO WORM',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Circular steel band -->
        <circle cx="0" cy="0" r="65" fill="none" stroke="url(#metal-grad)" stroke-width="20" />
        <circle cx="0" cy="0" r="65" fill="none" stroke="#1e293b" stroke-width="1.5" />
        <!-- Perforations on the band -->
        ${[-90, -60, -30, 0, 30, 60, 90, 120, 150, 180, 210].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return `<line x1="${Math.cos(rad) * 60}" y1="${Math.sin(rad) * 60}" x2="${Math.cos(rad) * 70}" y2="${Math.sin(rad) * 70}" stroke="#0f172a" stroke-width="3" />`;
        }).join('')}
        <!-- Tightening housing box top -->
        <rect x="-28" y="-85" width="56" height="34" rx="3" fill="#334155" stroke="#0f172a" stroke-width="2.5" />
        <!-- Hex head worm screw -->
        <rect x="28" y="-76" width="16" height="18" rx="2" fill="url(#brass)" stroke="#713f12" stroke-width="1.5" />
        <line x1="36" y1="-76" x2="36" y2="-58" stroke="#713f12" stroke-width="2" />
        <text x="0" y="5" text-anchor="middle" font-family="monospace" font-size="10" fill="#0284c7" font-weight="bold">INOX 304</text>
      </g>
    `
  },

  'adesivo-loctite.svg': {
    title: 'ADESIVO INDUSTRIAL / TRAVA ROSCA',
    standard: 'LOCTITE / WÜRTH W742',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Bottle body (Red Loctite bottle) -->
        <rect x="-42" y="-45" width="84" height="110" rx="8" fill="#ef4444" stroke="#991b1b" stroke-width="2.5" />
        <!-- Shoulder taper -->
        <polygon points="-42,-45 -22,-65 22,-65 42,-45" fill="#ef4444" stroke="#991b1b" stroke-width="2.5" />
        <!-- White nozzle & cap -->
        <rect x="-14" y="-78" width="28" height="14" rx="2" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
        <polygon points="-7,-78 -2,-98 2,-98 7,-78" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <!-- Bottle label with spec -->
        <rect x="-34" y="-30" width="68" height="75" rx="3" fill="#ffffff" stroke="#fecaca" stroke-width="1" />
        <text x="0" y="-12" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#b91c1c" font-weight="black">LOCTITE</text>
        <rect x="-26" y="-3" width="52" height="22" rx="2" fill="#0284c7" />
        <text x="0" y="12" text-anchor="middle" font-family="monospace" font-size="12" fill="#ffffff" font-weight="bold">242 / 271</text>
        <text x="0" y="32" text-anchor="middle" font-family="monospace" font-size="7" fill="#64748b">TORQUE MÉDIO</text>
      </g>
    `
  },

  'gas-refrigerante.svg': {
    title: 'CILINDRO DE GÁS REFRIGERANTE',
    standard: 'R-134a / R-404A / R-22',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Cylinder pressure tank -->
        <rect x="-55" y="-45" width="110" height="95" rx="10" fill="#38bdf8" stroke="#0284c7" stroke-width="2.5" />
        <!-- Domed top -->
        <path d="M -55,-45 Q 0,-70 55,-45 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2.5" />
        <!-- Foot ring base -->
        <rect x="-48" y="50" width="96" height="16" rx="3" fill="#0369a1" />
        <!-- Carrying handle collar top -->
        <rect x="-35" y="-76" width="70" height="16" rx="4" fill="none" stroke="#0369a1" stroke-width="4" />
        <!-- Center brass valve & port -->
        <rect x="-10" y="-88" width="20" height="18" rx="2" fill="url(#brass)" stroke="#713f12" stroke-width="2" />
        <circle cx="0" cy="-80" r="3" fill="#0f172a" />
        <!-- Content Diamond / Label -->
        <polygon points="0,-22 28,0 0,22 -28,0" fill="#22c55e" stroke="#15803d" stroke-width="2" />
        <text x="0" y="4" text-anchor="middle" font-family="monospace" font-size="9" fill="#ffffff" font-weight="bold">R-134a</text>
      </g>
    `
  },

  'lampada-reator.svg': {
    title: 'ILUMINAÇÃO & REATOR ELETRÔNICO',
    standard: 'PHILIPS / OSRAM TLD',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Fluorescent / LED tube -->
        <rect x="-115" y="-42" width="230" height="24" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
        <!-- End caps with bi-pin terminals -->
        <rect x="-120" y="-40" width="10" height="20" rx="1" fill="url(#brass)" stroke="#713f12" stroke-width="1.5" />
        <line x1="-125" y1="-35" x2="-120" y2="-35" stroke="#713f12" stroke-width="2.5" />
        <line x1="-125" y1="-25" x2="-120" y2="-25" stroke="#713f12" stroke-width="2.5" />
        <rect x="110" y="-40" width="10" height="20" rx="1" fill="url(#brass)" stroke="#713f12" stroke-width="1.5" />
        <line x1="120" y1="-35" x2="125" y2="-35" stroke="#713f12" stroke-width="2.5" />
        <line x1="120" y1="-25" x2="125" y2="-25" stroke="#713f12" stroke-width="2.5" />
        <!-- Glow highlight -->
        <line x1="-95" y1="-30" x2="95" y2="-30" stroke="#38bdf8" stroke-width="2" opacity="0.8" />
        
        <!-- Electronic Ballast Unit below -->
        <rect x="-85" y="10" width="170" height="42" rx="3" fill="#334155" stroke="#0f172a" stroke-width="2" />
        <rect x="-80" y="15" width="160" height="32" fill="#f8fafc" />
        <text x="0" y="32" text-anchor="middle" font-family="monospace" font-size="9" fill="#0f172a" font-weight="bold">REATOR HF 2x36W / 220V</text>
      </g>
    `
  },

  'inversor.svg': {
    title: 'INVERSOR DE FREQUÊNCIA VFD',
    standard: 'SIEMENS / WEG CFW',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- VFD enclosure housing -->
        <rect x="-65" y="-62" width="130" height="124" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2.5" />
        <!-- Keypad / HMI display unit -->
        <rect x="-42" y="-48" width="84" height="42" rx="3" fill="#0f172a" stroke="#475569" stroke-width="1.5" />
        <!-- 7-segment display -->
        <text x="0" y="-22" text-anchor="middle" font-family="monospace" font-size="16" fill="#22c55e" font-weight="black">50.0 Hz</text>
        <!-- Buttons: RUN (green), STOP (red), Up, Down -->
        <circle cx="-25" cy="12" r="8" fill="#22c55e" stroke="#15803d" stroke-width="1.5" />
        <circle cx="25" cy="12" r="8" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" />
        <polygon points="0,2 7,12 -7,12" fill="#38bdf8" />
        <polygon points="0,22 7,14 -7,14" fill="#38bdf8" />
        <!-- Ventilation grating bottom -->
        ${[-40, -25, -10, 5, 20, 35].map(x => `
          <rect x="${x}" y="32" width="8" height="18" rx="1" fill="#0f172a" />
        `).join('')}
      </g>
    `
  },

  'peca-mecanica-geral.svg': {
    title: 'COMPONENTE / SOBRESSALENTE',
    standard: 'CATÁLOGO MANUTAMAKI',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Machined precision block with chamfers -->
        <polygon points="-80,-45 45,-45 80,-15 80,45 -45,45 -80,15" fill="url(#metal-grad)" stroke="#1e293b" stroke-width="2.5" />
        <!-- 3D isometric lines -->
        <line x1="-80" y1="15" x2="45" y2="15" stroke="#334155" stroke-width="2" />
        <line x1="45" y1="-45" x2="45" y2="15" stroke="#334155" stroke-width="2" />
        <line x1="45" y1="15" x2="80" y2="45" stroke="#334155" stroke-width="2" />
        <!-- Machined counterbore hole -->
        <circle cx="-15" cy="-15" r="16" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />
        <circle cx="-15" cy="-15" r="9" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
        <!-- Center reference markings -->
        <line x1="-15" y1="-35" x2="-15" y2="5" stroke="#0284c7" stroke-width="1" stroke-dasharray="4 2" />
        <line x1="-35" y1="-15" x2="5" y2="-15" stroke="#0284c7" stroke-width="1" stroke-dasharray="4 2" />
        <text x="25" y="32" font-family="monospace" font-size="9" fill="#475569" font-weight="bold">PEÇA CAD</text>
      </g>
    `
  },

  'faca-circular.svg': {
    title: 'FACA / CONTRA-FACA CIRCULAR',
    standard: 'BILSTEIN / KAMPF SLITTER',
    graphic: `
      <g transform="translate(200, 138)">
        <!-- Outer sharp knife bevel edge -->
        <circle cx="0" cy="0" r="76" fill="url(#steel-light)" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="0" cy="0" r="71" fill="url(#metal-grad)" stroke="#334155" stroke-width="1.5" />
        
        <!-- Ground face ring with circular reflection -->
        <circle cx="0" cy="0" r="54" fill="#f8fafc" stroke="#64748b" stroke-width="1" />
        <circle cx="0" cy="0" r="46" fill="url(#dark-steel)" stroke="#0f172a" stroke-width="2" />
        
        <!-- Center bore with precision keyway -->
        <circle cx="0" cy="0" r="26" fill="#f8fafc" stroke="#0f172a" stroke-width="2" />
        <!-- Drive keyway slot -->
        <rect x="-5" y="-32" width="10" height="12" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5" />
        
        <!-- Radial grind marks / balance markings -->
        ${[0, 60, 120, 180, 240, 300].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return `<line x1="${Math.round(Math.cos(rad) * 32)}" y1="${Math.round(Math.sin(rad) * 32)}" x2="${Math.round(Math.cos(rad) * 44)}" y2="${Math.round(Math.sin(rad) * 44)}" stroke="#94a3b8" stroke-width="1.5" />`;
        }).join('')}
        
        <!-- Center reference and label -->
        <line x1="-85" y1="0" x2="85" y2="0" stroke="#0284c7" stroke-width="1" stroke-dasharray="6 3 2 3" opacity="0.6" />
        <line x1="0" y1="-85" x2="0" y2="85" stroke="#0284c7" stroke-width="1" stroke-dasharray="6 3 2 3" opacity="0.6" />
        <text x="0" y="4" text-anchor="middle" font-family="monospace" font-size="8" fill="#38bdf8" font-weight="bold">BILSTEIN</text>
      </g>
    `
  }
};

let count = 0;
for (const [filename, info] of Object.entries(SVGS)) {
  const filePath = path.join(targetDir, filename);
  const content = wrapSvg(info.title, info.standard, info.graphic);
  fs.writeFileSync(filePath, content, 'utf8');
  count++;
}

console.log(`Successfully generated ${count} high-precision technical CAD SVGs into ${targetDir}`);
