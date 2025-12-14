import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";

const lookbookImages = [
  { id: 1, image: lookbook1, alt: "Lookbook образ 1" },
  { id: 2, image: lookbook2, alt: "Lookbook образ 2" },
  { id: 3, image: lookbook3, alt: "Lookbook образ 3" },
];

const Lookbook = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="section-title mb-12 md:mb-16">Lookbook</h2>

        <div className="flex justify-center gap-4 mb-10">
          {lookbookImages.map((item) => (
            <div key={item.id} className="w-40 md:w-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.alt}
                className="w-full aspect-[3/4] object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground max-w-xl mx-auto mb-10 font-body text-sm leading-relaxed">
          Просмотрите наш lookbook, где вы найдете подобранные образы и коллекции,
          которые помогут вам создать уникальный и модный образ
        </p>

        <div className="flex justify-center">
          <a href="/lookbook" className="btn-primary">
            Смотреть Lookbook
          </a>
        </div>
      </div>
    </section>
  );
};

export default Lookbook;
