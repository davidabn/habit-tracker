import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  frequency: z.enum(['daily', 'weekly', 'custom'], {
    errorMap: () => ({ message: 'Frequência inválida' }),
  }),
  target_per_week: z.number().min(1).max(7).default(7),
  reminder_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido')
    .optional()
    .nullable(),
});

export const updateHabitSchema = createHabitSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export const createLogSchema = z.object({
  habit_id: z.string().uuid('ID do hábito inválido'),
  completed_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .optional(),
  source: z.enum(['web', 'whatsapp']).default('web'),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type CreateLogInput = z.infer<typeof createLogSchema>;
