import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-left font-display tracking-widest uppercase">
            Корзина ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-4">Ваша корзина пуста</p>
            <Link
              to="/catalog"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                  <Link
                    to={`/product/${item.product.id}`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-20 h-24 flex-shrink-0 bg-secondary overflow-hidden"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="text-sm font-medium hover:opacity-60 transition-opacity"
                    >
                      {item.product.name}
                    </Link>
                    
                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      {item.size && <p>Размер: {item.size}</p>}
                      {item.color && <p>Цвет: {item.color}</p>}
                    </div>

                    <p className="text-sm mt-auto">{item.product.price}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="p-1 hover:opacity-60 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 border border-border rounded">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                        className="p-1.5 hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                        className="p-1.5 hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between text-lg">
                <span>Итого:</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>

              <button className="w-full btn-primary">
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
