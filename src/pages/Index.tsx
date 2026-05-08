import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ImageMarquee from "@/components/ImageMarquee";
import AboutSection from "@/components/AboutSection";
import PartnersSection from "@/components/PartnersSection";
import ScheduleSection from "@/components/ScheduleSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PartnersSection />
      <ServicesSection />
      <ImageMarquee />
      <Footer />
    </div>
  );
};

export default Index;
