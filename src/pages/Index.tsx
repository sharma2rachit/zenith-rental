import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CarCategories from "@/components/CarCategories";
import FeaturedCars from "@/components/FeaturedCars";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CarCategories />
        <FeaturedCars />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
