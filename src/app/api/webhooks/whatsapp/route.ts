import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { parseIntent, findHabitByName } from '@/lib/whatsapp/intent-router';
import { sendMessage, extractPhoneFromJid } from '@/lib/whatsapp/evolution-client';
import * as responses from '@/lib/whatsapp/responses';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface EvolutionWebhook {
  event: string;
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    message?: {
      conversation?: string;
      extendedTextMessage?: {
        text: string;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EvolutionWebhook;

    // DEBUG: Log do payload completo
    console.log('[WhatsApp] Event:', body.event);
    console.log('[WhatsApp] Full payload:', JSON.stringify(body, null, 2));

    // Ignora eventos que não são mensagens recebidas
    if (body.event !== 'messages.upsert') {
      console.log('[WhatsApp] Ignoring event:', body.event);
      return NextResponse.json({ ok: true });
    }

    // Ignora mensagens enviadas por nós
    if (body.data.key.fromMe) {
      return NextResponse.json({ ok: true });
    }

    const phone = extractPhoneFromJid(body.data.key.remoteJid);
    const messageText =
      body.data.message?.conversation ||
      body.data.message?.extendedTextMessage?.text ||
      '';

    if (!messageText) {
      return NextResponse.json({ ok: true });
    }

    console.log(`[WhatsApp] Message from ${phone}: ${messageText}`);

    // Processa a mensagem
    await processMessage(phone, messageText);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function processMessage(phone: string, message: string) {
  const supabase = getSupabaseClient();

  console.log(`[WhatsApp] Processing message from phone: "${phone}"`);

  try {
    // Busca usuário pelo telefone
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, whatsapp_enabled, phone')
      .eq('phone', phone)
      .single();

    console.log(`[WhatsApp] Profile query result:`, { profile, error: profileError });

    if (!profile || !profile.whatsapp_enabled) {
      console.log(`[WhatsApp] User not found or disabled for phone: ${phone}`);
      // DEBUG: Buscar todos os perfis para comparar
      const { data: allProfiles } = await supabase.from('profiles').select('phone, whatsapp_enabled');
      console.log(`[WhatsApp] All profiles in DB:`, allProfiles);
      return;
    }

    const userId = profile.id;
    const today = format(new Date(), 'yyyy-MM-dd');

    // Busca hábitos do usuário
    const { data: habits } = await supabase
      .from('habits')
      .select(`
        id,
        name,
        logs:habit_logs(completed_at)
      `)
      .eq('user_id', userId)
      .eq('is_active', true);

    if (!habits) {
      await sendMessage({ phone, text: responses.errorMessage() });
      return;
    }

    const habitsWithStatus = habits.map((h) => ({
      id: h.id,
      name: h.name,
      is_completed_today: h.logs?.some(
        (log: { completed_at: string }) => log.completed_at === today
      ) || false,
    }));

    // Parse intent
    const { intent, confidence } = parseIntent(message);

    console.log(`[WhatsApp] Intent: ${intent.type}, confidence: ${confidence}`);

    switch (intent.type) {
      case 'mark_done':
        await handleMarkDone(supabase, phone, userId, habitsWithStatus, intent.habitName, today);
        break;

      case 'list_pending':
        await sendMessage({ phone, text: responses.listPendingHabits(habitsWithStatus) });
        break;

      case 'status':
        await sendMessage({ phone, text: responses.statusMessage(habitsWithStatus) });
        break;

      case 'help':
        await sendMessage({ phone, text: responses.helpMessage() });
        break;

      default:
        await sendMessage({ phone, text: responses.unknownCommand() });
    }
  } catch (error) {
    console.error('[WhatsApp] Error processing message:', error);
    await sendMessage({ phone, text: responses.errorMessage() });
  }
}

async function handleMarkDone(
  supabase: ReturnType<typeof getSupabaseClient>,
  phone: string,
  userId: string,
  habits: Array<{ id: string; name: string; is_completed_today: boolean }>,
  habitName?: string,
  today?: string
) {
  const pendingHabits = habits.filter((h) => !h.is_completed_today);

  if (pendingHabits.length === 0) {
    await sendMessage({
      phone,
      text: '🎉 Todos os hábitos já foram concluídos hoje!',
    });
    return;
  }

  let targetHabit: { id: string; name: string } | null = null;

  if (habitName) {
    // Usuário especificou qual hábito
    targetHabit = findHabitByName(pendingHabits, habitName);

    if (!targetHabit) {
      // Tenta buscar em todos os hábitos (mesmo os já feitos)
      const alreadyDone = findHabitByName(
        habits.filter((h) => h.is_completed_today),
        habitName
      );

      if (alreadyDone) {
        await sendMessage({ phone, text: responses.habitAlreadyDone(alreadyDone.name) });
      } else {
        await sendMessage({ phone, text: responses.habitNotFound(habitName) });
      }
      return;
    }
  } else if (pendingHabits.length === 1) {
    // Apenas um hábito pendente, marca automaticamente
    targetHabit = pendingHabits[0];
  } else {
    // Múltiplos hábitos pendentes, pergunta qual
    await sendMessage({ phone, text: responses.askWhichHabit(habits) });
    return;
  }

  // Marca o hábito como feito
  const { error } = await supabase.from('habit_logs').insert({
    habit_id: targetHabit.id,
    completed_at: today,
    source: 'whatsapp',
  });

  if (error) {
    console.error('[WhatsApp] Error marking habit:', error);
    await sendMessage({ phone, text: responses.errorMessage() });
    return;
  }

  await sendMessage({ phone, text: responses.habitMarkedDone(targetHabit.name) });

  // Verifica se completou todos
  const remainingPending = pendingHabits.filter((h) => h.id !== targetHabit!.id);
  if (remainingPending.length === 0) {
    setTimeout(async () => {
      await sendMessage({ phone, text: '🏆 Dia perfeito! Todos os hábitos concluídos!' });
    }, 1000);
  }
}

// Handler para verificação de webhook (GET)
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'habit-tracker-whatsapp' });
}
