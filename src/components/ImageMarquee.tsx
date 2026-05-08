import React from "react";

const marqueeImages = [
  "https://i.pinimg.com/736x/6f/3d/86/6f3d869f17093d2adf68d2b2989fdd3b.jpg",
  "https://i.pinimg.com/1200x/1e/2a/dd/1e2add775db5fc54d1dec059134e1289.jpg",
  "https://i.pinimg.com/1200x/92/47/3a/92473ac3815566e559793f1cd5f47c39.jpg",
  "https://i.pinimg.com/1200x/b0/b1/ff/b0b1fffb4da55e0b66401f21abd24622.jpg",
  "https://i.pinimg.com/1200x/03/8e/e2/038ee2df40c0eee4141bb26fb125db5f.jpg",
  "https://i.pinimg.com/736x/31/47/4e/31474e3067b534b0f92cf00de0221aad.jpg",
  "https://i.pinimg.com/1200x/6f/af/08/6faf08e2b621efe5725f194abe228038.jpg",
  "https://i.pinimg.com/736x/96/56/eb/9656eb6dcd307b037ef185ecc29a0cd9.jpg"
];

const ImageMarquee = () => {
  // Duplicate the array to ensure perfect, gapless seamless wrapping
  const doubleImages = [...marqueeImages, ...marqueeImages];

  return (
    <section className="py-12 bg-muted/20 border-y border-border/40 overflow-hidden relative group">
      {/* CSS Keyframe Animation inside styled block */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track-animated {
          display: flex;
          width: max-content;
          animation: marquee-scroll 35s linear infinite;
        }
        .marquee-track-animated:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="container mx-auto section-padding mb-6 text-center">
        <span className="inline-block bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-2">
          ✨ Aesthetic Gallery
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-foreground">Our Laundry & Garments Craftsmanship</h2>
      </div>

      <div className="relative w-full flex items-center overflow-hidden">
        {/* Soft edge gradients for a sleek cinematic fading effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="marquee-track-animated gap-4 md:gap-6 px-4">
          {doubleImages.map((imgUrl, index) => (
            <div 
              key={index} 
              className="w-36 sm:w-48 h-48 sm:h-60 rounded-xl overflow-hidden shadow-md border border-border/50 bg-card flex-shrink-0 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-primary/40 group/item"
            >
              <img 
                src={imgUrl} 
                alt={`Laundry Workspace Asset ${index % marqueeImages.length + 1}`} 
                className="w-full h-full object-cover transition-all duration-700 group-hover/item:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageMarquee;
