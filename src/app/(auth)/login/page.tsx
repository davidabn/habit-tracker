'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : error.message);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-bg-secondary">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-title1 text-label-primary mb-2">
            Entrar
          </h1>
          <p className="text-body text-label-secondary">
            Acesse sua conta para continuar
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-bg-primary rounded-xl shadow-apple p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-apple-red/10 rounded-lg text-apple-red text-subhead text-center">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-subhead text-label-secondary">
          Ainda não tem conta?{' '}
          <Link href="/register" className="text-apple-blue font-semibold hover:opacity-80">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
