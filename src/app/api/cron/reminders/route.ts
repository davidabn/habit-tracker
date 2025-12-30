import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { sendMessage } from '@/lib/whatsapp/evolution-client';
import { reminderMessage } from '@/lib/whatsapp/responses';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  // Verifica secret para proteger o endpoint
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const currentHour = format(now, 'HH:00');
    const today = format(now, 'yyyy-MM-dd');

    console.log(`[Cron] Running reminders for ${currentHour}`);

    // Busca hábitos com lembrete nessa hora que ainda não foram feitos hoje
    const supabase = getSupabaseClient();
    const { data: habits, error } = await supabase
      .from('habits')
      .select(`
        id,
        name,
        reminder_time,
        user:profiles!habits_user_id_fkey(
          id,
          phone,
          whatsapp_enabled
        ),
        logs:habit_logs(completed_at)
      `)
      .eq('is_active', true)
      .not('reminder_time', 'is', null)
      .gte('reminder_time', currentHour)
      .lt('reminder_time', format(new Date(now.getTime() + 60 * 60 * 1000), 'HH:00'));

    if (error) {
      console.error('[Cron] Error fetching habits:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let sent = 0;
    let skipped = 0;

    for (const habit of habits || []) {
      // Verifica se já foi feito hoje
      const logs = habit.logs as Array<{ completed_at: string }> | null;
      const doneToday = logs?.some(
        (log) => log.completed_at === today
      );

      if (doneToday) {
        skipped++;
        continue;
      }

      // Verifica se usuário tem WhatsApp habilitado
      // Supabase retorna array para joins, pegamos o primeiro item
      const userArray = habit.user as Array<{ id: string; phone: string | null; whatsapp_enabled: boolean }> | null;
      const user = userArray?.[0];
      if (!user?.whatsapp_enabled || !user?.phone) {
        skipped++;
        continue;
      }

      // Envia lembrete
      const success = await sendMessage({
        phone: user.phone,
        text: reminderMessage(habit.name),
      });

      if (success) {
        sent++;
        console.log(`[Cron] Reminder sent for "${habit.name}" to ${user.phone}`);
      } else {
        console.error(`[Cron] Failed to send reminder for "${habit.name}"`);
      }

      // Pequeno delay entre mensagens para não sobrecarregar
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`[Cron] Completed: ${sent} sent, ${skipped} skipped`);

    return NextResponse.json({
      ok: true,
      hour: currentHour,
      sent,
      skipped,
    });
  } catch (error) {
    console.error('[Cron] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
