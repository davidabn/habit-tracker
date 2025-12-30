import { createClient } from '@/lib/supabase/server';
import { HabitsManager } from '@/components/habits/habits-manager';
import type { Habit } from '@/types';

async function getHabits(): Promise<Habit[]> {
  const supabase = await createClient();

  const { data: habits, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching habits:', error);
    return [];
  }

  return habits || [];
}

export default async function HabitsPage() {
  const habits = await getHabits();

  return (
    <div className="space-y-6">
      <h1 className="text-large-title text-label-primary">Meus Hábitos</h1>
      <HabitsManager habits={habits} />
    </div>
  );
}
