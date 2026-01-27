import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentación - Parlamentarios de España',
  description:
    'Documentación de la API REST para acceder a datos de 1,257 parlamentarios de España (I y XV Legislatura). Endpoints, filtros, formatos de exportación y ejemplos de código.',
};

function CodeBlock({
  children,
  language = 'json',
}: {
  children: string;
  language?: string;
}) {
  return (
    <pre className="bg-foreground text-background p-4 overflow-x-auto text-sm border-2 border-border">
      <code className={`language-${language}`}>{children}</code>
    </pre>
  );
}

function EndpointCard({
  method,
  path,
  description,
  children,
}: {
  method: string;
  path: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
      <div className="flex items-start gap-3 flex-wrap">
        <span className="px-3 py-1 bg-main text-white font-bold text-sm uppercase border-2 border-border">
          {method}
        </span>
        <code className="text-sm font-bold break-all">{path}</code>
      </div>
      <p className="text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

function ParamTable({
  params,
}: {
  params: { name: string; type: string; description: string; required?: boolean }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted border-2 border-border">
            <th className="text-left p-2 font-bold">Parámetro</th>
            <th className="text-left p-2 font-bold">Tipo</th>
            <th className="text-left p-2 font-bold">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={param.name} className="border-b border-border">
              <td className="p-2">
                <code className="text-main">{param.name}</code>
                {param.required && (
                  <span className="ml-1 text-xs text-red-500">*</span>
                )}
              </td>
              <td className="p-2 text-muted-foreground">{param.type}</td>
              <td className="p-2">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link
          href="/representantes"
          className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main mb-8 inline-block"
        >
          &larr; Volver
        </Link>

        <h1 className="text-4xl md:text-5xl font-heading mb-4">
          API Documentación
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          API REST pública para acceder a datos de parlamentarios de España.
          Sin autenticación requerida.
        </p>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Datos Disponibles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-3xl">1,257</div>
              <div className="text-sm text-muted-foreground">
                Parlamentarios totales
              </div>
            </div>
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-3xl">2</div>
              <div className="text-sm text-muted-foreground">
                Legislaturas (I y XV)
              </div>
            </div>
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-3xl">3</div>
              <div className="text-sm text-muted-foreground">
                Fuentes de datos
              </div>
            </div>
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-3xl">3</div>
              <div className="text-sm text-muted-foreground">
                Endpoints públicos
              </div>
            </div>
          </div>
          <div className="bg-muted border-2 border-border p-4">
            <p className="text-sm">
              <strong>Base URL:</strong>{' '}
              <code className="bg-background px-2 py-1 border border-border">
                https://datomania.es/api/representantes
              </code>
            </p>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-6">
            Endpoints
          </h2>

          <div className="space-y-8">
            {/* GET /parlamentarios */}
            <EndpointCard
              method="GET"
              path="/api/representantes/parlamentarios"
              description="Lista de parlamentarios con filtros y paginación."
            >
              <h4 className="font-bold text-sm uppercase tracking-wide mb-2">
                Query Parameters
              </h4>
              <ParamTable
                params={[
                  {
                    name: 'camara',
                    type: "'Congreso' | 'Senado'",
                    description: 'Filtrar por cámara',
                  },
                  {
                    name: 'partido',
                    type: 'string',
                    description: 'Filtrar por partido político',
                  },
                  {
                    name: 'estudios_nivel',
                    type: 'EstudiosNivel',
                    description: 'Filtrar por nivel educativo',
                  },
                  {
                    name: 'profesion_categoria',
                    type: 'ProfesionCategoria',
                    description: 'Filtrar por categoría profesional',
                  },
                  {
                    name: 'circunscripcion',
                    type: 'string',
                    description: 'Filtrar por provincia/circunscripción',
                  },
                  {
                    name: 'busqueda',
                    type: 'string',
                    description: 'Buscar por nombre',
                  },
                  {
                    name: 'pagina',
                    type: 'number',
                    description: 'Página actual (default: 1)',
                  },
                  {
                    name: 'por_pagina',
                    type: 'number',
                    description: 'Resultados por página (default: 50, max: 100)',
                  },
                ]}
              />
              <h4 className="font-bold text-sm uppercase tracking-wide mb-2 mt-4">
                Response
              </h4>
              <CodeBlock>{`{
  "parlamentarios": [...],
  "total": 350,
  "pagina": 1,
  "por_pagina": 50,
  "total_paginas": 7
}`}</CodeBlock>
            </EndpointCard>

            {/* GET /export */}
            <EndpointCard
              method="GET"
              path="/api/representantes/export"
              description="Descargar datos completos en JSON o CSV."
            >
              <h4 className="font-bold text-sm uppercase tracking-wide mb-2">
                Query Parameters
              </h4>
              <ParamTable
                params={[
                  {
                    name: 'format',
                    type: "'json' | 'csv'",
                    description: "Formato de exportación (default: 'json')",
                  },
                  {
                    name: 'legislature',
                    type: "'I' | 'XV'",
                    description: "Legislatura a exportar (default: 'XV')",
                  },
                  {
                    name: 'camara',
                    type: "'Congreso' | 'Senado'",
                    description: 'Filtrar por cámara (opcional)',
                  },
                  {
                    name: 'partido',
                    type: 'string',
                    description: 'Filtrar por partido (opcional)',
                  },
                  {
                    name: 'estudios_nivel',
                    type: 'EstudiosNivel',
                    description: 'Filtrar por nivel educativo (opcional)',
                  },
                  {
                    name: 'profesion_categoria',
                    type: 'ProfesionCategoria',
                    description: 'Filtrar por categoría (opcional)',
                  },
                  {
                    name: 'circunscripcion',
                    type: 'string',
                    description: 'Filtrar por provincia (opcional)',
                  },
                ]}
              />
              <div className="flex gap-3 mt-4">
                <a
                  href="/api/representantes/export?format=json"
                  className="px-4 py-2 bg-main text-white font-bold text-sm uppercase border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
                >
                  Descargar JSON
                </a>
                <a
                  href="/api/representantes/export?format=csv"
                  className="px-4 py-2 bg-background font-bold text-sm uppercase border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
                >
                  Descargar CSV
                </a>
              </div>
            </EndpointCard>

            {/* GET /stats */}
            <EndpointCard
              method="GET"
              path="/api/representantes/stats"
              description="Estadísticas agregadas del dataset."
            >
              <h4 className="font-bold text-sm uppercase tracking-wide mb-2">
                Query Parameters
              </h4>
              <ParamTable
                params={[
                  {
                    name: 'legislature',
                    type: "'I' | 'XV'",
                    description: "Legislatura (default: 'XV')",
                  },
                  {
                    name: 'compare',
                    type: "'true'",
                    description: 'Comparar I vs XV legislatura',
                  },
                ]}
              />
              <h4 className="font-bold text-sm uppercase tracking-wide mb-2 mt-4">
                Response
              </h4>
              <CodeBlock>{`{
  "legislature": "XV",
  "total": 642,
  "por_camara": { "Congreso": 350, "Senado": 273 },
  "por_estudios_nivel": { ... },
  "por_profesion_categoria": { ... },
  "por_partido": { ... },
  "cobertura": {
    "estudios_con_datos": 580,
    "estudios_sin_datos": 62,
    "profesion_con_datos": 590,
    "profesion_sin_datos": 52
  }
}`}</CodeBlock>
            </EndpointCard>
          </div>
        </section>

        {/* Data Schema */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Esquema de Datos
          </h2>
          <p className="mb-6 text-muted-foreground">
            Cada parlamentario incluye los siguientes campos:
          </p>
          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
            <CodeBlock language="typescript">{`interface Parlamentario {
  // Identificadores
  id: string;                    // ID único
  slug: string;                  // URL-friendly name

  // Datos básicos
  camara: 'Congreso' | 'Senado';
  nombre_completo: string;
  partido: string;
  grupo_parlamentario: string;
  circunscripcion: string;
  partido_color: string;         // Color hex del partido

  // Fechas
  fecha_alta: string;            // ISO date
  url_ficha: string;             // URL a ficha oficial

  // Educación (sistema de 3 niveles)
  education_levels: {
    original: string;            // Texto declarado
    normalized: string;          // Nivel normalizado (ESO, Grado, etc.)
    simplified: string;          // Categoría amplia
  };

  // Fuentes de datos
  data_sources: DataSourceEntry[];

  // Estado (solo XV legislatura)
  estado?: 'activo' | 'baja';
  fecha_baja?: string;
  sustituido_por?: string;
}`}</CodeBlock>
          </div>
        </section>

        {/* Education Levels */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Sistema de Niveles Educativos
          </h2>
          <p className="mb-6 text-muted-foreground">
            Los datos educativos se normalizan en un sistema de 3 niveles para
            facilitar análisis comparativos:
          </p>

          <div className="space-y-6">
            {/* Original */}
            <div className="bg-muted border-2 border-border p-4">
              <h3 className="font-bold mb-2">
                1. Original{' '}
                <span className="font-normal text-muted-foreground">
                  (education_levels.original)
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Texto exacto declarado por el parlamentario o extraído de fuentes
                oficiales.
              </p>
              <div className="text-sm">
                <code className="bg-background px-2 py-1 border border-border">
                  &quot;Licenciado en Derecho por la Universidad Complutense&quot;
                </code>
              </div>
            </div>

            {/* Normalized */}
            <div className="bg-muted border-2 border-border p-4">
              <h3 className="font-bold mb-2">
                2. Normalized{' '}
                <span className="font-normal text-muted-foreground">
                  (education_levels.normalized)
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Mapeado al sistema educativo español actual.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {[
                  { code: 'ESO', desc: 'Secundaria obligatoria' },
                  { code: 'Bachillerato', desc: '16-18 años' },
                  { code: 'FP_Grado_Medio', desc: 'FP media' },
                  { code: 'FP_Grado_Superior', desc: 'FP superior' },
                  { code: 'Grado', desc: 'Univ. post-Bolonia' },
                  { code: 'Licenciatura', desc: 'Univ. pre-Bolonia' },
                  { code: 'Master', desc: 'Máster' },
                  { code: 'Doctorado', desc: 'PhD' },
                ].map((item) => (
                  <div
                    key={item.code}
                    className="bg-background border border-border p-2"
                  >
                    <code className="text-xs text-main">{item.code}</code>
                    <div className="text-xs text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simplified */}
            <div className="bg-muted border-2 border-border p-4">
              <h3 className="font-bold mb-2">
                3. Simplified{' '}
                <span className="font-normal text-muted-foreground">
                  (education_levels.simplified)
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Categorías amplias para análisis agregado.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border-2 border-border p-3 shadow-[4px_4px_0px_0px_#000]">
                  <div className="font-heading text-main">Obligatoria</div>
                  <div className="text-xs text-muted-foreground">
                    ESO o inferior
                  </div>
                </div>
                <div className="bg-card border-2 border-border p-3 shadow-[4px_4px_0px_0px_#000]">
                  <div className="font-heading text-main">Postobligatoria</div>
                  <div className="text-xs text-muted-foreground">
                    Bachillerato, FP
                  </div>
                </div>
                <div className="bg-card border-2 border-border p-3 shadow-[4px_4px_0px_0px_#000]">
                  <div className="font-heading text-main">Universitaria</div>
                  <div className="text-xs text-muted-foreground">
                    Grado, Máster, PhD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Fuentes de Datos
          </h2>
          <p className="mb-6 text-muted-foreground">
            Cada dato incluye trazabilidad completa de su origen:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-lg">congreso</div>
              <div className="text-sm text-muted-foreground">
                API Open Data del Congreso de los Diputados
              </div>
            </div>
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-lg">senado</div>
              <div className="text-sm text-muted-foreground">
                API Open Data del Senado de España
              </div>
            </div>
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-lg">perplexity</div>
              <div className="text-sm text-muted-foreground">
                Investigación IA cuando faltan datos oficiales
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
            <h4 className="font-bold text-sm uppercase tracking-wide mb-3">
              DataSourceEntry Schema
            </h4>
            <CodeBlock language="typescript">{`interface DataSourceEntry {
  source: 'congreso' | 'senado' | 'perplexity';
  field: 'estudios' | 'profesion';
  raw_text: string;         // Texto original extraído
  extracted_at: string;     // ISO timestamp
  extracted_value?: string; // Valor normalizado
  citations?: string[];     // URLs de fuentes
}`}</CodeBlock>
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-6">
            Ejemplos de Código
          </h2>

          <div className="space-y-6">
            {/* JavaScript */}
            <div className="bg-muted border-2 border-border p-4">
              <h3 className="font-bold mb-3">JavaScript / TypeScript</h3>
              <CodeBlock language="javascript">{`// Obtener todos los diputados del PSOE
const response = await fetch(
  'https://datomania.es/api/representantes/parlamentarios?' +
  new URLSearchParams({
    camara: 'Congreso',
    partido: 'PSOE',
    por_pagina: '100'
  })
);

const { parlamentarios, total } = await response.json();
console.log(\`Encontrados \${total} diputados del PSOE\`);

// Descargar CSV de la XV legislatura
const csvUrl = 'https://datomania.es/api/representantes/export?' +
  new URLSearchParams({
    format: 'csv',
    legislature: 'XV'
  });

// Obtener estadísticas comparativas
const statsResponse = await fetch(
  'https://datomania.es/api/representantes/stats?compare=true'
);
const comparison = await statsResponse.json();
console.log('I Legislatura:', comparison.legislatureI.total);
console.log('XV Legislatura:', comparison.legislatureXV.total);`}</CodeBlock>
            </div>

            {/* Python */}
            <div className="bg-muted border-2 border-border p-4">
              <h3 className="font-bold mb-3">Python</h3>
              <CodeBlock language="python">{`import requests
import pandas as pd

# Obtener parlamentarios con estudios universitarios
params = {
    'estudios_nivel': 'Universitario',
    'por_pagina': 100
}
response = requests.get(
    'https://datomania.es/api/representantes/parlamentarios',
    params=params
)
data = response.json()
print(f"Total universitarios: {data['total']}")

# Descargar como CSV y cargar en pandas
csv_url = 'https://datomania.es/api/representantes/export?format=csv'
df = pd.read_csv(csv_url)
print(df.head())

# Análisis por partido
print(df.groupby('partido').size().sort_values(ascending=False))

# Obtener estadísticas
stats = requests.get(
    'https://datomania.es/api/representantes/stats',
    params={'legislature': 'XV'}
).json()
print(f"Cobertura educativa: {stats['cobertura']['estudios_con_datos']}/{stats['total']}")`}</CodeBlock>
            </div>

            {/* cURL */}
            <div className="bg-muted border-2 border-border p-4">
              <h3 className="font-bold mb-3">cURL</h3>
              <CodeBlock language="bash">{`# Listar parlamentarios de Madrid
curl "https://datomania.es/api/representantes/parlamentarios?circunscripcion=Madrid"

# Descargar JSON de la I legislatura
curl -o parlamentarios_i.json \\
  "https://datomania.es/api/representantes/export?format=json&legislature=I"

# Obtener estadísticas
curl "https://datomania.es/api/representantes/stats?legislature=XV" | jq .

# Comparar legislaturas
curl "https://datomania.es/api/representantes/stats?compare=true" | jq .`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Límites y Caché
          </h2>
          <div className="bg-foreground text-background p-6 space-y-3">
            <p>
              <strong>Rate Limit:</strong> Sin límite estricto, pero por favor
              sé considerado
            </p>
            <p>
              <strong>Caché:</strong> Respuestas cacheadas durante 1 hora
              (s-maxage=3600)
            </p>
            <p>
              <strong>Formato:</strong> Todas las respuestas son JSON (excepto
              /export?format=csv)
            </p>
            <p>
              <strong>CORS:</strong> Habilitado para todos los orígenes
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/representantes"
            className="px-6 py-3 bg-main text-white font-bold uppercase tracking-wide border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
          >
            Explorar datos &rarr;
          </Link>
          <Link
            href="/representantes/metodologia"
            className="px-6 py-3 bg-background font-bold uppercase tracking-wide border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
          >
            Ver metodología
          </Link>
        </div>
      </div>
    </div>
  );
}
