import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contacts = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container py-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <a href="/" className="hover:text-foreground transition-colors">Главная</a>
            <span>/</span>
            <span className="text-foreground">Контакты</span>
          </nav>

          <h1 className="font-script text-4xl md:text-5xl tracking-wide mb-8">
            Контакты
          </h1>

          <div className="space-y-10">
            <div>
              <h2 className="font-script text-3xl md:text-4xl tracking-wide mb-4">
                Примерочная
              </h2>
              <p className="text-muted-foreground mb-2">
                220053, Республика Беларусь, город Минск, ул. Нововиленская, дом 61, 3 подъезд в ЖК Левада
              </p>
              <p className="text-muted-foreground mt-4">
                11:00 - 20:00 ежедневно
              </p>
            </div>

            <div>
              <h2 className="font-script text-3xl md:text-4xl tracking-wide mb-4">
                Интернет-магазин
              </h2>
              <p className="text-muted-foreground mb-4">
                с 10:00 до 21:00 (без выходных)
              </p>
              <p className="text-muted-foreground">
                Телефон: <a href="tel:+375298379586" className="hover:underline">+375 (29) 837-95-86</a>
              </p>
            </div>

            <div className="flex items-center gap-8">
              <a
                href="https://instagram.com/rumor.boutique"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                Instagram
              </a>
              <a
                href="https://t.me/rumor_boutique"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                Telegram
              </a>
            </div>

            {/* Map */}
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2350.5!2d27.4893!3d53.9356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfd35d2f33c1%3A0x5b9f25d8a5e72ac6!2z0YPQuy4g0J3QvtCy0L7QstC40LvQtdC90YHQutCw0Y8gNjEsINCc0LjQvdGB0Lo!5e0!3m2!1sru!2sby!4v1703600000000!5m2!1sru!2sby"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Наш адрес"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contacts;