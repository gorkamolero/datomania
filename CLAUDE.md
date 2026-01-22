# Datomania! - Project Architecture

## Overview

Datomania is a platform for publishing **public data that should exist but doesn't** in Spain. It hosts multiple independent research projects, each focused on a specific domain of public data.

## Multi-Project Architecture

This is NOT a single-purpose app. It's a **multi-project research platform**. Each project is self-contained with its own:

- **Data** (`src/projects/{project}/data/`)
- **Types** (`src/projects/{project}/types/`)
- **Business logic** (`src/projects/{project}/lib/`)
- **Scripts** (`src/projects/{project}/scripts/`)
- **Tests** (`src/projects/{project}/lib/*.test.ts`)
- **Metadata** (`src/projects/{project}/data/metadata.json`)

### Current Projects

| Project | Path | Description |
|---------|------|-------------|
| `representantes` | `src/projects/representantes/` | Education & profession data for Spanish parliamentarians (Congreso + Senado) |

## Project Structure

```
src/
├── app/                          # Next.js routes
│   ├── api/                      # API routes (scoped by project)
│   │   ├── research/             # Research cron APIs
│   │   └── representantes/       # Representantes project APIs
│   ├── representantes/           # Representantes project pages
│   └── layout.tsx                # Root layout
├── components/
│   ├── layout/                   # Shared layout components
│   ├── ui/                       # Shared UI components
│   └── visualizations/           # Data visualization components
├── projects/                     # PROJECT-SCOPED CODE
│   └── representantes/
│       ├── data/                 # JSON data files + metadata.json
│       ├── types/                # TypeScript types
│       ├── lib/                  # Business logic + tests
│       └── scripts/              # Data collection scripts
└── lib/                          # Shared utilities
```

## Data Update Flow

Each project has its own data update cycle:

1. **Scripts** fetch/scrape official sources
2. **Perplexity API** fills in missing data
3. **JSON files** are updated in `src/projects/{project}/data/`
4. **metadata.json** is updated with `lastUpdated` timestamp
5. **Git commit & push** to GitHub
6. **Vercel auto-deploys** on push

### metadata.json (per project)

```json
{
  "lastUpdated": "2025-01-22T00:00:00.000Z",
  "legislature": "XV",
  "totalParlamentarios": 599,
  "sources": { ... }
}
```

This `lastUpdated` is displayed in the UI when viewing that project's data.

## Key Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm lint                   # Lint code

# Testing (per project)
pnpm test:run               # Run all tests
pnpm test                   # Watch mode

# Research worker (representantes project)
pnpm research               # Run research, commit & push
pnpm research:dry           # Dry run (no commit)
pnpm research:dry --limit 5 # Process only 5 items
```

## API Routes

APIs are scoped by project:

- `/api/representantes/*` - Representantes project endpoints
- `/api/research/*` - Research/cron endpoints (used by worker scripts)

## Testing Strategy

- Tests live alongside code: `src/projects/{project}/lib/*.test.ts`
- Integration tests use **real data** and **real APIs** (Perplexity)
- Run with `PERPLEXITY_API_KEY=xxx pnpm test:run` for full integration tests

## Important Conventions

1. **Project scoping**: All project-specific code goes in `src/projects/{project}/`
2. **No code duplication**: Shared utilities in `src/lib/`, project code in `src/projects/`
3. **Metadata per project**: Each project has its own `metadata.json` with `lastUpdated`
4. **Git as version control**: Data updates are committed to git, giving us full history
5. **Tests use real functions**: Integration tests use the exact same functions as production code

## Data Sources

### Representantes Project

- **Congreso**: https://www.congreso.es/opendata
- **Senado**: https://www.senado.es/web/ficopencuestam/opendata
- **Perplexity API**: For researching missing education/profession data

## Environment Variables

```
PERPLEXITY_API_KEY=xxx     # For research worker
CRON_SECRET=xxx            # For API authentication
```
