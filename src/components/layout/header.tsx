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
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            Datocracia
          </Link>

          <div className="flex gap-6">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm transition-colors hover:text-foreground',
                    isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
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
