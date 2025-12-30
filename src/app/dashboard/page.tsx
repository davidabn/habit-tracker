import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HabitList } from '@/components/habits/habit-list';
import { ProgressRing } from '@/components/dashboard/progress-ring';
import { Card, CardContent } from '@/components/ui/card';
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

  const completed = habits.filter((h) => h.is_completed_today).length;
  const total = habits.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

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

      {/* Progress Card */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-6">
            <ProgressRing percentage={percentage} />
            <div>
              <p className="text-large-title text-label-primary">
                {completed}/{total}
              </p>
              <p className="text-body text-label-secondary">
                {completed === total && total > 0
                  ? 'Todos concluídos!'
                  : `${total - completed} restante${total - completed !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habit List */}
      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-body text-label-secondary mb-4">
              Você ainda não tem hábitos cadastrados.
            </p>
            <a
              href="/dashboard/habits"
              className="text-apple-blue font-semibold hover:opacity-80"
            >
              Criar primeiro hábito
            </a>
          </CardContent>
        </Card>
      ) : (
        <HabitList habits={habits} />
      )}
    </div>
  );
}
