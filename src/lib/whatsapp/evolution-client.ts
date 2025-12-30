const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE;

interface SendMessageOptions {
  phone: string;
  text: string;
}

interface SendButtonsOptions {
  phone: string;
  text: string;
  buttons: Array<{
    buttonId: string;
    buttonText: { displayText: string };
  }>;
}

export async function sendMessage({ phone, text }: SendMessageOptions): Promise<boolean> {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE) {
    console.error('Evolution API not configured');
    return false;
  }

  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: phone,
          text,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Error sending WhatsApp message:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

export async function sendButtons({ phone, text, buttons }: SendButtonsOptions): Promise<boolean> {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE) {
    console.error('Evolution API not configured');
    return false;
  }

  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/message/sendButtons/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: phone,
          title: '',
          description: text,
          buttons,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Error sending WhatsApp buttons:', error);
      // Fallback para mensagem simples
      return sendMessage({ phone, text });
    }

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp buttons:', error);
    return sendMessage({ phone, text });
  }
}

export function formatPhoneForWhatsApp(phone: string): string {
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');

  // Adiciona @s.whatsapp.net se necessário
  return `${numbers}@s.whatsapp.net`;
}

export function extractPhoneFromJid(jid: string): string {
  // Remove @s.whatsapp.net
  return jid.replace('@s.whatsapp.net', '').replace('@c.us', '');
}
