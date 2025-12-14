import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { lookbookItems, getProductsForLook, TELEGRAM_LINK } from "@/data/lookbook";
import { Product } from "@/data/products";

const LookbookPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="hover:opacity-60 transition-opacity">Главная</Link>
            <span>→</span>
            <span>Lookbook</span>
          </nav>

          {/* Title */}
          <h1 className="section-title mb-16 text-center">LOOKBOOK</h1>

          {/* Looks */}
          <div className="space-y-24">
            {lookbookItems.map((look, index) => {
              const products = getProductsForLook(look.productIds) as Product[];
              const leftProducts = products.slice(0, Math.ceil(products.length / 2));
              const rightProducts = products.slice(Math.ceil(products.length / 2));
              const isReversed = index % 2 === 1;

              return (
                <div key={look.id} className="relative">
                  <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 items-start ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Left Products Column */}
                    <div className={`space-y-6 order-2 ${isReversed ? 'lg:order-3' : 'lg:order-1'}`}>
                      {leftProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="block group"
                        >
                          <div className="aspect-[3/4] bg-secondary overflow-hidden mb-2">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <p className="text-xs tracking-wider uppercase font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.price}</p>
                        </Link>
                      ))}
                      
                      {/* Button for mobile */}
                      <a
                        href={TELEGRAM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full text-center block lg:hidden"
                      >
                        ХОЧУ ЭТОТ ОБРАЗ
                      </a>
                    </div>

                    {/* Main Look Image */}
                    <div className={`lg:col-span-2 order-1 ${isReversed ? 'lg:order-2' : 'lg:order-2'}`}>
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={look.mainImage}
                          alt={look.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-4 text-sm tracking-widest font-medium">{look.name}</p>
                    </div>

                    {/* Right Products Column */}
                    <div className={`space-y-6 order-3 ${isReversed ? 'lg:order-1' : 'lg:order-3'}`}>
                      {rightProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="block group"
                        >
                          <div className="aspect-[3/4] bg-secondary overflow-hidden mb-2">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <p className="text-xs tracking-wider uppercase font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.price}</p>
                        </Link>
                      ))}
                      
                      {/* Button for desktop */}
                      <a
                        href={TELEGRAM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full text-center hidden lg:block"
                      >
                        ХОЧУ ЭТОТ ОБРАЗ
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LookbookPage;
