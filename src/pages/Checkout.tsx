import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const deliveryOptions = [
  {
    value: "pickup",
    label: "Самовывоз",
    description: "ЖК Левада, ул. Нововиленская, 61, 3 подъезд, флагманский магазин Румор",
    needsAddress: false,
  },
  {
    value: "courier_minsk",
    label: "Курьер по Минску",
    description: "Укажите точный адрес, желаемые дату и время доставки",
    needsAddress: true,
  },
  {
    value: "europochta",
    label: "Европочта до двери/до отделения",
    description: "Укажите точный адрес или адрес отделения",
    needsAddress: true,
  },
  {
    value: "cdek",
    label: "СДЭК до двери/до отделения",
    description: "Укажите точный адрес или адрес отделения",
    needsAddress: true,
  },
  {
    value: "belpochta",
    label: "Белпочта по всему миру",
    description: "За пределы РБ и РФ, без возможности возврата/обмена. Укажите точный адрес",
    needsAddress: true,
  },
];

const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Введите ФИО').max(100, 'Имя слишком длинное'),
  email: z.string().trim().email('Введите корректный email').max(255, 'Email слишком длинный'),
  phone: z.string().trim().min(9, 'Введите корректный номер телефона').max(20, 'Номер слишком длинный')
    .regex(/^[\+0-9\s\-\(\)]+$/, 'Номер содержит недопустимые символы'),
  comment: z.string().max(1000, 'Комментарий слишком длинный').optional(),
});

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    instagram: '',
    deliveryMethod: 'pickup',
    deliveryAddress: '',
    paymentMethod: 'cash',
    comment: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " BYN";
  };

  const getProductImage = (images: string[] | null) => {
    if (images && images.length > 0) return images[0];
    return '/placeholder.svg';
  };

  const selectedDelivery = deliveryOptions.find(d => d.value === formData.deliveryMethod);

  const validateForm = () => {
    try {
      checkoutSchema.parse({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        comment: formData.comment?.trim(),
      });
      const fieldErrors: Record<string, string> = {};
      if (selectedDelivery?.needsAddress && !formData.deliveryAddress.trim()) {
        fieldErrors.deliveryAddress = 'Укажите адрес доставки';
      }
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return false;
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        if (selectedDelivery?.needsAddress && !formData.deliveryAddress.trim()) {
          fieldErrors.deliveryAddress = 'Укажите адрес доставки';
        }
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({ title: 'Корзина пуста', description: 'Добавьте товары в корзину', variant: 'destructive' });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const deliveryLabel = selectedDelivery?.label || formData.deliveryMethod;
      const deliveryAddress = selectedDelivery?.needsAddress
        ? formData.deliveryAddress.trim()
        : selectedDelivery?.description || 'Самовывоз';

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
      }));

      const response = await supabase.functions.invoke('create-order', {
        body: {
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim(),
          customer_phone: formData.phone.trim(),
          customer_instagram: formData.instagram.trim() || null,
          delivery_address: deliveryAddress,
          delivery_method: deliveryLabel,
          payment_method: formData.paymentMethod,
          comment: formData.comment?.trim() || null,
          items: orderItems,
        },
      });

      if (response.error) throw new Error(response.error.message || 'Ошибка создания заказа');

      const { orderId } = response.data;
      if (!orderId) throw new Error('Заказ не был создан');

      clearCart();
      toast({ title: 'Заказ оформлен!', description: `Номер заказа: ${orderId.slice(0, 8).toUpperCase()}` });
      navigate('/order-success', { state: { orderId } });
    } catch (error: any) {
      console.error('Order error:', error);
      toast({ title: 'Ошибка', description: error.message || 'Не удалось оформить заказ.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <h1 className="font-script text-4xl mb-4">корзина пуста</h1>
            <p className="text-muted-foreground mb-6">Добавьте товары для оформления заказа</p>
            <Link to="/catalog" className="btn-primary">Перейти в каталог</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container-custom py-8 md:py-16">
        <h1 className="font-script text-4xl text-center mb-8">оформление заказа</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-display tracking-widest uppercase text-sm">Контактные данные</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name">ФИО *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Фамилия Имя Отчество" disabled={loading} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+375 XX XXX XX XX" disabled={loading} />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram (опционально)</Label>
                  <Input id="instagram" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="@username" disabled={loading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" disabled={loading} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-display tracking-widest uppercase text-sm">Тип доставки</h2>
                
                <RadioGroup
                  value={formData.deliveryMethod}
                  onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value, deliveryAddress: '' })}
                  className="space-y-3"
                >
                  {deliveryOptions.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <RadioGroupItem value={option.value} id={`checkout-${option.value}`} className="mt-1" />
                      <Label htmlFor={`checkout-${option.value}`} className="font-normal cursor-pointer leading-relaxed">
                        <span className="font-medium">{option.label}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {selectedDelivery?.needsAddress && (
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес доставки *</Label>
                    <Textarea
                      id="address"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      placeholder={formData.deliveryMethod === 'courier_minsk' ? 'Точный адрес, желаемые дата и время доставки' : 'Точный адрес или адрес отделения'}
                      disabled={loading}
                    />
                    {errors.deliveryAddress && <p className="text-sm text-destructive">{errors.deliveryAddress}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="font-display tracking-widest uppercase text-sm">Способ оплаты</h2>
                
                <RadioGroup value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="font-normal cursor-pointer">Наличными при получении</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="font-normal cursor-pointer">Картой при получении</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий к заказу</Label>
                <Textarea id="comment" value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} placeholder="Дополнительные пожелания" disabled={loading} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Оформление...' : 'Оформить заказ'}
              </Button>
            </form>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-secondary p-6 space-y-4">
              <h2 className="font-display tracking-widest uppercase text-sm border-b border-border pb-4">Ваш заказ</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                    <div className="w-16 h-20 flex-shrink-0 bg-background overflow-hidden">
                      <img src={getProductImage(item.product.images)} alt={item.product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.size && <span>Размер: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && <span>Цвет: {item.color}</span>}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                        <span className="text-sm">{item.product.price * item.quantity} BYN</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-lg">
                <span>Итого:</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;