import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogIn, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/config";

const navLinks = [
  { label: "Home", href: "/", isRoute: true },
  { label: "About Us", href: "/about", isRoute: true },
  {
    label: "Services",
    href: "/services",
    isRoute: true,
    children: [
      { label: "Wash & Fold", href: "/services" },
      { label: "Dry Cleaning", href: "/services" },
      { label: "Ironing", href: "/services" },
    ],
  },
  {
    label: "Pages",
    href: "#",
    children: [
      { label: "Pricing", href: "/pricing", isRoute: true },
      { label: "Testimonials", href: "/testimonials", isRoute: true },
      { label: "Online Booking", href: "/booking", isRoute: true },
    ],
  },
  { label: "Contact Us", href: "/contact", isRoute: true },
];

const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/orders/my`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const hasUpdates = data.some(o => o.status !== "confirmed" && o.status !== "pending");
            setHasNotification(hasUpdates);
          }
        })
        .catch(err => console.error("Error loading notification:", err));
    }
  }, [user]);

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setMobileOpen(false);
    if (isRoute || href.startsWith("/")) {
      navigate(href);
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 border-b border-primary/10">
        <div className="container mx-auto flex justify-between items-center px-4 section-padding">
          <div className="flex items-center gap-4">
            <span className="font-semibold flex items-center gap-1.5">
              📞 Mobile: <a href="tel:8306520830" className="hover:underline">8306520830</a>
            </span>
          </div>
          <div className="font-semibold tracking-wide bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded text-[10px]">
            GSTIN: 08BLGPY7659R1ZN
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-background shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4 section-padding">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 text-sm md:text-base font-bold tracking-tight">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt3AbM85cVzKjBDKpwEqkd388Aj-07rQynKQ&s" 
              alt="Bombay Dry Cleaners Logo" 
              className="w-7 h-7 rounded-full object-cover shadow-sm border border-secondary/25"
            />
            <span className="max-w-[125px] md:max-w-none leading-tight">Bombay <span className="text-secondary">Dry</span> Cleaners</span>
          </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li
              key={link.label}
              className="relative group"
              onMouseEnter={() => link.children && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => handleNavClick(link.href, (link as any).isRoute)}
                className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
                {link.children && <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {link.children && openDropdown === link.label && (
                <div className="absolute top-full left-0 pt-3 w-48 z-50">
                  <ul className="bg-background rounded-xl shadow-xl border py-2 animate-fade-in overflow-hidden">
                    {link.children.map((child) => (
                      <li key={child.label}>
                        <button
                          onClick={() => handleNavClick(child.href, (child as any).isRoute)}
                          className="block w-full text-left px-5 py-2.5 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* CTA + Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 border border-border px-4 py-2.5 rounded-full text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="relative flex items-center gap-2 border border-border px-4 py-2.5 rounded-full text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                <User className="w-4 h-4" /> My Profile
                {hasNotification && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 border border-border px-4 py-2.5 rounded-full text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Login
            </Link>
          )}
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
          >
            Online Booking
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t animate-fade-in">
          <ul className="flex flex-col py-4 section-padding">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.href, (link as any).isRoute)}
                  className="block w-full text-left py-3 text-sm font-medium text-foreground/80 hover:text-primary border-b border-border/50"
                >
                  {link.label}
                </button>
                {link.children && (
                  <ul className="pl-4">
                    {link.children.map((child) => (
                      <li key={child.label}>
                        <button
                          onClick={() => handleNavClick(child.href, (child as any).isRoute)}
                          className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-primary"
                        >
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="pt-4 flex gap-3">
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 border border-border px-4 py-2.5 rounded-full text-sm font-medium"
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 border border-border px-4 py-2.5 rounded-full text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              )}
              <Link
                to="/booking"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-semibold"
              >
                Online Booking
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  </>
  );
};

export default Navbar;
