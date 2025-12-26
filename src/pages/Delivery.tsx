import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Delivery = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container py-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <a href="/" className="hover:text-foreground transition-colors">Главная</a>
            <span>/</span>
            <span className="text-foreground">Доставка и оплата</span>
          </nav>

          <h1 className="font-snell text-4xl md:text-5xl tracking-wide mb-4">
            Доставка и оплата
          </h1>

          <p className="text-muted-foreground mb-8 max-w-2xl">
            Точные условия и доступные способы доставки будут рассчитаны на странице оформления заказа после ввода страны и города доставки, а также озвучены консультантом при подтверждении заказа
          </p>

          <h2 className="font-snell text-3xl md:text-4xl tracking-wide mb-6">Цены на доставку 📦🚚</h2>

          <Tabs defaultValue="russia" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8 flex-wrap">
              <TabsTrigger 
                value="russia" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-4 text-sm"
              >
                🇷🇺 РФ
              </TabsTrigger>
              <TabsTrigger 
                value="belarus" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-4 text-sm"
              >
                🇧🇾 РБ
              </TabsTrigger>
              <TabsTrigger 
                value="minsk" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-4 text-sm"
              >
                По Минску
              </TabsTrigger>
              <TabsTrigger 
                value="other" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-4 text-sm"
              >
                Другие страны
              </TabsTrigger>
            </TabsList>

            <TabsContent value="russia" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Доставка СДЭК:</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>• Курьером до двери — <span className="font-medium text-foreground">60 руб</span></p>
                  <p>• До отделения — <span className="font-medium text-foreground">40 руб</span></p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="belarus" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Европочта:</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>• Курьером до двери — <span className="font-medium text-foreground">30 руб</span></p>
                  <p>• До отделения — <span className="font-medium text-foreground">15 руб</span></p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="minsk" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">В течение 4 часов с примеркой/без:</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>• Бесплатно в случае выкупа</p>
                  <p>• Если не выкупили — <span className="font-medium text-foreground">15 руб</span> стоимость доставки</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Срочная доставка в течение часа:</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>• Без примерки — <span className="font-medium text-foreground">30 руб</span></p>
                  <p>• С примеркой — <span className="font-medium text-foreground">50 руб</span></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Срочная доставка в нерабочее время:</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>• С примеркой/без — <span className="font-medium text-foreground">100 руб</span></p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  Все кроме РБ и РФ только по полной предоплате и без возможности возврата/обмена.
                </p>
                <p className="text-muted-foreground">
                  Стоимость доставки рассчитывается индивидуально. Для уточнения стоимости и сроков свяжитесь с нами.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 pt-8 border-t">
            <h2 className="font-snell text-3xl md:text-4xl tracking-wide mb-6">Способы оплаты</h2>
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