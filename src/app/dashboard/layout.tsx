import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Home, ListTodo, Settings, LogOut } from 'lucide-react';
import { LogoutButton } from '@/components/dashboard/logout-button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-semibold text-gray-900">
            Habit Tracker
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-48 shrink-0">
          <nav className="space-y-1">
            <NavLink href="/dashboard" icon={<Home className="w-5 h-5" />}>
              Hoje
            </NavLink>
            <NavLink href="/dashboard/habits" icon={<ListTodo className="w-5 h-5" />}>
              Hábitos
            </NavLink>
            <NavLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />}>
              Configurações
            </NavLink>
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-10">
          <div className="flex justify-around py-2">
            <MobileNavLink href="/dashboard" icon={<Home className="w-5 h-5" />}>
              Hoje
            </MobileNavLink>
            <MobileNavLink href="/dashboard/habits" icon={<ListTodo className="w-5 h-5" />}>
              Hábitos
            </MobileNavLink>
            <MobileNavLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />}>
              Config
            </MobileNavLink>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
}

function MobileNavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 px-4 py-1 text-gray-600"
    >
      {icon}
      <span className="text-xs">{children}</span>
    </Link>
  );
}
