import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Minus, Plus, ShoppingBag, Sparkles, ArrowRight, MapPin, Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/config";

type ServiceType = "wash_fold" | "dry_clean" | "iron" | "premium";

const services: { id: ServiceType; label: string; icon: string; multiplier: number; description: string }[] = [
  { id: "wash_fold", label: "Wash & Fold", icon: "🧺", multiplier: 1, description: "Regular wash with folding" },
  { id: "dry_clean", label: "Dry Cleaning", icon: "🧴", multiplier: 1.8, description: "Professional dry cleaning" },
  { id: "iron", label: "Iron Only", icon: "👔", multiplier: 0.6, description: "Steam press & ironing" },
  { id: "premium", label: "Premium Care", icon: "✨", multiplier: 2.2, description: "Wash + Iron + Packaging" },
];

interface ClothingItem {
  name: string;
  basePrice: number;
}

interface Category {
  name: string;
  icon: string;
  items: ClothingItem[];
}

const defaultCategories: Category[] = [
  {
    name: "Daily Wear",
    icon: "👕",
    items: [
      { name: "Shirt", basePrice: 30 },
      { name: "T-shirt", basePrice: 25 },
      { name: "Jeans", basePrice: 40 },
      { name: "Pants", basePrice: 35 },
      { name: "Shorts", basePrice: 20 },
      { name: "Kurta", basePrice: 35 },
    ],
  },
  {
    name: "Traditional / Ethnic",
    icon: "👗",
    items: [
      { name: "Saree", basePrice: 80 },
      { name: "Lehenga", basePrice: 250 },
      { name: "Suit / Salwar Kameez", basePrice: 100 },
      { name: "Sherwani", basePrice: 200 },
      { name: "Dupatta", basePrice: 40 },
    ],
  },
  {
    name: "Formal Wear",
    icon: "👔",
    items: [
      { name: "Blazer", basePrice: 120 },
      { name: "Coat", basePrice: 150 },
      { name: "Tie", basePrice: 30 },
      { name: "Formal Shirt", basePrice: 40 },
      { name: "Trousers", basePrice: 45 },
    ],
  },
  {
    name: "Home Items",
    icon: "🛏️",
    items: [
      { name: "Bedsheet", basePrice: 60 },
      { name: "Blanket", basePrice: 150 },
      { name: "Pillow Cover", basePrice: 25 },
      { name: "Curtains", basePrice: 100 },
      { name: "Sofa Cover", basePrice: 180 },
    ],
  },
  {
    name: "Accessories / Others",
    icon: "👟",
    items: [
      { name: "Shoes Cleaning", basePrice: 100 },
      { name: "Bags", basePrice: 120 },
      { name: "Jackets", basePrice: 100 },
      { name: "Woolen Clothes", basePrice: 80 },
    ],
  },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<ServiceType>("wash_fold");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState(0);
  const [pickupAddress, setPickupAddress] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

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
                basePrice: item.base_price,
                washFoldPrice: item.wash_fold_price,
                dryCleaningPrice: item.dry_cleaning_price,
                ironOnlyPrice: item.iron_only_price,
                premiumCarePrice: item.premium_care_price,
              })),
          }));
          setCategories(combined);
        }
      })
      .catch((err) => console.error("Error loading pricing:", err));
  }, []);

  // Auto-fill address from profile
  useEffect(() => {
    if ((user as any)?.profile?.address) {
      setPickupAddress((user as any).profile.address);
    }
  }, [user]);

  const getItemPriceForService = (item: any, service: ServiceType) => {
    if (service === "wash_fold") return item.washFoldPrice !== null && item.washFoldPrice !== undefined ? item.washFoldPrice : Math.round(item.basePrice * 1);
    if (service === "dry_clean") return item.dryCleaningPrice !== null && item.dryCleaningPrice !== undefined ? item.dryCleaningPrice : Math.round(item.basePrice * 1.8);
    if (service === "iron") return item.ironOnlyPrice !== null && item.ironOnlyPrice !== undefined ? item.ironOnlyPrice : Math.round(item.basePrice * 0.6);
    if (service === "premium") return item.premiumCarePrice !== null && item.premiumCarePrice !== undefined ? item.premiumCarePrice : Math.round(item.basePrice * 2.2);
    return item.basePrice;
  };

  const updateQuantity = (itemName: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemName] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [itemName]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemName]: next };
    });
  };

  const { totalItems, totalPrice, selectedItems } = useMemo(() => {
    let items = 0;
    let price = 0;
    const selected: { name: string; qty: number; price: number }[] = [];

    for (const cat of categories) {
      for (const item of cat.items) {
        const qty = quantities[item.name] || 0;
        if (qty > 0) {
          const singlePrice = getItemPriceForService(item, selectedService);
          const itemPrice = singlePrice * qty;
          items += qty;
          price += itemPrice;
          selected.push({ name: item.name, qty, price: itemPrice });
        }
      }
    }
    return { totalItems: items, totalPrice: price, selectedItems: selected };
  }, [quantities, selectedService, categories]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto section-padding text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-3">
            Book Your Laundry
          </h1>
          <p className="text-primary-foreground/80 text-sm md:text-base max-w-xl mx-auto">
            Select your clothes, choose a service, and we'll handle the rest!
          </p>
        </div>
      </section>

      <div className="container mx-auto section-padding py-8 md:py-12">
        {/* Step 1: Service Selection */}
        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-1 flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Choose Service Type
          </h2>
          <p className="text-muted-foreground text-sm mb-4 ml-9">Price varies based on the service you choose</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`relative rounded-xl border-2 p-4 md:p-5 text-left transition-all duration-200 ${
                  selectedService === service.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                {selectedService === service.id && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </span>
                )}
                <span className="text-2xl">{service.icon}</span>
                <h3 className="font-semibold text-foreground text-sm md:text-base mt-2">{service.label}</h3>
                <p className="text-muted-foreground text-xs mt-0.5">{service.description}</p>
                <span className="text-xs text-primary font-semibold mt-2 inline-block">
                  {service.multiplier === 1 ? "Base Price" : `${service.multiplier}x Base`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Clothes */}
        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-1 flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Select Your Clothes
          </h2>
          <p className="text-muted-foreground text-sm mb-4 ml-9">Add items and adjust quantities</p>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
            {categories.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(i)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === i
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories[activeCategory].items.map((item) => {
              const qty = quantities[item.name] || 0;
              const itemPrice = getItemPriceForService(item, selectedService);
              return (
                <div
                  key={item.name}
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                    qty > 0 ? "border-primary/50 bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div>
                    <h4 className="font-medium text-foreground text-sm md:text-base">{item.name}</h4>
                    <p className="text-primary font-semibold text-sm">₹{itemPrice}<span className="text-muted-foreground font-normal text-xs"> / piece</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.name, -1)}
                      disabled={qty === 0}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className={`w-8 text-center text-sm font-semibold ${qty > 0 ? "text-primary" : "text-muted-foreground"}`}>
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.name, 1)}
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Pickup Address */}
        {totalItems > 0 && (
          <div className="mb-10">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-1 flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Pickup Address
            </h2>
            <p className="text-muted-foreground text-sm mb-4 ml-9">
              {user ? "Auto-filled from your profile. You can edit it." : "Please enter your pickup address or login to auto-fill."}
            </p>
            <div className="ml-9">
              {editingAddress || !pickupAddress ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Enter your full pickup address"
                      className="pl-10"
                    />
                  </div>
                  {pickupAddress && (
                    <button
                      onClick={() => setEditingAddress(false)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                    >
                      Save
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground flex-1">{pickupAddress}</span>
                  <button
                    onClick={() => setEditingAddress(true)}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              {!user && (
                <p className="text-xs text-muted-foreground mt-2">
                  <a onClick={() => navigate("/auth")} className="text-primary font-medium cursor-pointer hover:underline">Log in</a> to auto-fill your address
                </p>
              )}
            </div>
          </div>
        )}

        {/* Order Summary - sticky bottom on mobile */}
        {totalItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 md:static bg-card border-t md:border md:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:shadow-lg p-4 md:p-6 z-40 animate-fade-up">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="font-bold text-foreground flex items-center gap-2 text-base md:text-lg">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Summary
                </h3>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                {selectedItems.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm py-1.5 px-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                    <span className="font-medium text-foreground">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-primary">₹{totalPrice}</p>
                </div>
                <a
                  onClick={() => navigate("/checkout", {
                    state: {
                      selectedItems,
                      totalPrice,
                      totalItems,
                      serviceName: services.find(s => s.id === selectedService)!.label,
                      pickupAddress,
                    }
                  })}
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity active:scale-[0.97] cursor-pointer"
                >
                  Proceed to Book
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Extra padding when summary is fixed */}
        {totalItems > 0 && <div className="h-28 md:h-0" />}
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
