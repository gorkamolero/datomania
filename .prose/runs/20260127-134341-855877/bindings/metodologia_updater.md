# metodologia_updater

kind: let

source:
```prose
let metodologia_updater = session: metodologia_updater
```

---

## Task Completed Successfully

Updated `/Users/gorkolas/Documents/www/parlamentarios-espana/src/app/representantes/metodologia/page.tsx` with five new sections:

### 1. Por que 1.257 parlamentarios
- Breakdown of 615 (I Legislature) + 642 (XV Legislature) = 1,257 total
- Visual grid showing composition of each legislature (diputados, senadores, bajas)
- Historical context: comparing first democratic legislature with current one

### 2. Calidad de Datos (Data Quality)
- Explains automatic validation process
- Four validation types: duplicates, source conflicts, logical inconsistencies, baja metadata
- Mentions quality reports with coverage metrics

### 3. Tracking Multi-Fuente (Multi-Source Tracking)
- Explains how each data point tracks its source (congreso, senado, perplexity)
- Shows JSON example of `data_sources` array structure
- Explains auditing capability and conflict detection

### 4. Normalizacion Educativa (Education Normalization)
- Explains 3-level system: original, normalized, simplified
- Historical mapping table showing different Spanish education systems
- Grid showing simplified categories (Obligatoria, Postobligatoria, Universitaria)

### 5. Inferencia Educacion-Profesion (Inference Rules)
- Explains how education is inferred from profession when missing
- Lists concrete rules with confidence percentages (Abogado -> Derecho 95%, etc.)
- Shows JSON structure of `education_inference` field
- Emphasizes that inferences require human review before application

### Build & Lint Results
- `pnpm build`: SUCCESS (659 static pages generated)
- `pnpm lint`: 1 warning (pre-existing, in `representantes-tabs.tsx`, not related to my changes)

The page now comprehensively documents the data quality, multi-source tracking, education normalization, and inference systems implemented in the codebase.
