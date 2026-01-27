# ui_developer

kind: let

source:
```prose
let ui_developer = session: ui_developer
```

---

## Summary

Successfully created the `DataExplanationBox` component and integrated it into the Representantes dashboard.

## Files Created

### `/Users/gorkolas/Documents/www/parlamentarios-espana/src/components/data-explanation-box.tsx`

A new component that displays comprehensive data statistics with tooltips explaining the data structure:

**Features:**
- Total entries breakdown (1,257 = 642 XV + 615 I)
- XV Legislature detailed breakdown showing:
  - 350 Congreso active
  - 273 Senado active
  - 19 Senado bajas (departed senators)
- I Legislature total (615)
- Education coverage progress bar with percentage
- Profession coverage progress bar with percentage
- Data sources section linking to official Congreso/Senado OpenData portals
- Download buttons:
  - "Descargar CSV" linking to `/api/representantes/export?format=csv`
  - "Documentacion API" linking to `/representantes/api-docs`

**Tooltips explaining:**
- Why there are 292 Senado entries (273 active + 19 bajas)
- What "No_consta" means (no verifiable data found)
- Data sources (official vs researched via Perplexity AI)
- How education and profession data is categorized

## Files Modified

### `/Users/gorkolas/Documents/www/parlamentarios-espana/src/app/representantes/representantes-tabs.tsx`

- Added import for `DataExplanationBox` component
- Added `dataExplanationStats` computed value using `useMemo` that aggregates stats from both legislatures
- Added the `DataExplanationBox` component to the Resumen tab after the Hemiciclo visualization

## Technical Notes

- Created a custom CSS-based `Tooltip` component since Radix UI tooltip was not installed
- Uses the project's design system (neobrutalist style with shadows, borders)
- Uses existing UI components: `Badge` from `@/components/ui/badge`
- All text in Spanish to match the rest of the application
- Build and lint pass with zero errors/warnings

## Verification

```bash
pnpm build  # Successful - 659 pages generated
pnpm lint   # Successful - no errors or warnings
```
