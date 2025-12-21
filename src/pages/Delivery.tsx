import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Delivery = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <a href="/" className="hover:text-foreground transition-colors">Главная</a>
            <span>/</span>
            <span className="text-foreground">Доставка и оплата</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-6">
            Доставка и оплата
          </h1>

          <p className="text-muted-foreground mb-10 max-w-2xl">
            Точные условия и доступные способы доставки будут рассчитаны на странице оформления заказа после ввода страны и города доставки, а также озвучены консультантом при подтверждении заказа
          </p>

          <Tabs defaultValue="belarus" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8">
              <TabsTrigger 
                value="belarus" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                По Беларуси
              </TabsTrigger>
              <TabsTrigger 
                value="cis" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Доставка в Россию, Казахстан, Молдавию, Армению
              </TabsTrigger>
              <TabsTrigger 
                value="other" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                В другие страны
              </TabsTrigger>
            </TabsList>

            <TabsContent value="belarus" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1) Доставка курьером до дома</h3>
                <p className="text-muted-foreground">Стоимость: от 15 BYN.</p>
                <p className="text-muted-foreground">Срок доставки: от 1 до 3 дней с момента отправки.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2) Доставка в ПВЗ (Европочта)</h3>
                <p className="text-muted-foreground">Стоимость: от 8 BYN.</p>
                <p className="text-muted-foreground">Выбрать ПВЗ можно в процессе оформления заказа.</p>
                <p className="text-muted-foreground">Срок доставки: от 2 до 5 дней с момента отправки.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3) Самовывоз из шоурума</h3>
                <p className="text-muted-foreground">Бесплатно.</p>
                <p className="text-muted-foreground">Адрес: ул. Нововиленская, 61, Минск.</p>
              </div>
            </TabsContent>

            <TabsContent value="cis" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1) Доставка курьером до дома</h3>
                <p className="text-muted-foreground">Стоимость: от 50 BYN.</p>
                <p className="text-muted-foreground">Срок доставки: от 5 до 14 дней с момента отправки в зависимости от региона.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2) Доставка в ПВЗ</h3>
                <p className="text-muted-foreground">Стоимость: от 35 BYN.</p>
                <p className="text-muted-foreground">Срок доставки: от 7 до 14 дней с момента отправки в зависимости от региона.</p>
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Международная доставка</h3>
                <p className="text-muted-foreground">Стоимость: рассчитывается индивидуально.</p>
                <p className="text-muted-foreground">Срок доставки: от 7 до 21 дня в зависимости от страны назначения.</p>
                <p className="text-muted-foreground">Для уточнения стоимости и сроков свяжитесь с нами.</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 pt-8 border-t">
            <h2 className="font-display text-2xl tracking-wide mb-6">Способы оплаты</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">• Банковская карта (Visa, Mastercard)</p>
              <p className="text-muted-foreground">• Наличными при получении</p>
              <p className="text-muted-foreground">• Рассрочка (Карта рассрочки "Халва")</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Delivery;
