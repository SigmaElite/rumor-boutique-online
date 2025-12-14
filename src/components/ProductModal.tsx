import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  discount?: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 border-0 bg-background">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 hover:opacity-60 transition-opacity"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="aspect-[3/4] md:aspect-auto md:h-[80vh] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="p-8 md:p-12 flex flex-col">
            {product.discount && (
              <span className="inline-block self-end border border-border px-4 py-1 text-sm tracking-wide mb-4">
                Очень много
              </span>
            )}
            
            <h2 className="font-display text-2xl md:text-3xl tracking-wide mb-4">
              {product.name}
            </h2>
            
            <p className="text-xl font-medium tracking-wide mb-8">
              {product.price}
            </p>
            
            {/* Size Select */}
            <div className="mb-6">
              <label className="block text-sm tracking-wide mb-2">Размер</label>
              <Select defaultValue="one-size">
                <SelectTrigger className="w-48 border-border">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="one-size">one size</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Color Select */}
            <div className="mb-8">
              <label className="block text-sm tracking-wide mb-2">Цвет</label>
              <Select defaultValue="black">
                <SelectTrigger className="w-48 border-border">
                  <SelectValue placeholder="Выберите цвет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Чёрный</SelectItem>
                  <SelectItem value="white">Белый</SelectItem>
                  <SelectItem value="red">Красный</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Add to Cart */}
            <div className="flex gap-4 mb-8">
              <button className="flex-1 border border-border py-4 text-sm tracking-widest uppercase hover:bg-secondary transition-colors">
                Добавить в корзину
              </button>
              <button className="w-14 h-14 border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            
            {/* Product Details */}
            <div className="mt-auto text-sm text-muted-foreground space-y-1">
              <p>Торговая марка: RUMOR</p>
              <p>Состав: 95% полиэстер, 5% вискоза</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
