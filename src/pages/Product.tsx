import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductById, getRelatedProducts, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(Number(id));
  const relatedProducts = getRelatedProducts(Number(id), 4);
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Выберите размер");
      return;
    }
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Выберите цвет");
      return;
    }
    
    addItem(product, selectedSize || undefined, selectedColor || undefined);
    toast.success("Товар добавлен в корзину");
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast.success("Удалено из избранного");
    } else {
      addToFavorites(product);
      toast.success("Добавлено в избранное");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-16 pb-16">
          <div className="container text-center">
            <h1 className="text-2xl mb-4">Товар не найден</h1>
            <Link to="/catalog" className="btn-primary">Вернуться в каталог</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images || [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <Header />
      </div>
      <main className="pt-0 md:pt-12 pb-16">
        {/* Back button - mobile top */}
        <button 
          onClick={() => navigate(-1)}
          className="md:hidden absolute top-4 left-4 z-20 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Back button - desktop */}
        <div className="container hidden md:block px-6 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm hover:opacity-60 transition-opacity"
          >
            ← Назад
          </button>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 lg:container lg:px-6">
          {/* Image Gallery */}
          <div className="relative md:ml-auto lg:max-w-[90%]">
            {/* Main Image */}
            <div className="relative w-screen md:w-auto aspect-[3/4] max-h-[70vh] bg-secondary overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 px-3 md:px-0 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex 
                        ? "border-primary" 
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - фото ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

            {/* Product Info */}
            <div className="flex flex-col px-3 md:px-0">
              {/* Close button - desktop */}
              <button
                onClick={() => navigate(-1)}
                className="hidden lg:flex self-end w-10 h-10 items-center justify-center hover:opacity-60 transition-opacity mb-4"
              >
                <X className="w-6 h-6" />
              </button>

              <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-4">
                {product.name}
              </h1>

              <p className="text-xl md:text-2xl font-light mb-2">
                {product.price}
              </p>

              {product.priceInstallment && (
                <p className="text-sm text-muted-foreground mb-6">
                  или в рассрочку по карте "Халва" от МТБанка
                </p>
              )}

              {/* Size Select */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Размер</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-40 bg-background border-border">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Color Select */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Цвет</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-40 bg-background border-border">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mb-6">
                <button onClick={handleAddToCart} className="flex-1 btn-primary">
                  Добавить в корзину
                </button>
                <button 
                  onClick={handleToggleFavorite}
                  className={`w-12 h-12 flex items-center justify-center border border-border rounded hover:bg-secondary transition-colors ${isFavorite(product.id) ? 'bg-secondary' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-primary text-primary' : ''}`} />
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-wrap gap-3 mb-8">
                <a href="https://t.me/rumor_boutique" target="_blank" rel="noopener noreferrer" className="btn-primary bg-foreground text-background hover:bg-foreground/90">
                  Задать вопрос в Telegram
                </a>
                <button className="btn-outline">
                  Размерная сетка
                </button>
              </div>

              {/* Product Details */}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Торговая марка: <span className="text-foreground">RUMOR</span></p>
                {product.composition && (
                  <p>Состав: <span className="text-foreground">{product.composition}</span></p>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          {product.description && (
            <div className="container mt-16 border-t border-border pt-16 px-4 md:px-6">
              <h2 className="text-center text-xl tracking-widest mb-8">Описание</h2>
              <div className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
                <p className="mb-4 text-foreground font-medium">{product.name}</p>
                <p className="mb-4">{product.description}</p>
                {product.colors && (
                  <p className="mb-2">
                    <span className="text-foreground">Цвета:</span> {product.colors.join(", ")}
                  </p>
                )}
                <p className="text-sm">Возможны другие под заказ.</p>
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="container mt-16 px-4 md:px-6">
              <h2 className="font-script text-2xl md:text-3xl text-center mb-8">смотрите также</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <Link 
                    key={relProduct.id} 
                    to={`/product/${relProduct.id}`}
                    className="product-card"
                  >
                    <div className="relative overflow-hidden bg-secondary">
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        className="product-card-image"
                      />
                    </div>
                    <div className="product-card-info">
                      <p className="product-price">{relProduct.price}</p>
                      <p className="product-name">{relProduct.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
