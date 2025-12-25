import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Bestsellers from "@/components/Bestsellers";
import YouSection from "@/components/YouSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
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
