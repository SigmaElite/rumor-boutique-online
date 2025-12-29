import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DbProduct, ProductFormData } from '@/hooks/useProducts';
import { X } from 'lucide-react';

interface ProductFormProps {
  product?: DbProduct | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const categories = ['NEW', 'Корсеты', 'Платья', 'Комплекты', 'Юбки'];
const defaultSizes = ['XS-40', 'S-42', 'M-44', 'L-46', 'XL-48'];

const ProductForm = ({ product, onSubmit, onCancel, loading }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    old_price: null,
    category: 'NEW',
    sizes: [],
    images: [],
    colors: [],
    is_bestseller: false,
    is_new: false,
    is_sale: false,
  });

  const [newColor, setNewColor] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        old_price: product.old_price,
        category: product.category,
        sizes: product.sizes || [],
        images: product.images || [],
        colors: product.colors || [],
        is_bestseller: product.is_bestseller,
        is_new: product.is_new,
        is_sale: product.is_sale,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
      }));
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== image),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Категория *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Цена (BYN) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="old_price">Старая цена (BYN)</Label>
          <Input
            id="old_price"
            type="number"
            step="0.01"
            value={formData.old_price || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                old_price: e.target.value ? parseFloat(e.target.value) : null,
              }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Размеры</Label>
        <div className="flex flex-wrap gap-2">
          {defaultSizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={formData.sizes.includes(size) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Цвета</Label>
        <div className="flex gap-2">
          <Input
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="Добавить цвет"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
          />
          <Button type="button" onClick={addColor} variant="outline">
            Добавить
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.colors.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm"
            >
              {color}
              <button type="button" onClick={() => removeColor(color)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Изображения (URL)</Label>
        <div className="flex gap-2">
          <Input
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="URL изображения"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
          />
          <Button type="button" onClick={addImage} variant="outline">
            Добавить
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="is_new"
            checked={formData.is_new}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_new: checked }))}
          />
          <Label htmlFor="is_new">Новинка</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="is_bestseller"
            checked={formData.is_bestseller}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_bestseller: checked }))}
          />
          <Label htmlFor="is_bestseller">Бестселлер</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="is_sale"
            checked={formData.is_sale}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_sale: checked }))}
          />
          <Label htmlFor="is_sale">Распродажа</Label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : product ? 'Сохранить' : 'Добавить товар'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
