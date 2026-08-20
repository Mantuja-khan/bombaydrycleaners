import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import heroWoman from "@/assets/hero-woman.png";
import heroMan from "@/assets/hero-man.png";
import heroWoman2 from "@/assets/hero-woman2.png";
import heroWoman3 from "@/assets/hero-woman3.png";
import { Sparkles, ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";

const heroImages = [
  { src: heroWoman, alt: "Laundry professional holding a basket of fresh clothes" },
  { src: heroMan, alt: "Professional holding neatly folded laundry" },
  { src: heroWoman2, alt: "Laundry worker with clean towels" },
  { src: heroWoman3, alt: "Dry cleaning specialist with pressed suits" },
];

// 4-Point Star Sparkle SVG (matching reference image)
const StarSparkle = ({ className = "w-6 h-6 text-amber-400" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

// Curved Yellow Arrow SVG (pointing from text to image)
const CurvedArrow = ({ className = "w-28 h-20 text-amber-400" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 15 25 C 45 85, 85 90, 100 60 C 115 30, 90 20, 80 45 C 70 70, 115 85, 145 50" />
    <path d="M 130 45 L 146 50 L 140 66" />
  </svg>
);

// Subtle Hexagonal Pattern Backdrop
const HexPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-0" width="100%" height="100%">
    <defs>
      <pattern id="hexagons" width="50" height="43.3" patternUnits="userSpaceOnUse">
        <path d="M25 0 L50 14.43 L50 43.3 L25 57.74 L0 43.3 L0 14.43 Z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-900" />
        <path d="M0 0 L25 14.43 M50 0 L25 14.43 M25 43.3 L25 57.74" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-900" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hexagons)" />
  </svg>
);

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 4500);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section id="home" className="relative bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-white overflow-hidden pt-2 sm:pt-4 md:pt-6 lg:pt-6 pb-6 sm:pb-10 md:pb-14 lg:pb-16">
      {/* Hex Pattern */}
      <HexPattern />

      {/* Floating Water Bubbles CSS & Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bubble-float {
          0% {
            transform: translateY(110%) scale(0.7) translateX(0);
            opacity: 0;
          }
          15% { opacity: 0.6; }
          85% { opacity: 0.6; }
          100% {
            transform: translateY(-130%) scale(1.3) translateX(40px);
            opacity: 0;
          }
        }
        @keyframes sparkle-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50% { transform: scale(1.25) rotate(12deg); opacity: 1; filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.8)); }
        }
        @keyframes ray-float {
          0%, 100% { transform: rotate(-28deg) skewX(-10deg) translateY(0px); }
          50% { transform: rotate(-28deg) skewX(-10deg) translateY(-8px); }
        }
        .hero-bubble {
          position: absolute;
          bottom: -40px;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(56, 189, 248, 0.2) 60%, rgba(2, 132, 199, 0.05));
          border: 1.5px solid rgba(56, 189, 248, 0.4);
          border-radius: 50%;
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.8), 0 4px 10px rgba(2, 132, 199, 0.1);
          pointer-events: none;
          animation: bubble-float linear infinite;
        }
        .animate-sparkle {
          animation: sparkle-pulse 3s ease-in-out infinite;
        }
        .animate-ray {
          animation: ray-float 6s ease-in-out infinite;
        }
      `}} />

      {/* Floating Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="hero-bubble" style={{ animationDuration: '10s', animationDelay: '0s', left: '6%', width: '22px', height: '22px' }}></div>
        <div className="hero-bubble" style={{ animationDuration: '12s', animationDelay: '2s', left: '18%', width: '32px', height: '32px' }}></div>
        <div className="hero-bubble" style={{ animationDuration: '9s', animationDelay: '1s', left: '32%', width: '20px', height: '20px' }}></div>
        <div className="hero-bubble" style={{ animationDuration: '14s', animationDelay: '3s', left: '48%', width: '38px', height: '38px' }}></div>
        <div className="hero-bubble" style={{ animationDuration: '11s', animationDelay: '1.5s', left: '64%', width: '26px', height: '26px' }}></div>
        <div className="hero-bubble" style={{ animationDuration: '13s', animationDelay: '4s', left: '78%', width: '34px', height: '34px' }}></div>
        <div className="hero-bubble" style={{ animationDuration: '8s', animationDelay: '0.5s', left: '90%', width: '18px', height: '18px' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center min-h-[400px] sm:min-h-[460px] lg:min-h-[520px]">
          
          {/* Left Column: Text & Content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 lg:space-y-6 text-center lg:text-left order-2 lg:order-1 pt-1 lg:pt-0">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2.5 bg-sky-100/90 text-sky-700 font-bold text-xs sm:text-sm uppercase tracking-wider px-4 py-2 rounded-full border border-sky-200 shadow-sm animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span>We Clean, You Shine</span>
              <span className="hidden sm:inline-block w-8 h-[2px] bg-sky-400 rounded-full" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.12] tracking-tight">
              Best Cleaning <br className="hidden sm:inline" />
              <span className="relative inline-block text-sky-600">
                Experience
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{" "}
              From <br className="hidden sm:inline" />
              <span className="text-amber-500 font-extrabold">Top Service</span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
              Premium laundry & dry cleaning delivered right to your doorstep. Exceptional care, fast turnaround, and crisp freshness guaranteed every time.
            </p>

            {/* Action Buttons & Curved Arrow */}
            <div className="relative pt-2">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                {/* Discover More / Pickup Now Button (Vibrant Blue Pill) */}
                <Link
                  to="/booking"
                  className="group relative inline-flex items-center gap-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm sm:text-base px-7 py-3.5 sm:px-8 sm:py-4 rounded-full shadow-lg shadow-sky-600/25 hover:shadow-xl hover:shadow-sky-600/35 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <StarSparkle className="w-5 h-5 text-amber-300 animate-sparkle" />
                  <span>DISCOVER MORE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Our Services Button (Vibrant Yellow Pill) */}
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm sm:text-base px-7 py-3.5 sm:px-8 sm:py-4 rounded-full shadow-md shadow-amber-400/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 border border-amber-300"
                >
                  <span>OUR SERVICES</span>
                </a>
              </div>

              {/* Decorative Yellow Curved Arrow (Visible on md+ screens) */}
              <div className="hidden md:block absolute -bottom-16 left-52 lg:left-64 pointer-events-none z-10 opacity-90">
                <CurvedArrow className="w-24 lg:w-28 h-16 lg:h-20 text-amber-400" />
              </div>
            </div>



          </div>

          {/* Right Column: Hero Image with Geometric Rays & Floating Sparkles */}
          <div className="lg:col-span-6 relative flex items-center justify-center order-1 lg:order-2 my-4 lg:my-0">
            
            {/* GEOMETRIC PARALLEL RAYS (Slanted Yellow & Blue Stripes behind image) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              
              {/* Soft Ambient Radial Glow */}
              <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] rounded-full bg-gradient-to-tr from-sky-400/25 via-amber-300/30 to-blue-600/20 blur-3xl opacity-80" />

              {/* Angled Parallel Geometric Bar Container */}
              <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] h-[340px] sm:h-[420px] md:h-[480px] flex items-center justify-center">
                
                {/* --- UPPER RIGHT RAYS --- */}
                {/* Ray 1: Main Yellow Slanted Bar */}
                <div className="absolute top-[2%] right-[5%] sm:right-[10%] w-[55px] sm:w-[75px] md:w-[90px] h-[220px] sm:h-[280px] md:h-[330px] bg-amber-400 rounded-2xl transform -rotate-[28deg] skew-x-[-10deg] shadow-xl shadow-amber-400/25 border-r-4 border-amber-300 animate-ray" />
                
                {/* Ray 2: Blue Accent Slanted Bar */}
                <div className="absolute top-[12%] right-[22%] sm:right-[26%] w-[35px] sm:w-[48px] md:w-[58px] h-[180px] sm:h-[230px] md:h-[270px] bg-sky-500 rounded-xl transform -rotate-[28deg] skew-x-[-10deg] shadow-lg shadow-sky-500/20" />

                {/* Ray 3: Deep Blue Slanted Bar */}
                <div className="absolute top-[22%] right-[36%] sm:right-[40%] w-[22px] sm:w-[30px] md:w-[36px] h-[140px] sm:h-[180px] md:h-[210px] bg-blue-600 rounded-lg transform -rotate-[28deg] skew-x-[-10deg] opacity-90 shadow-md" />

                {/* --- LOWER LEFT RAYS --- */}
                {/* Ray 4: Main Yellow Slanted Bar */}
                <div className="absolute bottom-[2%] left-[5%] sm:left-[10%] w-[55px] sm:w-[75px] md:w-[90px] h-[200px] sm:h-[260px] md:h-[310px] bg-amber-400 rounded-2xl transform -rotate-[28deg] skew-x-[-10deg] shadow-xl shadow-amber-400/25 border-l-4 border-amber-300 animate-ray" style={{ animationDelay: '-3s' }} />

                {/* Ray 5: Blue Accent Slanted Bar */}
                <div className="absolute bottom-[10%] left-[22%] sm:left-[26%] w-[35px] sm:w-[48px] md:w-[58px] h-[160px] sm:h-[210px] md:h-[250px] bg-sky-500 rounded-xl transform -rotate-[28deg] skew-x-[-10deg] shadow-lg shadow-sky-500/20" />

                {/* Ray 6: Cyan Slanted Accent Bar */}
                <div className="absolute bottom-[20%] left-[36%] sm:left-[40%] w-[20px] sm:w-[28px] md:w-[34px] h-[120px] sm:h-[160px] md:h-[190px] bg-cyan-400 rounded-lg transform -rotate-[28deg] skew-x-[-10deg] opacity-85 shadow-sm" />
              </div>
            </div>

            {/* FLOATING 4-POINT STAR SPARKLES (Matching reference image) */}
            {/* Top-Left Blue Star */}
            <div className="absolute top-4 left-4 sm:left-10 z-20 animate-sparkle" style={{ animationDelay: '0s' }}>
              <StarSparkle className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500 drop-shadow-md" />
            </div>

            {/* Top-Right Yellow Star */}
            <div className="absolute top-2 right-6 sm:right-14 z-20 animate-sparkle" style={{ animationDelay: '1.2s' }}>
              <StarSparkle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 drop-shadow-md" />
            </div>

            {/* Mid-Right Small Blue Star */}
            <div className="absolute top-1/3 right-0 sm:right-4 z-20 animate-sparkle" style={{ animationDelay: '2.4s' }}>
              <StarSparkle className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
            </div>

            {/* Bottom-Left Yellow Star */}
            <div className="absolute bottom-12 left-2 sm:left-8 z-20 animate-sparkle" style={{ animationDelay: '0.8s' }}>
              <StarSparkle className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400 drop-shadow-md" />
            </div>

            {/* Bottom-Right Blue Star */}
            <div className="absolute bottom-6 right-8 sm:right-16 z-20 animate-sparkle" style={{ animationDelay: '1.8s' }}>
              <StarSparkle className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600 drop-shadow-md" />
            </div>

            {/* Small Yellow Sparkle Dots */}
            <div className="absolute top-1/4 left-1/4 z-20 w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-75" />
            <div className="absolute bottom-1/3 right-1/4 z-20 w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />

            {/* HERO IMAGE CAROUSEL CONTAINER */}
            <div className="relative z-10 w-full max-w-[260px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[440px] xl:max-w-[480px] h-[300px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[540px]">
              {heroImages.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  className={`absolute inset-0 w-full h-full object-contain filter drop-shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    i === current
                      ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                      : "opacity-0 translate-x-10 scale-95 pointer-events-none"
                  }`}
                />
              ))}
            </div>

            {/* Carousel Navigation Dots */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/80 shadow-sm">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-amber-400 w-8 shadow-sm"
                      : "bg-slate-300 hover:bg-sky-400 w-2.5"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
