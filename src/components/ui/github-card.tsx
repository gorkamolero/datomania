interface GitHubCardProps {
  href: string;
}

export function GitHubCard({ href }: GitHubCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="p-8 bg-foreground text-background border-3 border-border shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_0px_#000] transition-all">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-tight">
                Open Source
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border border-background/30 p-3">
                <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-1">Código</p>
                <p className="font-medium">Auditable</p>
              </div>
              <div className="border border-background/30 p-3">
                <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-1">Datos</p>
                <p className="font-medium">JSON · CSV · API</p>
              </div>
              <div className="border border-background/30 p-3">
                <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-1">Licencia</p>
                <p className="font-medium">MIT</p>
              </div>
            </div>

            <p className="text-sm opacity-70 mb-4">
              ¿Ves un error? ¿Tienes datos? ¿Quieres añadir un proyecto?
            </p>

            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide border-b border-background/50 pb-1">
              Ver el código en GitHub
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>

          <svg className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 opacity-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </div>
      </div>
    </a>
  );
}
