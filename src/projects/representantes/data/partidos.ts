import type { Partido } from '@/projects/representantes/types/parlamentario';

/**
 * Spanish political party colors for the XV Legislatura
 *
 * Colors sourced from official party branding and parliamentary conventions
 */
export const PARTIDOS: Record<string, Partido> = {
  PP: {
    id: 'pp',
    nombre: 'Partido Popular',
    nombre_corto: 'PP',
    color: '#0066CC',
    color_secundario: '#004C99',
  },
  PSOE: {
    id: 'psoe',
    nombre: 'Partido Socialista Obrero Español',
    nombre_corto: 'PSOE',
    color: '#E30613',
    color_secundario: '#B80510',
  },
  VOX: {
    id: 'vox',
    nombre: 'VOX',
    nombre_corto: 'VOX',
    color: '#63BE21',
    color_secundario: '#4FA31A',
  },
  Sumar: {
    id: 'sumar',
    nombre: 'Sumar',
    nombre_corto: 'Sumar',
    color: '#E6007E',
    color_secundario: '#B8005F',
  },
  ERC: {
    id: 'erc',
    nombre: 'Esquerra Republicana de Catalunya',
    nombre_corto: 'ERC',
    color: '#FFB232',
    color_secundario: '#E69E2D',
  },
  'Junts per Catalunya': {
    id: 'junts',
    nombre: 'Junts per Catalunya',
    nombre_corto: 'Junts',
    color: '#00C3B2',
    color_secundario: '#00A396',
  },
  PNV: {
    id: 'pnv',
    nombre: 'Partido Nacionalista Vasco',
    nombre_corto: 'PNV',
    color: '#009526',
    color_secundario: '#007A1F',
  },
  'EH Bildu': {
    id: 'bildu',
    nombre: 'EH Bildu',
    nombre_corto: 'Bildu',
    color: '#96C31E',
    color_secundario: '#7DA319',
  },
  BNG: {
    id: 'bng',
    nombre: 'Bloque Nacionalista Galego',
    nombre_corto: 'BNG',
    color: '#76B3E8',
    color_secundario: '#5FA0D9',
  },
  'Coalición Canaria': {
    id: 'cc',
    nombre: 'Coalición Canaria',
    nombre_corto: 'CC',
    color: '#FFD700',
    color_secundario: '#E6C200',
  },
  UPN: {
    id: 'upn',
    nombre: 'Unión del Pueblo Navarro',
    nombre_corto: 'UPN',
    color: '#0066B3',
    color_secundario: '#005291',
  },
  Mixto: {
    id: 'mixto',
    nombre: 'Grupo Parlamentario Mixto',
    nombre_corto: 'Mixto',
    color: '#808080',
    color_secundario: '#666666',
  },
  // ═══════════════════════════════════════════════════════════════
  // LEGISLATURE I (1979-1982) - Historical Parties
  // ═══════════════════════════════════════════════════════════════

  // UCD - Unión de Centro Democrático (governing party 1977-1982)
  UCD: {
    id: 'ucd',
    nombre: 'Unión de Centro Democrático',
    nombre_corto: 'UCD',
    color: '#2E8B57', // Sea green (centrist)
    color_secundario: '#267349',
  },
  GPUCD: {
    id: 'gpucd',
    nombre: 'Grupo Parlamentario UCD',
    nombre_corto: 'GPUCD',
    color: '#2E8B57',
    color_secundario: '#267349',
  },
  'CC-UCD': {
    id: 'cc-ucd',
    nombre: 'Coalición Canaria-UCD',
    nombre_corto: 'CC-UCD',
    color: '#3CB371', // Medium sea green
    color_secundario: '#2E8B57',
  },

  // CD - Coalición Democrática (AP + others, right-wing predecessor to PP)
  CD: {
    id: 'cd',
    nombre: 'Coalición Democrática',
    nombre_corto: 'CD',
    color: '#1E90FF', // Dodger blue (conservative)
    color_secundario: '#1A7AD9',
  },

  // Communist parties
  PCE: {
    id: 'pce',
    nombre: 'Partido Comunista de España',
    nombre_corto: 'PCE',
    color: '#8B0000', // Dark red (communist)
    color_secundario: '#6B0000',
  },
  PSUC: {
    id: 'psuc',
    nombre: 'Partit Socialista Unificat de Catalunya',
    nombre_corto: 'PSUC',
    color: '#A52A2A', // Brown-red (Catalan communist)
    color_secundario: '#8B2323',
  },
  PCPV: {
    id: 'pcpv',
    nombre: 'Partido Comunista del País Valenciano',
    nombre_corto: 'PCPV',
    color: '#CD5C5C', // Indian red (Valencian communist)
    color_secundario: '#A94A4A',
  },

  // Socialist regional federations (all red variants)
  'PSC-PSOE': {
    id: 'psc-psoe',
    nombre: 'Partit dels Socialistes de Catalunya',
    nombre_corto: 'PSC',
    color: '#DC143C', // Crimson (Catalan socialists)
    color_secundario: '#B8102F',
  },
  'PSE-PSOE': {
    id: 'pse-psoe',
    nombre: 'Partido Socialista de Euskadi',
    nombre_corto: 'PSE',
    color: '#C41E3A', // Cardinal red (Basque socialists)
    color_secundario: '#A31830',
  },
  PSA: {
    id: 'psa',
    nombre: 'Partido Socialista de Andalucía',
    nombre_corto: 'PSA',
    color: '#FF6347', // Tomato (Andalusian socialists)
    color_secundario: '#E85A3F',
  },

  // Parliamentary groups (Grupos Parlamentarios)
  GPS: {
    id: 'gps',
    nombre: 'Grupo Parlamentario Socialista',
    nombre_corto: 'GPS',
    color: '#E30613', // Same as PSOE
    color_secundario: '#B80510',
  },
  GPSA: {
    id: 'gpsa',
    nombre: 'Grupo Parlamentario Socialista Andaluz',
    nombre_corto: 'GPSA',
    color: '#FF6347',
    color_secundario: '#E85A3F',
  },
  GPSV: {
    id: 'gpsv',
    nombre: 'Grupo Parlamentario Socialista Vasco',
    nombre_corto: 'GPSV',
    color: '#C41E3A',
    color_secundario: '#A31830',
  },
  GPCDIS: {
    id: 'gpcdis',
    nombre: 'Grupo Parlamentario Centrista',
    nombre_corto: 'GPCDIS',
    color: '#2E8B57', // UCD green
    color_secundario: '#267349',
  },
  GPMX: {
    id: 'gpmx',
    nombre: 'Grupo Parlamentario Mixto',
    nombre_corto: 'GPMX',
    color: '#808080',
    color_secundario: '#666666',
  },

  // Catalan parties
  CIU: {
    id: 'ciu',
    nombre: 'Convergència i Unió',
    nombre_corto: 'CiU',
    color: '#FF8C00', // Dark orange (Catalan nationalist)
    color_secundario: '#E67A00',
  },
  UPC: {
    id: 'upc',
    nombre: "Unió del Poble Català",
    nombre_corto: 'UPC',
    color: '#FFA500', // Orange
    color_secundario: '#E69500',
  },

  // Basque parties
  EE: {
    id: 'ee',
    nombre: 'Euskadiko Ezkerra',
    nombre_corto: 'EE',
    color: '#8FBC8F', // Dark sea green (Basque left)
    color_secundario: '#78A078',
  },
  HB: {
    id: 'hb',
    nombre: 'Herri Batasuna',
    nombre_corto: 'HB',
    color: '#006400', // Dark green (Basque independence)
    color_secundario: '#004D00',
  },

  // Regional parties
  PAR: {
    id: 'par',
    nombre: 'Partido Aragonés Regionalista',
    nombre_corto: 'PAR',
    color: '#DAA520', // Goldenrod (Aragonese regionalist)
    color_secundario: '#C49419',
  },
  UN: {
    id: 'un',
    nombre: 'Unión Nacional',
    nombre_corto: 'UN',
    color: '#4169E1', // Royal blue (right-wing)
    color_secundario: '#3658C4',
  },

  // Default for unmatched parties
  Otros: {
    id: 'otros',
    nombre: 'Otros',
    nombre_corto: 'Otros',
    color: '#A0A0A0',
    color_secundario: '#888888',
  },
};

/**
 * Get party color by party name (with fallback)
 */
export function getPartidoColor(partido: string): string {
  return PARTIDOS[partido]?.color ?? PARTIDOS.Otros.color;
}

/**
 * Get full partido data by name
 */
export function getPartido(partido: string): Partido {
  return PARTIDOS[partido] ?? PARTIDOS.Otros;
}

/**
 * List all unique parties from the data
 */
export function getAllPartidos(): Partido[] {
  return Object.values(PARTIDOS).filter((p) => p.id !== 'otros');
}
