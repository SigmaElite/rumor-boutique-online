import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: string;
  sizes: string[];
  images: string[];
  colors: string[];
  is_bestseller: boolean;
  is_new: boolean;
  is_sale: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  category: string;
  sizes: string[];
  images: string[];
  colors: string[];
  is_bestseller: boolean;
  is_new: boolean;
  is_sale: boolean;
}

export const useProducts = () => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить товары',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: ProductFormData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Товар добавлен',
      });

      await fetchProducts();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateProduct = async (id: string, productData: Partial<ProductFormData>) => {
    try {
      console.log('Updating product:', id, productData);
      
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      console.log('Update result:', { data, error });

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Товар обновлён',
      });

      await fetchProducts();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Ошибка',
        description: error?.message || 'Не удалось обновить товар',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Товар удалён',
      });

      await fetchProducts();
      return { error: null };
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
