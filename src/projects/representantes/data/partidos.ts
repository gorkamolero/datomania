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
