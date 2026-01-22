---
name: spanish-parliament-senado-api
description: |
  Spanish Senate (Senado de España) open data API for fetching senator information.
  Use when: (1) scraping Spanish parliament senator data, (2) confused by ultCredencial
  vs idweb/cod identifiers, (3) fetching individual senator XMLs returns empty responses,
  (4) building tools for Spanish political data. The list endpoint (tipoFich=10) returns
  ultCredencial which is NOT the same as cod/id1 needed for individual ficha XMLs.
author: Claude Code
version: 1.0.0
date: 2026-01-22
---

# Spanish Parliament Senado Open Data API

## Problem
The Spanish Senate (Senado) provides open data via XML endpoints, but the identifier
system is confusing and undocumented. The list endpoint returns one type of ID
(`ultCredencial`) while individual senator pages require a different ID (`idweb`/`cod`).

## Context / Trigger Conditions
- Building scrapers for Spanish parliament data
- Getting empty responses from `ficopendataservlet?tipoFich=1&cod=X`
- Confused why `ultCredencial` from list doesn't work as `cod` parameter
- Need to fetch senator biographies, education, or profession data

## Solution

### Key Endpoints

1. **Senator List (all legislatures)**
   ```
   https://www.senado.es/web/ficopendataservlet?tipoFich=10
   ```
   Returns XML with all senators since 1977. Filter by `<legislatura>15</legislatura>` for current.
   Contains: nombre, apellidos, legislatura, ultCredencial, procedencia, grupo parlamentario.
   **WARNING**: `ultCredencial` is NOT the ID needed for individual XMLs!

2. **Individual Senator Ficha**
   ```
   https://www.senado.es/web/ficopendataservlet?tipoFich=1&cod={idweb}&legis=15
   ```
   The `cod` parameter requires `idweb`, not `ultCredencial`.

### Finding the Correct ID (`idweb`)

**Option A: From existing data with url_ficha**
```typescript
// If you have url_ficha like:
// https://www.senado.es/.../fichasenador/index.html?id1=10148&legis=15
const match = url_ficha.match(/id1=(\d+)/);
const idweb = match ? match[1] : null;
```

**Option B: Brute force search**
- Legislatura 14: IDs around 16000-17000
- Legislatura 15: IDs around 10000-11000 and 18000-20000
- Range varies; scan with parallel requests

### XML Structure (Individual Ficha)
```xml
<fichaSenador>
  <datosPersonales>
    <idweb>10148</idweb>
    <nombre>JUAN JOSÉ</nombre>
    <apellidos>MATARÍ SÁEZ</apellidos>
    <fechaNacimiento>24/12/1959</fechaNacimiento>
    <lugarNacimiento>Almería</lugarNacimiento>
    <biografia>LICENCIADO EN DERECHO...</biografia>  <!-- Education/profession here -->
  </datosPersonales>
  <legislaturas>...</legislaturas>
</fichaSenador>
```

### Important Notes

1. **Empty `biografia` is common**: ~50% of senators don't provide bio info
2. **Request headers**: Use `Accept-Encoding: identity` to avoid gzip issues
3. **No User-Agent blocking**: Unlike Congreso, Senado doesn't block curl
4. **tipoFich values**:
   - 1 = Individual senator ficha
   - 10 = Full senator list (1977-present)
   - 14 = Plenary sessions
   - 16 = Parliamentary motions

## Verification
```bash
# Test individual fetch (should return XML with senator data)
curl -s "https://www.senado.es/web/ficopendataservlet?tipoFich=1&cod=10148&legis=15" | head -20

# Test list endpoint
curl -s "https://www.senado.es/web/ficopendataservlet?tipoFich=10" | grep -c "legislatura"
```

## Example
```typescript
async function fetchSenadoBio(idweb: string): Promise<string | null> {
  const url = `https://www.senado.es/web/ficopendataservlet?tipoFich=1&cod=${idweb}&legis=15`;
  const response = await fetch(url, {
    headers: { 'Accept-Encoding': 'identity' }
  });

  const xml = await response.text();
  if (xml.length < 100) return null;

  const match = xml.match(/<biografia><!\[CDATA\[(.*?)\]\]><\/biografia>/);
  return match ? match[1] : null;
}
```

## Notes
- The HTML ficha page (`fichasenador/index.html?id1=X&legis=15`) uses the same `idweb` as `id1`
- Congreso (Congress) uses a completely different API with JSON format
- For Congreso: `https://www.congreso.es/webpublica/opendata/diputados/DiputadosActivos__YYYYMMDDHHMMSS.json`
