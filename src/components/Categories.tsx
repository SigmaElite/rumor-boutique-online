import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="section-title mb-12 md:mb-16">Категории товаров</h2>
        
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center shadow-md hover:bg-background transition-colors -ml-5 hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Categories Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6"
          >
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/catalog?category=${category.name}`}
                className="category-card flex-shrink-0 w-60 md:w-72"
              >
                {category.image ? (
                  <div className="h-40 flex items-center justify-center">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center">
                    <span className="font-display text-4xl tracking-[0.2em] uppercase">
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

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center shadow-md hover:bg-background transition-colors -mr-5 hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
