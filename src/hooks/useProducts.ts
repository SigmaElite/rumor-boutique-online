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
  secondary_category: string | null;
  sizes: string[];
  images: string[];
  colors: string[];
  color_images: Record<string, string>;
  is_bestseller: boolean;
  is_new: boolean;
  is_sale: boolean;
  is_last_sizes: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  category: string;
  secondary_category: string | null;
  sizes: string[];
  images: string[];
  colors: string[];
  color_images: Record<string, string>;
  is_bestseller: boolean;
  is_new: boolean;
  is_sale: boolean;
  is_last_sizes: boolean;
  position: number;
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
        .order('position', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data || []).map(p => ({
        ...p,
        color_images: (p.color_images as Record<string, string>) || {},
      })));
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
      // Clean color_images: remove empty values
      const cleanedData = { ...productData };
      if (cleanedData.color_images) {
        const cleaned: Record<string, string> = {};
        for (const [k, v] of Object.entries(cleanedData.color_images)) {
          if (v && v.trim()) cleaned[k] = v.trim();
        }
        cleanedData.color_images = cleaned;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([cleanedData])
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
      // Clean color_images: remove empty values
      const cleanedData = { ...productData };
      if (cleanedData.color_images) {
        const cleaned: Record<string, string> = {};
        for (const [k, v] of Object.entries(cleanedData.color_images)) {
          if (v && v.trim()) cleaned[k] = v.trim();
        }
        cleanedData.color_images = cleaned;
      }
      console.log('Updating product:', id, cleanedData);
      
      const { data, error } = await supabase
        .from('products')
        .update(cleanedData)
        .eq('id', id)
        .select()
        .single();

      console.log('Update result:', { data, error });

      if (error) throw error;

      // Immediately update local state with the new data
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === id ? { ...p, ...data, color_images: (data.color_images as Record<string, string>) || {} } : p)
      );

      toast({
        title: 'Успешно',
        description: 'Товар обновлён',
      });

      // Also refetch to ensure consistency
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
