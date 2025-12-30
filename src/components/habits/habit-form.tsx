'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import type { Habit, Frequency } from '@/types';

interface HabitFormProps {
  habit?: Habit;
  onClose: () => void;
}

export function HabitForm({ habit, onClose }: HabitFormProps) {
  const router = useRouter();
  const isEditing = !!habit;

  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [frequency, setFrequency] = useState<Frequency>(habit?.frequency || 'daily');
  const [targetPerWeek, setTargetPerWeek] = useState(habit?.target_per_week || 7);
  const [reminderTime, setReminderTime] = useState(habit?.reminder_time || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      // Garantir que o profile existe antes de inserir o hábito
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: user.id });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          setError('Erro ao criar perfil. Tente novamente.');
          return;
        }
      }

      const habitData = {
        name: name.trim(),
        description: description.trim() || null,
        frequency,
        target_per_week: frequency === 'daily' ? 7 : targetPerWeek,
        reminder_time: reminderTime || null,
        user_id: user.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('habits')
          .update(habitData)
          .eq('id', habit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('habits')
          .insert(habitData);

        if (error) throw error;
      }

      router.refresh();
      onClose();
    } catch (err) {
      console.error('Error saving habit:', err);
      setError('Erro ao salvar hábito. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Hábito' : 'Novo Hábito'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Nome do hábito"
            placeholder="Ex: Ler 30 minutos"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
              placeholder="Detalhes adicionais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequência
            </label>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`
                    flex-1 py-2 px-3 text-sm rounded-lg border transition-colors
                    ${frequency === freq
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {freq === 'daily' && 'Diário'}
                  {freq === 'weekly' && 'Semanal'}
                  {freq === 'custom' && 'Personalizado'}
                </button>
              ))}
            </div>
          </div>

          {frequency === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vezes por semana
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={targetPerWeek}
                onChange={(e) => setTargetPerWeek(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          <Input
            label="Horário do lembrete (opcional)"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1"
            >
              {isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
