import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePublicProducts } from "@/hooks/usePublicProducts";
import ProductCardCarousel from "@/components/ProductCardCarousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { categories } from "@/data/products";

const Catalog = () => {
  const { products, loading } = usePublicProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [selectedSize, setSelectedSize] = useState<string>("all");

  // Read category from URL on mount and on navigation events
  useEffect(() => {
    const updateCategory = () => {
      const categoryFromUrl = searchParams.get("category");
      if (categoryFromUrl && categories.includes(categoryFromUrl)) {
        setSelectedCategory(categoryFromUrl);
      } else if (!searchParams.get("category")) {
        setSelectedCategory("all");
      }
    };
    updateCategory();
    
    const handleCatalogNavigate = () => {
      // Re-read from URL after navigation
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get("category");
        if (cat && categories.includes(cat)) {
          setSelectedCategory(cat);
        } else {
          setSelectedCategory("all");
        }
      }, 0);
    };
    window.addEventListener('catalog-navigate', handleCatalogNavigate);
    return () => window.removeEventListener('catalog-navigate', handleCatalogNavigate);
  }, [searchParams]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
  };

  // Collect all unique sizes from products
  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes || [])));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory || product.secondary_category === selectedCategory;
    const matchesSize = selectedSize === "all" || (product.sizes && product.sizes.includes(selectedSize));
    return matchesSearch && matchesCategory && matchesSize;
  });

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
    // Single color or no colors — use color_images of first color if available
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
      <Header />
      <main className="pt-2 md:pt-4">
        <div className="container px-2 md:px-6">
          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 text-sm mb-3">
            <a href="/" className="hover:opacity-60 transition-opacity">Главная</a>
            <span>→</span>
            <span>Каталог</span>
          </nav>

          {/* Title */}
          <h1 className="font-script text-5xl md:text-7xl text-center mb-3 md:mb-5">каталог</h1>

          {/* Filters Row */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px] border-border bg-background">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {allSizes.length > 0 && (
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-[160px] border-border bg-background">
                    <SelectValue placeholder="Размер" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Все размеры</SelectItem>
                    {allSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label={isSearchOpen ? "Скрыть поиск" : "Открыть поиск"}
                className="p-2 hover:opacity-60 transition-opacity ml-auto"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Search Field - appears below when icon clicked */}
            {isSearchOpen && (
              <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2">
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
          </div>

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

          {/* See Also Section */}
          {!loading && expandedProducts.length > 0 && (
            <div className="mt-8 mb-16">
              <h2 className="font-script text-4xl md:text-5xl text-center mb-10">смотрите также</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-4 gap-y-8 md:gap-y-20">
                {products
                  .filter(p => !filteredProducts.some(fp => fp.id === p.id))
                  .slice(0, 6)
                  .map((product) => (
                    <ProductCardCarousel key={product.id} product={product} hideColors />
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
