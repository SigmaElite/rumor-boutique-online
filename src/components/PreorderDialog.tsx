import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const preorderSchema = z.object({
  name: z.string().trim().nonempty({ message: "Укажите имя" }).max(100, { message: "Имя слишком длинное" }),
  phone: z.string().trim().nonempty({ message: "Укажите телефон" }).max(30, { message: "Телефон слишком длинный" }),
  size: z.string().trim().max(20).optional(),
  comment: z.string().trim().max(500, { message: "Комментарий слишком длинный" }).optional(),
});

interface PreorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  selectedSize?: string;
  selectedColor?: string;
}

const PreorderDialog = ({
  open,
  onOpenChange,
  productId,
  productName,
  selectedSize,
  selectedColor,
}: PreorderDialogProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState(selectedSize || "");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = preorderSchema.safeParse({ name, phone, size, comment });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("preorder_requests").insert({
      product_id: productId,
      product_name: productName,
      customer_name: parsed.data.name,
      phone: parsed.data.phone,
      size: parsed.data.size || null,
      color: selectedColor || null,
      comment: parsed.data.comment || null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
      return;
    }

    toast.success("Заявка на предзаказ отправлена! Мы свяжемся с вами.");
    setName("");
    setPhone("");
    setSize("");
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Оформить предзаказ</DialogTitle>
          <DialogDescription>
            {productName}
            {selectedColor ? ` · ${selectedColor}` : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Имя *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Телефон *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={30}
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="+375 ..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Нужный размер</label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              maxLength={20}
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Например: S"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Комментарий</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Пожелания, вопросы..."
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
            {submitting ? "Отправка..." : "Отправить заявку"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PreorderDialog;
