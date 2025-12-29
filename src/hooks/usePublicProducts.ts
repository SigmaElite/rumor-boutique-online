import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PublicProduct {
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
}

export const usePublicProducts = () => {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, old_price, category, sizes, images, colors, is_bestseller, is_new, is_sale')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data?.map(p => ({
        ...p,
        sizes: p.sizes || [],
        images: p.images || [],
        colors: p.colors || [],
        is_bestseller: p.is_bestseller || false,
        is_new: p.is_new || false,
        is_sale: p.is_sale || false,
      })) || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductById = (id: string): PublicProduct | undefined => {
    return products.find(p => p.id === id);
  };

  const getBestsellers = (): PublicProduct[] => {
    return products.filter(p => p.is_bestseller);
  };

  const getSaleProducts = (): PublicProduct[] => {
    return products.filter(p => p.is_sale);
  };

  const getRelatedProducts = (currentId: string, count: number = 4): PublicProduct[] => {
    return products.filter(p => p.id !== currentId).slice(0, count);
  };

  const getCategories = (): string[] => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  };

  return {
    products,
    loading,
    fetchProducts,
    getProductById,
    getBestsellers,
    getSaleProducts,
    getRelatedProducts,
    getCategories,
  };
};
