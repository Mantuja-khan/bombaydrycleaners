import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto section-padding py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-xl md:text-2xl font-bold text-background">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt3AbM85cVzKjBDKpwEqkd388Aj-07rQynKQ&s" 
                alt="Bombay Dry Cleaners Logo" 
                className="w-9 h-9 rounded-full object-cover shadow-sm bg-white p-0.5 border border-secondary/25"
              />
              <span>Bombay <span className="text-secondary">Dry</span> Cleaners</span>
            </Link>
            <p className="text-sm leading-relaxed text-background/60">
              Premium laundry & dry cleaning services delivering freshness and care to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/#about" },
                { label: "Services", href: "/services" },
                { label: "Pricing", href: "/pricing" },
                { label: "Testimonials", href: "/testimonials" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="hover:text-secondary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-background mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {["Wash & Fold", "Dry Cleaning"].map((s) => (
                <li key={s}>
                  <Link to="/services" className="hover:text-secondary transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-background mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary" />
                +91 8306520830
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary" />
                hello@bombaycleaners.com
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                142 Laundry Lane, Suite 8, New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center text-xs text-background/40">
          © {new Date().getFullYear()} Bombay Dry Cleaners. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
