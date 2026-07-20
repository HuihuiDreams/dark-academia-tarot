import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CARDS_DIR = path.join(__dirname, '..', 'src', 'assets', 'cards');
const PUBLIC_CARDS_DIR = path.join(__dirname, '..', 'public', 'assets', 'cards');

// Ensure output directories exist across macOS and Windows
if (!fs.existsSync(CARDS_DIR)) {
  fs.mkdirSync(CARDS_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_CARDS_DIR)) {
  fs.mkdirSync(PUBLIC_CARDS_DIR, { recursive: true });
}

console.log(`[Art Generator] Output directory: ${CARDS_DIR} and ${PUBLIC_CARDS_DIR}`);

/**
 * Dark Academia Tarot Art Generator
 * Generates high-fidelity, intricate Dark Academia SVG Tarot Cards (22 Major Arcana + Card Back)
 * Features: Antique parchment textures, gold foil embossing (`#c5a059`), sacred geometry,
 * mystical constellations, alchemical symbols, and classical serif typography.
 */

const MAJOR_ARCANA_DEFINITIONS = [
  { id: '0_fool', name: 'The Fool', roman: '0', symbol: '☿', archetype: 'Beginnings, Leap of Faith, Spontaneity', icon: '🌌' },
  { id: '1_magician', name: 'The Magician', roman: 'I', symbol: '🜂', archetype: 'Willpower, Creation, Manifestation', icon: '⚡' },
  { id: '2_high_priestess', name: 'The High Priestess', roman: 'II', symbol: '☾', archetype: 'Intuition, Unconscious, Secret Knowledge', icon: '📜' },
  { id: '3_empress', name: 'The Empress', roman: 'III', symbol: '♀', archetype: 'Abundance, Nature, Nurturing Flow', icon: '👑' },
  { id: '4_emperor', name: 'The Emperor', roman: 'IV', symbol: '♂', archetype: 'Structure, Authority, Rational Order', icon: '🏛️' },
  { id: '5_hierophant', name: 'The Hierophant', roman: 'V', symbol: '♉', archetype: 'Tradition, Philosophy, Institutional Wisdom', icon: '🗝️' },
  { id: '6_lovers', name: 'The Lovers', roman: 'VI', symbol: '♊', archetype: 'Alignment, Duality, Moral Choices', icon: '⚖️' },
  { id: '7_chariot', name: 'The Chariot', roman: 'VII', symbol: '♋', archetype: 'Direction, Control, Will over Obstacles', icon: '🛡️' },
  { id: '8_strength', name: 'Strength', roman: 'VIII', symbol: '♌', archetype: 'Inner Courage, Patience, Compassionate Resilience', icon: '🦁' },
  { id: '9_hermit', name: 'The Hermit', roman: 'IX', symbol: '♍', archetype: 'Solitude, Introspection, Inner Lantern', icon: '🏮' },
  { id: '10_wheel_of_fortune', name: 'Wheel of Fortune', roman: 'X', symbol: '🜃', archetype: 'Cycles, Karma, Inevitable Change', icon: '☸️' },
  { id: '11_justice', name: 'Justice', roman: 'XI', symbol: '♎', archetype: 'Truth, Cause and Effect, Clarity', icon: '⚔️' },
  { id: '12_hanged_man', name: 'The Hanged Man', roman: 'XII', symbol: '🜄', archetype: 'Surrender, New Perspective, Pause', icon: '🙃' },
  { id: '13_death', name: 'Death', roman: 'XIII', symbol: '♏', archetype: 'Transformation, Endings, Profound Rebirth', icon: '💀' },
  { id: '14_temperance', name: 'Temperance', roman: 'XIV', symbol: '♐', archetype: 'Alchemy, Balance, Synthesis of Opposites', icon: '🍷' },
  { id: '15_devil', name: 'The Devil', roman: 'XV', symbol: '♑', archetype: 'Shadow Self, Attachment, Material Bondage', icon: '⛓️' },
  { id: '16_tower', name: 'The Tower', roman: 'XVI', symbol: '♂', archetype: 'Sudden Awakening, Collapse of Illusions, Breakthrough', icon: '⚡' },
  { id: '17_star', name: 'The Star', roman: 'XVII', symbol: '♒', archetype: 'Hope, Inspiration, Serenity after Storm', icon: '⭐' },
  { id: '18_moon', name: 'The Moon', roman: 'XVIII', symbol: '♓', archetype: 'Illusion, Dreams, Subconscious Depths', icon: '🌙' },
  { id: '19_sun', name: 'The Sun', roman: 'XIX', symbol: '☉', archetype: 'Vitality, Joy, Radiant Enlightenment', icon: '☀️' },
  { id: '20_judgement', name: 'Judgement', roman: 'XX', symbol: '♇', archetype: 'Reckoning, Calling, Absolution', icon: '📯' },
  { id: '21_world', name: 'The World', roman: 'XXI', symbol: '♄', archetype: 'Completion, Wholeness, Cosmic Harmony', icon: '🌍' }
];

// Generate intricate Card Back SVG
function generateCardBackSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 600" width="360" height="600">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#1f212b" />
      <stop offset="70%" stop-color="#121318" />
      <stop offset="100%" stop-color="#0b0c0f" />
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5e0a3" />
      <stop offset="35%" stop-color="#c5a059" />
      <stop offset="70%" stop-color="#dfc282" />
      <stop offset="100%" stop-color="#8c6a2c" />
    </linearGradient>
    <pattern id="parchmentTexture" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0 20 Q10 15, 20 20 T40 20 M20 0 Q15 10, 20 20 T20 40" fill="none" stroke="#252836" stroke-width="0.6" opacity="0.4"/>
    </pattern>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="360" height="600" rx="18" fill="url(#bgGrad)" />
  <rect width="360" height="600" rx="18" fill="url(#parchmentTexture)" />

  <!-- Outer Double Border -->
  <rect x="12" y="12" width="336" height="576" rx="12" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.85" />
  <rect x="18" y="18" width="324" height="564" rx="10" fill="none" stroke="url(#gold)" stroke-width="0.8" opacity="0.6" />
  <rect x="26" y="26" width="308" height="548" rx="6" fill="none" stroke="#6e262c" stroke-width="1.2" opacity="0.7" />

  <!-- Corner Ornamental Runes -->
  <g stroke="url(#gold)" fill="none" stroke-width="1.2">
    <!-- Top-Left -->
    <path d="M26 48 L48 26 M26 38 L38 26 M34 34 circle 2" />
    <!-- Top-Right -->
    <path d="M334 48 L312 26 M334 38 L322 26" />
    <!-- Bottom-Left -->
    <path d="M26 552 L48 574 M26 562 L38 574" />
    <!-- Bottom-Right -->
    <path d="M334 552 L312 574 M334 562 L322 574" />
  </g>

  <!-- Central Occult Sacred Geometry -->
  <g transform="translate(180, 300)" filter="url(#goldGlow)">
    <!-- Outer Rings -->
    <circle r="120" fill="none" stroke="url(#gold)" stroke-width="1.2" stroke-dasharray="6,4" opacity="0.6" />
    <circle r="105" fill="none" stroke="url(#gold)" stroke-width="1.8" />
    <circle r="98" fill="none" stroke="#6e262c" stroke-width="1.5" opacity="0.8" />
    
    <!-- Astrological Star & Geometric Intersections -->
    <polygon points="0,-90 77,45 -77,45" fill="none" stroke="url(#gold)" stroke-width="1.4" opacity="0.8" />
    <polygon points="0,90 77,-45 -77,-45" fill="none" stroke="url(#gold)" stroke-width="1.4" opacity="0.8" />
    <circle r="52" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.9" />
    <rect x="-37" y="-37" width="74" height="74" fill="none" stroke="url(#gold)" stroke-width="1.2" transform="rotate(45)" opacity="0.7" />

    <!-- Center Eye of Providence / Ouroboros -->
    <circle r="22" fill="#181a24" stroke="url(#gold)" stroke-width="2" />
    <path d="M-14,0 Q0,-12 14,0 Q0,12 -14,0 Z" fill="none" stroke="url(#gold)" stroke-width="1.5" />
    <circle r="5" fill="url(#gold)" />
    <circle r="2" fill="#121318" />

    <!-- Cardinal Rays -->
    <line x1="0" y1="-105" x2="0" y2="-130" stroke="url(#gold)" stroke-width="2" />
    <line x1="0" y1="105" x2="0" y2="130" stroke="url(#gold)" stroke-width="2" />
    <line x1="-105" y1="0" x2="-130" y2="0" stroke="url(#gold)" stroke-width="2" />
    <line x1="105" y1="0" x2="130" y2="0" stroke="url(#gold)" stroke-width="2" />
  </g>

  <!-- Mystical Latin Inscription Header & Footer -->
  <text x="180" y="70" text-anchor="middle" font-family="'Cormorant Garamond', 'Playfair Display', serif" font-size="13" font-style="italic" fill="url(#gold)" letter-spacing="4">IGNIS • AER • AQUA • TERRA</text>
  <text x="180" y="542" text-anchor="middle" font-family="'Cormorant Garamond', 'Playfair Display', serif" font-size="12" font-style="italic" fill="url(#gold)" letter-spacing="3">VERITAS IN TENEBRIS</text>
</svg>`;
}

function getCardGeometry(index, goldUrl) {
  const cRed = '#6e262c';
  switch (index) {
    case 0: // Fool
      return `<circle r="80" fill="none" stroke="${goldUrl}" stroke-dasharray="2,6" stroke-width="2"/>
              <circle r="50" fill="none" stroke="${goldUrl}" stroke-dasharray="1,4" stroke-width="2"/>
              <circle cx="-30" cy="-30" r="15" fill="none" stroke="${cRed}" stroke-width="1.5"/>`;
    case 1: // Magician
      return `<path d="M-40,0 C-40,-30 0,-30 0,0 C0,30 40,30 40,0 C40,-30 0,-30 0,0 C0,30 -40,30 -40,0 Z" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <circle cx="0" cy="-60" r="10" fill="none" stroke="${cRed}"/>
              <circle cx="0" cy="60" r="10" fill="none" stroke="${cRed}"/>
              <circle cx="-60" cy="0" r="10" fill="none" stroke="${cRed}"/>
              <circle cx="60" cy="0" r="10" fill="none" stroke="${cRed}"/>`;
    case 2: // High Priestess
      return `<rect x="-60" y="-70" width="20" height="140" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <rect x="40" y="-70" width="20" height="140" fill="none" stroke="${cRed}" stroke-width="2"/>
              <path d="M0,-20 A20,20 0 1,0 0,20 A15,15 0 1,1 0,-20 Z" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>`;
    case 3: // Empress
      return `<circle r="50" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <path d="M0,50 L0,80 M-15,65 L15,65" stroke="${goldUrl}" stroke-width="2"/>
              <circle r="65" fill="none" stroke="${cRed}" stroke-dasharray="4,8" stroke-width="1.5"/>`;
    case 4: // Emperor
      return `<rect x="-45" y="-45" width="90" height="90" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <polygon points="0,-70 70,0 0,70 -70,0" fill="none" stroke="${cRed}" stroke-width="1.5"/>
              <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="${goldUrl}" stroke-width="1"/>`;
    case 5: // Hierophant
      return `<circle cx="0" cy="-30" r="40" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>
              <circle cx="-25" cy="15" r="40" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>
              <circle cx="25" cy="15" r="40" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>`;
    case 6: // Lovers
      return `<polygon points="0,-60 52,30 -52,30" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <polygon points="0,60 52,-30 -52,-30" fill="none" stroke="${cRed}" stroke-width="2"/>
              <circle cx="-20" cy="0" r="30" fill="none" stroke="${goldUrl}" stroke-width="1" opacity="0.6"/>
              <circle cx="20" cy="0" r="30" fill="none" stroke="${goldUrl}" stroke-width="1" opacity="0.6"/>`;
    case 7: // Chariot
      return `<rect x="-50" y="-30" width="100" height="60" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <circle cx="-30" cy="30" r="20" fill="none" stroke="${cRed}" stroke-width="1.5"/>
              <circle cx="30" cy="30" r="20" fill="none" stroke="${cRed}" stroke-width="1.5"/>
              <polygon points="0,-60 20,-30 -20,-30" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>`;
    case 8: // Strength
      return `<path d="M-30,-50 C-30,-70 0,-70 0,-50 C0,-30 30,-30 30,-50 C30,-70 0,-70 0,-50 C0,-30 -30,-30 -30,-50 Z" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>
              <circle r="50" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <path d="M-60,0 L60,0 M0,-60 L0,60 M-42,-42 L42,42 M-42,42 L42,-42" stroke="${cRed}" stroke-width="1.5"/>`;
    case 9: // Hermit
      return `<polygon points="0,-70 40,-30 30,60 -30,60 -40,-30" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <polygon points="0,-10 15,15 -15,15" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>
              <polygon points="0,25 15,0 -15,0" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>`;
    case 10: // Wheel of Fortune
      return `<circle r="60" fill="none" stroke="${goldUrl}" stroke-width="3"/>
              <circle r="45" fill="none" stroke="${goldUrl}" stroke-width="1"/>
              <path d="M-60,0 L60,0 M0,-60 L0,60 M-42,-42 L42,42 M-42,42 L42,-42" stroke="${cRed}" stroke-width="2"/>
              <circle r="15" fill="none" stroke="${goldUrl}" stroke-width="2"/>`;
    case 11: // Justice
      return `<line x1="-50" y1="-20" x2="50" y2="-20" stroke="${goldUrl}" stroke-width="2"/>
              <polygon points="-50,-20 -70,20 -30,20" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>
              <polygon points="50,-20 30,20 70,20" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>
              <line x1="0" y1="-40" x2="0" y2="40" stroke="${cRed}" stroke-width="2"/>
              <polygon points="0,40 10,60 -10,60" fill="none" stroke="${goldUrl}" stroke-width="1"/>`;
    case 12: // Hanged Man
      return `<line x1="-40" y1="-50" x2="40" y2="-50" stroke="${goldUrl}" stroke-width="3"/>
              <line x1="0" y1="-50" x2="0" y2="60" stroke="${goldUrl}" stroke-width="3"/>
              <polygon points="0,20 30,-20 -30,-20" fill="none" stroke="${cRed}" stroke-width="2"/>`;
    case 13: // Death
      return `<path d="M30,-50 C30,-50 -20,-60 -40,-20 C-60,20 -10,60 50,60 C40,40 20,40 -20,20 C-30,0 -10,-40 30,-50 Z" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <circle cx="-20" cy="-10" r="10" fill="none" stroke="${cRed}" stroke-width="1.5"/>`;
    case 14: // Temperance
      return `<rect x="-40" y="-40" width="80" height="80" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <polygon points="0,-40 40,40 -40,40" fill="none" stroke="${cRed}" stroke-width="2"/>
              <circle r="40" fill="none" stroke="${goldUrl}" stroke-width="1" opacity="0.5"/>`;
    case 15: // Devil
      return `<circle r="60" fill="none" stroke="${goldUrl}" stroke-width="3"/>
              <polygon points="0,60 35,-48 -57,18 57,18 -35,-48" fill="none" stroke="${cRed}" stroke-width="2"/>`;
    case 16: // Tower
      return `<rect x="-30" y="-50" width="60" height="100" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <path d="M10,-80 L-20,-10 L0,10 L-10,70" fill="none" stroke="${cRed}" stroke-width="2"/>
              <circle cx="-40" cy="-40" r="5" fill="${goldUrl}"/>
              <circle cx="40" cy="20" r="5" fill="${goldUrl}"/>`;
    case 17: // Star
      return `<polygon points="0,-60 15,-15 60,0 15,15 0,60 -15,15 -60,0 -15,-15" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <polygon points="0,-30 7,-7 30,0 7,7 0,30 -7,7 -30,0 -7,-7" fill="none" stroke="${cRed}" stroke-width="1.5"/>`;
    case 18: // Moon
      return `<path d="M20,-50 A50,50 0 1,0 20,50 A40,40 0 1,1 20,-50 Z" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <rect x="-50" y="10" width="15" height="40" fill="none" stroke="${cRed}" stroke-width="1.5"/>
              <rect x="35" y="10" width="15" height="40" fill="none" stroke="${cRed}" stroke-width="1.5"/>
              <path d="M-60,70 Q-30,50 0,70 T60,70" fill="none" stroke="${goldUrl}" stroke-width="1.5"/>`;
    case 19: // Sun
      return `<circle r="40" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <path d="M0,-40 L0,-70 M40,0 L70,0 M0,40 L0,70 M-40,0 L-70,0" stroke="${goldUrl}" stroke-width="2"/>
              <path d="M28,-28 L50,-50 M28,28 L50,50 M-28,28 L-50,50 M-28,-28 L-50,-50" stroke="${cRed}" stroke-width="2"/>
              <circle cx="0" cy="0" r="30" fill="none" stroke="${goldUrl}" stroke-dasharray="2,4"/>`;
    case 20: // Judgement
      return `<rect x="-50" y="-30" width="100" height="60" fill="none" stroke="${goldUrl}" stroke-width="2"/>
              <line x1="-50" y1="0" x2="50" y2="0" stroke="${goldUrl}" stroke-width="2"/>
              <line x1="0" y1="-30" x2="0" y2="30" stroke="${goldUrl}" stroke-width="2"/>
              <path d="M-30,-60 Q0,-40 30,-60" fill="none" stroke="${cRed}" stroke-width="2"/>`;
    case 21: // World
      return `<ellipse cx="0" cy="0" rx="45" ry="65" fill="none" stroke="${goldUrl}" stroke-width="2" stroke-dasharray="8,4"/>
              <circle cx="-50" cy="-70" r="12" fill="none" stroke="${cRed}" stroke-width="1.5"/>
              <circle cx="50" cy="-70" r="12" fill="none" stroke="${cRed}" stroke-width="1.5"/>
              <circle cx="-50" cy="70" r="12" fill="none" stroke="${cRed}" stroke-width="1.5"/>
              <circle cx="50" cy="70" r="12" fill="none" stroke="${cRed}" stroke-width="1.5"/>`;
    default:
      return `<polygon points="0,-60 52,30 -52,30" fill="none" stroke="${goldUrl}" stroke-width="1.5" />
              <polygon points="0,60 52,-30 -52,-30" fill="none" stroke="${cRed}" stroke-width="1.5" />`;
  }
}

// Generate Major Arcana Card SVG
function generateArcanaSvg(card) {
  // Generate distinct geometry / accents based on card symbol & roman
  const hash = card.id.split('_')[0];
  const index = parseInt(hash || '0', 10);
  const isOdd = index % 2 !== 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 600" width="360" height="600">
  <defs>
    <radialGradient id="cardBg_${card.id}" cx="50%" cy="45%" r="80%">
      <stop offset="0%" stop-color="#2a2c3a" />
      <stop offset="60%" stop-color="#181a22" />
      <stop offset="100%" stop-color="#0f1015" />
    </radialGradient>
    <linearGradient id="gold_${card.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5e0a3" />
      <stop offset="40%" stop-color="#c5a059" />
      <stop offset="80%" stop-color="#dfc282" />
      <stop offset="100%" stop-color="#8c6a2c" />
    </linearGradient>
    <pattern id="parch_${card.id}" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="0.5" fill="#c5a059" opacity="0.25"/>
    </pattern>
    <filter id="glow_${card.id}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Card Background -->
  <rect width="360" height="600" rx="18" fill="url(#cardBg_${card.id})" />
  <rect width="360" height="600" rx="18" fill="url(#parch_${card.id})" />

  <!-- Classical Gold Frame -->
  <rect x="14" y="14" width="332" height="572" rx="12" fill="none" stroke="url(#gold_${card.id})" stroke-width="2" opacity="0.9" />
  <rect x="22" y="22" width="316" height="556" rx="8" fill="none" stroke="url(#gold_${card.id})" stroke-width="0.8" opacity="0.5" />
  <rect x="30" y="30" width="300" height="540" rx="4" fill="none" stroke="#6e262c" stroke-width="1" opacity="0.65" />

  <!-- Top Roman Numeral Header -->
  <g transform="translate(180, 68)">
    <line x1="-120" y1="0" x2="-45" y2="0" stroke="url(#gold_${card.id})" stroke-width="1" opacity="0.6"/>
    <text x="0" y="5" text-anchor="middle" font-family="'Playfair Display', 'Cormorant Garamond', serif" font-size="22" font-weight="700" fill="url(#gold_${card.id})" letter-spacing="3">${card.roman}</text>
    <line x1="45" y1="0" x2="120" y2="0" stroke="url(#gold_${card.id})" stroke-width="1" opacity="0.6"/>
  </g>

  <!-- Central Artwork & Sacred Emblem -->
  <g transform="translate(180, 275)">
    <!-- Aura & Halo -->
    <circle r="115" fill="#14151c" stroke="url(#gold_${card.id})" stroke-width="1" opacity="0.7" />
    <circle r="95" fill="none" stroke="url(#gold_${card.id})" stroke-width="1.5" stroke-dasharray="${isOdd ? '4,4' : '8,4'}" />
    <circle r="75" fill="none" stroke="#6e262c" stroke-width="1.2" opacity="0.8" />
    
    <!-- Geometric Occult Structure -->
    ${getCardGeometry(index, 'url(#gold_' + card.id + ')')}

    <!-- Central Alchemical & Archetypal Emblem -->
    <circle r="42" fill="#1c1e28" stroke="url(#gold_${card.id})" stroke-width="2" filter="url(#glow_${card.id})" />
    <text x="0" y="16" text-anchor="middle" font-size="44" fill="url(#gold_${card.id})" filter="url(#glow_${card.id})">${card.symbol}</text>
  </g>

  <!-- Archetype & Keyword Banner -->
  <g transform="translate(180, 455)">
    <rect x="-135" y="-18" width="270" height="36" rx="4" fill="#14151c" stroke="url(#gold_${card.id})" stroke-width="1" opacity="0.9" />
    <text x="0" y="5" text-anchor="middle" font-family="'Cormorant Garamond', 'Noto Serif SC', serif" font-size="12.5" font-style="italic" fill="#e6d5ac" letter-spacing="1.5">${card.archetype.split(',')[0].toUpperCase()}</text>
  </g>

  <!-- Card Title Footer -->
  <text x="180" y="515" text-anchor="middle" font-family="'Playfair Display', 'Cormorant Garamond', serif" font-size="24" font-weight="700" fill="url(#gold_${card.id})" letter-spacing="2">${card.name.toUpperCase()}</text>
  <line x1="80" y1="535" x2="280" y2="535" stroke="url(#gold_${card.id})" stroke-width="1" opacity="0.6" />
  <text x="180" y="555" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="11" fill="#8c6a2c" letter-spacing="4">ARCANA • MAJORA</text>
</svg>`;
}

// Main generator execution
async function runGenerator() {
  console.log('[Art Generator] Generating Dark Academia Card Back...');
  const cardBackSvg = generateCardBackSvg();
  fs.writeFileSync(path.join(CARDS_DIR, 'card_back.svg'), cardBackSvg, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_CARDS_DIR, 'card_back.svg'), cardBackSvg, 'utf8');
  console.log(' -> Created: card_back.svg');

  console.log('[Art Generator] Generating 22 Major Arcana Cards...');
  for (const card of MAJOR_ARCANA_DEFINITIONS) {
    const svgContent = generateArcanaSvg(card);
    const filename = `${card.id}.svg`;
    fs.writeFileSync(path.join(CARDS_DIR, filename), svgContent, 'utf8');
    fs.writeFileSync(path.join(PUBLIC_CARDS_DIR, filename), svgContent, 'utf8');
  }
  console.log(` -> Successfully generated all 22 Major Arcana SVG artwork files in ${CARDS_DIR} and ${PUBLIC_CARDS_DIR}`);
}

runGenerator().catch(err => {
  console.error('[Art Generator Error]', err);
  process.exit(1);
});
