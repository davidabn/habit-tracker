'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
      <div className="bg-bg-primary w-full sm:max-w-md sm:rounded-xl rounded-t-xl overflow-hidden">
        {/* Grabber (mobile) */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-9 h-1 bg-label-quaternary rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-separator">
          <button
            onClick={onClose}
            className="text-apple-blue text-body font-normal min-w-[60px] text-left"
          >
            Cancelar
          </button>
          <h2 className="text-headline text-label-primary">
            {isEditing ? 'Editar Hábito' : 'Novo Hábito'}
          </h2>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-apple-blue text-body font-semibold min-w-[60px] text-right disabled:opacity-50"
          >
            {isLoading ? '...' : 'Salvar'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-apple-red/10 rounded-lg text-apple-red text-subhead text-center">
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
            <label className="block text-footnote font-medium text-label-secondary mb-2">
              Descrição (opcional)
            </label>
            <textarea
              className="w-full min-h-[80px] px-4 py-3 bg-bg-secondary rounded-md text-body text-label-primary placeholder:text-label-tertiary border-none outline-none resize-none focus:ring-4 focus:ring-[rgba(0,122,255,0.3)]"
              placeholder="Detalhes adicionais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-footnote font-medium text-label-secondary mb-2">
              Frequência
            </label>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`
                    flex-1 min-h-[36px] px-3 text-subhead font-medium rounded-lg
                    transition-all duration-fast ease-apple
                    ${frequency === freq
                      ? 'bg-apple-blue text-white'
                      : 'bg-bg-secondary text-label-primary'
                    }
                  `}
                >
                  {freq === 'daily' && 'Diário'}
                  {freq === 'weekly' && 'Semanal'}
                  {freq === 'custom' && 'Custom'}
                </button>
              ))}
            </div>
          </div>

          {frequency === 'custom' && (
            <div>
              <label className="block text-footnote font-medium text-label-secondary mb-2">
                Vezes por semana
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={targetPerWeek}
                onChange={(e) => setTargetPerWeek(Number(e.target.value))}
                className="w-full min-h-44 px-4 py-3 bg-bg-secondary rounded-md text-body text-label-primary border-none outline-none focus:ring-4 focus:ring-[rgba(0,122,255,0.3)]"
              />
            </div>
          )}

          <Input
            label="Horário do lembrete (opcional)"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
