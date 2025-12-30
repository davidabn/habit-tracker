import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { WhatsAppSettings } from '@/components/dashboard/whatsapp-settings';
import { User } from 'lucide-react';

async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}

export default async function SettingsPage() {
  const data = await getProfile();

  if (!data) return null;

  const { user, profile } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-large-title text-label-primary">Ajustes</h1>

      {/* Account Info - iOS Grouped List Style */}
      <div className="bg-bg-primary rounded-card overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-gray-5 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body text-label-primary font-medium">Conta</p>
            <p className="text-subhead text-label-secondary truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* WhatsApp Settings - iOS Grouped List Style */}
      <div>
        <p className="text-footnote text-label-secondary uppercase tracking-wide px-4 mb-2">
          Integrações
        </p>
        <div className="bg-bg-primary rounded-card overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-separator">
            <div className="w-10 h-10 bg-apple-green/10 rounded-full flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dq0sp4wc2/image/upload/v1767068699/pngegg_b0cfmf.png"
                alt="WhatsApp"
                className="w-5 h-5"
              />
            </div>
            <div>
              <p className="text-body text-label-primary font-medium">WhatsApp</p>
              <p className="text-subhead text-label-secondary">
                Configure lembretes e comandos
              </p>
            </div>
          </div>
          <div className="px-4 py-4">
            <WhatsAppSettings
              phone={profile?.phone || ''}
              enabled={profile?.whatsapp_enabled || false}
            />
          </div>
        </div>
      </div>

      {/* Instructions - iOS Grouped List Style */}
      <div>
        <p className="text-footnote text-label-secondary uppercase tracking-wide px-4 mb-2">
          Como usar pelo WhatsApp
        </p>
        <div className="bg-bg-primary rounded-card overflow-hidden divide-y divide-separator">
          <CommandItem
            command='"feito"'
            description="Marca o único hábito pendente como concluído"
          />
          <CommandItem
            command='"feito leitura"'
            description='Marca o hábito "Leitura" como concluído'
          />
          <CommandItem
            command='"pendentes"'
            description="Lista hábitos pendentes do dia"
          />
          <CommandItem
            command='"progresso"'
            description="Mostra seu progresso do dia"
          />
        </div>
      </div>
    </div>
  );
}

function CommandItem({ command, description }: { command: string; description: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-body text-label-primary font-medium">{command}</p>
      <p className="text-subhead text-label-secondary">{description}</p>
    </div>
  );
}
