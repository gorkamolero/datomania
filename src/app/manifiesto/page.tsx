import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Manifiesto',
  description:
    'Por qué hemos hecho esto. O cómo descubrimos que saber si tu diputado terminó la carrera es más difícil que conseguir una cita en el médico de cabecera.',
};

export default function ManifiestoPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main mb-8 inline-block"
        >
          &larr; Volver
        </Link>

        <h1 className="text-4xl md:text-5xl font-heading mb-2">
          Por qué hemos hecho esto
        </h1>
        <p className="text-lg font-medium text-muted-foreground mb-12">
          O cómo descubrimos que saber si tu diputado terminó la carrera es más
          difícil que conseguir una cita en el médico de cabecera
        </p>

        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <p className="text-lg font-medium">
            En España tenemos 616 parlamentarios. Cobran de lo público. Votan
            leyes que nos afectan a todos. Y sin embargo, si quieres saber algo
            tan básico como si estudiaron o qué hacían antes de dedicarse a
            esto, prepárate para un safari digital que haría llorar a Indiana
            Jones.
          </p>

          <p className="font-medium">
            <strong className="text-main">
              El problema no es que la información no exista. El problema es que
              nadie se ha molestado en juntarla.
            </strong>
          </p>

          <p>
            Hemos visto artículos de periódicos serios —sí, de esos que pagan a
            redactores— publicando análisis sobre &ldquo;el perfil educativo del
            Congreso&rdquo; basados en... ¿qué exactamente? En datos parciales.
            En lo que pillaron a mano. En fichas oficiales que, sorpresa, no
            están obligadas a incluir formación académica.
          </p>

          <p>
            Hemos visto portales de transparencia que ocultan los datos
            educativos de un cargo público cuando termina su mandato. Como si el
            derecho a saber caducara como un yogur.
          </p>

          <p>
            Hemos visto a Wikipedia en catalán saber más sobre un diputado que
            la propia web del Congreso.
          </p>

          <p>
            Y nos hemos preguntado:{' '}
            <em>
              ¿de verdad nadie ha mandado unos cuantos agentes a rastrear esto
              sistemáticamente?
            </em>
          </p>

          <p className="font-bold">Pues no. Nadie. Hasta ahora.</p>

          {/* Lo que hemos descubierto */}
          <div className="bg-muted border-2 border-border p-6 my-8">
            <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
              Lo que hemos descubierto
            </h2>
            <ul className="space-y-3 list-none p-0 m-0">
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>
                  El 23% de los parlamentarios con datos desconocidos son
                  alcaldes rurales con 20+ años en el cargo. Nadie les ha
                  preguntado desde entonces.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>
                  Hay diputados cuya Wikipedia dice que tienen carrera, pero
                  ninguna fuente oficial lo confirma.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>
                  El Presidente del Senado tuvo que corregir su currículum
                  público en 2025 porque le pillaron inflándolo.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>
                  Un senador del PSOE fue denunciado por falsificar su título de
                  Derecho. El Gobierno Vasco archivó la denuncia.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-main font-bold">→</span>
                <span>
                  El 70% de los 23 parlamentarios que investigamos a fondo no
                  tiene NINGÚN dato educativo público verificable.
                </span>
              </li>
            </ul>
          </div>

          {/* Qué hemos hecho */}
          <h2 className="text-xl font-heading uppercase tracking-tight mt-12 mb-4">
            Qué hemos hecho
          </h2>
          <ol className="space-y-2 list-none p-0 m-0">
            <li className="flex gap-3">
              <span className="font-bold text-main">1.</span>
              <span>Scrapeamos las fichas oficiales del Congreso y el Senado</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-main">2.</span>
              <span>
                Cruzamos con Wikipedia, LinkedIn, webs de partidos, portales
                municipales
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-main">3.</span>
              <span>
                Mandamos agentes de investigación a buscar los casos dudosos
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-main">4.</span>
              <span>
                Documentamos cada fuente, cada hallazgo, cada
                &ldquo;No_consta&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-main">5.</span>
              <span>Publicamos todo en abierto</span>
            </li>
          </ol>

          <p className="text-2xl font-heading mt-8">
            616 parlamentarios. Una base de datos. Verificable.
          </p>

          {/* El mensaje */}
          <div className="border-l-4 border-main pl-6 my-12 space-y-4">
            <h2 className="text-xl font-heading uppercase tracking-tight mb-4">
              El mensaje
            </h2>
            <p>
              <strong>A los periódicos:</strong> dejad de publicar porcentajes
              basados en muestras incompletas. Los datos están aquí. Son gratis.
              Usadlos.
            </p>
            <p>
              <strong>A los partidos:</strong> si vuestros candidatos no quieren
              decir qué estudiaron, igual deberíais preguntaros por qué.
            </p>
            <p>
              <strong>A los portales de transparencia:</strong> la transparencia
              no caduca. Si alguien fue cargo público, su información básica
              debería ser accesible para siempre.
            </p>
          </div>

          <p className="text-lg font-bold bg-foreground text-background p-6 -mx-4">
            Y a quien diga que esto no se puede hacer: lo acabamos de hacer con
            un LLM y unas cuantas horas de trabajo.
            <br />
            <br />
            Si nosotros podemos, vosotros también. La única excusa es no querer.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t-2 border-border">
          <Link
            href="/representantes"
            className="inline-block px-6 py-3 bg-main text-background font-bold uppercase tracking-wide border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
          >
            Ver los datos &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
