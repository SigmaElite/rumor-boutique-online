import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { lookbookItems, getProductsForLook, TELEGRAM_LINK } from "@/data/lookbook";
import { Product } from "@/data/products";

const LookbookPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 pb-16">
        {/* Title - 40px, bold, uppercase, centered, padding top 80px bottom 60px */}
        <h1 
          className="text-center font-bold uppercase tracking-widest"
          style={{ fontSize: '40px', paddingTop: '80px', paddingBottom: '60px' }}
        >
          LOOKBOOK
        </h1>

        {/* Looks Grid - 2 per row on desktop */}
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lookbookItems.map((look, index) => (
              <LookBlock key={look.id} look={look} lookNumber={index + 1} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface LookBlockProps {
  look: typeof lookbookItems[0];
  lookNumber: number;
}

const LookBlock = ({ look, lookNumber }: LookBlockProps) => {
  const products = getProductsForLook(look.productIds) as Product[];
  const isReversed = lookNumber % 2 === 0; // LOOK2, LOOK4 etc. - reversed

  return (
    <div>
      {/* Flex row: model image + products column */}
      <div className={`flex gap-4 ${isReversed ? 'flex-row-reverse' : ''}`}>
        {/* Model Image - 50% width */}
        <div className="w-1/2">
          <div className="overflow-hidden" style={{ height: '520px' }}>
            <img
              src={look.mainImage}
              alt={look.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Products Column - 50% width, flex column with 3 equal rows */}
        <div className="w-1/2 flex flex-col" style={{ height: '520px' }}>
          {/* Row 1: Product 1 - aligned left */}
          {products[0] && (
            <Link
              to={`/product/${products[0].id}`}
              className="flex-1 group flex flex-col justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-md px-4"
            >
              <div className="flex-1 overflow-hidden flex items-center justify-start">
                <img
                  src={products[0].image}
                  alt={products[0].name}
                  className="max-w-full max-h-[160px] object-contain"
                />
              </div>
              <p className="uppercase font-medium" style={{ fontSize: '13px', lineHeight: '1.3' }}>
                {products[0].name}
              </p>
              <p style={{ fontSize: '13px', color: '#000' }}>{products[0].price}</p>
            </Link>
          )}

          {/* Row 2: Product 2 - aligned right */}
          {products[1] && (
            <Link
              to={`/product/${products[1].id}`}
              className="flex-1 group flex flex-col justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-md px-4"
            >
              <div className="flex-1 overflow-hidden flex items-center justify-end">
                <img
                  src={products[1].image}
                  alt={products[1].name}
                  className="max-w-full max-h-[160px] object-contain"
                />
              </div>
              <p className="uppercase font-medium text-right" style={{ fontSize: '13px', lineHeight: '1.3' }}>
                {products[1].name}
              </p>
              <p className="text-right" style={{ fontSize: '13px', color: '#000' }}>{products[1].price}</p>
            </Link>
          )}

          {/* Row 3: Button - same height as product rows */}
          <div className="flex-1 flex items-end px-4 pb-2">
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-black text-white uppercase tracking-widest hover:opacity-90 transition-opacity"
              style={{ height: '44px', fontSize: '14px' }}
            >
              ХОЧУ ЭТОТ ОБРАЗ
            </a>
          </div>
        </div>
      </div>

      {/* Look label - under model image */}
      <p className="uppercase mt-2 font-medium" style={{ fontSize: '14px', color: '#000' }}>
        LOOK{lookNumber}
      </p>
    </div>
  );
};
export default LookbookPage;
