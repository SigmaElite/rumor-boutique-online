import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Documents = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-8">
            Документы подтверждающие покупку
          </h1>
          
          <div className="prose prose-sm max-w-none mb-10">
            <p className="text-muted-foreground">
              Документами, подтверждающими оплату покупки в нашем Интернет-магазине, являются:
            </p>
            <ul className="text-muted-foreground list-disc pl-5 space-y-2 mt-4">
              <li>В случае оплаты наличными или платёжной картой - кассовый чек.</li>
              <li>В случае доставки почтой и оплаты наложенным платежом, покупателю предоставляется товарный чек.</li>
            </ul>
          </div>

          <div className="space-y-12">
            {/* Товарный чек */}
            <div className="border-t pt-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/2">
                  <img 
                    src="/cash-receipt-sample.jpg" 
                    alt="Образец товарного чека" 
                    className="w-full max-w-sm border shadow-sm"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h2 className="text-xl font-medium mb-4">Образец товарного чека</h2>
                  <p className="text-sm text-muted-foreground">
                    Товарный чек выдаётся при доставке почтой и оплате наложенным платежом. 
                    Содержит информацию о продавце, наименовании товара, количестве и стоимости.
                  </p>
                </div>
              </div>
            </div>

            {/* Кассовый чек */}
            <div className="border-t pt-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/2">
                  <img 
                    src="/cash-receipt-sample.jpg" 
                    alt="Образец кассового чека" 
                    className="w-full max-w-sm border shadow-sm"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h2 className="text-xl font-medium mb-4">Образец кассового чека</h2>
                  <p className="text-sm text-muted-foreground">
                    Кассовый чек выдаётся при оплате наличными или банковской картой. 
                    Является официальным документом, подтверждающим факт покупки.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documents;
