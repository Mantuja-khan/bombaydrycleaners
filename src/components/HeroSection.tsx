import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom"; // navigation
import heroWoman from "@/assets/hero-woman.png";
import heroMan from "@/assets/hero-man.png";
import heroWoman2 from "@/assets/hero-woman2.png";
import heroWoman3 from "@/assets/hero-woman3.png";
import { Sparkles } from "lucide-react";

const heroImages = [
  { src: heroWoman, alt: "Laundry professional holding a basket of fresh clothes" },
  { src: heroMan, alt: "Professional holding neatly folded laundry" },
  { src: heroWoman2, alt: "Laundry worker with clean towels" },
  { src: heroWoman3, alt: "Dry cleaning specialist with pressed suits" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const goNext = useCallback(() => {
    setDirection("left");
    setCurrent((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section id="home" className="relative bg-primary overflow-hidden">
      {/* CSS for Floating Water Bubbles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bubble-float {
          0% {
            transform: translateY(110%) scale(0.7) translateX(0);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-130%) scale(1.4) translateX(50px);
            opacity: 0;
          }
        }
        .bubble {
          position: absolute;
          bottom: -60px;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0.05));
          border: 1.5px solid rgba(255, 255, 255, 0.65);
          border-radius: 50%;
          box-shadow: inset 0 3px 6px rgba(255, 255, 255, 0.75), 0 4px 12px rgba(0, 0, 0, 0.08);
          pointer-events: none;
          animation: bubble-float linear infinite;
        }
      `}} />

      {/* Floating Water Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bubble" style={{ animationDuration: '9s', animationDelay: '0s', left: '5%', width: '22px', height: '22px' }}></div>
        <div className="bubble" style={{ animationDuration: '11s', animationDelay: '2s', left: '15%', width: '34px', height: '34px' }}></div>
        <div className="bubble" style={{ animationDuration: '8s', animationDelay: '1s', left: '25%', width: '18px', height: '18px' }}></div>
        <div className="bubble" style={{ animationDuration: '13s', animationDelay: '3s', left: '35%', width: '28px', height: '28px' }}></div>
        <div className="bubble" style={{ animationDuration: '15s', animationDelay: '5s', left: '45%', width: '46px', height: '46px' }}></div>
        <div className="bubble" style={{ animationDuration: '10s', animationDelay: '1.5s', left: '55%', width: '24px', height: '24px' }}></div>
        <div className="bubble" style={{ animationDuration: '12s', animationDelay: '4s', left: '65%', width: '32px', height: '32px' }}></div>
        <div className="bubble" style={{ animationDuration: '9s', animationDelay: '2.5s', left: '75%', width: '40px', height: '40px' }}></div>
        <div className="bubble" style={{ animationDuration: '7s', animationDelay: '0.5s', left: '85%', width: '18px', height: '18px' }}></div>
        <div className="bubble" style={{ animationDuration: '14s', animationDelay: '6s', left: '95%', width: '36px', height: '36px' }}></div>
        <div className="bubble" style={{ animationDuration: '10s', animationDelay: '3.5s', left: '10%', width: '26px', height: '26px' }}></div>
        <div className="bubble" style={{ animationDuration: '12s', animationDelay: '5.5s', left: '30%', width: '30px', height: '30px' }}></div>
        <div className="bubble" style={{ animationDuration: '11s', animationDelay: '1.8s', left: '50%', width: '20px', height: '20px' }}></div>
        <div className="bubble" style={{ animationDuration: '13s', animationDelay: '4.5s', left: '70%', width: '38px', height: '38px' }}></div>
        <div className="bubble" style={{ animationDuration: '9s', animationDelay: '3s', left: '90%', width: '22px', height: '22px' }}></div>
      </div>

      <div className="container mx-auto section-padding relative z-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-4 lg:gap-8 items-center min-h-[420px] md:min-h-[480px] lg:min-h-[600px] py-10 md:py-6 lg:py-0">
          {/* Image — shows FIRST on mobile (order-first), second on md+ (md:order-last) */}
          <div className="relative flex justify-center md:justify-end order-first md:order-last">
            <div className="absolute top-4 left-8 text-secondary z-10">
              <Sparkles className="w-8 h-8 md:w-5 md:h-5 lg:w-8 lg:h-8" />
            </div>
            <div className="absolute bottom-16 right-4 text-secondary z-10">
              <Sparkles className="w-6 h-6 md:w-4 md:h-4 lg:w-6 lg:h-6" />
            </div>

            {/* Image Carousel — only images slide */}
            <div className="relative w-full max-w-[220px] sm:max-w-xs md:max-w-[260px] lg:max-w-md xl:max-w-lg h-[220px] sm:h-[280px] md:h-[340px] lg:h-[480px] xl:h-[520px]">
              {heroImages.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  className={`absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    i === current
                      ? "opacity-100 translate-x-0 scale-100"
                      : i === (current - 1 + heroImages.length) % heroImages.length
                        ? "opacity-0 -translate-x-12 scale-95"
                        : "opacity-0 translate-x-12 scale-95"
                  }`}
                />
              ))}
            </div>

            {/* Dots */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? "left" : "right");
                    setCurrent(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-secondary w-7"
                      : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Text — shows SECOND on mobile, first on md+ */}
          <div className="relative z-10 space-y-4 md:space-y-4 lg:space-y-6 animate-fade-up order-last md:order-first">
            <span className="inline-block bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded">
              Welcome to Bombay Dry Cleaners
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl xl:text-6xl font-extrabold text-primary-foreground leading-[1.08]">
              Where Freshness
              <br />
              Meets Care
            </h1>
            <p className="text-primary-foreground/75 max-w-md text-xs sm:text-sm md:text-xs lg:text-base leading-relaxed">
              Premium laundry services that keep your clothes looking their best.
              We handle everything with the utmost care and attention to detail.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 md:px-4 lg:px-6 py-2.5 md:py-2 lg:py-3 rounded-full text-sm md:text-xs lg:text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                <Sparkles className="w-4 h-4 md:w-3 md:h-3 lg:w-4 lg:h-4" />
                Pickup Now
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/30 px-5 md:px-4 lg:px-6 py-2.5 md:py-2 lg:py-3 rounded-full text-sm md:text-xs lg:text-sm font-semibold hover:bg-primary-foreground/20 transition-colors active:scale-[0.97]"
              >
                Discover More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
