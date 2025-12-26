import { useRef, useState } from "react";
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
    <section className="pt-4 md:pt-6 pb-16 md:pb-24">
      <div className="container">
        <h2 className="font-snell text-3xl md:text-4xl lg:text-5xl text-center mb-12 md:mb-16">You</h2>

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
          {celebrities.map((celeb) => (
            <div 
              key={celeb.id} 
              className="flex-shrink-0 w-72 md:w-80"
              draggable={false}
            >
              <div className="overflow-hidden">
                <img
                  src={celeb.image}
                  alt={celeb.handle}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 hover:scale-105 pointer-events-none"
                  draggable={false}
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
