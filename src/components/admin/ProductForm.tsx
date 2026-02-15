import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DbProduct, ProductFormData } from '@/hooks/useProducts';
import { X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: DbProduct | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const categories = ['NEW', 'Корсеты', 'Платья', 'Комплекты', 'Юбки', 'Костюмы', 'Верхняя одежда', 'Спорт'];
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
];

const ProductForm = ({ product, onSubmit, onCancel, loading }: ProductFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
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
    is_bestseller: false,
    is_new: false,
    is_sale: false,
    is_last_sizes: false,
    position: 0,
  });

  // For controlled price input that allows empty string
  const [priceValue, setPriceValue] = useState('');
  const [oldPriceValue, setOldPriceValue] = useState('');
  const [positionValue, setPositionValue] = useState('0');

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
        secondary_category: product.secondary_category || null,
        sizes: product.sizes || [],
        images: product.images || [],
        colors: product.colors || [],
        color_images: (product.color_images as Record<string, string>) || {},
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
      // Reset form for new product
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
    
    // Validate price
    const price = parseFloat(priceValue);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Укажите корректную цену',
        variant: 'destructive',
      });
      return;
    }
    
    const submitData: ProductFormData = {
      ...formData,
      price: price,
      old_price: oldPriceValue ? parseFloat(oldPriceValue) : null,
    };
    
    await onSubmit(submitData);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid number input
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPriceValue(value);
    }
  };

  const handleOldPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setOldPriceValue(value);
    }
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    
    try {
      for (const file of Array.from(files)) {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: 'Ошибка загрузки',
            description: uploadError.message,
            variant: 'destructive',
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, urlData.publicUrl],
          }));
        }
      }

      toast({
        title: 'Успешно',
        description: 'Изображения загружены',
      });
    } catch (error) {
      console.error('Error uploading:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить изображения',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
          <Label htmlFor="secondary_category">Вторая категория</Label>
          <Select
            value={formData.secondary_category || 'none'}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, secondary_category: value === 'none' ? null : value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Нет —</SelectItem>
              {categories.filter(cat => cat !== formData.category).map((cat) => (
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
            type="text"
            inputMode="decimal"
            value={priceValue}
            onChange={handlePriceChange}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="old_price">Старая цена (BYN)</Label>
          <Input
            id="old_price"
            type="text"
            inputMode="decimal"
            value={oldPriceValue}
            onChange={handleOldPriceChange}
            placeholder=""
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
        <div className="flex flex-col gap-3 mt-2">
          {formData.colors.map((color) => (
            <div key={color} className="flex items-center gap-3 p-2 border rounded">
              <span className="text-sm font-medium min-w-[80px]">{color}</span>
              {formData.color_images[color] ? (
                <img src={formData.color_images[color]} alt={color} className="w-12 h-12 object-cover rounded border" />
              ) : null}
              <Input
                placeholder={`URL фото для "${color}"`}
                value={formData.color_images[color] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  color_images: { ...prev.color_images, [color]: e.target.value },
                }))}
                className="flex-1 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // Open file picker for this color
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (ev) => {
                    const file = (ev.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                    const filePath = `products/${fileName}`;
                    const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
                    if (uploadError) { toast({ title: 'Ошибка', description: uploadError.message, variant: 'destructive' }); return; }
                    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
                    if (urlData?.publicUrl) {
                      setFormData(prev => ({
                        ...prev,
                        color_images: { ...prev.color_images, [color]: urlData.publicUrl },
                        images: prev.images.includes(urlData.publicUrl) ? prev.images : [...prev.images, urlData.publicUrl],
                      }));
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="h-3 w-3" />
              </Button>
              <button type="button" onClick={() => removeColor(color)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Изображения</Label>
        
        {/* File Upload */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="flex-1"
          >
            {uploadingImage ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Загрузить с компьютера
              </>
            )}
          </Button>
        </div>
        
        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="Или введите URL изображения"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
          />
          <Button type="button" onClick={addImage} variant="outline">
            Добавить
          </Button>
        </div>
        
        {/* Image Previews */}
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-16 h-16 object-cover rounded border"
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

        <div className="flex items-center gap-2">
          <Switch
            id="is_last_sizes"
            checked={formData.is_last_sizes}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_last_sizes: checked }))}
          />
          <Label htmlFor="is_last_sizes">Последние размеры</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Позиция (порядок сортировки)</Label>
        <Input
          id="position"
          type="number"
          value={positionValue}
          onChange={(e) => {
            setPositionValue(e.target.value);
            setFormData((prev) => ({ ...prev, position: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }));
          }}
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground">Чем меньше число, тем выше товар в каталоге</p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading || uploadingImage}>
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