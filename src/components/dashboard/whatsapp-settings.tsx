'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WhatsAppSettingsProps {
  phone: string;
  enabled: boolean;
}

export function WhatsAppSettings({ phone: initialPhone, enabled: initialEnabled }: WhatsAppSettingsProps) {
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    // Limita a 13 dígitos (55 + DDD + número)
    return numbers.slice(0, 13);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage({ type: 'error', text: 'Usuário não autenticado' });
        return;
      }

      // Validar número
      if (enabled && phone.length < 10) {
        setMessage({ type: 'error', text: 'Número de telefone inválido' });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          phone: phone || null,
          whatsapp_enabled: enabled && phone.length >= 10,
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Configurações salvas!' });
      router.refresh();
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-gray-700">Ativar integração com WhatsApp</span>
        </label>
      </div>

      {enabled && (
        <div className="pl-8">
          <Input
            label="Número do WhatsApp"
            placeholder="5511999999999"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
          />
          <p className="mt-1 text-xs text-gray-500">
            Digite com código do país e DDD, sem espaços ou traços.
            <br />
            Exemplo: 5511999999999
          </p>
        </div>
      )}

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-600'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button onClick={handleSave} isLoading={isLoading}>
        Salvar Configurações
      </Button>
    </div>
  );
}
