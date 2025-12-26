import { useState } from "react";
import { Link } from "react-router-dom";
import { allProducts } from "@/data/products";
import ProductCardCarousel from "./ProductCardCarousel";

const INITIAL_COUNT = 12;

const Bestsellers = () => {
  const [showAll, setShowAll] = useState(false);
  const products = showAll ? allProducts : allProducts.slice(0, INITIAL_COUNT);

  return (
    <section className="pt-4 md:pt-6 pb-16 md:pb-24">
      <div className="container">
        <h2 className="font-snell text-4xl md:text-5xl lg:text-6xl text-center mb-6 md:mb-8">Bestsellers</h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-20">
          {products.map((product) => (
            <ProductCardCarousel key={product.id} product={product} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 mt-16">
          {!showAll && allProducts.length > INITIAL_COUNT && (
            <button onClick={() => setShowAll(true)} className="btn-outline">
              Загрузить ещё
            </button>
          )}
          <Link to="/catalog" className="btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Bestsellers;
