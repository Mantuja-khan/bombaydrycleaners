import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Play, ChevronRight, Sparkles, Award, Shield } from "lucide-react";

const highlights = [
  { title: "Artisanal Garment Care", desc: "Every piece of clothing is individually sorted, examined for stains, and hand-finished with utmost respect." },
  { title: "Advanced Eco-Friendly Solvents", desc: "We use organic, non-toxic cleaning solvents that preserve the soft texture and color of delicate fabrics." },
  { title: "Artisanal Steam Finishers", desc: "Our industrial-grade steam equipment relaxes fibers, delivering crisp, pristine, and wrinkle-free results." },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Navbar />

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

      {/* Hero Header Banner */}
      <section className="bg-primary py-16 md:py-20 text-center relative">
        <div className="absolute inset-0 bg-primary/5 pattern-grid opacity-20 pointer-events-none" />
        <div className="container mx-auto section-padding relative z-10">
          <span className="inline-block bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded mb-3">
            Our Story & Legacy
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-primary-foreground tracking-tight">About Bombay Dry Cleaners</h1>
          <p className="text-primary-foreground/80 text-base md:text-lg max-w-2xl mx-auto mt-3">
            Discover our rich tradition of premium fabric revival, eco-safe cleaning technologies, and dedicated care.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="flex-1 py-16 lg:py-24 container mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Overlapping Infinity Circles displaying Pinterest images */}
          <div className="relative flex justify-center py-6">
            
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
                  className="w-full h-full object-cover"
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

              {/* Decorative Floating Cartoon Glove */}
              <div className="absolute -left-6 bottom-4 text-5xl animate-bounce select-none filter drop-shadow-md" style={{ animationDuration: "3s" }}>
                🧤
              </div>

              {/* Decorative Floating Bucket */}
              <div className="absolute -right-6 bottom-4 text-5xl animate-bounce select-none filter drop-shadow-md" style={{ animationDuration: "4s", animationDelay: "500ms" }}>
                🪣
              </div>
            </div>

          </div>

          {/* Right Column: Premium Expanded Content */}
          <div className="space-y-6">
            
            <div className="flex items-center gap-1">
              <span className="text-sky-500 font-extrabold tracking-widest text-xs uppercase flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-sky-500 stroke-[3]" /> CRAFTSMANSHIP & INNOVATION
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
              Let Us Handle the Care <br />
              <span className="text-primary">So You Can Shine Always</span>
            </h2>

            <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
              <p>
                At Bombay Dry Cleaners, we believe that your wardrobe is a curated investment. For over a decade, we have dedicated ourselves to perfecting the science of textile care, ensuring that delicate silks, heavy wools, tailored wedding gowns, and daily wear are protected with utmost craftsmanship.
              </p>
              <p>
                Unlike generic laundromats, we treat every garment as a masterpiece. We individually check each item for spots, apply custom pre-treatment, use solvent-free eco-friendly washing solutions, and perform professional hand-finished steam pressing. Our state-of-the-art systems ensure fibers are relaxed, colors are preserved, and life is brought back to your beloved clothing.
              </p>
            </div>

            {/* Guarantees Matrix */}
            <div className="border border-sky-100 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-5 bg-sky-50/20 shadow-sm mt-4">
              {/* Video play badge */}
              <div className="relative w-full md:w-36 h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0 group">
                <img
                  src="https://i.pinimg.com/1200x/b0/b1/ff/b0b1fffb4da55e0b66401f21abd24622.jpg"
                  alt="Process Video"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Checklists */}
              <ul className="space-y-2 text-sm font-semibold text-foreground w-full">
                <li className="flex items-center gap-2">
                  <span className="text-sky-500 stroke-[3] font-black">&gt;</span>
                  Restoring Fiber Softness & Luster
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-500 stroke-[3] font-black">&gt;</span>
                  Eco-Safe, Non-Toxic Laundry Detergents
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-500 stroke-[3] font-black">&gt;</span>
                  Pristine Packaging & Crease-Free Hangers
                </li>
              </ul>
            </div>

            {/* Founder details */}
            <div className="flex items-center gap-3 pt-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                alt="Mukesh Yadav"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-sm"
              />
              <div>
                <h5 className="font-bold text-foreground text-sm leading-tight">Mukesh Yadav</h5>
                <p className="text-xs text-muted-foreground">Founder, Bombay Dry Cleaners</p>
              </div>
            </div>

          </div>

        </div>

        {/* Dynamic Highlights Column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pt-8 border-t border-border/40">
          {highlights.map((h, i) => (
            <div key={h.title} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {i === 0 && <Award className="w-5 h-5 text-primary" />}
                {i === 1 && <Shield className="w-5 h-5 text-primary" />}
                {i === 2 && <Sparkles className="w-5 h-5 text-primary" />}
              </div>
              <h4 className="font-bold text-foreground text-base mb-1.5">{h.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Showcase of remaining 4 Pinterest Images */}
        <div className="mt-20 md:mt-28">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full">
              🌿 Our Facility & Craftsmanship
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-3">Where Magic Happens</h3>
            <p className="text-xs text-muted-foreground mt-2">Take a visual tour inside our pristine laundering workspace, garment pressing lines, and detailed inspection tables.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              "https://i.pinimg.com/1200x/03/8e/e2/038ee2df40c0eee4141bb26fb125db5f.jpg",
              "https://i.pinimg.com/736x/31/47/4e/31474e3067b534b0f92cf00de0221aad.jpg",
              "https://i.pinimg.com/1200x/6f/af/08/6faf08e2b621efe5725f194abe228038.jpg",
              "https://i.pinimg.com/736x/96/56/eb/9656eb6dcd307b037ef185ecc29a0cd9.jpg"
            ].map((img, idx) => (
              <div key={idx} className="w-full h-48 md:h-64 object-cover rounded-2xl overflow-hidden shadow-md border border-border/50 bg-card group">
                <img 
                  src={img} 
                  alt={`Facility Showcase ${idx + 5}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
