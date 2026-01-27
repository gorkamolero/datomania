# inference_reviewer

kind: let

source:
```prose
let inference_reviewer = session: inference_reviewer
```

---

## Summary

Created an internal inference review page for validating education inferences derived from profession data. This tool is designed for the father's validation workflow.

## Files Created

### API Routes

1. **`/Users/gorkolas/Documents/www/parlamentarios-espana/src/app/api/representantes/inferences/route.ts`**
   - GET endpoint that lists parlamentarios with `education_inference` present
   - Query parameters:
     - `min_confidence`: Filter by minimum confidence (0-1)
     - `status`: Filter by approval status (`pending`, `approved`, `rejected`, `all`)
     - `pagina`, `por_pagina`: Pagination
   - Returns stats (total, pending, approved, rejected, high_confidence)

2. **`/Users/gorkolas/Documents/www/parlamentarios-espana/src/app/api/representantes/inferences/[id]/route.ts`**
   - PUT endpoint to update an inference
   - Actions: `approve`, `reject`, `modify`
   - Request body: `{ action, reviewed_by, modified_education? }`
   - Directly updates the JSON data file

### Page

3. **`/Users/gorkolas/Documents/www/parlamentarios-espana/src/app/representantes/review-inferences/page.tsx`**
   - Server component wrapper with noindex meta for internal tool
   - Title: "Revision de Inferencias"

4. **`/Users/gorkolas/Documents/www/parlamentarios-espana/src/app/representantes/review-inferences/inferences-table.tsx`**
   - Client component with full functionality:
     - Stats cards showing total, pending, approved, rejected, high confidence counts
     - Filter by status (pending/approved/rejected/all)
     - Filter by minimum confidence (70%/80%/90%/95%)
     - Table with columns: Select, Name, Profession, Inferred Education, Confidence, Status, Actions
     - Actions: Approve, Reject, Modify (inline editing)
     - Bulk approve for selected high-confidence items (&ge;95%)
     - Pagination

## Features

- **List**: Shows all parlamentarios with education_inference
- **Show**: Name (link to profile), profession, inferred education, confidence badge, status badge
- **Actions**: Approve, Reject, Modify (inline text editing)
- **Filters**: By confidence level, by approval status
- **Bulk actions**: Approve all selected with &ge;95% confidence

## Build & Lint

Both `pnpm build` and `pnpm lint` pass with zero errors and zero warnings.

## Access

Navigate to: `/representantes/review-inferences`
