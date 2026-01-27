import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metodología Representantes - Fuentes y proceso',
  description: 'Cómo recopilamos datos de 1.257 parlamentarios: APIs de Congreso.es y Senado.es, clasificación de educación y profesión, verificación cruzada.',
};

export default function MetodologiaPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          href="/representantes"
          className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main mb-8 inline-block"
        >
          &larr; Volver
        </Link>

        <h1 className="text-4xl md:text-5xl font-heading mb-8">Metodología</h1>

        {/* Fuentes oficiales */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Fuentes Oficiales
          </h2>
          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <div>
              <h3 className="font-bold mb-2">Congreso de los Diputados</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Open Data JSON con biografías. Patrón: <code className="text-xs">odsDiputadosXX__*.json</code>
              </p>
              <code className="text-xs bg-muted px-2 py-1 border border-border block overflow-x-auto">
                https://www.congreso.es/webpublica/opendata/diputados/
              </code>
            </div>
            <div>
              <h3 className="font-bold mb-2">Senado</h3>
              <p className="text-muted-foreground text-sm mb-2">
                XML con fichas individuales. <code className="text-xs">tipoFich=10</code> (lista) + <code className="text-xs">tipoFich=1</code> (ficha)
              </p>
              <code className="text-xs bg-muted px-2 py-1 border border-border block overflow-x-auto">
                https://www.senado.es/web/ficopendataservlet?tipoFich=10&amp;legis=15
              </code>
            </div>
          </div>
        </section>

        {/* Investigación complementaria */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Investigación con IA
          </h2>
          <div className="bg-muted border-2 border-border p-6 space-y-4">
            <p>
              Cuando las fuentes oficiales no incluyen información educativa o
              profesional, usamos <strong>Perplexity AI</strong> (modelo sonar)
              para investigar en tiempo real:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>Wikipedia (español, catalán, euskera, gallego)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>LinkedIn y perfiles profesionales</span>
              </li>
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>Webs de partidos políticos</span>
              </li>
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>Portales municipales y autonómicos</span>
              </li>
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>Hemerotecas y medios de comunicación</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              La IA busca datos verificables con fuentes citables. Los resultados se revisan antes de incorporarse.
            </p>
          </div>
        </section>

        {/* Campo source */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Trazabilidad
          </h2>
          <p className="mb-4">
            Cada parlamentario tiene un campo <code className="bg-muted px-1 border border-border">source</code>:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-lg">official</div>
              <div className="text-sm text-muted-foreground">
                Datos extraídos directamente de Congreso/Senado
              </div>
            </div>
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-lg">researched</div>
              <div className="text-sm text-muted-foreground">
                Datos obtenidos por agentes de investigación
              </div>
            </div>
          </div>
        </section>

        {/* Clasificaciones */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Clasificaciones
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-3">Nivel Educativo</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {[
                  { code: 'Universitario', desc: 'Título universitario declarado' },
                  { code: 'Universitario_inferido', desc: 'Profesión que requiere título' },
                  { code: 'FP_Tecnico', desc: 'Formación profesional' },
                  { code: 'Secundario', desc: 'Bachillerato o ESO' },
                  { code: 'Estudios_incompletos', desc: 'Sin completar' },
                  { code: 'No_consta', desc: 'Sin información' },
                ].map((item) => (
                  <div key={item.code} className="bg-muted border border-border p-2">
                    <code className="text-xs text-main">{item.code}</code>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3">Categoría Profesional</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {[
                  { code: 'Profesional_liberal', desc: 'Abogados, médicos, etc.' },
                  { code: 'Funcionario', desc: 'Empleados públicos' },
                  { code: 'Empresario', desc: 'Propietarios, directivos' },
                  { code: 'Politica', desc: 'Carrera política' },
                  { code: 'Oficina', desc: 'Trabajo administrativo' },
                  { code: 'Manual', desc: 'Trabajo manual' },
                  { code: 'No_consta', desc: 'Sin información' },
                ].map((item) => (
                  <div key={item.code} className="bg-muted border border-border p-2">
                    <code className="text-xs text-main">{item.code}</code>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Actualización */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Actualización Automática
          </h2>
          <div className="bg-foreground text-background p-6 space-y-3">
            <p>
              <strong>Cron mensual:</strong> Sincroniza con APIs oficiales de Congreso y Senado
            </p>
            <p>
              <strong>Detección:</strong> Nuevos parlamentarios, bajas y cambios en composición
            </p>
            <p>
              <strong>Bajas:</strong> Senadores que causan baja se mantienen con <code className="text-main bg-background/20 px-1">estado: baja</code>
            </p>
            <p>
              <strong>Investigación:</strong> Perplexity AI para perfiles sin datos educativos (cooldown 30 días)
            </p>
            <p>
              <strong>Endpoint:</strong>{' '}
              <code className="text-main bg-background/20 px-1">/api/cron/check-updates</code>
            </p>
          </div>
        </section>

        {/* Por qué 1.257 */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Por qué 1.257 parlamentarios
          </h2>
          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <p className="text-muted-foreground">
              Nuestro dataset incluye parlamentarios de dos legislaturas históricamente significativas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-muted border border-border p-4">
                <div className="font-heading text-main text-2xl">I Legislatura</div>
                <div className="text-sm font-bold">1979-1982</div>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <p><strong>350</strong> diputados</p>
                  <p><strong>265</strong> senadores</p>
                  <p className="border-t border-border pt-1 mt-2"><strong>615</strong> total</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Primera legislatura democrática tras la Transición.
                </p>
              </div>
              <div className="bg-muted border border-border p-4">
                <div className="font-heading text-main text-2xl">XV Legislatura</div>
                <div className="text-sm font-bold">2023-presente</div>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <p><strong>350</strong> diputados</p>
                  <p><strong>273</strong> senadores activos</p>
                  <p><strong>19</strong> senadores (bajas)</p>
                  <p className="border-t border-border pt-1 mt-2"><strong>642</strong> total</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Legislatura actual, actualizada mensualmente.
                </p>
              </div>
            </div>
            <div className="bg-foreground text-background p-4 mt-4">
              <p className="font-bold">615 + 642 = 1.257 parlamentarios</p>
              <p className="text-sm mt-1">
                Permitiendo comparación histórica: primera democracia vs. actualidad.
              </p>
            </div>
          </div>
        </section>

        {/* Calidad de datos */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Calidad de Datos
          </h2>
          <div className="bg-muted border-2 border-border p-6 space-y-4">
            <p>
              Cada parlamentario pasa por un proceso de <strong>validación automática</strong> que detecta:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border p-4">
                <h4 className="font-bold text-sm mb-2">Duplicados</h4>
                <p className="text-xs text-muted-foreground">
                  Detectamos entradas duplicadas por nombre exacto y por similitud fonética.
                </p>
              </div>
              <div className="bg-card border border-border p-4">
                <h4 className="font-bold text-sm mb-2">Conflictos entre fuentes</h4>
                <p className="text-xs text-muted-foreground">
                  Cuando Congreso, Senado y Perplexity reportan datos diferentes para el mismo campo.
                </p>
              </div>
              <div className="bg-card border border-border p-4">
                <h4 className="font-bold text-sm mb-2">Inconsistencias lógicas</h4>
                <p className="text-xs text-muted-foreground">
                  Profesiones que requieren título pero educación aparece como &quot;No consta&quot;.
                </p>
              </div>
              <div className="bg-card border border-border p-4">
                <h4 className="font-bold text-sm mb-2">Metadatos de bajas</h4>
                <p className="text-xs text-muted-foreground">
                  Senadores marcados como &quot;baja&quot; deben tener fecha y sustituto registrado.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              El sistema genera un <strong>informe de calidad</strong> con métricas de cobertura (% de datos completos) y lista de conflictos a revisar.
            </p>
          </div>
        </section>

        {/* Tracking multi-fuente */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Tracking Multi-Fuente
          </h2>
          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <p>
              Cada dato de educación y profesión se registra con su <strong>fuente original</strong>.
              Un parlamentario puede tener múltiples entradas de diferentes fuentes:
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-muted border border-border p-3 text-center">
                <code className="text-xs text-main block">congreso</code>
                <div className="text-xs text-muted-foreground mt-1">API Open Data</div>
              </div>
              <div className="bg-muted border border-border p-3 text-center">
                <code className="text-xs text-main block">senado</code>
                <div className="text-xs text-muted-foreground mt-1">XML Fichas</div>
              </div>
              <div className="bg-muted border border-border p-3 text-center">
                <code className="text-xs text-main block">perplexity</code>
                <div className="text-xs text-muted-foreground mt-1">Investigación IA</div>
              </div>
            </div>
            <div className="bg-muted p-4 mt-4 font-mono text-xs overflow-x-auto">
              <pre>{`{
  "data_sources": [
    {
      "source": "congreso",
      "field": "estudios",
      "raw_text": "Licenciado en Derecho",
      "extracted_at": "2025-01-15T10:30:00Z"
    },
    {
      "source": "perplexity",
      "field": "profesion",
      "raw_text": "Abogado del Estado",
      "extracted_at": "2025-01-20T14:00:00Z",
      "citations": ["https://..."]
    }
  ]
}`}</pre>
            </div>
            <p className="text-xs text-muted-foreground">
              Esto permite auditar de dónde viene cada dato y detectar conflictos cuando las fuentes no coinciden.
            </p>
          </div>
        </section>

        {/* Normalización educativa */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Normalización Educativa (3 niveles)
          </h2>
          <div className="bg-muted border-2 border-border p-6 space-y-4">
            <p>
              España ha tenido múltiples sistemas educativos. Normalizamos todo a <strong>tres niveles</strong>:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-4 border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-2 font-heading">Nivel</th>
                    <th className="text-left p-2 font-heading">Descripción</th>
                    <th className="text-left p-2 font-heading">Ejemplo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-2"><code className="text-main">original</code></td>
                    <td className="p-2 text-muted-foreground">Texto exacto de la fuente</td>
                    <td className="p-2 text-xs">&quot;Licenciado en Derecho por la UCM&quot;</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2"><code className="text-main">normalized</code></td>
                    <td className="p-2 text-muted-foreground">Sistema educativo actual</td>
                    <td className="p-2 text-xs">&quot;Licenciatura&quot;</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2"><code className="text-main">simplified</code></td>
                    <td className="p-2 text-muted-foreground">Categoría amplia</td>
                    <td className="p-2 text-xs">&quot;Universitaria&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h4 className="font-bold text-sm mb-3">Mapeo histórico</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Reconocemos terminología de diferentes épocas:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="bg-card border border-border p-2">
                  <div className="font-bold">Pre-1970</div>
                  <div className="text-muted-foreground">Bachillerato Elemental</div>
                </div>
                <div className="bg-card border border-border p-2">
                  <div className="font-bold">1970-1990</div>
                  <div className="text-muted-foreground">EGB, BUP, COU, FP</div>
                </div>
                <div className="bg-card border border-border p-2">
                  <div className="font-bold">1990-2006</div>
                  <div className="text-muted-foreground">ESO, Bachillerato, FP</div>
                </div>
                <div className="bg-card border border-border p-2">
                  <div className="font-bold">Pre-Bolonia</div>
                  <div className="text-muted-foreground">Licenciado, Diplomado</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-bold text-sm mb-3">Categorías normalizadas</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { cat: 'Obligatoria', levels: ['ESO'] },
                  { cat: 'Postobligatoria', levels: ['Bachillerato', 'FP Medio', 'FP Superior'] },
                  { cat: 'Universitaria', levels: ['Grado', 'Licenciatura', 'Máster', 'Doctorado'] },
                ].map((group) => (
                  <div key={group.cat} className="bg-card border border-border p-2">
                    <div className="font-bold text-main">{group.cat}</div>
                    <div className="text-muted-foreground">{group.levels.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reglas de inferencia */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Inferencia Educación-Profesión
          </h2>
          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <p>
              Cuando falta el dato de educación pero conocemos la profesión, podemos <strong>inferir</strong> el nivel educativo requerido.
            </p>
            <div className="bg-muted p-4 mt-4">
              <h4 className="font-bold text-sm mb-3">Reglas de inferencia</h4>
              <div className="space-y-2 text-sm">
                {[
                  { prof: 'Abogado/a', edu: 'Licenciado en Derecho', conf: '95%' },
                  { prof: 'Médico/a', edu: 'Licenciado en Medicina', conf: '95%' },
                  { prof: 'Enfermero/a', edu: 'Diplomado en Enfermería', conf: '90%' },
                  { prof: 'Arquitecto/a', edu: 'Arquitectura', conf: '90%' },
                  { prof: 'Ingeniero/a', edu: 'Ingeniería', conf: '80%' },
                  { prof: 'Catedrático/a', edu: 'Doctorado', conf: '70%' },
                ].map((rule) => (
                  <div key={rule.prof} className="flex items-center gap-2">
                    <span className="text-muted-foreground">{rule.prof}</span>
                    <span className="text-main">→</span>
                    <span>{rule.edu}</span>
                    <span className="text-xs text-muted-foreground ml-auto">({rule.conf})</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-foreground text-background p-4 mt-4">
              <p className="text-sm">
                <strong>Las inferencias no se aplican automáticamente.</strong> Se almacenan con su nivel de confianza para revisión humana antes de incorporarse al dataset.
              </p>
            </div>
            <div className="bg-muted p-4 mt-4 font-mono text-xs overflow-x-auto">
              <pre>{`{
  "education_inference": {
    "inferred_education": "Licenciado en Derecho",
    "inference_rule": "profession_requires_degree",
    "confidence": 0.95,
    "applied": false,
    "reviewed_by": null,
    "approved": null
  }
}`}</pre>
            </div>
          </div>
        </section>

        {/* Legislaturas (moved to end) */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Legislaturas Disponibles
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-2xl">I</div>
              <div className="text-sm font-bold">1979-1982</div>
              <div className="text-xs text-muted-foreground mt-1">
                615 parlamentarios. Primera legislatura democrática.
              </div>
            </div>
            <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="font-heading text-main text-2xl">XV</div>
              <div className="text-sm font-bold">2023-presente</div>
              <div className="text-xs text-muted-foreground mt-1">
                642 parlamentarios (350 diputados + 273 senadores + 19 bajas). Legislatura actual.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/representantes"
            className="px-6 py-3 bg-main text-background font-bold uppercase tracking-wide border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
          >
            Ver datos &rarr;
          </Link>
          <Link
            href="/api/representantes/export?format=json"
            className="px-6 py-3 bg-background text-foreground font-bold uppercase tracking-wide border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
          >
            Descargar JSON
          </Link>
        </div>
      </div>
    </div>
  );
}
