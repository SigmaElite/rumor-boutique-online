import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';
export interface HeroSettings {
  image_url: string;
  title: string;
  subtitle: string;
}

export interface CategoryItem {
  name: string;
  image_url: string;
}

export interface CategoriesSettings {
  items: CategoryItem[];
}

export interface YouSectionItem {
  handle: string;
  image_url: string;
}

export interface YouSectionSettings {
  items: YouSectionItem[];
}

export interface SizeGuideSettings {
  image_url: string;
}

export const useHomepageSettings = () => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [categoriesSettings, setCategoriesSettings] = useState<CategoriesSettings | null>(null);
  const [youSectionSettings, setYouSectionSettings] = useState<YouSectionSettings | null>(null);
  const [sizeGuideSettings, setSizeGuideSettings] = useState<SizeGuideSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('*');

      if (error) throw error;

      data?.forEach((setting: { id: string; data: unknown }) => {
        if (setting.id === 'hero') {
          setHeroSettings(setting.data as HeroSettings);
        } else if (setting.id === 'categories') {
          setCategoriesSettings(setting.data as CategoriesSettings);
        } else if (setting.id === 'you_section') {
          setYouSectionSettings(setting.data as YouSectionSettings);
        } else if (setting.id === 'size_guide') {
          setSizeGuideSettings(setting.data as SizeGuideSettings);
        }
      });
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHeroSettings = async (data: HeroSettings) => {
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .update({ data: JSON.parse(JSON.stringify(data)) as Json })
        .eq('id', 'hero');

      if (error) throw error;

      setHeroSettings(data);
      toast({ title: 'Успешно', description: 'Hero секция обновлена' });
      return { error: null };
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить', variant: 'destructive' });
      return { error };
    }
  };

  const updateCategoriesSettings = async (data: CategoriesSettings) => {
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .update({ data: JSON.parse(JSON.stringify(data)) as Json })
        .eq('id', 'categories');

      if (error) throw error;

      setCategoriesSettings(data);
      toast({ title: 'Успешно', description: 'Категории обновлены' });
      return { error: null };
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить', variant: 'destructive' });
      return { error };
    }
  };

  const updateYouSectionSettings = async (data: YouSectionSettings) => {
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .update({ data: JSON.parse(JSON.stringify(data)) as Json })
        .eq('id', 'you_section');

      if (error) throw error;

      setYouSectionSettings(data);
      toast({ title: 'Успешно', description: 'Секция You обновлена' });
      return { error: null };
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить', variant: 'destructive' });
      return { error };
    }
  };

  const updateSizeGuideSettings = async (data: SizeGuideSettings) => {
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .upsert({ id: 'size_guide', data: JSON.parse(JSON.stringify(data)) as Json });

      if (error) throw error;

      setSizeGuideSettings(data);
      toast({ title: 'Успешно', description: 'Размерная сетка обновлена' });
      return { error: null };
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить', variant: 'destructive' });
      return { error };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    heroSettings,
    categoriesSettings,
    youSectionSettings,
    sizeGuideSettings,
    loading,
    updateHeroSettings,
    updateCategoriesSettings,
    updateYouSectionSettings,
    updateSizeGuideSettings,
    refetch: fetchSettings,
  };
};
