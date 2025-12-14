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

  return (
    <div>
      {/* Main content - model + products side by side */}
      <div className="flex gap-4 md:gap-6">
        {/* Model Image - Left side, 50% width, 800px height */}
        <div className="w-1/2">
          <div 
            className="overflow-hidden bg-secondary"
            style={{ height: '800px' }}
          >
            <img
              src={look.mainImage}
              alt={look.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Look label */}
          <p 
            className="uppercase mt-2.5"
            style={{ fontSize: '14px', color: '#000' }}
          >
            LOOK{lookNumber}
          </p>
        </div>

        {/* Products Column - Right side, 50% width, 800px height */}
        <div className="w-1/2 flex flex-col">
          {/* Products container - exactly 800px to match model */}
          <div 
            className="flex flex-col gap-5"
            style={{ height: '800px' }}
          >
            {products.slice(0, 2).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="flex-1 group flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {/* Product image - 250px height, contain, white bg */}
                <div 
                  className="bg-white overflow-hidden flex items-center justify-center pt-4"
                  style={{ height: '250px' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                {/* Product name - centered, 14px, uppercase */}
                <p 
                  className="text-center uppercase font-medium mt-2.5"
                  style={{ fontSize: '14px' }}
                >
                  {product.name}
                </p>
                {/* Price - centered, 14px */}
                <p 
                  className="text-center mt-1"
                  style={{ fontSize: '14px', color: '#000' }}
                >
                  {product.price}
                </p>
              </Link>
            ))}
          </div>

          {/* Button - full width, 44px height, black bg, rounded */}
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-black text-white uppercase tracking-widest hover:opacity-90 transition-opacity"
            style={{ 
              height: '44px', 
              fontSize: '14px', 
              borderRadius: '4px',
              marginTop: '30px'
            }}
          >
            ХОЧУ ЭТОТ ОБРАЗ
          </a>
        </div>
      </div>
    </div>
  );
};

export default LookbookPage;
