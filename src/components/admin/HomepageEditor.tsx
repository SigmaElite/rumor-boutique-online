import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import {
  useHomepageSettings,
  HeroSettings,
  CategoriesSettings,
  YouSectionSettings,
} from '@/hooks/useHomepageSettings';

const HomepageEditor = () => {
  const {
    heroSettings,
    categoriesSettings,
    youSectionSettings,
    loading,
    updateHeroSettings,
    updateCategoriesSettings,
    updateYouSectionSettings,
  } = useHomepageSettings();

  const [heroForm, setHeroForm] = useState<HeroSettings | null>(null);
  const [categoriesForm, setCategoriesForm] = useState<CategoriesSettings | null>(null);
  const [youSectionForm, setYouSectionForm] = useState<YouSectionSettings | null>(null);
  const [saving, setSaving] = useState(false);

  // Initialize forms when settings load
  if (!heroForm && heroSettings) setHeroForm(heroSettings);
  if (!categoriesForm && categoriesSettings) setCategoriesForm(categoriesSettings);
  if (!youSectionForm && youSectionSettings) setYouSectionForm(youSectionSettings);

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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="hero">Hero</TabsTrigger>
        <TabsTrigger value="categories">Категории</TabsTrigger>
        <TabsTrigger value="you">You секция</TabsTrigger>
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
                <div className="space-y-2">
                  <Label>URL изображения</Label>
                  <Input
                    value={heroForm.image_url}
                    onChange={(e) => setHeroForm({ ...heroForm, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  {heroForm.image_url && (
                    <img
                      src={heroForm.image_url}
                      alt="Hero preview"
                      className="mt-2 h-32 w-full object-cover rounded"
                    />
                  )}
                </div>
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

      {/* Categories Section */}
      <TabsContent value="categories">
        <Card>
          <CardHeader>
            <CardTitle>Категории товаров</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoriesForm?.items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label>Название</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateCategory(index, 'name', e.target.value)}
                    placeholder="Название категории"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>URL изображения</Label>
                  <Input
                    value={item.image_url}
                    onChange={(e) => updateCategory(index, 'image_url', e.target.value)}
                    placeholder="https://... (оставьте пустым для текста)"
                  />
                </div>
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="h-16 w-16 object-cover rounded" />
                )}
                <Button variant="destructive" size="icon" onClick={() => removeCategory(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
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
              <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label>Handle (@username)</Label>
                  <Input
                    value={item.handle}
                    onChange={(e) => updateYouItem(index, 'handle', e.target.value)}
                    placeholder="@username"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>URL изображения</Label>
                  <Input
                    value={item.image_url}
                    onChange={(e) => updateYouItem(index, 'image_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                {item.image_url && (
                  <img src={item.image_url} alt={item.handle} className="h-16 w-16 object-cover rounded" />
                )}
                <Button variant="destructive" size="icon" onClick={() => removeYouItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
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
    </Tabs>
  );
};

export default HomepageEditor;
