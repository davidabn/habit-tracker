'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { HabitForm } from './habit-form';
import { Plus, ChevronRight, Clock, Trash2 } from 'lucide-react';
import type { Habit } from '@/types';

interface HabitsManagerProps {
  habits: Habit[];
}

export function HabitsManager({ habits }: HabitsManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este hábito?')) return;

    setDeletingId(id);
    try {
      const supabase = createClient();
      await supabase.from('habits').delete().eq('id', id);
      router.refresh();
    } catch (error) {
      console.error('Error deleting habit:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  const activeHabits = habits.filter((h) => h.is_active);
  const inactiveHabits = habits.filter((h) => !h.is_active);

  const frequencyLabel = (habit: Habit) => {
    if (habit.frequency === 'daily') return 'Diário';
    if (habit.frequency === 'weekly') return 'Semanal';
    return `${habit.target_per_week}x por semana`;
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
        <Plus className="w-5 h-5 mr-2" />
        Novo Hábito
      </Button>

      {habits.length === 0 ? (
        <div className="bg-bg-primary rounded-card p-8 text-center">
          <p className="text-body text-label-secondary mb-2">
            Você ainda não tem hábitos cadastrados.
          </p>
          <p className="text-subhead text-label-tertiary">
            Clique em "Novo Hábito" para começar.
          </p>
        </div>
      ) : (
        <>
          {activeHabits.length > 0 && (
            <div>
              <p className="text-footnote text-label-secondary uppercase tracking-wide px-4 mb-2">
                Ativos ({activeHabits.length})
              </p>
              <div className="bg-bg-primary rounded-card overflow-hidden divide-y divide-separator">
                {activeHabits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    frequencyLabel={frequencyLabel(habit)}
                    onEdit={() => handleEdit(habit)}
                    onDelete={() => handleDelete(habit.id)}
                    isDeleting={deletingId === habit.id}
                  />
                ))}
              </div>
            </div>
          )}

          {inactiveHabits.length > 0 && (
            <div>
              <p className="text-footnote text-label-secondary uppercase tracking-wide px-4 mb-2">
                Inativos ({inactiveHabits.length})
              </p>
              <div className="bg-bg-primary rounded-card overflow-hidden divide-y divide-separator opacity-60">
                {inactiveHabits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    frequencyLabel={frequencyLabel(habit)}
                    onEdit={() => handleEdit(habit)}
                    onDelete={() => handleDelete(habit.id)}
                    isDeleting={deletingId === habit.id}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showForm && (
        <HabitForm
          habit={editingHabit || undefined}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

function HabitRow({
  habit,
  frequencyLabel,
  onEdit,
  onDelete,
  isDeleting,
}: {
  habit: Habit;
  frequencyLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex items-center">
      <button
        onClick={onEdit}
        className="flex-1 flex items-center gap-3 px-4 py-3 text-left active:bg-bg-secondary transition-colors duration-fast"
      >
        <div className="flex-1 min-w-0">
          <p className="text-body text-label-primary truncate">{habit.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-subhead text-label-secondary">{frequencyLabel}</span>
            {habit.reminder_time && (
              <span className="flex items-center gap-1 text-subhead text-label-tertiary">
                <Clock className="w-3 h-3" />
                {habit.reminder_time.slice(0, 5)}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-label-quaternary shrink-0" />
      </button>

      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="px-4 py-3 text-apple-red hover:bg-apple-red/10 transition-colors duration-fast disabled:opacity-50"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
