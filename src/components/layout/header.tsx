'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Proyectos', href: '/' },
  { name: 'Representantes', href: '/representantes' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b-3 border-border bg-background sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-heading text-xl uppercase tracking-tight hover:text-main transition-colors">
            Datocracia
          </Link>

          <div className="flex gap-8">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-bold uppercase tracking-wide transition-colors hover:text-main',
                    isActive ? 'text-main' : 'text-foreground'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
