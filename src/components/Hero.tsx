import { useEffect, useState } from "react";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";
import heroImageFallback from "@/assets/hero-main-new.jpg";

const HERO_CACHE_KEY = "rumor_hero_image";
const HERO_CACHE_VERSION_KEY = "rumor_hero_version";

const Hero = () => {
  const { heroSettings, loading } = useHomepageSettings();
  const [displayImage, setDisplayImage] = useState<string>(() => {
    try {
      return localStorage.getItem(HERO_CACHE_KEY) || heroImageFallback;
    } catch {
      return heroImageFallback;
    }
  });

  const imageUrl = heroSettings?.image_url || heroImageFallback;
  const title = heroSettings?.title || "Rumor Evening Collection";
  const subtitle = heroSettings?.subtitle || "new year edition";

  useEffect(() => {
    if (imageUrl && !loading) {
      try {
        const cached = localStorage.getItem(HERO_CACHE_KEY);
        if (cached !== imageUrl) {
          localStorage.setItem(HERO_CACHE_KEY, imageUrl);
        }
      } catch {}
      setDisplayImage(imageUrl);
    }
  }, [imageUrl, loading]);

  return (
    <section className="relative w-full h-[70svh] md:h-[90svh] overflow-hidden">
      <img
        src={displayImage}
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
