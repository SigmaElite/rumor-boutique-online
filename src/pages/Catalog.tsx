import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { allProducts, categories } from "@/data/products";
import ProductCardCarousel from "@/components/ProductCardCarousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Read category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
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

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6 md:pt-16">
        <div className="container px-2 md:px-6">
          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 text-sm mb-8">
            <a href="/" className="hover:opacity-60 transition-opacity">Главная</a>
            <span>→</span>
            <span>Каталог</span>
          </nav>

          {/* Title */}
          <h1 className="font-script text-5xl md:text-7xl text-center mb-6 md:mb-12">каталог</h1>

          {/* Filters Row */}
          <div className="flex flex-col gap-4 mb-16">
            <div className="flex items-center justify-between">
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

              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:opacity-60 transition-opacity"
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

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-4 gap-y-8 md:gap-y-20 mb-16">
            {filteredProducts.map((product) => (
              <ProductCardCarousel key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Товары не найдены
            </p>
          )}

          {/* See Also Section */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 mb-16">
              <h2 className="font-script text-4xl md:text-5xl text-center mb-10">смотрите также</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-4 gap-y-8 md:gap-y-20">
                {allProducts
                  .filter(p => !filteredProducts.some(fp => fp.id === p.id))
                  .slice(0, 6)
                  .map((product) => (
                    <ProductCardCarousel key={product.id} product={product} />
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
