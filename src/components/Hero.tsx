import { useEffect, useState } from "react";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";


const HERO_CACHE_KEY = "rumor_hero_img";
const HERO_TITLE_KEY = "rumor_hero_title";
const HERO_SUBTITLE_KEY = "rumor_hero_subtitle";

const Hero = () => {
  const { heroSettings, loading } = useHomepageSettings();
  const [displayImage, setDisplayImage] = useState<string>(() => {
    try { return localStorage.getItem(HERO_CACHE_KEY) || ""; } catch { return ""; }
  });
  const [displayTitle, setDisplayTitle] = useState<string>(() => {
    try { return localStorage.getItem(HERO_TITLE_KEY) || ""; } catch { return ""; }
  });
  const [displaySubtitle, setDisplaySubtitle] = useState<string>(() => {
    try { return localStorage.getItem(HERO_SUBTITLE_KEY) || ""; } catch { return ""; }
  });

  const imageUrl = heroSettings?.image_url || "";
  const title = heroSettings?.title || "";
  const subtitle = heroSettings?.subtitle || "";

  // Once DB responds, update cache & displayed values
  useEffect(() => {
    if (!loading) {
      if (imageUrl) {
        setDisplayImage(imageUrl);
        try { localStorage.setItem(HERO_CACHE_KEY, imageUrl); } catch {}
      }
      if (title) {
        setDisplayTitle(title);
        try { localStorage.setItem(HERO_TITLE_KEY, title); } catch {}
      }
      if (subtitle) {
        setDisplaySubtitle(subtitle);
        try { localStorage.setItem(HERO_SUBTITLE_KEY, subtitle); } catch {}
      }
    }
  }, [imageUrl, title, subtitle, loading]);

  return (
    <section className="relative w-full h-[50svh] md:h-[62svh] overflow-hidden bg-black">
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
        <h1 className="sr-only">RUMOR — премиальная женская одежда: платья, корсеты, жакеты и брюки</h1>
        <p className="font-snell text-3xl md:text-5xl mb-2 drop-shadow-lg" aria-hidden="true">
          {displayTitle}
        </p>
        <p className="font-snell text-xl md:text-2xl drop-shadow-md mb-6 md:mb-8">
          {displaySubtitle}
        </p>
        <a
          href="#bestsellers"
          className="inline-block border border-primary-foreground bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground px-8 py-3 text-xs tracking-[0.25em] uppercase font-body hover:bg-primary-foreground hover:text-primary transition-colors"
        >
          Shop bestsellers
        </a>
      </div>
    </section>
  );
};

export default Hero;
