import { useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { usePublicProducts } from "@/hooks/usePublicProducts";
import ProductCardCarousel from "@/components/ProductCardCarousel";

const Sale = () => {
  const { loading, getSaleProducts } = usePublicProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const saleProducts = getSaleProducts();

  // Get unique categories from sale products
  const saleCategories = [...new Set(saleProducts.flatMap(p => [p.category, p.secondary_category].filter(Boolean)))];

  const filteredProducts = saleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || product.category === activeCategory || product.secondary_category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Expand by color
  const expandedProducts = filteredProducts.flatMap(product => {
    if (product.colors && product.colors.length > 1) {
      return product.colors.map((color) => {
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
    if (product.colors?.length === 1) {
      const color = product.colors[0];
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

  return (
    <div className="min-h-screen">
      <Seo title={"Sale — Скидки на одежду RUMOR"} description={"Товары со скидкой в интернет-магазине RUMOR: платья, корсеты и жакеты по специальным ценам."} path="/sale" />
      <Header />
      <main className="pt-6 md:pt-16">
        <div className="container px-2 md:px-6">
          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 text-sm mb-8">
            <a href="/" className="hover:opacity-60 transition-opacity">Главная</a>
            <span>→</span>
            <span>Sale</span>
          </nav>

          {/* Title */}
          <h1 className="section-title mb-6 md:mb-12">Sale</h1>

          {/* Category Filters + Search */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                  activeCategory === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary"
                }`}
              >
                Все
              </button>
              {saleCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:opacity-60 transition-opacity shrink-0"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Search Field - appears below when icon clicked */}
          {isSearchOpen && (
            <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск"
                autoFocus
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
              />
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-4 gap-y-8 md:gap-y-20 mb-16">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-secondary aspect-[3/4] mb-4"></div>
                  <div className="h-4 bg-secondary w-2/3 mx-auto mb-2"></div>
                  <div className="h-4 bg-secondary w-1/3 mx-auto"></div>
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-4 gap-y-8 md:gap-y-20 mb-16">
              {expandedProducts.map((product) => (
                <ProductCardCarousel key={product._key} product={product} selectedColor={product._colorVariant} />
              ))}
            </div>
          )}

          {!loading && expandedProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Товары не найдены
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sale;
