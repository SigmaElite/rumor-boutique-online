import { useState } from "react";
import { Link } from "react-router-dom";
import { usePublicProducts } from "@/hooks/usePublicProducts";
import ProductCardCarousel from "./ProductCardCarousel";

const INITIAL_COUNT = 12;

const Bestsellers = () => {
  const { products, loading, getBestsellers } = usePublicProducts();
  const [showAll, setShowAll] = useState(false);
  
  const bestsellers = getBestsellers();

  // Expand by color: only show colors listed in bestseller_colors
  const expandedBestsellers = bestsellers.flatMap(product => {
    const allowedColors = product.bestseller_colors?.length > 0
      ? product.bestseller_colors
      : product.colors || [];

    if (allowedColors.length > 1) {
      return allowedColors.map((color) => {
        const colorImages = product.color_images?.[color] || [];
        return {
          ...product,
          _colorVariant: color,
          _key: `${product.id}-${color}`,
          images: colorImages.length > 0 ? colorImages : product.images,
          colors: [color],
        };
      });
    }
    if (allowedColors.length === 1) {
      const color = allowedColors[0];
      const colorImages = product.color_images?.[color] || [];
      return [{
        ...product,
        _colorVariant: color,
        _key: product.id,
        images: colorImages.length > 0 ? colorImages : product.images,
      }];
    }
    return [{ ...product, _colorVariant: undefined as string | undefined, _key: product.id }];
  });

  const displayProducts = showAll ? expandedBestsellers : expandedBestsellers.slice(0, INITIAL_COUNT);

  if (loading) {
    return (
      <section className="pt-4 md:pt-6 pb-16 md:pb-24">
        <div className="container">
          <h2 className="font-snell text-4xl md:text-5xl lg:text-6xl text-center mb-6 md:mb-8">Bestsellers</h2>
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

  return (
    <section className="pt-4 md:pt-6 pb-16 md:pb-24">
      <div className="container">
        <h2 className="font-snell text-4xl md:text-5xl lg:text-6xl text-center mb-6 md:mb-8">Bestsellers</h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-20">
          {displayProducts.map((product) => (
            <ProductCardCarousel key={product._key} product={product} selectedColor={product._colorVariant} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 mt-16">
          {!showAll && expandedBestsellers.length > INITIAL_COUNT && (
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
