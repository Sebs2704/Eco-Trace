import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ClassificationSection from "@/components/sections/ClassificationSection";
import GamificationSection from "@/components/sections/GamificationSection";
import TraceabilitySection from "@/components/sections/TraceabilitySection";
import ImpactSection from "@/components/sections/ImpactSection";
import RecyclingCentersSection from "@/components/sections/RecyclingCentersSection";
import Footer from "@/components/layout/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <ClassificationSection />
    <GamificationSection />
    <TraceabilitySection />
    <ImpactSection />
    <RecyclingCentersSection />
    <Footer />
  </div>
);

export default Index;
