import { useState, useMemo, useCallback, useEffect } from 'react';
import { useCartStore } from '../Store/cartStore';
import { useAddressStore } from '../Store/addressStore';
import { useAuthStore } from '../Store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { deliverySchema, validateData } from '../Utils/validators';
import { BACKEND_URL } from '../Config/api';
import { MapPin, Phone, User, CreditCard, Lock, Loader2, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { items: cartItems, clearCart, buyNowItem, setBuyNowItem } = useCartStore();
  const { addresses } = useAddressStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  
  const items = buyNowItem ? [buyNowItem] : cartItems;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const deliveryFee = 40.00;
  const totalAmount = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Require login
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to checkout");
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCheckout = useCallback(async () => {
    if (items.length === 0 || isSubmitting) return;

    // Validate delivery details before proceeding
    const validation = validateData(deliverySchema, deliveryDetails);
    if (validation.success === false) {
      toast.error(validation.error);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          totalAmount,
          deliveryFee,
          deliveryDetails,
          userId: user?.id
        })
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        if (buyNowItem) {
          setBuyNowItem(null); // Clear the direct checkout item
        } else {
          clearCart(); // Clear the main cart
        }
        navigate('/profile');
      } else {
        toast.error('Failed to place order.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error placing order.');
    } finally {
      setIsSubmitting(false);
    }
  }, [items, totalAmount, deliveryFee, deliveryDetails, isSubmitting, clearCart, navigate]);

  if (items.length === 0) return null; // Avoid flicker during redirect

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-body">
      <main className="flex-1 py-8 px-[5%] max-w-[1200px] mx-auto w-full">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Lock size={24} /> Secure Checkout
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column: Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <MapPin size={20} className="text-primary" /> Delivery Details
              </h3>
              
              {/* Saved Addresses Selector */}
              {addresses.length > 0 && (
                <div className="mb-6 border-b border-gray-100 pb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Select Saved Address</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map(addr => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => setDeliveryDetails({ name: addr.name, address: addr.address, phone: addr.phone })}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          deliveryDetails.address === addr.address && deliveryDetails.phone === addr.phone 
                            ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary' 
                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                      >
                        <p className="font-bold text-gray-900">{addr.name}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{addr.address}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                    <User size={16} className="text-gray-400" /> Full Name
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
                    value={deliveryDetails.name} 
                    onChange={e => setDeliveryDetails({...deliveryDetails, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                    <MapPin size={16} className="text-gray-400" /> Address
                  </label>
                  <textarea 
                    required 
                    rows={3}
                    placeholder="123 Main St, Apt 4B..."
                    className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm"
                    value={deliveryDetails.address} 
                    onChange={e => setDeliveryDetails({...deliveryDetails, address: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Phone size={16} className="text-gray-400" /> Phone Number
                  </label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="9876543210"
                    className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    value={deliveryDetails.phone} 
                    onChange={e => setDeliveryDetails({...deliveryDetails, phone: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mini Summary with Thumbs & Tick Marks */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-primary/20 sticky top-24">
              <h3 className="font-bold text-xl text-gray-900 mb-4 border-b border-gray-100 pb-4">Order Summary</h3>

              {/* Item Thumbnails with Tick Mark */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                {items.map(item => (
                  <div key={item.product_id} className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 p-1 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <span className="text-[10px] font-bold">Foodie</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 bg-green-500 rounded-full border-2 border-white text-white">
                        <CheckCircle2 size={14} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-sm text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Delivery Fee</span>
                  <span>+₹{deliveryFee.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="font-black text-2xl text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout} 
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold text-base py-4 rounded-xl hover:bg-primaryHover transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Place Order (₹{totalAmount.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
