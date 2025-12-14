import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Bestsellers from "@/components/Bestsellers";
import Lookbook from "@/components/Lookbook";
import YouSection from "@/components/YouSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Categories />
        <Bestsellers />
        <Lookbook />
        <YouSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
