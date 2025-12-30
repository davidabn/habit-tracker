interface HabitInfo {
  name: string;
  is_completed_today: boolean;
}

export function habitMarkedDone(habitName: string): string {
  const emojis = ['✅', '💪', '🎯', '⭐'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return `${emoji} ${habitName} marcado como feito!`;
}

export function habitAlreadyDone(habitName: string): string {
  return `${habitName} já foi feito hoje!`;
}

export function listPendingHabits(habits: HabitInfo[]): string {
  const pending = habits.filter((h) => !h.is_completed_today);

  if (pending.length === 0) {
    return '🎉 Parabéns! Você completou todos os hábitos de hoje!';
  }

  const list = pending.map((h) => `• ${h.name}`).join('\n');
  return `📋 Hábitos pendentes:\n${list}`;
}

export function statusMessage(habits: HabitInfo[]): string {
  const total = habits.length;
  const completed = habits.filter((h) => h.is_completed_today).length;

  if (total === 0) {
    return 'Você ainda não tem hábitos cadastrados.';
  }

  const percentage = Math.round((completed / total) * 100);
  const progressBar = generateProgressBar(percentage);

  let message = `📊 Progresso de hoje:\n${progressBar} ${percentage}%\n\n`;
  message += `${completed}/${total} hábitos concluídos`;

  if (completed === total) {
    message += '\n\n🏆 Dia perfeito!';
  } else {
    const pending = total - completed;
    message += `\n\n${pending} pendente${pending > 1 ? 's' : ''}`;
  }

  return message;
}

export function helpMessage(): string {
  return `📱 *Comandos disponíveis:*

*"feito"* - Marca hábito pendente
*"feito [nome]"* - Marca hábito específico
*"pendentes"* - Lista hábitos pendentes
*"progresso"* - Mostra status do dia
*"ajuda"* - Mostra esta mensagem`;
}

export function askWhichHabit(habits: HabitInfo[]): string {
  const pending = habits.filter((h) => !h.is_completed_today);
  const list = pending.map((h, i) => `${i + 1}. ${h.name}`).join('\n');
  return `Qual hábito você completou?\n\n${list}\n\nResponda com o nome ou número.`;
}

export function habitNotFound(searchName: string): string {
  return `Não encontrei o hábito "${searchName}". Use "pendentes" para ver a lista.`;
}

export function unknownCommand(): string {
  return 'Não entendi. Use "ajuda" para ver os comandos disponíveis.';
}

export function errorMessage(): string {
  return 'Ops! Algo deu errado. Tente novamente.';
}

export function reminderMessage(habitName: string): string {
  return `⏰ Lembrete: ${habitName}\n\nResponda "feito" quando completar!`;
}

function generateProgressBar(percentage: number): string {
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  return '▓'.repeat(filled) + '░'.repeat(empty);
}
