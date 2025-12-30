'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListTodo, Settings } from 'lucide-react';
import { LogoutButton } from '@/components/dashboard/logout-button';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header - iOS Style */}
      <header className="bg-bg-primary/80 backdrop-blur-xl border-b border-separator sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-[44px] flex justify-between items-center">
          <Link href="/dashboard" className="text-headline text-label-primary">
            Habit Tracker
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      {/* Tab Bar - iOS Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-primary/80 backdrop-blur-xl border-t border-separator z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-49">
          <TabBarItem
            href="/dashboard"
            icon={<Home className="w-6 h-6" />}
            label="Hoje"
            isActive={pathname === '/dashboard'}
          />
          <TabBarItem
            href="/dashboard/habits"
            icon={<ListTodo className="w-6 h-6" />}
            label="Hábitos"
            isActive={pathname === '/dashboard/habits'}
          />
          <TabBarItem
            href="/dashboard/settings"
            icon={<Settings className="w-6 h-6" />}
            label="Ajustes"
            isActive={pathname === '/dashboard/settings'}
          />
        </div>
      </nav>
    </div>
  );
}

function TabBarItem({
  href,
  icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-center justify-center
        min-w-44 min-h-44 px-3
        transition-colors duration-fast ease-apple
        ${isActive ? 'text-apple-blue' : 'text-gray'}
      `}
    >
      {icon}
      <span className="text-caption2 mt-1 font-medium">{label}</span>
    </Link>
  );
}
