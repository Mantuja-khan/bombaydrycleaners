import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { API_URL } from "@/config";

const defaultCategories = [
  {
    name: "Daily Wear",
    icon: "👕",
    items: [
      { name: "Shirt", washFold: 30, dryCleaning: 54, ironOnly: 18, premium: 66 },
      { name: "T-shirt", washFold: 25, dryCleaning: 45, ironOnly: 15, premium: 55 },
      { name: "Jeans", washFold: 40, dryCleaning: 72, ironOnly: 24, premium: 88 },
      { name: "Pants", washFold: 35, dryCleaning: 63, ironOnly: 21, premium: 77 },
      { name: "Shorts", washFold: 20, dryCleaning: 36, ironOnly: 12, premium: 44 },
      { name: "Kurta", washFold: 35, dryCleaning: 63, ironOnly: 21, premium: 77 },
    ],
  },
  {
    name: "Traditional / Ethnic",
    icon: "👗",
    items: [
      { name: "Saree", washFold: 80, dryCleaning: 144, ironOnly: 48, premium: 176 },
      { name: "Lehenga", washFold: 250, dryCleaning: 450, ironOnly: 150, premium: 550 },
      { name: "Suit / Salwar Kameez", washFold: 100, dryCleaning: 180, ironOnly: 60, premium: 220 },
      { name: "Sherwani", washFold: 200, dryCleaning: 360, ironOnly: 120, premium: 440 },
      { name: "Dupatta", washFold: 40, dryCleaning: 72, ironOnly: 24, premium: 88 },
    ],
  },
  {
    name: "Formal Wear",
    icon: "👔",
    items: [
      { name: "Blazer", washFold: 120, dryCleaning: 216, ironOnly: 72, premium: 264 },
      { name: "Coat", washFold: 150, dryCleaning: 270, ironOnly: 90, premium: 330 },
      { name: "Tie", washFold: 30, dryCleaning: 54, ironOnly: 18, premium: 66 },
      { name: "Formal Shirt", washFold: 40, dryCleaning: 72, ironOnly: 24, premium: 88 },
      { name: "Trousers", washFold: 45, dryCleaning: 81, ironOnly: 27, premium: 99 },
    ],
  },
  {
    name: "Home Items",
    icon: "🛏️",
    items: [
      { name: "Bedsheet", washFold: 60, dryCleaning: 108, ironOnly: 36, premium: 132 },
      { name: "Blanket", washFold: 150, dryCleaning: 270, ironOnly: 90, premium: 330 },
      { name: "Pillow Cover", washFold: 25, dryCleaning: 45, ironOnly: 15, premium: 55 },
      { name: "Curtains", washFold: 100, dryCleaning: 180, ironOnly: 60, premium: 220 },
      { name: "Sofa Cover", washFold: 180, dryCleaning: 324, ironOnly: 108, premium: 396 },
    ],
  },
  {
    name: "Accessories / Others",
    icon: "👟",
    items: [
      { name: "Shoes Cleaning", washFold: 100, dryCleaning: 180, ironOnly: 60, premium: 220 },
      { name: "Bags", washFold: 120, dryCleaning: 216, ironOnly: 72, premium: 264 },
      { name: "Jackets", washFold: 100, dryCleaning: 180, ironOnly: 60, premium: 220 },
      { name: "Woolen Clothes", washFold: 80, dryCleaning: 144, ironOnly: 48, premium: 176 },
    ],
  },
];

const PricingPage = () => {
  const [categories, setCategories] = useState<any[]>(defaultCategories);

  useEffect(() => {
    fetch(`${API_URL}/api/pricing`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data.categories && data.items) {
          const combined = data.categories.map((cat: any) => ({
            name: cat.name,
            icon: cat.icon || "👕",
            items: data.items
              .filter((item: any) => item.category_id === cat.id)
              .map((item: any) => ({
                name: item.name,
                washFold: item.wash_fold_price !== null && item.wash_fold_price !== undefined ? item.wash_fold_price : Math.round(item.base_price * 1),
                dryCleaning: item.dry_cleaning_price !== null && item.dry_cleaning_price !== undefined ? item.dry_cleaning_price : Math.round(item.base_price * 1.8),
                ironOnly: item.iron_only_price !== null && item.iron_only_price !== undefined ? item.iron_only_price : Math.round(item.base_price * 0.6),
                premium: item.premium_care_price !== null && item.premium_care_price !== undefined ? item.premium_care_price : Math.round(item.base_price * 2.2),
              })),
          }));
          setCategories(combined);
        }
      })
      .catch((err) => console.error("Error loading pricing:", err));
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary py-14 lg:py-20">
        <div className="container mx-auto section-padding text-center space-y-4 animate-fade-up">
          <span className="inline-block bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded">
            Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight">
            Transparent Pricing
          </h1>
          <p className="text-primary-foreground/70 max-w-lg mx-auto text-sm sm:text-base">
            No hidden charges. See exactly what you'll pay for each item and service.
          </p>
        </div>
      </section>

      {/* Service highlights */}
      <section className="py-10 border-b border-border">
        <div className="container mx-auto section-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Wash & Fold", desc: "Base price (1×)", color: "bg-primary/10 text-primary" },
              { label: "Dry Cleaning", desc: "1.8× base price", color: "bg-secondary/10 text-secondary" },
              { label: "Iron Only", desc: "0.6× base price", color: "bg-accent text-accent-foreground" },
              { label: "Premium Care", desc: "2.2× base price", color: "bg-primary/10 text-primary" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
                <h3 className="font-bold text-sm md:text-base">{s.label}</h3>
                <p className="text-xs mt-1 opacity-70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Tables */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto section-padding space-y-12">
          {categories.map((cat, ci) => (
            <div
              key={cat.name}
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: `${ci * 80}ms`, animationFillMode: "forwards" }}
            >
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">{cat.icon}</span> {cat.name}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Item</th>
                      <th className="text-center px-4 py-3 font-semibold text-foreground">Wash & Fold</th>
                      <th className="text-center px-4 py-3 font-semibold text-foreground">Dry Cleaning</th>
                      <th className="text-center px-4 py-3 font-semibold text-foreground">Iron Only</th>
                      <th className="text-center px-4 py-3 font-semibold text-foreground">Premium Care</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.items.map((item, i) => (
                      <tr key={item.name} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                        <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                        <td className="text-center px-4 py-3 text-muted-foreground">₹{item.washFold}</td>
                        <td className="text-center px-4 py-3 text-muted-foreground">₹{item.dryCleaning}</td>
                        <td className="text-center px-4 py-3 text-muted-foreground">₹{item.ironOnly}</td>
                        <td className="text-center px-4 py-3 text-muted-foreground">₹{item.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="text-center pt-6">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity active:scale-[0.97]"
            >
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
