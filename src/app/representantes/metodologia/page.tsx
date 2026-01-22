import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metodología Representantes - Fuentes y proceso',
  description: 'Cómo recopilamos datos de 599 parlamentarios: APIs de Congreso.es y Senado.es, clasificación de educación y profesión, verificación cruzada.',
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
                Datos abiertos en formato JSON actualizados diariamente.
              </p>
              <code className="text-xs bg-muted px-2 py-1 border border-border block overflow-x-auto">
                https://www.congreso.es/es/opendata/diputados
              </code>
            </div>
            <div>
              <h3 className="font-bold mb-2">Senado</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Fichas XML individuales por senador.
              </p>
              <code className="text-xs bg-muted px-2 py-1 border border-border block overflow-x-auto">
                https://www.senado.es/web/ficopendataservlet?tipoFich=1&amp;cod=XXXXX&amp;legis=15
              </code>
            </div>
          </div>
        </section>

        {/* Investigación complementaria */}
        <section className="mb-12">
          <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
            Investigación Complementaria
          </h2>
          <div className="bg-muted border-2 border-border p-6 space-y-4">
            <p>
              Cuando las fuentes oficiales no incluyen información educativa o
              profesional, enviamos <strong>agentes de investigación LLM</strong>{' '}
              a buscar en:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>Wikipedia (español, catalán, euskera, gallego)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>LinkedIn</span>
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
                <span>Hemerotecas digitales</span>
              </li>
            </ul>
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
            Actualización
          </h2>
          <div className="bg-foreground text-background p-6">
            <p className="mb-2">
              <strong>Frecuencia:</strong> Mensual (cron automatizado)
            </p>
            <p className="mb-2">
              <strong>Trigger:</strong> Solo si hay cambios en la composición oficial
            </p>
            <p>
              <strong>Política:</strong> Parlamentarios ya investigados no se re-procesan
            </p>
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
