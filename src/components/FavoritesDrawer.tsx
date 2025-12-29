import { Trash2 } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const FavoritesDrawer = () => {
  const { favorites, isFavoritesOpen, setIsFavoritesOpen, removeFromFavorites, totalFavorites } = useFavorites();
  const { addItem } = useCart();

  const handleAddToCart = (product: typeof favorites[0]) => {
    addItem(product);
    toast.success("Товар добавлен в корзину");
  };

  const getProductImage = (product: typeof favorites[0]) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/placeholder.svg';
  };

  return (
    <Sheet open={isFavoritesOpen} onOpenChange={setIsFavoritesOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-left font-display tracking-widest uppercase">
            Избранное ({totalFavorites})
          </SheetTitle>
        </SheetHeader>

        {favorites.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-4">Список избранного пуст</p>
            <Link
              to="/catalog"
              onClick={() => setIsFavoritesOpen(false)}
              className="btn-primary"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {favorites.map((product) => (
              <div key={product.id} className="flex gap-4">
                <Link
                  to={`/product/${product.id}`}
                  onClick={() => setIsFavoritesOpen(false)}
                  className="w-20 h-24 flex-shrink-0 bg-secondary overflow-hidden"
                >
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </Link>

                <div className="flex-1 flex flex-col">
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => setIsFavoritesOpen(false)}
                    className="text-sm font-medium hover:opacity-60 transition-opacity"
                  >
                    {product.name}
                  </Link>

                  <p className="text-sm mt-1">{product.price} BYN</p>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-auto text-xs underline text-left hover:opacity-60 transition-opacity"
                  >
                    В корзину
                  </button>
                </div>

                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="p-1 h-fit hover:opacity-60 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FavoritesDrawer;
