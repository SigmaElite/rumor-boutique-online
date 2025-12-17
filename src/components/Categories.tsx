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
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="section-title mb-12 md:mb-16">Категории товаров</h2>
        
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 cursor-grab active:cursor-grabbing">
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
      </div>
    </section>
  );
};

export default Categories;
