# Datomania!

**Datos públicos que deberían existir en España pero no existen.**

Datomania es una plataforma de datos abiertos que recopila, estructura y publica información pública que debería ser accesible pero no lo es. Todo el código es auditable, los datos están disponibles para descarga, y las contribuciones son bienvenidas.

🌐 **Web**: [datomania.vercel.app](https://datomania.vercel.app)  
📦 **Datos**: JSON, CSV, API pública  
📜 **Licencia**: MIT

---

## Proyectos

### Representantes

Educación y profesión de los parlamentarios españoles.

- **Legislaturas**: I (1979-1982) y XV (2023-presente)
- **Cámaras**: Congreso de los Diputados y Senado
- **Datos**: ~1.200 parlamentarios
- **Fuentes**: [congreso.es](https://www.congreso.es), [senado.es](https://www.senado.es)

**Ruta**: `/representantes`

---

## Stack Técnico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Visualización**: Nivo, D3
- **Testing**: Vitest
- **Deploy**: Vercel

---

## Desarrollo

### Requisitos

- Node.js 20+
- pnpm 9+

### Instalación

```bash
git clone https://github.com/gorkamolero/datomania.git
cd datomania
pnpm install
```

### Comandos

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo (puerto 3001) |
| `pnpm build` | Build de producción |
| `pnpm lint` | Linter |
| `pnpm test` | Tests (watch mode) |
| `pnpm test:run` | Tests (single run) |
| `pnpm deploy` | Deploy manual a Vercel |

### Deploy automático

El proyecto usa un hook de git que despliega automáticamente a Vercel en cada push a `main`.

```bash
git push origin main  # Despliega automáticamente
```

---

## Estructura del Proyecto

```
src/
├── app/                    # Rutas Next.js (App Router)
│   ├── api/               # API routes
│   ├── representantes/    # Páginas del proyecto Representantes
│   └── page.tsx           # Homepage
├── components/            # Componentes React
│   ├── layout/           # Header, Footer
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   └── charts/           # Gráficos (Nivo, D3)
├── lib/                   # Utilidades compartidas
└── projects/              # Proyectos de datos
    └── representantes/
        ├── data/         # JSON con datos de parlamentarios
        ├── lib/          # Funciones de acceso a datos
        ├── scripts/      # Scripts de actualización
        └── types/        # TypeScript types
```

### Arquitectura Multi-Proyecto

Cada proyecto de datos es independiente:

```
src/projects/{nombre}/
├── data/           # Datos en JSON
├── lib/            # Funciones de acceso
├── scripts/        # Scripts de scraping/actualización
├── types/          # Types específicos
└── metadata.json   # Metadatos del proyecto
```

---

## API

### Parlamentarios

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/representantes/parlamentarios` | Lista todos los parlamentarios |
| `GET /api/representantes/parlamentarios/[slug]` | Detalle de un parlamentario |
| `GET /api/representantes/stats` | Estadísticas agregadas |
| `GET /api/representantes/export?format=json` | Exportar en JSON |
| `GET /api/representantes/export?format=csv` | Exportar en CSV |

### Partidos

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/partidos` | Lista de partidos políticos |

---

## Datos

### Descarga

- **JSON**: `/api/representantes/export?format=json`
- **CSV**: `/api/representantes/export?format=csv`
- **Raw**: `src/projects/representantes/data/`

### Esquema

```typescript
interface Parlamentario {
  id: string;
  nombre_completo: string;
  camara: 'Congreso' | 'Senado';
  circunscripcion: string;
  partido: string;
  legislatura: 'I' | 'XV';
  estudios_raw: string;
  estudios_nivel: 'Universitario' | 'FP_Tecnico' | 'Secundario' | 'No_consta';
  profesion_raw: string;
  profesion_categoria: string;
  source: 'official' | 'researched';
}
```

### Fuentes oficiales

| Fuente | URL | Datos |
|--------|-----|-------|
| Congreso de los Diputados | [congreso.es](https://www.congreso.es) | Diputados, biografías |
| Senado de España | [senado.es](https://www.senado.es) | Senadores, biografías |

---

## Contribuir

### Reportar errores

Si encuentras un error en los datos:

1. Abre un [issue](https://github.com/gorkamolero/datomania/issues)
2. Indica el nombre del parlamentario y el error
3. Incluye la fuente correcta

### Corregir datos

1. Fork el repositorio
2. Modifica el JSON en `src/projects/representantes/data/`
3. Envía un PR con la fuente

### Proponer nuevo proyecto

¿Hay datos públicos que deberían existir pero no existen?

1. Abre un [issue](https://github.com/gorkamolero/datomania/issues) con tu propuesta
2. Describe qué datos son y por qué importan
3. Indica las fuentes oficiales disponibles

---

## Metodología

La metodología de cada proyecto está documentada en su página correspondiente:

- [Representantes - Metodología](https://datomania.vercel.app/representantes/metodologia)

Incluye:
- Proceso de recopilación
- Clasificación de niveles educativos
- Categorización de profesiones
- Limitaciones conocidas

---

## Scripts de investigación

Para complementar datos faltantes, el proyecto incluye scripts que consultan fuentes externas:

```bash
pnpm research          # Ejecutar worker de investigación
pnpm research:dry      # Dry run (sin guardar cambios)
```

Requiere `PERPLEXITY_API_KEY` en el entorno.

---

## Variables de entorno

```bash
# .env.local
PERPLEXITY_API_KEY=xxx    # Para scripts de investigación (opcional)
```

---

## Licencia

MIT

Usa los datos libremente. Atribución apreciada pero no requerida.

---

## Autor

**Gorka Fernández Molero**  
GitHub: [@gorkamolero](https://github.com/gorkamolero)
