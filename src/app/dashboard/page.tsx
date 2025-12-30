import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import type { HabitWithLogs } from '@/types';

async function getHabitsWithLogs(): Promise<HabitWithLogs[]> {
  const supabase = await createClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: habits, error } = await supabase
    .from('habits')
    .select(`
      *,
      logs:habit_logs(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error || !habits) {
    console.error('Error fetching habits:', error);
    return [];
  }

  return habits.map((habit) => ({
    ...habit,
    logs: habit.logs || [],
    is_completed_today: habit.logs?.some(
      (log: { completed_at: string }) => log.completed_at === today
    ) || false,
  }));
}

export default async function DashboardPage() {
  const habits = await getHabitsWithLogs();
  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-large-title text-label-primary capitalize">
          {format(today, "EEEE", { locale: ptBR })}
        </h1>
        <p className="text-title3 text-label-secondary mt-1">
          {format(today, "d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Dashboard Content (Client Component) */}
      <DashboardContent initialHabits={habits} />
    </div>
  );
}
