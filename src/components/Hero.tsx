import { useHomepageSettings } from "@/hooks/useHomepageSettings";

const Hero = () => {
  const { heroSettings, loading } = useHomepageSettings();

  const imageUrl = heroSettings?.image_url || "";
  const title = heroSettings?.title || "Rumor Evening Collection";
  const subtitle = heroSettings?.subtitle || "new year edition";

  return (
    <section className="relative w-full h-[70svh] md:h-[90svh] overflow-hidden bg-black">
      {!loading && imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      )}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Overlay Content */}
      <div className="absolute bottom-16 left-8 md:left-16 text-white z-10">
        <h2 className="font-snell text-3xl md:text-5xl mb-2 drop-shadow-lg">
          {title}
        </h2>
        <p className="font-snell text-xl md:text-2xl drop-shadow-md">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default Hero;
