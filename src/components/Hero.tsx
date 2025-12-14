import heroImage from "@/assets/hero-main.jpg";

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      <img
        src={heroImage}
        alt="Rumor Evening Collection"
        className="w-full h-full object-cover object-center"
      />
      
      {/* Overlay Content */}
      <div className="absolute bottom-16 left-8 md:left-16 text-foreground">
        <h2 className="font-display text-2xl md:text-4xl tracking-[0.15em] uppercase font-medium mb-2">
          Rumor Evening Collection
        </h2>
        <p className="font-body text-base md:text-lg tracking-wide font-light italic">
          new year edition
        </p>
      </div>
    </section>
  );
};

export default Hero;
