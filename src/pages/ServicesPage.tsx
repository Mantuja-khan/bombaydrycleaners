import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import washFoldImg from "@/assets/wash-fold.jpg";
import dryCleaningImg from "@/assets/dry-cleaning.jpg";
import ironingImg from "@/assets/steam-ironing.png";

const services = [
  {
    image: washFoldImg,
    slug: "wash-and-fold",
    title: "1. Wash & Fold Area",
    shortDesc: "Professional washing and folding service with premium detergents.",
    longDesc: "Our Wash & Fold service takes the hassle out of laundry day. Simply schedule a pickup, and our expert team will wash, dry, and neatly fold every item using premium, eco-friendly detergents. We sort by color and fabric type, use optimal wash settings for each load, and return your clothes fresh, clean, and perfectly organized.",
    features: [
      "Color and fabric sorting for optimal care",
      "Premium eco-friendly detergents & fabric softeners",
      "Temperature-controlled washing and drying",
      "Neat precision folding and packaging",
      "Same-day and 24h turnaround options",
      "Free doorstep pickup and delivery",
    ],
  },
  {
    image: dryCleaningImg,
    slug: "dry-cleaning",
    title: "2. Dry Cleaning Part",
    slugName: "Dry Cleaning",
    shortDesc: "Expert dry cleaning for delicate fabrics, suits, and formal wear.",
    longDesc: "Trust your finest garments to our expert dry cleaning service. We specialize in handling delicate fabrics, designer pieces, suits, evening gowns, and specialty items with the care they deserve. Our advanced solvent-free cleaning process removes stubborn stains while preserving fabric integrity and color brilliance.",
    features: [
      "Solvent-free, eco-friendly gentle cleaning",
      "Specialized care for suits, silks, and woolens",
      "Professional steam pressing and finishing",
      "Minor seam repairs and button inspection",
      "Free protective garment hanger bags",
      "Wedding dress and formal wear specialists",
    ],
  },
  {
    image: ironingImg,
    slug: "steam-ironing",
    title: "3. Ironing Area",
    slugName: "Steam Ironing",
    shortDesc: "Professional wrinkle-free steam ironing and pressing service.",
    longDesc: "Our high-pressure steam ironing service ensures a sharp, crisp, wrinkle-free finish for all your shirts, trousers, suits, dresses, and ethnic wear. Temperature-controlled steam protects delicate fibers while eliminating deep creases and sanitizing fabric.",
    features: [
      "High-pressure industrial steam pressing",
      "Crisp collar, cuff, and crease perfection",
      "Safe temperature settings for delicate fabrics",
      "Custom option: Hanger or neat flat folding",
      "Sanitizing steam heat treatment",
      "Express 6-hour option available",
    ],
  },
];

export { services };

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-sky-600 to-blue-800 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center space-y-4 animate-fade-up relative z-10">
          <span className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Our Comprehensive Solutions
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            Professional Laundry & Garment Care
          </h1>
          <p className="text-sky-100 max-w-xl mx-auto text-sm sm:text-base">
            Explore our specialized Wash & Fold, Dry Cleaning, and Steam Ironing services tailored for your daily and premium wardrobe needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((s, i) => (
            <div
              key={s.slug}
              className={`bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center opacity-0 animate-fade-up`}
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: "forwards" }}
            >
              {/* Service Image Card - Larger image size & height */}
              <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="bg-gradient-to-b from-slate-50 to-sky-50/60 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-4 border border-slate-100 h-80 sm:h-96 shadow-inner overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="max-h-[92%] max-w-[95%] object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Service Details */}
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Service Category #0{i + 1}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{s.title}</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{s.longDesc}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {s.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    to="/booking"
                    className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md shadow-sky-600/20 hover:shadow-lg transition-all active:scale-[0.97]"
                  >
                    <span>Book {s.title.split(" ")[1] || s.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
