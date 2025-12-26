import { useRef, useState } from "react";
import corsetImage from "@/assets/product-corset-1.jpg";
import dressImage from "@/assets/product-dress-1.jpg";
import setImage from "@/assets/product-set-1.jpg";

const categories = [
  { id: 1, name: "NEW", image: null },
  { id: 2, name: "Корсеты", image: corsetImage },
  { id: 3, name: "Платья", image: dressImage },
  { id: 4, name: "Комплекты", image: setImage },
  { id: 5, name: "Юбки", image: null },
];

const Categories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  return (
    <section className="pt-8 md:pt-12 pb-4 md:pb-6">
      <div className="container">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-center mb-6 md:mb-8 italic" style={{ fontFamily: '"Pinyon Script", cursive' }}>Категории товаров</h2>
        
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
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
              className="category-card flex-shrink-0 w-36 md:w-72"
            >
              {category.image ? (
                <div className="h-24 md:h-40 flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="max-h-full max-w-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="h-24 md:h-40 flex items-center justify-center">
                  <span className="font-display text-2xl md:text-4xl tracking-[0.2em] uppercase">
                    {category.name}
                  </span>
                </div>
              )}
              {category.image && (
                <span className="category-title">{category.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
