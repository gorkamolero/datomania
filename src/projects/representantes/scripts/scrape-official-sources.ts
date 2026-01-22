/**
 * Scrape official sources for parlamentarios data
 *
 * Sources:
 * - Congreso: https://www.congreso.es/es/opendata/diputados (JSON)
 * - Senado: https://www.senado.es/web/ficopendataservlet (XML)
 *
 * Run with: npx tsx src/projects/representantes/scripts/scrape-official-sources.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '..', 'data', 'parlamentarios_espana_xv.json');

// Senado individual ficha URL
const SENADO_FICHA_URL = (cod: string) =>
  `https://www.senado.es/web/ficopendataservlet?tipoFich=1&cod=${cod}&legis=15`;

interface CongresoData {
  NOMBRE: string;
  CIRCUNSCRIPCION: string;
  FORMACIONELECTORAL: string;
  FECHACONDICIONPLENA: string;
  FECHAALTA: string;
  GRUPOPARLAMENTARIO: string;
  FECHAALTAENGRUPOPARLAMENTARIO: string;
  BIOGRAFIA: string;
}

interface ParlamentarioData {
  camara: 'Congreso' | 'Senado';
  nombre_completo: string;
  partido: string;
  grupo_parlamentario: string;
  circunscripcion: string;
  estudios_raw: string;
  estudios_nivel: string;
  profesion_raw: string;
  profesion_categoria: string;
  fecha_alta: string;
  url_ficha: string;
  bio_oficial?: string;
  source: 'official' | 'researched';
}

async function fetchWithUserAgent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'application/json, text/xml, */*',
      'Accept-Encoding': 'identity',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.text();
}

async function findCongresoJsonUrl(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  const times = ['050007', '050006', '060007', '040007'];

  for (const time of times) {
    const url = `https://www.congreso.es/webpublica/opendata/diputados/DiputadosActivos__${dateStr}${time}.json`;
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });
      if (response.ok) {
        return url;
      }
    } catch {
      // Try next pattern
    }
  }

  throw new Error('Could not find Congreso JSON URL');
}

async function fetchCongresoData(): Promise<CongresoData[]> {
  console.log('Fetching Congreso data...');

  const url = await findCongresoJsonUrl();
  console.log(`Found Congreso URL: ${url}`);

  const text = await fetchWithUserAgent(url);
  return JSON.parse(text) as CongresoData[];
}

function extractCDATA(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}><!\\[CDATA\\[([^\\]]*?)\\]\\]></${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Extract id1 from Senado url_ficha
 * e.g. "...?id1=10148&legis=15" -> "10148"
 */
function extractSenadoId(urlFicha: string): string | null {
  const match = urlFicha.match(/id1=(\d+)/);
  return match ? match[1] : null;
}

/**
 * Fetch biography from Senado XML for a single senator
 */
async function fetchSenadoBio(cod: string): Promise<string | null> {
  try {
    const url = SENADO_FICHA_URL(cod);
    const xml = await fetchWithUserAgent(url);
    
    if (xml.length < 100) {
      return null;
    }
    
    const bio = extractCDATA(xml, 'biografia');
    return bio || null;
  } catch {
    return null;
  }
}

async function loadExistingData(): Promise<ParlamentarioData[]> {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function normalizeNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim();
}

async function main() {
  console.log('=== Official Sources Scraper ===\n');

  // Load existing data
  const existingData = await loadExistingData();
  console.log(`Loaded ${existingData.length} existing parlamentarios\n`);

  // Fetch Congreso data
  const congresoData = await fetchCongresoData();
  console.log(`Fetched ${congresoData.length} diputados from Congreso\n`);

  // Create lookup map
  const congresoMap = new Map<string, CongresoData>();
  for (const d of congresoData) {
    congresoMap.set(normalizeNombre(d.NOMBRE), d);
  }

  // Update existing data with official bios
  let congresoUpdatedCount = 0;
  let senadoUpdatedCount = 0;

  for (const p of existingData) {
    const key = normalizeNombre(p.nombre_completo);

    if (p.camara === 'Congreso') {
      const official = congresoMap.get(key);
      if (official && official.BIOGRAFIA) {
        p.bio_oficial = official.BIOGRAFIA;
        p.source = 'official';
        congresoUpdatedCount++;
      } else {
        p.source = p.estudios_raw || p.profesion_raw ? 'researched' : 'official';
      }
    }
  }

  console.log(`Updated ${congresoUpdatedCount} diputados with official bios\n`);

  // Fetch Senado bios from XML
  console.log('Fetching Senado bios...');
  const senadores = existingData.filter((p) => p.camara === 'Senado');
  
  for (let i = 0; i < senadores.length; i++) {
    const p = senadores[i];
    const cod = extractSenadoId(p.url_ficha);
    
    if (cod) {
      const bio = await fetchSenadoBio(cod);
      if (bio) {
        p.bio_oficial = bio;
        p.source = 'official';
        senadoUpdatedCount++;
      } else {
        p.source = p.estudios_raw || p.profesion_raw ? 'researched' : 'official';
      }
    } else {
      p.source = p.estudios_raw || p.profesion_raw ? 'researched' : 'official';
    }

    // Progress indicator
    if ((i + 1) % 50 === 0) {
      console.log(`  Processed ${i + 1}/${senadores.length} senators...`);
    }
  }

  console.log(`\nUpdated ${senadoUpdatedCount} senators with official bios\n`);

  // Save updated data
  fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2));
  console.log(`Saved updated data to ${DATA_PATH}`);
}

main().catch(console.error);
