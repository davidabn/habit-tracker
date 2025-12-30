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
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Conta</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <img src="https://res.cloudinary.com/dq0sp4wc2/image/upload/v1767068699/pngegg_b0cfmf.png" alt="WhatsApp" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">WhatsApp</h2>
              <p className="text-sm text-gray-500">
                Configure a integração com WhatsApp
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WhatsAppSettings
            phone={profile?.phone || ''}
            enabled={profile?.whatsapp_enabled || false}
          />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="py-6">
          <h3 className="font-medium text-gray-900 mb-3">
            Como usar pelo WhatsApp
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <strong>"feito"</strong> - Marca o único hábito pendente como concluído
            </li>
            <li>
              <strong>"feito leitura"</strong> - Marca o hábito "Leitura" como concluído
            </li>
            <li>
              <strong>"pendentes"</strong> ou <strong>"o que falta?"</strong> - Lista hábitos pendentes
            </li>
            <li>
              <strong>"progresso"</strong> ou <strong>"como estou?"</strong> - Mostra seu progresso do dia
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
