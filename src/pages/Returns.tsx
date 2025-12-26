import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[118px] md:pt-[122px]">
        <div className="container pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <a href="/" className="hover:text-foreground transition-colors">Главная</a>
            <span>/</span>
            <span className="text-foreground">Обмен и возврат</span>
          </nav>

          <h1 className="font-script text-4xl md:text-5xl tracking-wide mb-6">
            Обмен и возврат
          </h1>

          <div className="bg-muted/30 p-8 rounded-lg max-w-4xl">
            <h2 className="font-semibold text-xl mb-4">Возврат</h2>
            
            <p className="text-muted-foreground mb-6">
              Обменять или вернуть купленные изделия возможно в течение 7 дней с момента их получения. 
              Если в этот период Вы не подали запрос на возврат или обмен, заказ считается завершенным и не подлежит возврату.
            </p>

            <p className="italic text-muted-foreground mb-8">
              *Согласно законодательству Республики Беларусь, покупатель вправе отказаться от товара в любое время до его передачи, 
              а после передачи товара - в течение 7 дней.
            </p>

            <h3 className="font-semibold text-lg mb-4">Условия для возврата:</h3>
            
            <ol className="space-y-3 text-muted-foreground mb-8">
              <li>1. Товар не был в употреблении.</li>
              <li>2. На одежде отсутствуют следы дезодоранта, запах пота, затяжки и других дефектов, несущих потерю первоначального вида одежды.</li>
              <li>3. Сохранены товарный вид и потребительские свойства. Пломбы, фабричные ярлыки сохранены и не отделены от товара.</li>
              <li>4. Одежда не подвергалась стирке.</li>
              <li>5. Возврату не подлежат:</li>
              <li className="ml-4">— Нижнее белье, купальники.*</li>
              <li className="ml-4">— Индивидуально изготовленные и персонализированные заказы.</li>
            </ol>

            <h3 className="font-semibold text-lg mb-4">Как оформить возврат:</h3>
            
            <ol className="space-y-3 text-muted-foreground">
              <li>1. Свяжитесь с нами через Telegram или по телефону.</li>
              <li>2. Укажите номер заказа и причину возврата.</li>
              <li>3. Мы предоставим инструкции по отправке товара.</li>
              <li>4. После получения и проверки товара, возврат средств будет осуществлен в течение 5-7 рабочих дней.</li>
            </ol>
          </div>

          <div className="mt-12 max-w-4xl">
            <h2 className="font-script text-3xl md:text-4xl tracking-wide mb-6">Обмен</h2>
            <p className="text-muted-foreground mb-4">
              Обмен товара осуществляется на аналогичную модель другого размера при наличии на складе.
            </p>
            <p className="text-muted-foreground">
              Для оформления обмена свяжитесь с нами любым удобным способом. Расходы на доставку при обмене оплачивает покупатель.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Returns;
