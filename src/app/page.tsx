import Link from "next/link";
import { CheckCircle, Bell } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Habit Tracker</h1>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Construa hábitos melhores,
            <br />
            <span className="text-primary-600">um dia de cada vez</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Acompanhe seus hábitos pelo app ou responda uma simples mensagem no WhatsApp.
            Receba lembretes e veja seu progresso em tempo real.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Comece agora
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Simples e Direto</h3>
            <p className="text-gray-600 text-sm">
              Sem complicação. Adicione seus hábitos e marque como feito com um clique.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <img src="https://res.cloudinary.com/dq0sp4wc2/image/upload/v1767068699/pngegg_b0cfmf.png" alt="WhatsApp" className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">WhatsApp Integrado</h3>
            <p className="text-gray-600 text-sm">
              Marque hábitos como feitos direto pelo WhatsApp. Basta responder "feito".
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Lembretes Automáticos</h3>
            <p className="text-gray-600 text-sm">
              Receba lembretes no horário que você escolher. Nunca mais esqueça.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-gray-500 text-sm">
        Habit Tracker &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
