import { useHomepageSettings } from "@/hooks/useHomepageSettings";
import heroImageFallback from "@/assets/hero-main-new.jpg";

const Hero = () => {
  const { heroSettings, loading } = useHomepageSettings();

  const imageUrl = heroSettings?.image_url || heroImageFallback;
  const title = heroSettings?.title || "Rumor Evening Collection";
  const subtitle = heroSettings?.subtitle || "new year edition";

  return (
    <section className="relative w-full h-[70svh] md:h-[90svh] overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover object-center"
      />
      
      {/* Overlay Content */}
      <div className="absolute bottom-16 left-8 md:left-16 text-white">
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
