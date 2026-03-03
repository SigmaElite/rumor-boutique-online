import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Image as ImageIcon, Ruler, Star, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUpload from './ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  useHomepageSettings,
  HeroSettings,
  CategoriesSettings,
  YouSectionSettings,
  SizeGuideSettings,
} from '@/hooks/useHomepageSettings';

interface BestsellersProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  is_bestseller: boolean;
  position: number;
}

const HomepageEditor = () => {
  const {
    heroSettings,
    categoriesSettings,
    youSectionSettings,
    sizeGuideSettings,
    loading,
    updateHeroSettings,
    updateCategoriesSettings,
    updateYouSectionSettings,
    updateSizeGuideSettings,
  } = useHomepageSettings();

  const [heroForm, setHeroForm] = useState<HeroSettings | null>(null);
  const [categoriesForm, setCategoriesForm] = useState<CategoriesSettings | null>(null);
  const [youSectionForm, setYouSectionForm] = useState<YouSectionSettings | null>(null);
  const [sizeGuideForm, setSizeGuideForm] = useState<SizeGuideSettings | null>(null);
  const [saving, setSaving] = useState(false);

  // Bestsellers state
  const [allProducts, setAllProducts] = useState<BestsellersProduct[]>([]);
  const [bestsellersLoading, setBestsellersLoading] = useState(false);
  const [bestsellersSearch, setBestsellersSearch] = useState('');

  // Initialize forms when settings load
  if (!heroForm && heroSettings) setHeroForm(heroSettings);
  if (!categoriesForm && categoriesSettings) setCategoriesForm(categoriesSettings);
  if (!youSectionForm && youSectionSettings) setYouSectionForm(youSectionSettings);
  if (!sizeGuideForm && sizeGuideSettings) setSizeGuideForm(sizeGuideSettings);
  if (!sizeGuideForm && !sizeGuideSettings && !loading) setSizeGuideForm({ image_url: '/size-guide-table.jpg' });

  // Fetch products for bestsellers tab
  const fetchBestsellersProducts = async () => {
    setBestsellersLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, price, images, is_bestseller, position')
        .order('position', { ascending: true });
      if (error) throw error;
      setAllProducts(data?.map(p => ({
        ...p,
        images: p.images || [],
        is_bestseller: p.is_bestseller || false,
        position: p.position || 0,
      })) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setBestsellersLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellersProducts();
  }, []);

  const toggleBestseller = async (productId: string, current: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_bestseller: !current })
      .eq('id', productId);
    if (error) {
      toast.error('Ошибка обновления');
      return;
    }
    setAllProducts(prev => prev.map(p => p.id === productId ? { ...p, is_bestseller: !current } : p));
  };

  const moveBestseller = async (productId: string, direction: 'up' | 'down') => {
    const bestsellers = allProducts.filter(p => p.is_bestseller).sort((a, b) => a.position - b.position);
    const idx = bestsellers.findIndex(p => p.id === productId);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= bestsellers.length) return;

    const posA = bestsellers[idx].position;
    const posB = bestsellers[swapIdx].position;

    const { error: e1 } = await supabase.from('products').update({ position: posB }).eq('id', bestsellers[idx].id);
    const { error: e2 } = await supabase.from('products').update({ position: posA }).eq('id', bestsellers[swapIdx].id);
    if (e1 || e2) { toast.error('Ошибка сортировки'); return; }

    setAllProducts(prev => prev.map(p => {
      if (p.id === bestsellers[idx].id) return { ...p, position: posB };
      if (p.id === bestsellers[swapIdx].id) return { ...p, position: posA };
      return p;
    }));
  };

  const currentBestsellers = allProducts.filter(p => p.is_bestseller).sort((a, b) => a.position - b.position);
  const nonBestsellers = allProducts.filter(p => !p.is_bestseller && (
    bestsellersSearch === '' ||
    p.name.toLowerCase().includes(bestsellersSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(bestsellersSearch.toLowerCase())
  ));

  const handleSaveHero = async () => {
    if (!heroForm) return;
    setSaving(true);
    await updateHeroSettings(heroForm);
    setSaving(false);
  };

  const handleSaveCategories = async () => {
    if (!categoriesForm) return;
    setSaving(true);
    await updateCategoriesSettings(categoriesForm);
    setSaving(false);
  };

  const handleSaveYouSection = async () => {
    if (!youSectionForm) return;
    setSaving(true);
    await updateYouSectionSettings(youSectionForm);
    setSaving(false);
  };

  const handleSaveSizeGuide = async () => {
    if (!sizeGuideForm) return;
    setSaving(true);
    await updateSizeGuideSettings(sizeGuideForm);
    setSaving(false);
  };

  const addCategory = () => {
    if (!categoriesForm) return;
    setCategoriesForm({
      items: [...categoriesForm.items, { name: '', image_url: '' }],
    });
  };

  const removeCategory = (index: number) => {
    if (!categoriesForm) return;
    setCategoriesForm({
      items: categoriesForm.items.filter((_, i) => i !== index),
    });
  };

  const updateCategory = (index: number, field: 'name' | 'image_url', value: string) => {
    if (!categoriesForm) return;
    const newItems = [...categoriesForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setCategoriesForm({ items: newItems });
  };

  const addYouItem = () => {
    if (!youSectionForm) return;
    setYouSectionForm({
      items: [...youSectionForm.items, { handle: '', image_url: '' }],
    });
  };

  const removeYouItem = (index: number) => {
    if (!youSectionForm) return;
    setYouSectionForm({
      items: youSectionForm.items.filter((_, i) => i !== index),
    });
  };

  const updateYouItem = (index: number, field: 'handle' | 'image_url', value: string) => {
    if (!youSectionForm) return;
    const newItems = [...youSectionForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setYouSectionForm({ items: newItems });
  };

  if (loading) {
    return <div className="text-muted-foreground">Загрузка настроек...</div>;
  }

  return (
    <Tabs defaultValue="hero" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="hero">Hero</TabsTrigger>
        <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
        <TabsTrigger value="categories">Категории</TabsTrigger>
        <TabsTrigger value="you">You секция</TabsTrigger>
        <TabsTrigger value="sizeguide">Размерная сетка</TabsTrigger>
      </TabsList>

      {/* Hero Section */}
      <TabsContent value="hero">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Hero секция
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {heroForm && (
              <>
                <ImageUpload
                  label="Фото Hero"
                  value={heroForm.image_url}
                  onChange={(url) => setHeroForm({ ...heroForm, image_url: url })}
                />
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Подзаголовок</Label>
                  <Input
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  />
                </div>
                <Button onClick={handleSaveHero} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Bestsellers Section */}
      <TabsContent value="bestsellers">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Управление Bestsellers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {bestsellersLoading ? (
              <div className="text-muted-foreground">Загрузка...</div>
            ) : (
              <>
                {/* Current bestsellers */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Текущие бестселлеры ({currentBestsellers.length})
                  </Label>
                  {currentBestsellers.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Нет выбранных бестселлеров</p>
                  ) : (
                    <div className="space-y-2">
                      {currentBestsellers.map((product, idx) => (
                        <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg bg-accent/30">
                          {product.images[0] && (
                            <img src={product.images[0]} alt="" className="w-12 h-16 object-cover rounded" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category} · ${product.price}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={idx === 0}
                              onClick={() => moveBestseller(product.id, 'up')}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={idx === currentBestsellers.length - 1}
                              onClick={() => moveBestseller(product.id, 'down')}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => toggleBestseller(product.id, true)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add from all products */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Добавить товар в бестселлеры</Label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по названию или категории..."
                      value={bestsellersSearch}
                      onChange={(e) => setBestsellersSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="space-y-1 max-h-[400px] overflow-y-auto">
                    {nonBestsellers.map(product => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/20 cursor-pointer"
                        onClick={() => toggleBestseller(product.id, false)}
                      >
                        <Checkbox checked={false} />
                        {product.images[0] && (
                          <img src={product.images[0]} alt="" className="w-10 h-13 object-cover rounded" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                    ))}
                    {nonBestsellers.length === 0 && (
                      <p className="text-sm text-muted-foreground py-2">Нет товаров для добавления</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Categories Section */}
      <TabsContent value="categories">
        <Card>
          <CardHeader>
            <CardTitle>Категории товаров</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoriesForm?.items.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <Label>Название</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateCategory(index, 'name', e.target.value)}
                      placeholder="Название категории"
                    />
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => removeCategory(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ImageUpload
                  label="Изображение категории"
                  value={item.image_url}
                  onChange={(url) => updateCategory(index, 'image_url', url)}
                  placeholder="Оставьте пустым для отображения текста"
                />
              </div>
            ))}
            <div className="flex gap-4">
              <Button variant="outline" onClick={addCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить категорию
              </Button>
              <Button onClick={handleSaveCategories} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* You Section */}
      <TabsContent value="you">
        <Card>
          <CardHeader>
            <CardTitle>Секция "You"</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {youSectionForm?.items.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <Label>Handle (@username)</Label>
                    <Input
                      value={item.handle}
                      onChange={(e) => updateYouItem(index, 'handle', e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => removeYouItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ImageUpload
                  label="Фото"
                  value={item.image_url}
                  onChange={(url) => updateYouItem(index, 'image_url', url)}
                />
              </div>
            ))}
            <div className="flex gap-4">
              <Button variant="outline" onClick={addYouItem}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
              <Button onClick={handleSaveYouSection} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Size Guide Section */}
      <TabsContent value="sizeguide">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Размерная сетка
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              label="Фото размерной сетки"
              value={sizeGuideForm?.image_url || ''}
              onChange={(url) => setSizeGuideForm({ image_url: url })}
            />
            <Button onClick={handleSaveSizeGuide} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default HomepageEditor;
