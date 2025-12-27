import { useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSaleProducts } from "@/data/products";
import ProductCardCarousel from "@/components/ProductCardCarousel";

const Sale = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const saleProducts = getSaleProducts();

  const filteredProducts = saleProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
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

          {/* Filters Row */}
          <div className="flex flex-col gap-4 mb-16">
            <div className="flex items-center justify-end">
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sale;
