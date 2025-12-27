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
                  <div className="w-12 h-12 flex items-center justify-center border border-current rounded-lg">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
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
                  <div className="w-12 h-12 flex items-center justify-center border border-current rounded-lg">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.125l3.908 1.3a1.5 1.5 0 0 0 1.522-.326l6.885-6.338-5.357 7.069a1.5 1.5 0 0 0 .204 2.036l3.054 2.633a2.25 2.25 0 0 0 3.405-.65l5.558-14.56a2.25 2.25 0 0 0-1.783-3.004z"></path>
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
