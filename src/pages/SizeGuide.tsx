import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SizeGuide = () => {
  const [sizeGuideImage, setSizeGuideImage] = useState<string>('/size-guide-table.jpg');

  useEffect(() => {
    const fetchSizeGuideImage = async () => {
      const { data } = await supabase
        .from('homepage_settings')
        .select('data')
        .eq('id', 'size_guide')
        .single();
      
      if (data?.data && typeof data.data === 'object' && 'image_url' in data.data) {
        setSizeGuideImage((data.data as { image_url: string }).image_url);
      }
    };
    fetchSizeGuideImage();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <div className="container pt-3 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <a href="/" className="hover:text-foreground transition-colors">Главная</a>
            <span>/</span>
            <span className="text-foreground">Определить размер</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="font-script text-4xl md:text-5xl tracking-wide mb-4">
                Как определить размер изделия
              </h1>

              <p className="text-muted-foreground mb-6">
                Самый простой способ определить размер — <strong className="text-foreground">соотнести свой размер одежды с размерной сеткой товара</strong>. 
                В каждой карточке товара ты найдешь актуальную размерную сетку.
              </p>

              <p className="text-muted-foreground mb-6">
                Для более точного измерения ты можешь воспользоваться измерительным сантиметром:
              </p>

              <ul className="space-y-4 text-muted-foreground mb-8">
                <li>• Измерение груди проходит по оси тела ровно через лопатки и по груди.</li>
                <li>• Измерение талии проходит по самой узкой части туловища, чуть выше пупка, замер производится на выдохе в расслабленном состоянии.</li>
                <li>• Измерение бедер проходит по самым выпуклым местам ягодицы, ноги сведены вместе.</li>
              </ul>

              <p className="text-muted-foreground mb-8">
                Для консультации ты можешь обратиться к нашим специалистам и они с радостью помогут
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Button asChild size="lg" className="px-12">
                <Link to="/catalog">Перейти к покупкам</Link>
              </Button>
            </div>
          </div>

          {/* Size Guide Image */}
          <div className="mt-12 mb-8">
            <img 
              src={sizeGuideImage} 
              alt="Размерная сетка" 
              className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Size Tables */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display text-lg tracking-wide text-center mb-6">
                Универсальная размерная сетка для других изделий
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left">Размер</th>
                      <th className="px-4 py-3 text-left">Грудь</th>
                      <th className="px-4 py-3 text-left">Талия</th>
                      <th className="px-4 py-3 text-left">Бедра</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">XS</td>
                      <td className="px-4 py-3">82-86</td>
                      <td className="px-4 py-3">60-64</td>
                      <td className="px-4 py-3">86-90</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">S</td>
                      <td className="px-4 py-3">86-90</td>
                      <td className="px-4 py-3">64-68</td>
                      <td className="px-4 py-3">90-94</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">M</td>
                      <td className="px-4 py-3">90-94</td>
                      <td className="px-4 py-3">68-72</td>
                      <td className="px-4 py-3">94-98</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">L</td>
                      <td className="px-4 py-3">94-98</td>
                      <td className="px-4 py-3">72-76</td>
                      <td className="px-4 py-3">98-102</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-wide text-center mb-6">
                Размерная сетка для корсетов-топ
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left">Размер</th>
                      <th className="px-4 py-3 text-left">Грудь</th>
                      <th className="px-4 py-3 text-left">Талия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">XS</td>
                      <td className="px-4 py-3">82-86</td>
                      <td className="px-4 py-3">60-64</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">S</td>
                      <td className="px-4 py-3">86-90</td>
                      <td className="px-4 py-3">64-68</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">M</td>
                      <td className="px-4 py-3">90-94</td>
                      <td className="px-4 py-3">68-72</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">L</td>
                      <td className="px-4 py-3">94-98</td>
                      <td className="px-4 py-3">72-76</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-wide text-center mb-6">
                Размерная сетка для корсетов с чашечками
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left">Размер</th>
                      <th className="px-4 py-3 text-left">Чашка</th>
                      <th className="px-4 py-3 text-left">Талия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">XS</td>
                      <td className="px-4 py-3">A-B</td>
                      <td className="px-4 py-3">60-64</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">S</td>
                      <td className="px-4 py-3">B-C</td>
                      <td className="px-4 py-3">64-68</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">M</td>
                      <td className="px-4 py-3">C-D</td>
                      <td className="px-4 py-3">68-72</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">L</td>
                      <td className="px-4 py-3">D-E</td>
                      <td className="px-4 py-3">72-76</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SizeGuide;
