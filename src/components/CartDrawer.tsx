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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { z } from "zod";

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

const orderSchema = z.object({
  phone: z.string().min(9, "Введите корректный номер телефона"),
  name: z.string().min(2, "Введите ваше ФИО"),
  email: z.string().email("Введите корректный email"),
});

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    phone: "+375",
    name: "",
    email: "",
    instagram: "",
    deliveryMethod: "pickup",
    deliveryAddress: "",
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

  const selectedDelivery = deliveryOptions.find(d => d.value === formData.deliveryMethod);

  const validateForm = () => {
    try {
      orderSchema.parse(formData);
      const fieldErrors: Record<string, string> = {};
      
      if (selectedDelivery?.needsAddress && !formData.deliveryAddress.trim()) {
        fieldErrors.deliveryAddress = "Укажите адрес доставки";
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
          fieldErrors.deliveryAddress = "Укажите адрес доставки";
        }
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Необходимо принять условия оферты");
      return;
    }

    if (items.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const deliveryLabel = selectedDelivery?.label || formData.deliveryMethod;
      const deliveryAddress = selectedDelivery?.needsAddress
        ? formData.deliveryAddress.trim()
        : selectedDelivery?.description || "Самовывоз";

      const { data: orderResult, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_instagram: formData.instagram.trim() || null,
          delivery_address: deliveryAddress,
          delivery_method: deliveryLabel,
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

      if (orderError) throw orderError;
      if (!orderResult?.orderId) throw new Error('No orderId returned from server');

      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('webpay-create-payment', {
        body: { orderId: orderResult.orderId }
      });

      if (paymentError) throw new Error('Failed to create payment: ' + JSON.stringify(paymentError));
      if (!paymentData?.redirectUrl) throw new Error('No redirectUrl returned from WebPay');

      clearCart();
      setFormData({ phone: "+375", name: "", email: "", instagram: "", deliveryMethod: "pickup", deliveryAddress: "" });
      setAgreed(false);
      setIsCartOpen(false);
      
      window.location.href = paymentData.redirectUrl;
      
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error("Не удалось оформить заказ. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
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
                  <Label htmlFor="name">ФИО *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Фамилия Имя Отчество"
                    disabled={loading}
                    className="border-foreground"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона *</Label>
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
                  <Label htmlFor="instagram">Instagram (опционально)</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@username"
                    disabled={loading}
                    className="border-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">e-mail *</Label>
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
              </div>

              {/* Delivery Options */}
              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Тип доставки</h3>

                <RadioGroup
                  value={formData.deliveryMethod}
                  onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value, deliveryAddress: "" })}
                  className="space-y-3"
                >
                  {deliveryOptions.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <Label htmlFor={option.value} className="font-normal cursor-pointer leading-relaxed">
                        <span className="font-medium">{option.label}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {selectedDelivery?.needsAddress && (
                  <div className="space-y-2 mt-3">
                    <Label htmlFor="deliveryAddress">Адрес доставки *</Label>
                    <Textarea
                      id="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      placeholder={
                        formData.deliveryMethod === "courier_minsk"
                          ? "Точный адрес, желаемые дата и время доставки"
                          : "Точный адрес или адрес отделения"
                      }
                      disabled={loading}
                      className="border-foreground"
                    />
                    {errors.deliveryAddress && <p className="text-sm text-destructive">{errors.deliveryAddress}</p>}
                  </div>
                )}
              </div>

              {/* Agreement checkbox */}
              <div className="flex items-start space-x-2 mb-6">
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