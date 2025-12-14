import { useState } from "react";
import ProductModal from "@/components/ProductModal";
import bestseller1 from "@/assets/bestseller-1.jpg";
import bestseller2 from "@/assets/bestseller-2.jpg";
import bestseller3 from "@/assets/bestseller-3.jpg";
import bestseller4 from "@/assets/bestseller-4.jpg";
import bestseller5 from "@/assets/bestseller-5.jpg";
import bestseller6 from "@/assets/bestseller-6.jpg";
import bestseller7 from "@/assets/bestseller-7.jpg";
import bestseller8 from "@/assets/bestseller-8.jpg";
import bestseller9 from "@/assets/bestseller-9.jpg";
import bestseller10 from "@/assets/bestseller-10.jpg";
import bestseller11 from "@/assets/bestseller-11.jpg";
import bestseller12 from "@/assets/bestseller-12.jpg";

const allProducts = [
  { id: 1, name: "блузка с бантом", price: "799 BYN", image: bestseller1 },
  { id: 2, name: "платье с открытой спиной", price: "869 BYN", image: bestseller2 },
  { id: 3, name: "кейп", price: "529 BYN", image: bestseller3 },
  { id: 4, name: "кроп-жакет", price: "1 500 BYN", image: bestseller4, discount: "-20%" },
  { id: 5, name: "платье-боди", price: "1 099 BYN", image: bestseller5 },
  { id: 6, name: "пиджак в полоску", price: "1 599 BYN", image: bestseller6 },
  { id: 7, name: "корсет бархат", price: "629 BYN", image: bestseller7 },
  { id: 8, name: "платье шёлк", price: "1 299 BYN", image: bestseller8 },
  { id: 9, name: "костюм оверсайз", price: "1 769 BYN", image: bestseller9 },
  { id: 10, name: "вечернее платье", price: "2 269 BYN", image: bestseller10 },
  { id: 11, name: "платье металлик", price: "1 429 BYN", image: bestseller11 },
  { id: 12, name: "корсет с брюками", price: "1 199 BYN", image: bestseller12 },
];

const INITIAL_COUNT = 12;

const Bestsellers = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const products = showAll ? allProducts : allProducts.slice(0, INITIAL_COUNT);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="section-title mb-12 md:mb-16">Bestsellers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="product-card cursor-pointer"
              onClick={() => setSelectedProduct(product)}
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
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 mt-16">
          {!showAll && allProducts.length > INITIAL_COUNT && (
            <button onClick={() => setShowAll(true)} className="btn-outline">
              Загрузить ещё
            </button>
          )}
          <a href="/catalog" className="btn-primary">
            Перейти в каталог
          </a>
        </div>
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default Bestsellers;
