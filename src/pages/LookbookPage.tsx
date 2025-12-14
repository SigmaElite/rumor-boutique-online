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
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest text-center mb-16 uppercase">LOOKBOOK</h1>

          {/* Looks Grid - Two looks per row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            {lookbookItems.map((look) => (
              <LookBlock key={look.id} look={look} />
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
}

const LookBlock = ({ look }: LookBlockProps) => {
  const products = getProductsForLook(look.productIds) as Product[];

  return (
    <div className="flex gap-6">
      {/* Model Image - Left side, not clickable */}
      <div className="w-1/2 flex-shrink-0">
        <div className="aspect-[2/3] overflow-hidden bg-secondary">
          <img
            src={look.mainImage}
            alt={look.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Products Column - Right side */}
      <div className="w-1/2 flex flex-col">
        {/* Products - each takes equal space, together matching model height */}
        <div className="flex flex-col flex-1" style={{ aspectRatio: '2/3' }}>
          {products.slice(0, 2).map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="flex-1 group flex flex-col"
            >
              <div className="flex-1 bg-secondary overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="py-2">
                <p className="text-xs tracking-wider uppercase font-medium leading-tight">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Button */}
        <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 bg-foreground text-background py-3 px-6 text-center text-xs tracking-widest uppercase hover:opacity-90 transition-opacity block"
        >
          ХОЧУ ЭТОТ ОБРАЗ
        </a>
      </div>
    </div>
  );
};

export default LookbookPage;
