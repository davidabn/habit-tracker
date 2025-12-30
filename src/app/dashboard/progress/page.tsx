import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { ProgressDashboard } from '@/components/progress/progress-dashboard';
import { Card, CardContent } from '@/components/ui/card';
import type { HabitWithLogs } from '@/types';

async function getHabitsWithAllLogs(): Promise<HabitWithLogs[]> {
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

export default async function ProgressPage() {
  const habits = await getHabitsWithAllLogs();

  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-large-title text-label-primary">Progresso</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-body text-label-secondary mb-4">
              Voce ainda nao tem habitos cadastrados.
            </p>
            <a
              href="/dashboard/habits"
              className="text-apple-blue font-semibold hover:opacity-80"
            >
              Criar primeiro habito
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ProgressDashboard habits={habits} />;
}
