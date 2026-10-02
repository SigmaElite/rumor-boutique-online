import { useState } from "react";
import { usePublicProducts } from "@/hooks/usePublicProducts";
import ProductCardCarousel from "./ProductCardCarousel";

const INITIAL_COUNT = 12;

const NewSection = () => {
  const { products, loading } = usePublicProducts();
  const [showAll, setShowAll] = useState(false);

  const newProducts = products.filter(p => p.is_new);
  const displayProducts = showAll ? newProducts : newProducts.slice(0, INITIAL_COUNT);

  if (loading) {
    return (
      <section className="pt-4 md:pt-6 pb-16 md:pb-24">
        <div className="container">
          <h2 className="font-snell text-4xl md:text-5xl lg:text-6xl text-center mb-6 md:mb-8">New</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-20">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-secondary aspect-[3/4] mb-4"></div>
                <div className="h-4 bg-secondary w-2/3 mx-auto mb-2"></div>
                <div className="h-4 bg-secondary w-1/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (newProducts.length === 0) return null;

  return (
    <section className="pt-4 md:pt-6 pb-16 md:pb-24">
      <div className="container">
        <h2 className="font-snell text-4xl md:text-5xl lg:text-6xl text-center mb-6 md:mb-8">New</h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-20">
          {displayProducts.map((product) => (
            <ProductCardCarousel key={`new-${product.id}`} product={product} />
          ))}
        </div>

        {!showAll && newProducts.length > INITIAL_COUNT && (
          <div className="flex justify-center mt-16">
            <button onClick={() => setShowAll(true)} className="btn-outline">
              Загрузить ещё
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewSection;
