export type Frequency = 'daily' | 'weekly' | 'custom';
export type LogSource = 'web' | 'whatsapp';

export interface Profile {
  id: string;
  phone: string | null;
  whatsapp_enabled: boolean;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  frequency: Frequency;
  target_per_week: number;
  reminder_time: string | null;
  is_active: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
  source: LogSource;
  created_at: string;
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
  is_completed_today: boolean;
}

export interface DailyProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface WeeklyProgress {
  habit_id: string;
  habit_name: string;
  target: number;
  completed: number;
  days: boolean[];
}
