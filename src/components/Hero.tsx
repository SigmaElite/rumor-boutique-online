import heroImage from "@/assets/hero-main-new.jpg";

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <img
        src={heroImage}
        alt="Rumor Evening Collection"
        className="w-full h-full object-cover object-center"
      />
      
      {/* Overlay Content */}
      <div className="absolute bottom-16 left-8 md:left-16 text-white">
        <h2 className="font-display text-2xl md:text-4xl tracking-[0.15em] uppercase font-medium mb-2 drop-shadow-lg">
          Rumor Evening Collection
        </h2>
        <p className="font-body text-base md:text-lg tracking-wide font-light italic drop-shadow-md">
          new year edition
        </p>
      </div>
    </section>
  );
};

export default Hero;
