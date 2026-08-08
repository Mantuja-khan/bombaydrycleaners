import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, LogOut, User, Phone, MapPin, Loader2, ShoppingBag, Calendar, Sparkles, Clock } from "lucide-react";
import { API_URL } from "@/config";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    mobile_number: "",
    address: "",
    avatar_url: "",
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      fetchProfile();
      fetchMyOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/my`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (err) {
      console.error("Error loading user orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "picked_up": return "bg-purple-100 text-purple-800 border-purple-200";
      case "in_progress": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "delivered": return "bg-teal-100 text-teal-800 border-teal-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").toUpperCase();
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      if (data.profile) {
        setProfile({
          full_name: data.profile.full_name || "",
          mobile_number: data.profile.mobile_number || "",
          address: data.profile.address || "",
          avatar_url: data.profile.avatar_url || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          full_name: profile.full_name,
          mobile_number: profile.mobile_number,
          address: profile.address,
          avatar_url: profile.avatar_url,
        })
      });

      if (!res.ok) throw new Error("Failed to update profile");
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    toast({ title: "Not Supported", description: "Avatar upload is not supported in the new backend yet." });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-primary py-10 md:py-14">
        <div className="container mx-auto section-padding text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-primary-foreground">My Profile</h1>
          <p className="text-primary-foreground/80 text-sm mt-2">Manage your account details</p>
        </div>
      </section>

      <div className="container mx-auto section-padding py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Profile Card (Left Column) */}
          <div className="lg:col-span-1 bg-card border rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-3">
              <User className="w-5 h-5 text-primary" />
              Profile Settings
            </h2>
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted border-4 border-primary/20 overflow-hidden flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Click camera to change photo</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name" className="text-sm font-medium text-foreground">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                    placeholder="Your full name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mobile_number" className="text-sm font-medium text-foreground">Mobile Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="mobile_number"
                    value={profile.mobile_number}
                    onChange={(e) => setProfile((p) => ({ ...p, mobile_number: e.target.value }))}
                    placeholder="+91 9876543210"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-foreground">Delivery Address</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Your full address for pickup & delivery"
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 border border-destructive text-destructive py-3 rounded-xl font-semibold text-sm hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Orders Card (Right Column) */}
          <div className="lg:col-span-2 bg-card border rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-3">
              <ShoppingBag className="w-5 h-5 text-primary" />
              My Orders & Live Updates
            </h2>

            {ordersLoading ? (
              <div className="py-16 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed border-border px-4">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-semibold text-sm">No orders placed yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">Book your dry cleaning or laundry order today to trace live updates from the admin!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border rounded-xl p-4 md:p-5 hover:border-primary/20 transition-all shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 mb-3">
                      <div>
                        <div className="font-bold text-sm md:text-base text-foreground flex items-center gap-2">
                          <span>{order.service_name}</span>
                          <span className="text-xs font-normal text-muted-foreground">({order.total_items} items)</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ID: {order.id.slice(0, 8)}</span>
                        </div>
                      </div>
                      <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">Itemized Breakdown</div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {order.items?.map((item: any, i: number) => (
                            <div key={i} className="text-xs text-foreground flex justify-between bg-muted/40 px-2 py-1.5 rounded">
                              <span>{item.name} × {item.qty}</span>
                              <span className="font-bold">₹{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col justify-between text-right md:border-l border-border md:pl-4">
                        <div className="text-left md:text-right">
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Pickup Address</div>
                          <p className="text-xs text-foreground line-clamp-2 leading-relaxed">{order.pickup_address}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-dashed border-border">
                          <span className="text-xs font-medium text-muted-foreground">Total Price:</span>
                          <span className="text-xl font-black text-primary">₹{order.total_price}</span>
                        </div>
                      </div>
                    </div>
                    {/* Delivery & Payment Details section */}
                    <div className="mt-4 pt-4 border-t border-dashed border-border space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-muted/40 p-2 rounded-lg">
                          <div className="font-bold text-muted-foreground">Payment Status</div>
                          <span className={`inline-block mt-1 font-semibold px-2 py-0.5 rounded text-[10px] uppercase border ${
                            order.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                            order.payment_status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {order.payment_status || 'pending'}
                          </span>
                        </div>
                        <div className="bg-muted/40 p-2 rounded-lg">
                          <div className="font-bold text-muted-foreground">Payment Method</div>
                          <div className="mt-1 font-medium capitalize text-foreground">{order.payment_method}</div>
                        </div>
                        <div className="bg-muted/40 p-2 rounded-lg">
                          <div className="font-bold text-muted-foreground">Pickup Status</div>
                          <span className={`inline-block mt-1 font-semibold px-2 py-0.5 rounded text-[10px] uppercase border ${
                            order.pickup_status === 'picked_up' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {order.pickup_status === 'picked_up' ? 'Picked Up' : 'Pending'}
                          </span>
                        </div>
                        <div className="bg-muted/40 p-2 rounded-lg">
                          <div className="font-bold text-muted-foreground">Delivery Status</div>
                          <span className={`inline-block mt-1 font-semibold px-2 py-0.5 rounded text-[10px] uppercase border ${
                            order.drop_status === 'dropped' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {order.drop_status === 'dropped' ? 'Dropped / Delivered' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      {order.delivery_details && (
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-xs text-foreground flex items-start gap-2 text-left">
                          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-primary block mb-0.5">Delivery Details & Updates:</span>
                            <p className="text-muted-foreground leading-relaxed">{order.delivery_details}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
