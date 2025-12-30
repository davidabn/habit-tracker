'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HabitForm } from './habit-form';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
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
      <Button onClick={() => setShowForm(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Novo Hábito
      </Button>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">
              Você ainda não tem hábitos cadastrados.
            </p>
            <p className="text-gray-500 text-sm">
              Clique em "Novo Hábito" para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {activeHabits.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Ativos ({activeHabits.length})
              </h2>
              <div className="space-y-2">
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
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Inativos ({inactiveHabits.length})
              </h2>
              <div className="space-y-2 opacity-60">
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
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{habit.name}</h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm text-gray-500">{frequencyLabel}</span>
          {habit.reminder_time && (
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {habit.reminder_time.slice(0, 5)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
