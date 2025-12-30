'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListTodo, Settings } from 'lucide-react';
import { LogoutButton } from '@/components/dashboard/logout-button';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Hoje' },
    { href: '/dashboard/habits', icon: ListTodo, label: 'Hábitos' },
    { href: '/dashboard/settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <header className="bg-bg-primary/80 backdrop-blur-xl border-b border-separator sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-[44px] flex justify-between items-center">
          <Link href="/dashboard" className="text-headline text-label-primary">
            Habit Tracker
          </Link>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-5xl mx-auto flex">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden md:block w-52 shrink-0 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors duration-fast ease-apple
                    ${isActive
                      ? 'bg-apple-blue/10 text-apple-blue'
                      : 'text-label-secondary hover:bg-bg-primary hover:text-label-primary'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-body font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 py-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Tab Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-primary/80 backdrop-blur-xl border-t border-separator z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-49">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center
                  min-w-44 min-h-44 px-3
                  transition-colors duration-fast ease-apple
                  ${isActive ? 'text-apple-blue' : 'text-gray'}
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="text-caption2 mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
