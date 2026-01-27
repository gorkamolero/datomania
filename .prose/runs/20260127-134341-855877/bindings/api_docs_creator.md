# api_docs_creator

kind: let

source:
```prose
let api_docs_creator = session: api_docs_creator
```

---

## Completion Summary

Successfully created the API documentation page at `/Users/gorkolas/Documents/www/parlamentarios-espana/src/app/representantes/api-docs/page.tsx`.

### What was created:

1. **Overview Section**: Displays key stats (1,257 parlamentarios, 2 legislatures, 3 data sources, 3 public endpoints) with the base URL.

2. **Endpoints Documentation**:
   - `GET /api/representantes/parlamentarios` - List with filters and pagination
   - `GET /api/representantes/export` - Download CSV/JSON with direct download buttons
   - `GET /api/representantes/stats` - Aggregate statistics with comparison option

3. **Data Schema**: Complete TypeScript interface showing all Parlamentario fields including the new `education_levels` and `data_sources` structures.

4. **Education Levels System**: Detailed explanation of the 3-level system:
   - Original (raw declared text)
   - Normalized (mapped to current Spanish education system: ESO, Bachillerato, FP, Grado, Licenciatura, Master, Doctorado)
   - Simplified (broad categories: Obligatoria, Postobligatoria, Universitaria)

5. **Data Sources**: Documentation of the three sources (congreso, senado, perplexity) with the DataSourceEntry schema.

6. **Code Examples**: Working copy-paste examples in:
   - JavaScript/TypeScript
   - Python (with pandas integration)
   - cURL

7. **Rate Limits & Cache**: Information about caching (1 hour), CORS, and format details.

### Design System Compliance:

The page follows the project's neobrutalist design system:
- Uses `font-heading`, `text-main`, `bg-card`, `border-border` utilities
- Consistent `shadow-[4px_4px_0px_0px_#000]` and hover effects
- Code blocks with dark background
- Parameter tables with proper styling
- Grid layouts for stat cards

### Verification:

- `pnpm build` - Passed (659 pages generated, including `/representantes/api-docs`)
- `pnpm lint` - Passed with no errors or warnings

### File Location:

`/Users/gorkolas/Documents/www/parlamentarios-espana/src/app/representantes/api-docs/page.tsx`
