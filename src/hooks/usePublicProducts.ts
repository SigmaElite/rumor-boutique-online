import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { normalizeColorImages, normalizeColorSizes } from './useProducts';

export interface PublicProduct {
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
  color_images: Record<string, string[]>;
  color_sizes: Record<string, string[]>;
  bestseller_colors: string[];
  is_bestseller: boolean;
  is_new: boolean;
  is_sale: boolean;
  is_last_sizes: boolean;
  badge_text?: string | null;
  position: number;
}

// Shared cache: one request for all components, reused for 5 minutes
const TTL = 5 * 60 * 1000;
const LS_KEY = 'public_products_cache_v2';
let cache: PublicProduct[] | null = null;
let cacheTime = 0;
let inflight: Promise<PublicProduct[]> | null = null;
const listeners = new Set<(p: PublicProduct[]) => void>();
try {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) { const j = JSON.parse(raw); cache = j.data; cacheTime = j.time || 0; }
} catch { /* ignore */ }

const loadProducts = (force = false): Promise<PublicProduct[]> => {
  if (!force && cache && Date.now() - cacheTime < TTL) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = (async () => {
      const base = 'id, name, description, price, old_price, category, secondary_category, sizes, images, colors, color_images, color_sizes, bestseller_colors, is_bestseller, is_new, is_sale, is_last_sizes, position';
      const run = (cols: string) => supabase
        .from('products')
        .select(cols)
        .order('position', { ascending: true })
        .order('created_at', { ascending: false });
      let { data, error } = await run(`${base}, badge_text`) as { data: any[] | null; error: any };
      // Fallback: databases without the badge_text column must still load products
      if (error && (error.code === '42703' || String(error.message || '').includes('badge_text'))) {
        ({ data, error } = await run(base) as { data: any[] | null; error: any });
      }

      if (error) throw error;
      const mapped: PublicProduct[] = (data?.map(p => ({
        ...p,
        secondary_category: p.secondary_category || null,
        sizes: p.sizes || [],
        images: p.images || [],
        colors: p.colors || [],
        color_images: normalizeColorImages(p.color_images),
        color_sizes: normalizeColorSizes(p.color_sizes),
        bestseller_colors: (p as any).bestseller_colors || [],
        is_bestseller: p.is_bestseller || false,
        is_new: p.is_new || false,
        is_sale: p.is_sale || false,
        is_last_sizes: p.is_last_sizes || false,
        badge_text: (p as any).badge_text || null,
        position: p.position || 0,
      })) || []) as PublicProduct[];
      cache = mapped; cacheTime = Date.now();
      try { localStorage.setItem(LS_KEY, JSON.stringify({ data: mapped, time: cacheTime })); } catch { /* quota */ }
      listeners.forEach(l => l(mapped));
      return mapped;
  })().finally(() => { inflight = null; });
  return inflight;
};

export const usePublicProducts = () => {
  const [products, setProducts] = useState<PublicProduct[]>(cache || []);
  const [loading, setLoading] = useState(!cache);

  const fetchProducts = async (force = true) => {
    try {
      if (!cache) setLoading(true);
      setProducts(await loadProducts(force));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listeners.add(setProducts);
    fetchProducts(false);
    return () => { listeners.delete(setProducts); };
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

  return { products, loading, fetchProducts, getProductById, getBestsellers, getSaleProducts, getRelatedProducts, getCategories };
};
