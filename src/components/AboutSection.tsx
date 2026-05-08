import { Play, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-background overflow-hidden relative">
      {/* CSS for Organic Morphing Curved Water Drops */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob-morph-1 {
          0% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
          50% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
          100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
        }
        @keyframes blob-morph-2 {
          0% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
          50% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
          100% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
        }
        .blob-1 {
          animation: blob-morph-1 8s ease-in-out infinite;
        }
        .blob-2 {
          animation: blob-morph-2 8s ease-in-out infinite;
        }
      `}} />

      <div className="container mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Overlapping Infinity Circles and Decorative Assets */}
          <div className="relative opacity-0 animate-slide-left flex justify-center py-6" style={{ animationFillMode: "forwards" }}>
            
            {/* Main Overlapping Circles Wrapper */}
            <div className="relative w-full max-w-[420px] h-[360px]">
              
              {/* Blue Dot Pattern background */}
              <div className="absolute right-4 bottom-16 grid grid-cols-5 gap-2 opacity-30 z-0">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-sky-500" />
                ))}
              </div>
              
              {/* Circle 1: Top Right (Large, Blue Border) */}
              <div className="blob-1 absolute top-0 right-4 w-48 h-48 border-[6px] border-sky-500 overflow-hidden shadow-xl z-10 transition-transform hover:scale-105 duration-300">
                <img
                  src="https://i.pinimg.com/736x/6f/3d/86/6f3d869f17093d2adf68d2b2989fdd3b.jpg"
                  alt="Premium Clothing Care"
                  className="w-full h-full object-cover animate-pulse-slow"
                />
              </div>

              {/* Circle 2: Middle Left (Medium, Yellow Border) */}
              <div className="blob-2 absolute top-12 left-0 w-36 h-36 border-[6px] border-yellow-400 overflow-hidden shadow-xl z-20 transition-transform hover:scale-105 duration-300">
                <img
                  src="https://i.pinimg.com/1200x/1e/2a/dd/1e2add775db5fc54d1dec059134e1289.jpg"
                  alt="Washing Garments"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Circle 3: Bottom Left (Small, Blue Border) */}
              <div className="blob-1 absolute bottom-4 left-10 w-28 h-28 border-[6px] border-sky-400 overflow-hidden shadow-xl z-30 transition-transform hover:scale-105 duration-300">
                <img
                  src="https://i.pinimg.com/1200x/92/47/3a/92473ac3815566e559793f1cd5f47c39.jpg"
                  alt="Fresh Folded Clothes"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Circle 4: Bottom Right (Medium, Yellow Border) */}
              <div className="blob-2 absolute bottom-0 right-12 w-36 h-36 border-[6px] border-yellow-400 overflow-hidden shadow-xl z-20 transition-transform hover:scale-105 duration-300">
                <img
                  src="https://i.pinimg.com/1200x/b0/b1/ff/b0b1fffb4da55e0b66401f21abd24622.jpg"
                  alt="Steam Ironing and Care"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative Floating Cartoon Glove in Bottom Left */}
              <div className="absolute -left-6 bottom-4 text-5xl animate-bounce select-none filter drop-shadow-md" style={{ animationDuration: "3s" }}>
                🧤
              </div>

              {/* Decorative Floating Bucket & Mop in Bottom Right */}
              <div className="absolute -right-6 bottom-4 text-5xl animate-bounce select-none filter drop-shadow-md" style={{ animationDuration: "4s", animationDelay: "500ms" }}>
                🪣
              </div>
            </div>

          </div>

          {/* Right Column: Premium Content & Guarantees Card */}
          <div className="space-y-6 opacity-0 animate-slide-right" style={{ animationFillMode: "forwards", animationDelay: "150ms" }}>
            
            <div className="flex items-center gap-1">
              <span className="text-sky-500 font-extrabold tracking-widest text-xs uppercase flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-sky-500 stroke-[3]" /> ABOUT US
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
              We Care For Your Clothes <br />
              <span className="text-primary">So They Always Feel Brand New</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Our professional dry cleaning and laundry services are dedicated to preserving the life,
              texture, and vibrant color of your garments. We sort every piece individually and treat 
              delicate fabrics with extreme care so your wardrobe always shines with perfection.
            </p>

            {/* Premium Guarantee Inner Card */}
            <div className="border border-sky-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-5 bg-sky-50/20 shadow-sm">
              
              {/* Video Thumbnail with Play Button */}
              <div className="relative w-full md:w-36 h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0 group">
                <img
                  src="https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&q=80&w=400"
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Checklists */}
              <ul className="space-y-2 text-sm font-semibold text-foreground w-full">
                <li className="flex items-center gap-2">
                  <span className="text-sky-500 stroke-[3] font-bold">&gt;</span>
                  We Don't Cut Corners, We Clean Them
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-500 stroke-[3] font-bold">&gt;</span>
                  Bringing Freshness to Your Doorstep
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-500 stroke-[3] font-bold">&gt;</span>
                  Where Cleanliness Meets Perfection
                </li>
              </ul>

            </div>

            {/* Read More button & Founder Profile info */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link 
                to="/about"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs tracking-wider px-6 py-3.5 rounded-full flex items-center gap-1.5 uppercase transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Read More <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </Link>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                  alt="Mukesh Yadav"
                  className="w-11 h-11 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                />
                <div>
                  <h5 className="font-bold text-foreground text-sm leading-tight">Mukesh Yadav</h5>
                  <p className="text-xs text-muted-foreground">Founder</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
