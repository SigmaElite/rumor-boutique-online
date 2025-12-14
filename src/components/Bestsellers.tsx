import { useState } from "react";
import { Link } from "react-router-dom";
import { allProducts } from "@/data/products";

const INITIAL_COUNT = 12;

const Bestsellers = () => {
  const [showAll, setShowAll] = useState(false);
  const products = showAll ? allProducts : allProducts.slice(0, INITIAL_COUNT);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="section-title mb-12 md:mb-16">Bestsellers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((product) => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="product-card"
            >
              <div className="relative overflow-hidden bg-secondary">
                {product.discount && (
                  <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs tracking-wider px-3 py-1.5 rounded-full z-10">
                    {product.discount}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card-image"
                />
              </div>
              <div className="product-card-info">
                <p className="product-price">{product.price}</p>
                <p className="product-name">{product.name}</p>
              </div>
            </Link>
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
