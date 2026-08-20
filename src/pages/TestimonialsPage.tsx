import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Regular Customer",
    rating: 5,
    text: "Bombay Dry Cleaners has been my go-to for over 2 years. Their wash & fold service is impeccable — clothes always come back smelling fresh and perfectly folded. Highly recommended!",
    avatar: "PS",
  },
  {
    name: "Rajesh Patel",
    role: "Business Professional",
    rating: 5,
    text: "As someone who wears suits daily, I trust only Bombay Dry Cleaners with my formal wear. The dry cleaning quality is outstanding and the turnaround time is excellent.",
    avatar: "RP",
  },
  {
    name: "Anita Verma",
    role: "Homemaker",
    rating: 5,
    text: "I use their home items service for curtains and sofa covers. The stain removal is magical — they got out a red wine stain I thought was permanent! Their pickup and delivery is so convenient.",
    avatar: "AV",
  },
  {
    name: "Karan Singh",
    role: "IT Professional",
    rating: 4,
    text: "Great service at reasonable prices. The app makes booking super easy and I love the transparent pricing. The premium care service is worth every penny for my expensive shirts.",
    avatar: "KS",
  },
  {
    name: "Meena Joshi",
    role: "Fashion Designer",
    rating: 5,
    text: "I send my most delicate fabrics — silks, chiffons, embroidered sarees — to Bombay Dry Cleaners. They handle everything with such care. Never had a single issue in 3 years!",
    avatar: "MJ",
  },
  {
    name: "Amit Gupta",
    role: "Restaurant Owner",
    rating: 5,
    text: "We use their commercial service for our restaurant linens. Always on time, always spotless. The team is professional and the cash on delivery option is very convenient for our business.",
    avatar: "AG",
  },
  {
    name: "Sunita Reddy",
    role: "Working Mother",
    rating: 5,
    text: "With two kids, laundry was my biggest headache. Bombay Dry Cleaners made my life so much easier. The pick-up service saves me hours every week. Absolute lifesaver!",
    avatar: "SR",
  },
  {
    name: "Vikram Malhotra",
    role: "Groom (Wedding)",
    rating: 5,
    text: "They cleaned and pressed my entire wedding wardrobe — sherwani, kurtas, everything. Each piece came back looking brand new. I couldn't have been happier on my big day!",
    avatar: "VM",
  },
];

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary py-14 lg:py-20">
        <div className="container mx-auto section-padding text-center space-y-4 animate-fade-up">
          <span className="inline-block bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded">
            Testimonials
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight">
            What Our Customers Say
          </h1>
          <p className="text-primary-foreground/70 max-w-lg mx-auto text-sm sm:text-base">
            Real stories from real customers who trust us with their laundry care.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto section-padding">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-shadow opacity-0 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
              >
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-14 lg:py-20">
        <div className="container mx-auto section-padding text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-foreground">
            Ready to Experience the Difference?
          </h2>
          <p className="text-primary-foreground/70 max-w-md mx-auto text-sm">
            Join thousands of satisfied customers. Book your first pickup today!
          </p>
          <a
            href="/booking"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity active:scale-[0.97]"
          >
            Book Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;
