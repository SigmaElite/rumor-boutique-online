import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { PublicProduct } from "@/hooks/usePublicProducts";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

interface ProductCardCarouselProps {
  product: PublicProduct;
  selectedColor?: string;
}

const ProductCardCarousel = ({ product, selectedColor }: ProductCardCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.svg'];
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast.success("Удалено из избранного");
    } else {
      addToFavorites(product);
      toast.success("Добавлено в избранное");
    }
  };

  const discount = product.old_price && product.price < product.old_price
    ? `-${Math.round((1 - product.price / product.old_price) * 100)}%`
    : null;

  return (
    <Link 
      to={selectedColor ? `/product/${product.id}?color=${encodeURIComponent(selectedColor)}` : `/product/${product.id}`}
      className="product-card group"
    >
      <div className="relative overflow-hidden bg-secondary">
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
        >
          <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-primary text-primary' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
          {discount && (
            <span className="bg-primary text-primary-foreground text-xs tracking-wider px-3 py-1.5 rounded-full">
              {discount}
            </span>
          )}
          {product.is_last_sizes && (
            <span className="bg-destructive text-destructive-foreground text-[10px] tracking-wider px-2 py-1 rounded-full">
              Заканчивается
            </span>
          )}
        </div>
        
        <img
          src={images[currentIndex]}
          alt={product.name}
          className="product-card-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />

        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-background"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-background"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
            
            {/* Dots indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === currentIndex ? "bg-primary" : "bg-primary/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="product-card-info text-center">
        <p className="product-name">{product.name}</p>
        <div className="flex items-center justify-center gap-2">
          {product.old_price && (
            <span className="text-muted-foreground line-through text-xs">{product.old_price} byn</span>
          )}
          <p className="product-price">{product.price} byn</p>
        </div>
        {/* Color swatches */}
        {product.colors && product.colors.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-1">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Find image index matching this color name (convention: image filename contains color)
                  const colorLower = color.toLowerCase();
                  const matchIndex = images.findIndex((img) => img.toLowerCase().includes(colorLower));
                  if (matchIndex >= 0) {
                    setCurrentIndex(matchIndex);
                  }
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
              >
                {color}
              </button>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCardCarousel;
