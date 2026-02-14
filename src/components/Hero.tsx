import { useEffect, useState } from "react";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";

const HERO_CACHE_KEY = "rumor_hero_img";

const Hero = () => {
  const { heroSettings, loading } = useHomepageSettings();
  const [displayImage, setDisplayImage] = useState<string>(() => {
    try { return localStorage.getItem(HERO_CACHE_KEY) || ""; } catch { return ""; }
  });

  const imageUrl = heroSettings?.image_url || "";
  const title = heroSettings?.title || "Rumor Evening Collection";
  const subtitle = heroSettings?.subtitle || "new year edition";

  // Once DB responds, update cache & displayed image
  useEffect(() => {
    if (!loading && imageUrl) {
      setDisplayImage(imageUrl);
      try { localStorage.setItem(HERO_CACHE_KEY, imageUrl); } catch {}
    }
  }, [imageUrl, loading]);

  return (
    <section className="relative w-full h-[70svh] md:h-[90svh] overflow-hidden bg-black">
      {displayImage && (
        <img
          src={displayImage}
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
