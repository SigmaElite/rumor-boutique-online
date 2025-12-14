import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { lookbookItems, getProductsForLook, TELEGRAM_LINK } from "@/data/lookbook";
import { Product } from "@/data/products";

const LookbookPage = () => {
  // Group looks into pairs for the two-column layout
  const lookPairs: Array<[typeof lookbookItems[0], typeof lookbookItems[0] | undefined]> = [];
  for (let i = 0; i < lookbookItems.length; i += 2) {
    lookPairs.push([lookbookItems[i], lookbookItems[i + 1]]);
  }

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

          {/* Looks Grid - Two looks per row */}
          <div className="space-y-20">
            {lookPairs.map(([look1, look2], pairIndex) => (
              <div key={pairIndex} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4">
                {/* First Look */}
                <LookBlock look={look1} />
                
                {/* Second Look (if exists) */}
                {look2 && <LookBlock look={look2} />}
              </div>
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
    <div className="grid grid-cols-2 gap-4">
      {/* Model Image */}
      <div>
        <div className="aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={look.mainImage}
            alt={look.name}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-3 text-sm tracking-widest font-medium">{look.name}</p>
      </div>

      {/* Products Column */}
      <div className="flex flex-col">
        <div className="space-y-4 flex-1">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="block group"
            >
              <div className="aspect-[3/4] bg-secondary overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-xs tracking-wider uppercase font-medium leading-tight">{product.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{product.price}</p>
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
