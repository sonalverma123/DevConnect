// Import reusable components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/ui/Home/HeroSection";
import FeaturesSection from "@/ui/Home/FeaturesSection";

// Home page layout
export default function HomePage() {
  return (
    <main>
      <Navbar />              {/* Top navigation */}
      <HeroSection />         {/* Landing hero area */}
      <FeaturesSection />     {/* Key app features */}
      <Footer />              {/* Footer */}
    </main>
  );
}
