import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const Catalog = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32">
        <div className="container">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="hover:opacity-60 transition-opacity">Главная</Link>
            <span>→</span>
            <span>Каталог</span>
          </nav>

          {/* Title */}
          <h1 className="section-title mb-12">Каталог</h1>

          {/* Filters Row */}
          <div className="flex items-center justify-between mb-10">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm tracking-widest uppercase"
            >
              Категория
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-2 border-b border-border pb-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск"
                className="bg-transparent text-sm outline-none w-32 placeholder:text-muted-foreground"
              />
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mb-16">
            {filteredProducts.map((product) => (
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
        </div>
      </main>
      <Footer />

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Catalog;
