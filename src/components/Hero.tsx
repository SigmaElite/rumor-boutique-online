import heroImage from "@/assets/hero-main-new.jpg";

const Hero = () => {
  return (
    <section className="relative w-full h-[70svh] md:h-[90svh] overflow-hidden">
      <img
        src={heroImage}
        alt="Rumor Evening Collection"
        className="w-full h-full object-cover object-center"
      />
      
      {/* Overlay Content */}
      <div className="absolute bottom-16 left-8 md:left-16 text-white">
        <h2 className="font-snell text-3xl md:text-5xl mb-2 drop-shadow-lg">
          Rumor Evening Collection
        </h2>
        <p className="font-snell text-xl md:text-2xl drop-shadow-md">
          new year edition
        </p>
      </div>
    </section>
  );
};

export default Hero;
