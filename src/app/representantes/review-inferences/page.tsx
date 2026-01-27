import { InferencesTable } from './inferences-table';

export const metadata = {
  title: 'Revision de Inferencias - Datomania',
  description: 'Herramienta interna para revisar inferencias de educacion',
  robots: 'noindex, nofollow', // Internal tool, no indexing
};

/**
 * Internal inference review page
 *
 * Used by administrators to validate education inferences derived from profession data.
 * Actions: Approve, Reject, Modify
 */
export default function ReviewInferencesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-heading uppercase tracking-tight mb-2">
          Revision de Inferencias
        </h1>
        <p className="text-muted-foreground">
          Herramienta interna para revisar y validar inferencias de educacion basadas en profesion.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Las inferencias con confianza &gt;=95% son candidatas para aprobacion automatica (abogados, medicos, etc.)
        </p>
      </div>

      <InferencesTable />
    </div>
  );
}
