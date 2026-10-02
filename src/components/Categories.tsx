import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";
import corsetImage from "@/assets/product-corset-1.jpg";
import dressImage from "@/assets/product-dress-1.jpg";
import setImage from "@/assets/product-set-1.jpg";
import { getImageUrl } from "@/lib/image";

const defaultCategories = [
  { name: "NEW", image: null },
  { name: "Корсеты", image: corsetImage },
  { name: "Платья", image: dressImage },
  { name: "Комплекты", image: setImage },
  { name: "Юбки", image: null },
  { name: "Жакеты", image: null },
  { name: "Брюки", image: null },
  { name: "Верхняя одежда", image: null },
  { name: "Спорт", image: null },
  { name: "wedding collection", image: null },
];

const Categories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const { categoriesSettings } = useHomepageSettings();

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".category-card");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Use DB settings if available, otherwise fallback to defaults
  const categories = categoriesSettings?.items?.length 
    ? categoriesSettings.items.map((item, idx) => ({
        id: idx + 1,
        name: item.name,
        image: item.image_url || defaultCategories[idx]?.image || null,
      }))
    : defaultCategories.map((cat, idx) => ({ id: idx + 1, ...cat }));

  return (
    <section className="pt-8 md:pt-12 pb-4 md:pb-6">
      <div className="container">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-center mb-6 md:mb-8 italic" style={{ fontFamily: '"Pinyon Script", cursive' }}>Категории товаров</h2>
        
        <div className="relative">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => scrollByCards(-1)}
            className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-opacity hover:bg-muted ${canScrollPrev ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Вперёд"
            onClick={() => scrollByCards(1)}
            className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-opacity hover:bg-muted ${canScrollNext ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onScroll={updateArrows}
            className={`flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/catalog?category=${category.name}`}
                onClick={(e) => isDragging && e.preventDefault()}
                draggable={false}
                className="category-card flex-shrink-0 w-36 md:w-64 block"
              >
                <div className="bg-background border border-border rounded-lg p-4 flex flex-col items-center">
                  {category.image ? (
                    <div className="h-40 md:h-56 w-full flex items-center justify-center mb-4">
                      <img
                        src={getImageUrl(category.image, 600, 75)}
                        alt={category.name}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full object-contain pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  ) : (
                    <div className="h-40 md:h-56 w-full flex items-center justify-center mb-4 overflow-hidden px-1">
                      <span className="font-display text-lg md:text-3xl tracking-[0.1em] md:tracking-[0.2em] uppercase text-muted-foreground text-center break-words leading-tight max-w-full">
                        {category.name}
                      </span>
                    </div>
                  )}
                  <span className="block text-center text-[0.65rem] md:text-base tracking-wider uppercase font-body break-words leading-tight">{category.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
