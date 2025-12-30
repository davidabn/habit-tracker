export type Intent =
  | { type: 'mark_done'; habitName?: string }
  | { type: 'list_pending' }
  | { type: 'status' }
  | { type: 'help' }
  | { type: 'unknown' };

interface IntentResult {
  intent: Intent;
  confidence: 'high' | 'medium' | 'low';
}

// Patterns para cada intent
const patterns = {
  mark_done: [
    /^feito$/i,
    /^feito\s+(.+)$/i,
    /^fiz$/i,
    /^fiz\s+(.+)$/i,
    /^concluído$/i,
    /^concluido$/i,
    /^pronto$/i,
    /^ok$/i,
    /^done$/i,
    /^✓$/,
    /^✔$/,
  ],
  list_pending: [
    /^pendentes?$/i,
    /^o que falta\??$/i,
    /^falta$/i,
    /^faltam?$/i,
    /^lista$/i,
    /^listar$/i,
    /^hoje$/i,
  ],
  status: [
    /^status$/i,
    /^progresso$/i,
    /^como (estou|est[aá])\??$/i,
    /^resumo$/i,
    /^como (vai|est[aá]) meu dia\??$/i,
  ],
  help: [
    /^ajuda$/i,
    /^help$/i,
    /^comandos$/i,
    /^\?$/,
    /^oi$/i,
    /^ol[aá]$/i,
    /^bom dia$/i,
    /^boa tarde$/i,
    /^boa noite$/i,
  ],
};

export function parseIntent(message: string): IntentResult {
  const text = message.trim().toLowerCase();

  // Check mark_done patterns
  for (const pattern of patterns.mark_done) {
    const match = text.match(pattern);
    if (match) {
      const habitName = match[1]?.trim();
      return {
        intent: { type: 'mark_done', habitName },
        confidence: 'high',
      };
    }
  }

  // Check list_pending patterns
  for (const pattern of patterns.list_pending) {
    if (pattern.test(text)) {
      return {
        intent: { type: 'list_pending' },
        confidence: 'high',
      };
    }
  }

  // Check status patterns
  for (const pattern of patterns.status) {
    if (pattern.test(text)) {
      return {
        intent: { type: 'status' },
        confidence: 'high',
      };
    }
  }

  // Check help patterns
  for (const pattern of patterns.help) {
    if (pattern.test(text)) {
      return {
        intent: { type: 'help' },
        confidence: 'high',
      };
    }
  }

  // Se não encontrou padrão exato, tenta inferir
  if (text.includes('feito') || text.includes('fiz')) {
    // Extrai o possível nome do hábito
    const habitName = text
      .replace(/feito|fiz|o|a|do|da/gi, '')
      .trim();

    return {
      intent: { type: 'mark_done', habitName: habitName || undefined },
      confidence: 'medium',
    };
  }

  return {
    intent: { type: 'unknown' },
    confidence: 'low',
  };
}

export function findHabitByName(
  habits: Array<{ id: string; name: string }>,
  searchName?: string
): { id: string; name: string } | null {
  if (!searchName) return null;

  const search = searchName.toLowerCase();

  // Primeiro, busca por match exato
  const exactMatch = habits.find(
    (h) => h.name.toLowerCase() === search
  );
  if (exactMatch) return exactMatch;

  // Depois, busca por inclusão
  const partialMatch = habits.find(
    (h) =>
      h.name.toLowerCase().includes(search) ||
      search.includes(h.name.toLowerCase())
  );
  if (partialMatch) return partialMatch;

  // Por fim, busca por palavras similares
  const searchWords = search.split(/\s+/);
  for (const habit of habits) {
    const habitWords = habit.name.toLowerCase().split(/\s+/);
    const hasMatch = searchWords.some((sw) =>
      habitWords.some(
        (hw) => hw.includes(sw) || sw.includes(hw)
      )
    );
    if (hasMatch) return habit;
  }

  return null;
}
