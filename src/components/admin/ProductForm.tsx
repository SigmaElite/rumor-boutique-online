import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DbProduct, ProductFormData, normalizeColorImages, normalizeColorSizes } from '@/hooks/useProducts';
import { X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: DbProduct | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const categories = ['NEW', 'Корсеты', 'Платья', 'Комплекты', 'Юбки', 'Жакеты', 'Брюки', 'Верхняя одежда', 'Спорт', 'wedding collection'];
const defaultSizes = [
  'XXS-38',
  'Doll (55 талия, 90 грудь)',
  'XXS с Push-up',
  'XS без Push-up',
  'XS-40',
  'S с Push-up',
  'S-42',
  'M без Push-up',
  'M-44',
  'L-46',
  'XL-48',
  'Предзаказ',
];

const ProductForm = ({ product, onSubmit, onCancel, loading }: ProductFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingColorImage, setUploadingColorImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    old_price: null,
    category: 'NEW',
    secondary_category: null,
    sizes: [],
    images: [],
    colors: [],
    color_images: {},
    color_sizes: {},
    is_bestseller: false,
    is_new: false,
    is_sale: false,
    is_last_sizes: false,
    position: 0,
  });

  const [priceValue, setPriceValue] = useState('');
  const [oldPriceValue, setOldPriceValue] = useState('');
  const [positionValue, setPositionValue] = useState('0');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        old_price: product.old_price,
        category: product.category,
        secondary_category: product.secondary_category || null,
        sizes: product.sizes || [],
        images: product.images || [],
        colors: product.colors || [],
        color_images: normalizeColorImages(product.color_images),
        color_sizes: normalizeColorSizes(product.color_sizes),
        is_bestseller: product.is_bestseller || false,
        is_new: product.is_new || false,
        is_sale: product.is_sale || false,
        is_last_sizes: product.is_last_sizes || false,
        position: product.position || 0,
      });
      setPriceValue(product.price.toString());
      setOldPriceValue(product.old_price?.toString() || '');
      setPositionValue(product.position?.toString() || '0');
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        old_price: null,
        category: 'NEW',
        secondary_category: null,
        sizes: [],
        images: [],
        colors: [],
        color_images: {},
        color_sizes: {},
        is_bestseller: false,
        is_new: false,
        is_sale: false,
        is_last_sizes: false,
        position: 0,
      });
      setPriceValue('');
      setOldPriceValue('');
      setPositionValue('0');
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(priceValue);
    if (isNaN(price) || price <= 0) {
      toast({ title: 'Ошибка', description: 'Укажите корректную цену', variant: 'destructive' });
      return;
    }
    
    // Build images from all color_images
    const allImages: string[] = [];
    for (const imgs of Object.values(formData.color_images)) {
      for (const img of imgs) {
        if (!allImages.includes(img)) allImages.push(img);
      }
    }
    // Also include any images not associated with a color
    for (const img of formData.images) {
      if (!allImages.includes(img)) allImages.push(img);
    }
    
    const submitData: ProductFormData = {
      ...formData,
      price,
      old_price: oldPriceValue ? parseFloat(oldPriceValue) : null,
      images: allImages,
    };
    await onSubmit(submitData);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) setPriceValue(value);
  };

  const handleOldPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) setOldPriceValue(value);
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }));
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
        color_images: { ...prev.color_images, [newColor.trim()]: [] },
        color_sizes: { ...prev.color_sizes, [newColor.trim()]: [...prev.sizes] },
      }));
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setFormData((prev) => {
      const newColorImages = { ...prev.color_images };
      delete newColorImages[color];
      const newColorSizes = { ...prev.color_sizes };
      delete newColorSizes[color];
      return {
        ...prev,
        colors: prev.colors.filter((c) => c !== color),
        color_images: newColorImages,
        color_sizes: newColorSizes,
      };
    });
  };

  const toggleColorSize = (color: string, size: string) => {
    setFormData((prev) => {
      const currentSizes = prev.color_sizes[color] || [];
      const newSizes = currentSizes.includes(size)
        ? currentSizes.filter(s => s !== size)
        : [...currentSizes, size];
      return {
        ...prev,
        color_sizes: { ...prev.color_sizes, [color]: newSizes },
      };
    });
  };

  const removeColorImage = (color: string, imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      color_images: {
        ...prev.color_images,
        [color]: (prev.color_images[color] || []).filter(img => img !== imageUrl),
      },
    }));
  };

  const uploadImageForColor = async (color: string, file: File) => {
    setUploadingColorImage(color);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) {
        toast({ title: 'Ошибка', description: uploadError.message, variant: 'destructive' });
        return;
      }
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
      if (urlData?.publicUrl) {
        setFormData(prev => ({
          ...prev,
          color_images: {
            ...prev.color_images,
            [color]: [...(prev.color_images[color] || []), urlData.publicUrl],
          },
        }));
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить', variant: 'destructive' });
    } finally {
      setUploadingColorImage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название *</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Категория *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary_category">Вторая категория</Label>
          <Select value={formData.secondary_category || 'none'} onValueChange={(value) => setFormData((prev) => ({ ...prev, secondary_category: value === 'none' ? null : value }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Нет —</SelectItem>
              {categories.filter(cat => cat !== formData.category).map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Цена (BYN) *</Label>
          <Input id="price" type="text" inputMode="decimal" value={priceValue} onChange={handlePriceChange} placeholder="0" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="old_price">Старая цена (BYN)</Label>
          <Input id="old_price" type="text" inputMode="decimal" value={oldPriceValue} onChange={handleOldPriceChange} placeholder="" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} rows={4} />
      </div>

      <div className="space-y-2">
        <Label>Размеры</Label>
        <div className="flex flex-wrap gap-2">
          {defaultSizes.map((size) => (
            <Button key={size} type="button" variant={formData.sizes.includes(size) ? 'default' : 'outline'} size="sm" onClick={() => toggleSize(size)}>{size}</Button>
          ))}
        </div>
      </div>

      {/* Colors with per-color image galleries */}
      <div className="space-y-2">
        <Label>Цвета и фотографии</Label>
        <p className="text-xs text-muted-foreground mb-2">Добавьте цвета и загрузите фотографии для каждого. В каталоге каждый цвет будет отдельной карточкой.</p>
        <div className="flex gap-2">
          <Input value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Добавить цвет" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())} />
          <Button type="button" onClick={addColor} variant="outline">Добавить</Button>
        </div>
        <div className="flex flex-col gap-4 mt-3">
          {formData.colors.map((color) => {
            const colorImages = formData.color_images[color] || [];
            return (
              <div key={color} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{color}</span>
                  <button type="button" onClick={() => removeColor(color)} className="text-destructive hover:opacity-70">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Color images gallery */}
                <div className="flex flex-wrap gap-2">
                  {colorImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`${color} ${idx + 1}`} className="w-20 h-24 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                      <button type="button" onClick={() => removeColorImage(color, img)} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sizes for this color */}
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Доступные размеры для "{color}":</span>
                  <div className="flex flex-wrap gap-1">
                    {defaultSizes.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={(formData.color_sizes[color] || []).includes(size) ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => toggleColorSize(color, size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Upload button for this color */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingColorImage === color}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.multiple = true;
                    input.onchange = async (ev) => {
                      const files = (ev.target as HTMLInputElement).files;
                      if (!files) return;
                      for (const file of Array.from(files)) {
                        await uploadImageForColor(color, file);
                      }
                    };
                    input.click();
                  }}
                >
                  {uploadingColorImage === color ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Загрузка...</>
                  ) : (
                    <><Upload className="h-3 w-3 mr-1" />Загрузить фото для "{color}"</>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch id="is_new" checked={formData.is_new} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_new: checked }))} />
          <Label htmlFor="is_new">Новинка</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="is_bestseller" checked={formData.is_bestseller} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_bestseller: checked }))} />
          <Label htmlFor="is_bestseller">Бестселлер</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="is_sale" checked={formData.is_sale} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_sale: checked }))} />
          <Label htmlFor="is_sale">Распродажа</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="is_last_sizes" checked={formData.is_last_sizes} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_last_sizes: checked }))} />
          <Label htmlFor="is_last_sizes">Последние размеры</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Позиция (порядок сортировки)</Label>
        <Input id="position" type="number" value={positionValue} onChange={(e) => { setPositionValue(e.target.value); setFormData((prev) => ({ ...prev, position: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })); }} placeholder="0" />
        <p className="text-xs text-muted-foreground">Чем меньше число, тем выше товар в каталоге</p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading || uploadingImage}>{loading ? 'Сохранение...' : product ? 'Сохранить' : 'Добавить товар'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
      </div>
    </form>
  );
};

export default ProductForm;
