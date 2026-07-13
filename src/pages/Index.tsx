import Header from "@/components/Header";
import Seo from "@/components/Seo";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Bestsellers from "@/components/Bestsellers";
import YouSection from "@/components/YouSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Seo
        title="RUMOR — Премиальная женская одежда | Платья, корсеты, жакеты"
        description="Бренд RUMOR: премиальная женская одежда — вечерние платья, корсеты, жакеты, брюки. Оффлайн шоурум в Минске, доставка по РБ, РФ и миру."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "RUMOR",
            url: "https://rumor-chic-style.lovable.app",
            logo: "https://rumor-chic-style.lovable.app/favicon.png",
            sameAs: [
              "https://www.instagram.com/rumor.by",
              "https://t.me/rumor_by",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "RUMOR",
            url: "https://rumor-chic-style.lovable.app",
          },
        ]}
      />
      <Header />
      <main>
        <Hero />
        <Categories />
        <Bestsellers />
        <YouSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
