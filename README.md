# Datomania!

**Datos públicos que deberían existir en España pero no existen.**

Datomania is an open-data publishing platform for Spanish public information that should be easy to inspect, download, and reuse. The first dataset, **Representantes**, structures education and profession data for Spanish parliamentarians across the I and XV legislatures.

Web: [datomania.vercel.app](https://datomania.vercel.app)
Repository: [github.com/gorkamolero/datomania](https://github.com/gorkamolero/datomania)
License: MIT

## What It Proves

- Product judgment in a messy civic-data domain: find the public-interest gap, turn scattered official records into a usable data product, and explain the methodology.
- Full-stack data publishing: Next.js app, public routes, API endpoints, CSV/JSON export, data pages, visualizations, and deployment.
- Data modeling discipline: legislature-aware records, multi-source provenance, normalized education levels, profession categories, inferred education fields, and data-quality checks.
- Practical automation: official source scraping, Perplexity-assisted research for missing fields, metadata updates, and git-backed data history.
- Public communication: methodology pages, API docs, manifesto, downloads, charts, and contribution paths.

## Current Project: Representantes

Education and profession data for Spanish parliamentarians.

- Legislatures: I (1979-1982) and XV (2023-present)
- Chambers: Congreso de los Diputados and Senado
- Dataset size: 1,257 parliamentarians
- Sources: official Congreso/Senado records plus marked researched additions
- Outputs: web UI, JSON, CSV, API, raw repo data

Routes:

```text
/representantes
/representantes/parlamentarios
/representantes/parlamentarios/[slug]
/representantes/metodologia
/representantes/api-docs
/api/representantes/parlamentarios
/api/representantes/stats
/api/representantes/export?format=json
/api/representantes/export?format=csv
```

## Data Model

Each parliamentarian record tracks the person, chamber, party, district, legislature, status, official profile URL, normalized education, and source provenance.

Simplified shape:

```typescript
interface Parlamentario {
  slug: string;
  nombre_completo: string;
  camara: 'Congreso' | 'Senado';
  partido: string;
  grupo_parlamentario: string;
  circunscripcion: string;
  legislature: 'I' | 'XV';
  data_sources: DataSourceEntry[];
  education_levels: EducationLevels;
  education_inference?: EducationInference;
  estado?: 'activo' | 'baja';
  url_ficha: string;
}
```

Source tracking:

```typescript
interface DataSourceEntry {
  source: 'congreso' | 'senado' | 'perplexity';
  field: 'estudios' | 'profesion';
  raw_text: string;
  extracted_at: string;
  extracted_value?: string;
  citations?: string[];
}
```

This matters because public datasets are usually less useful when provenance is flattened away. Datomania keeps official and researched fields distinguishable.

## Features

- Legislature selector and comparison views.
- Parliamentarian table with filtering and detail pages.
- Education and profession visualizations.
- Party-color metadata.
- Methodology page explaining collection, classification, limitations, and inference.
- Public API documentation page.
- JSON and CSV export endpoints.
- Internal inference review surface.
- Data-quality checks for duplicates, conflicts, missing metadata, and suspicious classifications.
- Research worker for missing education/profession fields.

## Architecture

```text
src/app                         Next.js App Router pages and API routes
src/app/representantes          Representantes UI, methodology, API docs, tables
src/app/api/representantes      public data API and export routes
src/app/api/research            research/cron endpoints
src/components/charts           Nivo/D3 chart components
src/components/visualizations   custom civic-data visualizations
src/projects/representantes     dataset, types, logic, scripts, tests
src/projects/representantes/data
                                 JSON datasets and metadata
```

Each data project is intended to be self-contained:

```text
src/projects/{project}/
  data/
  types/
  lib/
  scripts/
  metadata.json
```

## Development

Requirements:

- Node.js 20+
- pnpm 9+

Install:

```bash
git clone https://github.com/gorkamolero/datomania.git
cd datomania
pnpm install
```

Run:

```bash
pnpm dev
```

Verify:

```bash
pnpm lint
pnpm test:run
pnpm build
```

Research worker:

```bash
pnpm research:dry
pnpm research
```

Research requires:

```env
PERPLEXITY_API_KEY=
CRON_SECRET=
```

## Public API

Representative data:

```text
GET /api/representantes/parlamentarios
GET /api/representantes/stats
GET /api/representantes/export?format=json
GET /api/representantes/export?format=csv
GET /api/representantes/inferences
```

Political parties:

```text
GET /api/partidos
```

The export endpoint supports filters such as legislature, chamber, party, district, education level, and profession category.

## Methodology

The project combines:

- official Congreso open data
- official Senado open data
- manually/AI-assisted research for missing education/profession fields
- normalization into modern Spanish education categories
- simplified categories for comparison
- data-source tracking for each extracted field
- inference rules for likely education level from profession, marked separately from direct evidence

The methodology page documents the limits of the dataset rather than hiding them.

## Status

Live prototype with real data and public routes.

Done:

- Representantes dataset for I and XV legislatures.
- Public website.
- API/export routes.
- Charts and comparison views.
- Methodology and API docs pages.
- Data quality and education inference tests.
- Research scripts for missing data.

Needs polish:

- Capture screenshots for portfolio/GitHub.
- Add a compact architecture diagram to the README.
- Review deployment hook wording before broader public promotion.
- Expand the platform with a second civic-data project.

## Portfolio Context

Datomania shows a different engineering strength than the agent/tooling repos: it is public-interest product work. It takes a messy institutional-data problem, designs a normalized domain model, ships an inspectable public interface, and exposes the result through downloads and APIs.

The hiring signal is civic product judgment plus execution: finding a data gap, building the scraping/research/update workflow, making provenance visible, and turning raw political records into a usable public artifact.

## Contributing

If you find a data error:

1. Open an issue.
2. Name the parliamentarian and field.
3. Include the corrected source.

If you want to propose a new Datomania project:

1. Describe the public data that should exist.
2. Explain why it matters.
3. Link to official or semi-official sources.

## License

MIT. Use the code and data freely. Attribution is appreciated.
