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
    const numbers = value.replace(/\D/g, '');
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
      {/* iOS Style Toggle */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-body text-label-primary">Ativar integração</span>
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`
            relative w-[51px] h-[31px] rounded-full
            transition-colors duration-fast ease-apple
            ${enabled ? 'bg-apple-green' : 'bg-gray-4'}
          `}
        >
          <span
            className={`
              absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full
              shadow-sm transition-transform duration-fast ease-apple
              ${enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'}
            `}
          />
        </button>
      </label>

      {enabled && (
        <div className="space-y-3">
          <Input
            label="Número do WhatsApp"
            placeholder="5511999999999"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
          />
          <p className="text-caption1 text-label-tertiary">
            Digite com código do país e DDD, sem espaços.
            Exemplo: 5511999999999
          </p>
        </div>
      )}

      {message && (
        <div
          className={`p-3 rounded-lg text-subhead text-center ${
            message.type === 'success'
              ? 'bg-apple-green/10 text-apple-green'
              : 'bg-apple-red/10 text-apple-red'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button onClick={handleSave} isLoading={isLoading} className="w-full">
        Salvar
      </Button>
    </div>
  );
}
