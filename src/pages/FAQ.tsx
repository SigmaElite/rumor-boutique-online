import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Как мне выбрать размер?",
    answer: "В каждой карточке товара есть размерная сетка. Измерьте свои параметры (грудь, талию, бедра) и сравните с таблицей. Если сомневаетесь, свяжитесь с нами — поможем подобрать идеальный размер.",
  },
  {
    question: "Что делать, если я ошиблась с размером?",
    answer: "Вы можете обменять товар на другой размер в течение 7 дней с момента получения. Для этого свяжитесь с нами через WhatsApp или Telegram.",
  },
  {
    question: "Сколько стоит доставка и сколько мне ждать?",
    answer: "Стоимость и сроки зависят от региона доставки. По Беларуси — от 8 BYN, доставка 1-5 дней. В другие страны — от 35 BYN, доставка 5-14 дней. Точная стоимость рассчитывается при оформлении заказа.",
  },
  {
    question: "Возврат и обмен",
    answer: "Возврат или обмен возможен в течение 7 дней с момента получения. Товар должен быть в первоначальном виде, с бирками. Нижнее белье и персонализированные заказы возврату не подлежат.",
  },
  {
    question: "Оригинальны ли товары? Есть ли гарантия?",
    answer: "Все изделия RUMOR — это оригинальная продукция собственного производства. Мы гарантируем качество каждого изделия и используем только премиальные материалы.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <a href="/" className="hover:text-foreground transition-colors">Главная</a>
            <span>/</span>
            <span className="text-foreground">FAQ</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-10">
            Часто задаваемые вопросы
          </h1>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-0 max-w-5xl">
            {faqItems.map((item, index) => (
              <Accordion key={index} type="single" collapsible>
                <AccordionItem value={`item-${index}`} className="border-b">
                  <AccordionTrigger className="text-left py-6 hover:no-underline">
                    <span className="pr-4">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
