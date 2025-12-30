# Habit Tracker

Aplicativo de rastreamento de hábitos com integração WhatsApp.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Realtime)
- Evolution API (WhatsApp)

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Copie as credenciais do projeto

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# Evolution API (WhatsApp)
EVOLUTION_API_URL=url_da_evolution_api
EVOLUTION_API_KEY=sua_api_key
EVOLUTION_INSTANCE=nome_da_instancia

# Cron (opcional)
CRON_SECRET=um_secret_aleatorio
```

### 4. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Configurar Evolution API

1. Instale a Evolution API via Docker ou use uma instância cloud
2. Crie uma nova instância
3. Conecte seu WhatsApp via QR Code
4. Configure o webhook para apontar para:
   ```
   https://seu-dominio.vercel.app/api/webhooks/whatsapp
   ```
5. Evento: `MESSAGES_UPSERT`

## Deploy na Vercel

1. Faça push do código para o GitHub
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático

## Comandos WhatsApp

| Comando | Descrição |
|---------|-----------|
| `feito` | Marca hábito pendente como concluído |
| `feito [nome]` | Marca hábito específico |
| `pendentes` | Lista hábitos pendentes |
| `progresso` | Mostra status do dia |
| `ajuda` | Lista comandos disponíveis |

## Estrutura

```
src/
├── app/
│   ├── (auth)/           # Login/Register
│   ├── dashboard/        # Dashboard pages
│   └── api/              # API routes
├── components/
│   ├── ui/               # Componentes base
│   ├── habits/           # Componentes de hábitos
│   └── dashboard/        # Componentes do dashboard
├── lib/
│   ├── supabase/         # Cliente Supabase
│   ├── whatsapp/         # Integração WhatsApp
│   └── validations/      # Schemas Zod
└── types/                # TypeScript types
```
