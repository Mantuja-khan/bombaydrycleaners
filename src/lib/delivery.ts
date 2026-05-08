export interface DeliveryOption {
  id: string;
  label: string;
  desc: string;
  price: number;
  eta: string;
}

export const deliveryOptions: DeliveryOption[] = [
  { id: "standard", label: "Standard Delivery", desc: "Regular delivery within 3-5 days", price: 30, eta: "3-5 days" },
  { id: "express", label: "Express Delivery", desc: "Fast delivery within 1-2 days", price: 49, eta: "1-2 days" },
  { id: "sameday", label: "Same Day Delivery", desc: "Get it delivered today", price: 99, eta: "Today" },
];
