import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SchemesSection from "@/components/SchemesSection";
import CreditsSection from "@/components/CreditsSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <FeaturesSection />
    <HowItWorksSection />
    <SchemesSection />
    <CreditsSection />
    <Footer />
  </div>
);

export default Index;
