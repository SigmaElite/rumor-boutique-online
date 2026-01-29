import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { z } from "zod";

const orderSchema = z.object({
  phone: z.string().min(9, "Введите корректный номер телефона"),
  name: z.string().min(2, "Введите ваше имя"),
  email: z.string().email("Введите корректный email"),
});

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    phone: "+375",
    name: "",
    email: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " BYN";
  };

  const getProductImage = (images: string[] | null) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return '/placeholder.svg';
  };

  const validateForm = () => {
    try {
      orderSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== STEP 1: Form submit started ===');
    console.log('Form data:', formData);
    console.log('Cart items:', items);
    console.log('Total price:', totalPrice);
    console.log('Agreement accepted:', agreed);

    if (!agreed) {
      console.log('ERROR: Agreement not accepted');
      toast.error("Необходимо принять условия оферты");
      return;
    }

    if (items.length === 0) {
      console.log('ERROR: Cart is empty');
      toast.error("Корзина пуста");
      return;
    }

    if (!validateForm()) {
      console.log('ERROR: Form validation failed', errors);
      return;
    }

    console.log('=== STEP 2: Validation passed, creating order ===');
    setLoading(true);

    try {
      // Create order via edge function (bypasses RLS)
      console.log('Calling create-order edge function...');
      const { data: orderResult, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          total_price: totalPrice,
          items: items.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            product_price: item.product.price,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
          })),
        }
      });

      if (orderError) {
        console.log('=== ERROR: Order creation failed ===');
        console.log('Order error:', orderError);
        throw orderError;
      }

      if (!orderResult?.orderId) {
        console.log('=== ERROR: No orderId returned ===');
        throw new Error('No orderId returned from server');
      }

      console.log('=== STEP 3: Order created successfully ===');
      console.log('Order ID:', orderResult.orderId);

      // Get WebPay redirect URL from JSON API
      console.log('=== STEP 4: Calling webpay-create-payment function ===');
      console.log('Calling with orderId:', orderResult.orderId);

      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('webpay-create-payment', {
        body: { orderId: orderResult.orderId }
      });

      console.log('WebPay function response:');
      console.log('  paymentData:', paymentData);
      console.log('  paymentError:', paymentError);

      if (paymentError) {
        console.log('=== ERROR: WebPay function error ===');
        console.log('Payment error details:', paymentError);
        throw new Error('Failed to create payment: ' + JSON.stringify(paymentError));
      }

      if (!paymentData?.redirectUrl) {
        console.log('=== ERROR: No redirectUrl returned ===');
        console.log('Payment data received:', paymentData);
        throw new Error('No redirectUrl returned from WebPay');
      }

      console.log('=== STEP 5: Got redirectUrl, redirecting... ===');
      console.log('Redirect URL:', paymentData.redirectUrl);

      // Clear cart and form
      clearCart();
      setFormData({ phone: "+375", name: "", email: "" });
      setAgreed(false);
      setIsCartOpen(false);
      
      // Redirect to WebPay payment page
      window.location.href = paymentData.redirectUrl;
      
    } catch (error: any) {
      console.log('=== CATCH BLOCK: Error occurred ===');
      console.log('Error type:', typeof error);
      console.log('Error message:', error?.message);
      console.log('Full error:', error);
      toast.error("Не удалось оформить заказ. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          {/* Header */}
          <h2 className="text-xl font-medium mb-6">Ваш заказ:</h2>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Ваша корзина пуста</p>
              <Link
                to="/catalog"
                onClick={() => setIsCartOpen(false)}
                className="btn-primary inline-block"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex gap-4 items-start">
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-16 h-20 flex-shrink-0 bg-secondary overflow-hidden"
                    >
                      <img
                        src={getProductImage(item.product.images)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </Link>

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-medium hover:opacity-60 transition-opacity block"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.size && <span>Размер: {item.size}</span>}
                        {item.size && item.color && <br />}
                        {item.color && <span>Цвет: {item.color}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                        className="w-6 h-6 flex items-center justify-center border border-border rounded-full hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                        className="w-6 h-6 flex items-center justify-center border border-border rounded-full hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-medium whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="p-1 hover:opacity-60 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="text-right mb-6">
                <span className="font-medium">Сумма: {formatPrice(totalPrice)}</span>
              </div>

              {/* Info text */}
              <div className="bg-secondary/50 p-4 mb-6 text-sm italic">
                <p className="font-medium mb-2">При подтверждении заказа, консультант проинформирует вас о наличии изделия на складе или необходимости его отшить по вашим параметрам для идеальной посадки</p>
              </div>

              {/* Form */}
              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Данные получателя</h3>

                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+375 (XX) XXX-XX-XX"
                    disabled={loading}
                    className="border-foreground"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ваше имя"
                    disabled={loading}
                    className="border-foreground"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    disabled={loading}
                    className="border-foreground"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                {/* Agreement checkbox */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreement"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    disabled={loading}
                  />
                  <label htmlFor="agreement" className="text-sm leading-relaxed cursor-pointer">
                    Согласен (-сна) с условиями{" "}
                    <Link to="/offer" className="underline" onClick={() => setIsCartOpen(false)}>Оферты</Link>,{" "}
                    <Link to="/privacy" className="underline" onClick={() => setIsCartOpen(false)}>Политики обработки персональных данных</Link>,{" "}
                    <Link to="/returns" className="underline" onClick={() => setIsCartOpen(false)}>Политики возврата товара</Link>
                  </label>
                </div>
              </div>

              {/* Total and submit */}
              <div className="text-right mb-4">
                <span className="text-lg font-medium">Итоговая сумма: {formatPrice(totalPrice)}</span>
              </div>

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full bg-foreground text-background py-4 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Оформление...' : 'Оформить заказ'}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartDrawer;
