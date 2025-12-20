import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";

const shopImages = [lookbook1, lookbook2, lookbook3];

const Contacts = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <a href="/" className="hover:text-foreground transition-colors">Главная</a>
            <span>→</span>
            <span className="text-foreground">Контакты</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] uppercase text-center mb-16">
            Контакты
          </h1>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h2 className="font-display text-xl tracking-[0.15em] uppercase mb-4">
                  Примерочная
                </h2>
                <p className="text-muted-foreground mb-2">
                  Novovilenskaya Street, 61, Minsk, Belarus
                </p>
                <a 
                  href="https://maps.google.com/?q=Novovilenskaya+Street+61+Minsk+Belarus" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm underline hover:no-underline"
                >
                  Смотреть карту
                </a>
                <p className="text-muted-foreground mt-4">
                  11:00 - 20:00 ежедневно
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl tracking-[0.15em] uppercase mb-4">
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
                  href="https://wa.me/375298379586"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  WhatsApp
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
            </div>

            {/* Image Carousel */}
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {shopImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`Шоурум ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contacts;
