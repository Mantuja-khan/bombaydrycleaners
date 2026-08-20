import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Package, Search, DollarSign, Settings, Edit, Plus, Trash, Users, MapPin } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminSettings from "@/components/admin/AdminSettings";
import { API_URL } from "@/config";

const AdminPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("orders");
  const [categories, setCategories] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editWashFold, setEditWashFold] = useState("");
  const [editDryCleaning, setEditDryCleaning] = useState("");
  const [editIronOnly, setEditIronOnly] = useState("");
  const [editPremiumCare, setEditPremiumCare] = useState("");

  // Add Pricing Item States
  const [addingCategory, setAddingCategory] = useState<any>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newWashFold, setNewWashFold] = useState("");
  const [newDryCleaning, setNewDryCleaning] = useState("");
  const [newIronOnly, setNewIronOnly] = useState("");
  const [newPremiumCare, setNewPremiumCare] = useState("");

  // Editing User Address State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userAddressInput, setUserAddressInput] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (!authLoading && user && !isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async (): Promise<any[]> => {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to load orders");
      return res.json();
    },
    enabled: !!isAdmin,
  });

  const { data: usersList, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<any[]> => {
      const res = await fetch(`${API_URL}/api/auth/users`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to load users");
      return res.json();
    },
    enabled: !!isAdmin && activeTab === "users",
  });

  const { data: pricingCategories, isLoading: pricingLoading } = useQuery({
    queryKey: ["admin-pricing"],
    queryFn: async (): Promise<any[]> => {
      const res = await fetch(`${API_URL}/api/pricing`);
      if (!res.ok) throw new Error("Failed to load pricing");
      const { categories: catData, items: itemData } = await res.json();

      const combined = catData.map((cat: any) => ({
        ...cat,
        items: itemData.filter((item: any) => item.category_id === cat.id),
      }));
      setCategories(combined);
      return combined;
    },
    enabled: !!isAdmin && activeTab === "pricing",
  });

  const updateOrderFields = async (orderId: string, fields: any) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(fields)
      });
      if (!res.ok) throw new Error("Failed to update order");
      
      toast.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateUserAddress = async (userId: string, newAddress: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ address: newAddress })
      });
      if (!res.ok) throw new Error("Failed to update user address");
      toast.success("User delivery address updated successfully");
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdatePrice = async () => {
    if (!editingItem) return;
    try {
      const res = await fetch(`${API_URL}/api/pricing/items/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: editingItem.name,
          base_price: parseInt(editPrice || "0"),
          wash_fold_price: parseInt(editWashFold || "0"),
          dry_cleaning_price: parseInt(editDryCleaning || "0"),
          iron_only_price: parseInt(editIronOnly || "0"),
          premium_care_price: parseInt(editPremiumCare || "0"),
        })
      });
      if (!res.ok) throw new Error("Failed to update price");

      toast.success("Price updated successfully");
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddItem = async () => {
    if (!addingCategory || !newItemName) return;
    try {
      const base = parseInt(newItemPrice || "0");
      const res = await fetch(`${API_URL}/api/pricing/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          category_id: addingCategory.id,
          name: newItemName,
          base_price: base,
          wash_fold_price: parseInt(newWashFold || base.toString()),
          dry_cleaning_price: parseInt(newDryCleaning || Math.round(base * 1.8).toString()),
          iron_only_price: parseInt(newIronOnly || Math.round(base * 0.6).toString()),
          premium_care_price: parseInt(newPremiumCare || Math.round(base * 2.2).toString()),
        })
      });
      if (!res.ok) throw new Error("Failed to add pricing item");

      toast.success("Item added successfully");
      setAddingCategory(null);
      setNewItemName("");
      setNewItemPrice("");
      setNewWashFold("");
      setNewDryCleaning("");
      setNewIronOnly("");
      setNewPremiumCare("");
      queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this pricing item?")) return;
    try {
      const res = await fetch(`${API_URL}/api/pricing/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete item");

      toast.success("Item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (authLoading || (isAdmin && ordersLoading && activeTab === "orders")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="bg-primary py-8 md:py-12">
        <div className="container mx-auto section-padding text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-primary-foreground">Admin Panel</h1>
          <p className="text-primary-foreground/80 mt-2">Manage orders and pricing</p>
        </div>
      </div>

      <div className="container mx-auto section-padding py-8 flex-1">
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === "orders" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Package className="w-5 h-5" /> Orders
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === "users" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Users className="w-5 h-5" /> Customers
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === "pricing" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <DollarSign className="w-5 h-5" /> Pricing
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === "settings" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>

        {activeTab === "orders" && (
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-foreground font-semibold">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No orders found.</td>
                    </tr>
                  )}
                  {orders?.map((order: any) => (
                    <Fragment key={order.id}>
                      <tr className="hover:bg-muted/30 transition-colors border-t border-border">
                        <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{order.full_name || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{order.mobile_number || ""}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{order.service_name}</div>
                          <div className="text-xs text-muted-foreground">{order.total_items} items</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">₹{order.total_price + order.delivery_charge}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className={`w-fit px-2.5 py-1 text-xs font-bold rounded-full border ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' : 
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                              'bg-blue-100 text-blue-700 border-blue-200'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                            <span className={`w-fit px-2 py-0.5 text-[10px] font-semibold rounded border ${
                              order.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                              order.payment_status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                              PAY: {(order.payment_status || 'pending').toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <select
                              className="border rounded px-2 py-1 text-xs bg-background w-full max-w-[130px]"
                              value={order.status}
                              onChange={(e) => updateOrderFields(order.id, { status: e.target.value })}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="picked_up">Picked Up</option>
                              <option value="in_process">In Process</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <select
                              className="border rounded px-2 py-1 text-[11px] bg-background w-full max-w-[130px]"
                              value={order.payment_status || 'pending'}
                              onChange={(e) => updateOrderFields(order.id, { payment_status: e.target.value })}
                            >
                              <option value="pending">Pay Pending</option>
                              <option value="paid">Pay Paid</option>
                              <option value="failed">Pay Failed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                      {/* Sub-row for detailed tracking */}
                      <tr className="bg-muted/10 border-b border-border">
                        <td colSpan={6} className="px-6 py-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                            <div className="flex gap-4">
                              <div>
                                <span className="font-semibold text-muted-foreground mr-1.5">Pickup:</span>
                                <select
                                  className="border rounded px-2 py-1 bg-background text-[11px]"
                                  value={order.pickup_status || 'pending'}
                                  onChange={(e) => updateOrderFields(order.id, { pickup_status: e.target.value })}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="picked_up">Picked Up</option>
                                </select>
                              </div>
                              <div>
                                <span className="font-semibold text-muted-foreground mr-1.5">Drop / Delivery:</span>
                                <select
                                  className="border rounded px-2 py-1 bg-background text-[11px]"
                                  value={order.drop_status || 'pending'}
                                  onChange={(e) => updateOrderFields(order.id, { drop_status: e.target.value })}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="dropped">Dropped / Delivered</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex-1 max-w-md flex items-center gap-2">
                              <span className="font-semibold text-muted-foreground whitespace-nowrap">Delivery Info:</span>
                              <input
                                type="text"
                                className="flex-1 text-[11px] border rounded px-2 py-1 bg-background"
                                defaultValue={order.delivery_details || ''}
                                placeholder="e.g. Agent John - 9876543210, Delivered at 5 PM"
                                onBlur={(e) => {
                                  if (e.target.value !== (order.delivery_details || '')) {
                                    updateOrderFields(order.id, { delivery_details: e.target.value });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateOrderFields(order.id, { delivery_details: (e.target as HTMLInputElement).value });
                                  }
                                }}
                              />
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-primary" /> Delivery / Pickup Address:
                              </span>
                              <input
                                type="text"
                                className="flex-1 text-[11px] border rounded px-2.5 py-1 bg-background text-foreground font-medium"
                                defaultValue={order.pickup_address || ''}
                                placeholder="Edit delivery/pickup address for this order & sync to user profile..."
                                onBlur={(e) => {
                                  if (e.target.value !== (order.pickup_address || '')) {
                                    updateOrderFields(order.id, { pickup_address: e.target.value, update_user_address: true });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateOrderFields(order.id, { pickup_address: (e.target as HTMLInputElement).value, update_user_address: true });
                                  }
                                }}
                              />
                              <span className="text-[10px] text-muted-foreground/80 italic shrink-0">(Syncs to User Profile)</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-card border rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Registered Customers ({usersList?.length || 0})
              </h2>
            </div>
            {usersLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-foreground font-semibold">
                    <tr>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Delivery Address</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {usersList?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No registered customers found.</td>
                      </tr>
                    )}
                    {usersList?.map((u: any) => {
                      const profile = u.profile || {};
                      const isEditing = editingUser?.id === u.id;
                      return (
                        <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-foreground">{profile.full_name || "No Name"}</div>
                            {profile.is_admin && (
                              <span className="inline-block mt-0.5 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">ADMIN</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-foreground font-medium">{u.email || "No Email"}</div>
                            <div className="text-xs text-muted-foreground">{profile.mobile_number || u.phone || "No Phone"}</div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            {isEditing ? (
                              <Input
                                type="text"
                                className="text-xs h-9 bg-background"
                                value={userAddressInput}
                                onChange={(e) => setUserAddressInput(e.target.value)}
                                placeholder="Enter full delivery address..."
                              />
                            ) : (
                              <p className="text-xs text-foreground leading-relaxed">
                                {profile.address || <span className="text-muted-foreground italic">No address set</span>}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {isEditing ? (
                              <div className="flex justify-center gap-2">
                                <Button
                                  size="sm"
                                  className="h-8 text-xs bg-primary text-primary-foreground"
                                  onClick={() => handleUpdateUserAddress(u.id, userAddressInput)}
                                >
                                  Save Address
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs"
                                  onClick={() => setEditingUser(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs flex items-center gap-1 mx-auto"
                                onClick={() => {
                                  setEditingUser(u);
                                  setUserAddressInput(profile.address || "");
                                }}
                              >
                                <Edit className="w-3.5 h-3.5" /> Edit Address
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-6">
            {categories.map((cat: any) => (
              <div key={cat.id} className="bg-card border rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span> {cat.name}
                  </h3>
                  <Dialog open={addingCategory?.id === cat.id} onOpenChange={(open) => {
                    if (open) {
                      setAddingCategory(cat);
                      setNewItemName("");
                      setNewItemPrice("");
                      setNewWashFold("");
                      setNewDryCleaning("");
                      setNewIronOnly("");
                      setNewPremiumCare("");
                    } else {
                      setAddingCategory(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Item to {cat.name}</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                        <div>
                          <p className="text-sm font-medium mb-2">Item Name</p>
                          <Input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="e.g. Special Shirt"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Base Price (₹)</p>
                          <Input
                            type="number"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(e.target.value)}
                            placeholder="e.g. 50"
                          />
                        </div>
                        <div className="border-t pt-3 mt-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Individual Service Overrides (Optional)</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs font-medium mb-1.5">Wash & Fold (₹)</p>
                              <Input
                                type="number"
                                value={newWashFold}
                                onChange={(e) => setNewWashFold(e.target.value)}
                                placeholder="Auto"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-1.5">Dry Cleaning (₹)</p>
                              <Input
                                type="number"
                                value={newDryCleaning}
                                onChange={(e) => setNewDryCleaning(e.target.value)}
                                placeholder="Auto"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-1.5">Iron Only (₹)</p>
                              <Input
                                type="number"
                                value={newIronOnly}
                                onChange={(e) => setNewIronOnly(e.target.value)}
                                placeholder="Auto"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-1.5">Premium Care (₹)</p>
                              <Input
                                type="number"
                                value={newPremiumCare}
                                onChange={(e) => setNewPremiumCare(e.target.value)}
                                placeholder="Auto"
                              />
                            </div>
                          </div>
                        </div>
                        <Button onClick={handleAddItem} className="w-full mt-2">Create Item</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-4 py-3 font-semibold text-foreground text-left">Item</th>
                        <th className="px-4 py-3 font-semibold text-foreground text-center">Wash & Fold</th>
                        <th className="px-4 py-3 font-semibold text-foreground text-center">Dry Cleaning</th>
                        <th className="px-4 py-3 font-semibold text-foreground text-center">Iron Only</th>
                        <th className="px-4 py-3 font-semibold text-foreground text-center">Premium Care</th>
                        <th className="px-4 py-3 font-semibold text-foreground text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items?.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No items in this category.</td>
                        </tr>
                      )}
                      {cat.items?.map((item: any, i: number) => {
                        const washFold = item.wash_fold_price !== null && item.wash_fold_price !== undefined ? item.wash_fold_price : Math.round(item.base_price * 1);
                        const dryCleaning = item.dry_cleaning_price !== null && item.dry_cleaning_price !== undefined ? item.dry_cleaning_price : Math.round(item.base_price * 1.8);
                        const ironOnly = item.iron_only_price !== null && item.iron_only_price !== undefined ? item.iron_only_price : Math.round(item.base_price * 0.6);
                        const premiumCare = item.premium_care_price !== null && item.premium_care_price !== undefined ? item.premium_care_price : Math.round(item.base_price * 2.2);

                        return (
                          <tr key={item.id} className={i % 2 === 0 ? "bg-card hover:bg-muted/10 transition-colors" : "bg-muted/30 hover:bg-muted/10 transition-colors"}>
                            <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                            <td className="text-center px-4 py-3 text-muted-foreground">₹{washFold}</td>
                            <td className="text-center px-4 py-3 text-muted-foreground">₹{dryCleaning}</td>
                            <td className="text-center px-4 py-3 text-muted-foreground">₹{ironOnly}</td>
                            <td className="text-center px-4 py-3 text-muted-foreground">₹{premiumCare}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2 justify-center">
                                <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => {
                                  if (open) {
                                    setEditingItem(item);
                                    setEditPrice(item.base_price.toString());
                                    setEditWashFold(washFold.toString());
                                    setEditDryCleaning(dryCleaning.toString());
                                    setEditIronOnly(ironOnly.toString());
                                    setEditPremiumCare(premiumCare.toString());
                                  } else {
                                    setEditingItem(null);
                                  }
                                }}>
                                  <DialogTrigger asChild>
                                    <button className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1.5 rounded text-xs font-semibold hover:bg-primary/20 transition-all">
                                      <Edit className="w-3.5 h-3.5" /> Edit
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Update Prices for {editingItem?.name}</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                                      <div>
                                        <p className="text-sm font-medium mb-2">Base Price (₹)</p>
                                        <Input
                                          type="number"
                                          value={editPrice}
                                          onChange={(e) => setEditPrice(e.target.value)}
                                          placeholder="Enter base price"
                                        />
                                      </div>
                                      <div className="border-t pt-3 mt-3">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Individual Service Prices</p>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <p className="text-xs font-medium mb-1.5">Wash & Fold (₹)</p>
                                            <Input
                                              type="number"
                                              value={editWashFold}
                                              onChange={(e) => setEditWashFold(e.target.value)}
                                            />
                                          </div>
                                          <div>
                                            <p className="text-xs font-medium mb-1.5">Dry Cleaning (₹)</p>
                                            <Input
                                              type="number"
                                              value={editDryCleaning}
                                              onChange={(e) => setEditDryCleaning(e.target.value)}
                                            />
                                          </div>
                                          <div>
                                            <p className="text-xs font-medium mb-1.5">Iron Only (₹)</p>
                                            <Input
                                              type="number"
                                              value={editIronOnly}
                                              onChange={(e) => setEditIronOnly(e.target.value)}
                                            />
                                          </div>
                                          <div>
                                            <p className="text-xs font-medium mb-1.5">Premium Care (₹)</p>
                                            <Input
                                              type="number"
                                              value={editPremiumCare}
                                              onChange={(e) => setEditPremiumCare(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <Button onClick={handleUpdatePrice} className="w-full mt-2">Save Prices</Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded text-xs font-semibold transition-all"
                                >
                                  <Trash className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && <AdminSettings />}

      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
