import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-primary py-12 md:py-20 text-center">
        <div className="container mx-auto section-padding">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4">Contact Us</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            We're here to help! Reach out to us for inquiries, feedback, or to schedule your premier garment care.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 container mx-auto section-padding py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Information & Map */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">Our Location</h3>
                    <p className="text-muted-foreground">123 Clean Street, Laundry District<br/>Mumbai, MH 400001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">Email Us</h3>
                    <p className="text-muted-foreground">bombaydrycleaners@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">Call Us</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">Mon - Sat: 8:00 AM - 8:00 PM<br/>Sunday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden h-64 shadow-md border border-border">
              {/* Note: This is a placeholder standard iframe embed. In a real scenario, use actual Google Maps URL */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-8 lg:p-10 text-card-foreground">
            <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
            <p className="text-muted-foreground mb-8">Fill out the form below and we'll get back to you shortly.</p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message Sent Successfully!"); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1">Full Name</label>
                  <Input type="text" placeholder="John Doe" required className="h-12 bg-muted/30" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">Email <span className="text-primary">*</span></label>
                    <Input type="email" placeholder="john@example.com" required className="h-12 bg-muted/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">Phone</label>
                    <Input type="tel" placeholder="+91 0000000000" className="h-12 bg-muted/30" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1">Message <span className="text-primary">*</span></label>
                  <Textarea placeholder="How can we help you?" required className="min-h-[160px] resize-y bg-muted/30" />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all transform"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
