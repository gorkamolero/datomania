import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen py-12 md:py-20 flex items-center">
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* 404 Big Number */}
        <div className="relative inline-block mb-8">
          <span className="text-[12rem] md:text-[20rem] font-heading leading-none text-main select-none">
            404
          </span>
          <div className="absolute inset-0 text-[12rem] md:text-[20rem] font-heading leading-none text-border translate-x-[6px] translate-y-[6px] -z-10 select-none">
            404
          </div>
        </div>

        {/* Message */}
        <div className="p-8 bg-card border-3 border-border shadow-[6px_6px_0px_0px_#000] mb-8">
          <h1 className="text-3xl md:text-5xl font-heading mb-4">
            Aqui no hay datos
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-md mx-auto">
            Esta pagina no existe. Quiza buscabas otra cosa, o quiza alguien la borro sin avisar.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-main text-main-foreground font-bold uppercase tracking-wide border-3 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Volver al inicio
          </Link>
          <Link
            href="/representantes"
            className="w-full sm:w-auto px-8 py-4 bg-card text-foreground font-bold uppercase tracking-wide border-3 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Ver representantes
          </Link>
        </div>

        {/* Decorative Element */}
        <div className="mt-16 flex justify-center gap-4">
          <div className="w-4 h-4 bg-main border-2 border-border rotate-45" />
          <div className="w-4 h-4 bg-foreground border-2 border-border rotate-45" />
          <div className="w-4 h-4 bg-main border-2 border-border rotate-45" />
        </div>
      </div>
    </div>
  );
}
