import { Link } from "react-router-dom";
import washFoldImg from "@/assets/wash-fold.jpg";
import dryCleaningImg from "@/assets/dry-cleaning.jpg";
import ironingImg from "@/assets/steam-ironing.png";
import { Sparkles, ArrowRight, Check } from "lucide-react";

const services = [
  {
    id: "wash-fold",
    image: washFoldImg,
    title: "Wash & Fold Area",
    subtitle: "Everyday Laundry Care",
    badge: "Most Popular",
    badgeColor: "bg-sky-500 text-white",
    desc: "Professional washing, drying, and neat folding using premium eco-friendly detergents. Delivered fresh and ready for your wardrobe.",
    features: ["Color & fabric sorting", "Eco-friendly detergents", "Neat precision folding"],
  },
  {
    id: "dry-cleaning",
    image: dryCleaningImg,
    title: "Dry Cleaning Part",
    subtitle: "Delicate & Suit Specialists",
    badge: "Premium Care",
    badgeColor: "bg-amber-500 text-white",
    desc: "Advanced solvent-free dry cleaning for suits, silk dresses, coats, and formal wear. Tough on stains while protecting fine fabrics.",
    features: ["Stain pre-treatment", "Gentle fabric preservation", "Free protective hanger bags"],
  },
  {
    id: "ironing",
    image: ironingImg,
    title: "Steam Ironing Area",
    subtitle: "Crisp & Wrinkle-Free Finish",
    badge: "Express Finish",
    badgeColor: "bg-emerald-500 text-white",
    desc: "High-pressure professional steam ironing for shirts, trousers, suits, and sarees. Gives your garments a sharp, flawless look.",
    features: ["High-pressure steam", "Crisp collar & cuff press", "Hanger or fold option"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full border border-sky-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Our Core Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            The Best Care Provided To Your Garments
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From daily laundry to luxury garment dry cleaning and crisp steam pressing, we handle every thread with expert precision.
          </p>
        </div>

        {/* 3 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 hover:shadow-2xl hover:shadow-sky-500/15 border border-slate-100 transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Top Badge */}
              <div className="absolute top-8 right-8 z-20">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${service.badgeColor}`}>
                  {service.badge}
                </span>
              </div>

              <div>
                {/* Image Container - Larger height & bigger image */}
                <div className="relative w-full h-64 sm:h-72 lg:h-80 rounded-2xl bg-gradient-to-b from-slate-50 to-sky-50/50 p-2 sm:p-3 mb-6 flex items-center justify-center overflow-hidden group-hover:bg-sky-50/80 transition-colors border border-slate-100/80">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="max-h-[95%] max-w-[98%] object-contain filter drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                    {service.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {service.desc}
                  </p>

                  {/* Bullet features */}
                  <ul className="pt-2 space-y-2">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 text-sky-600 font-bold text-sm hover:text-sky-700 transition-colors group-hover:translate-x-1 duration-300"
                >
                  <span>Book {service.title.split(" ")[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-sky-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner CTA */}
        <div className="mt-16 bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-sky-600/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Need Express Same-Day Pickup?</h3>
            <p className="text-sky-100 text-xs sm:text-sm max-w-xl">
              Book online in 60 seconds and our delivery agent will pick up your clothes right from your doorstep.
            </p>
          </div>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Schedule Free Pickup</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
