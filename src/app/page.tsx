import Link from "next/link";
import { CheckCircle, Bell } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg-secondary">
      {/* Header */}
      <header className="bg-bg-primary/80 backdrop-blur-xl border-b border-separator sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-[44px] flex justify-between items-center">
          <h1 className="text-headline text-label-primary">Habit Tracker</h1>
          <div className="flex gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-apple-blue text-subhead font-medium hover:opacity-80 transition-opacity"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-apple-blue text-white rounded-full text-subhead font-semibold hover:opacity-90 transition-opacity"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl text-center">
          <h2 className="text-large-title md:text-[40px] font-bold text-label-primary mb-6 leading-tight">
            Construa hábitos melhores,
            <br />
            <span className="text-apple-blue">um dia de cada vez</span>
          </h2>
          <p className="text-body text-label-secondary mb-8 max-w-lg mx-auto">
            Acompanhe seus hábitos pelo app ou responda uma simples mensagem no WhatsApp.
            Receba lembretes e veja seu progresso em tempo real.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center min-h-44 px-8 bg-apple-blue text-white rounded-full text-body font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-fast ease-apple"
          >
            Comece agora
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-bg-primary py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CheckCircle className="w-7 h-7 text-apple-blue" />}
              iconBg="bg-apple-blue/10"
              title="Simples e Direto"
              description="Sem complicação. Adicione seus hábitos e marque como feito com um clique."
            />
            <FeatureCard
              icon={
                <img
                  src="https://res.cloudinary.com/dq0sp4wc2/image/upload/v1767068699/pngegg_b0cfmf.png"
                  alt="WhatsApp"
                  className="w-7 h-7"
                />
              }
              iconBg="bg-apple-green/10"
              title="WhatsApp Integrado"
              description='Marque hábitos como feitos direto pelo WhatsApp. Basta responder "feito".'
            />
            <FeatureCard
              icon={<Bell className="w-7 h-7 text-apple-orange" />}
              iconBg="bg-apple-orange/10"
              title="Lembretes Automáticos"
              description="Receba lembretes no horário que você escolher. Nunca mais esqueça."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-separator py-6 px-4 text-center text-label-tertiary text-footnote bg-bg-primary">
        Habit Tracker &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="text-headline text-label-primary mb-2">{title}</h3>
      <p className="text-subhead text-label-secondary">
        {description}
      </p>
    </div>
  );
}
