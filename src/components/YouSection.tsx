import bestseller9 from "@/assets/bestseller-9.jpg";
import bestseller10 from "@/assets/bestseller-10.jpg";
import bestseller11 from "@/assets/bestseller-11.jpg";
import bestseller12 from "@/assets/bestseller-12.jpg";

const celebrities = [
  { id: 1, handle: "@ELENA_STYLE", image: bestseller9 },
  { id: 2, handle: "@FASHION_DIVA", image: bestseller10 },
  { id: 3, handle: "@LUXE_ANNA", image: bestseller11 },
  { id: 4, handle: "@MARIA_GLAM", image: bestseller12 },
];

const YouSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="section-title mb-12 md:mb-16">You</h2>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
          {celebrities.map((celeb) => (
            <div key={celeb.id} className="flex-shrink-0 w-72 md:w-80">
              <div className="overflow-hidden">
                <img
                  src={celeb.image}
                  alt={celeb.handle}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <p className="mt-4 font-body text-sm tracking-wider uppercase">
                {celeb.handle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouSection;
