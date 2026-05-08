import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethodSelect from "@/components/checkout/PaymentMethodSelect";
import OnlinePayment from "@/components/checkout/OnlinePayment";
import CodPayment from "@/components/checkout/CodPayment";
import OrderTracking from "@/components/checkout/OrderTracking";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { deliveryOptions } from "@/lib/delivery";
import { API_URL } from "@/config";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

type PaymentStep = "choose" | "online" | "cod_message" | "confirmed" | "loading";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<PaymentStep>("online");
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [orderId, setOrderId] = useState(() => `BDC${Date.now().toString().slice(-6)}`);

  const { selectedItems = [], totalPrice = 0, totalItems = 0, serviceName = "", pickupAddress = "" } = (location.state as {
    selectedItems: OrderItem[];
    totalPrice: number;
    totalItems: number;
    serviceName: string;
    pickupAddress: string;
  }) || {};

  if (!selectedItems.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto section-padding py-16 sm:py-20 text-center flex-1">
          <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">No items selected</h2>
          <p className="text-muted-foreground text-sm mb-6">Please go back and add items to your order.</p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Booking
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const deliveryCharge = deliveryOptions.find((d) => d.id === selectedDelivery)!.price;
  const grandTotal = totalPrice + deliveryCharge;
  const halfPrice = Math.ceil(grandTotal / 2);

  const handleConfirmOrder = async (method: "online" | "cod") => {
    if (!user) {
      toast.error("Please login to complete your order");
      navigate("/auth");
      return;
    }
    
    setStep("loading");
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          service_name: serviceName,
          total_items: totalItems,
          total_price: totalPrice,
          delivery_charge: deliveryCharge,
          pickup_address: pickupAddress,
          delivery_option: selectedDelivery,
          payment_method: method,
          items: selectedItems
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");
      
      setOrderId(data.id.split('-')[0].toUpperCase()); // Short form of UUID
      setStep("confirmed");
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error("Failed to place order: " + err.message);
      setStep(method === "online" ? "online" : "cod_message");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="bg-primary py-8 sm:py-10 md:py-14">
        <div className="container mx-auto section-padding text-center">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-primary-foreground mb-1 sm:mb-2">Checkout</h1>
          <p className="text-primary-foreground/70 text-xs sm:text-sm">Complete your order</p>
        </div>
      </section>

      <div className="container mx-auto section-padding py-6 sm:py-8 md:py-12 max-w-2xl flex-1">
        <OrderSummary
          selectedItems={selectedItems}
          totalPrice={totalPrice}
          totalItems={totalItems}
          serviceName={serviceName}
          deliveryCharge={deliveryCharge}
          grandTotal={grandTotal}
          selectedDelivery={selectedDelivery}
          onDeliveryChange={setSelectedDelivery}
        />

        {step === "online" && (
          <OnlinePayment grandTotal={grandTotal} onBack={() => navigate("/booking")} onConfirm={() => handleConfirmOrder("online")} />
        )}
        
        {step === "loading" && (
          <div className="p-8 text-center bg-card border rounded-2xl">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-semibold text-lg">Processing Order...</h3>
            <p className="text-muted-foreground text-sm">Please wait while we secure your booking.</p>
          </div>
        )}

        {step === "confirmed" && (
          <OrderTracking orderId={orderId} serviceName={serviceName} totalItems={totalItems} grandTotal={grandTotal} deliveryEta={deliveryOptions.find((d) => d.id === selectedDelivery)!.eta} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
