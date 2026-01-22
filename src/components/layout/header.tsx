'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Representantes', href: '/representantes' },
  { name: 'Manifiesto', href: '/manifiesto' },
];

export function Header() {
  const pathname = usePathname();

  // Hide header on homepage
  if (pathname === '/') {
    return null;
  }

  return (
    <header className="border-b-3 border-border bg-background sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="font-heading text-lg sm:text-xl uppercase tracking-tight hover:text-main transition-colors">
            Datomania
          </Link>

          <div className="flex gap-4 sm:gap-8">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors hover:text-main',
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
