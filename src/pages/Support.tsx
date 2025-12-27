import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Ruler, RefreshCw, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const supportLinks = [
  {
    title: "Доставка и оплата",
    icon: CreditCard,
    href: "/delivery",
  },
  {
    title: "Определение размера",
    icon: Ruler,
    href: "/size-guide",
  },
  {
    title: "Обмен и возврат",
    icon: RefreshCw,
    href: "/returns",
  },
];

const Support = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <div className="container pt-3 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <a href="/" className="hover:text-foreground transition-colors">Главная</a>
            <span>/</span>
            <span className="text-foreground">Центр поддержки</span>
          </nav>

          <h1 className="font-script text-4xl md:text-5xl tracking-wide mb-4">
            Центр поддержки
          </h1>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {supportLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex flex-col items-center p-8 border rounded-lg hover:border-primary transition-colors group"
              >
                <span className="text-sm text-muted-foreground mb-4">{link.title}</span>
                <div className="w-16 h-16 flex items-center justify-center border rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <link.icon className="w-8 h-8" strokeWidth={1} />
                </div>
              </Link>
            ))}
          </div>

          {/* Contact Form & Info */}
          <div className="grid lg:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                placeholder="Твое имя" 
                className="h-12"
              />
              <Input 
                type="tel" 
                placeholder="+375 (00) 000-00-00" 
                className="h-12"
              />
              <Input 
                type="email" 
                placeholder="Твой e-mail" 
                className="h-12"
              />
              <Textarea 
                placeholder="Твой вопрос" 
                className="min-h-[120px] resize-none"
              />
              <Button type="submit" size="lg" className="w-full md:w-auto px-12">
                Отправить
              </Button>
            </form>

            <div>
              <h2 className="font-display text-2xl md:text-3xl tracking-wide mb-4">
                Обратная связь
              </h2>
              <p className="text-muted-foreground mb-6">
                Бесплатная горячая линия для связи с клиентской службой:
              </p>

              <div className="flex items-center gap-6">
                <a
                  href="https://instagram.com/rumor.boutique"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="text-sm">Instagram</span>
                </a>

                <a
                  href="https://t.me/rumor_boutique"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <span className="text-sm">Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
