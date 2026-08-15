import { useState, useMemo, useCallback, useEffect } from 'react';
import { useCartStore } from '../Store/cartStore';
import { useAddressStore } from '../Store/addressStore';
import { useAuthStore } from '../Store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { deliverySchema, validateData } from '../Utils/validators';
import { BACKEND_URL } from '../Config/api';
import { MapPin, Phone, User, CreditCard, Lock, Loader2, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Checkout() {
  const { items: cartItems, clearCart, buyNowItem, setBuyNowItem } = useCartStore();
  const { addresses, addAddress } = useAddressStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  
  const items = buyNowItem ? [buyNowItem] : cartItems;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(addresses.length === 0);

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: addresses.length > 0 ? addresses[0].name : '',
    address: addresses.length > 0 ? addresses[0].address : '',
    phone: addresses.length > 0 ? addresses[0].phone : ''
  });

  useEffect(() => {
    if (addresses.length === 0) {
      setIsAddingNewAddress(true);
    }
  }, [addresses.length]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const deliveryFee = 40.00;
  const totalAmount = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !isOrderSuccess) {
      navigate('/cart');
    }
  }, [items, navigate, isOrderSuccess]);

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
        setIsOrderSuccess(true);
        
        // Clear cart after state update to prevent race condition with redirect effect
        setTimeout(() => {
          if (buyNowItem) {
            setBuyNowItem(null);
          } else {
            clearCart();
          }
        }, 100);
        
        // Save address if it doesn't already exist
        const isExistingAddress = addresses.some(
          addr => addr.name === deliveryDetails.name && 
                  addr.address === deliveryDetails.address && 
                  addr.phone === deliveryDetails.phone
        );
        if (!isExistingAddress) {
          addAddress(deliveryDetails);
        }
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

  if (isOrderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-body p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-400"></div>
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-heading font-black text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8 font-medium">
            Your delicious food is being prepared. We will notify you once it's out for delivery.
          </p>
          
          <div className="space-y-4">
            <Link to="/orders" className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-primaryHover transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group">
              <ShoppingBag size={20} />
              See My Orders
            </Link>
            <Link to="/products" className="w-full bg-white text-gray-900 border-2 border-gray-200 font-bold text-lg py-3.5 rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
              Order More
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                <div className={`mb-6 ${isAddingNewAddress ? 'border-b border-gray-100 pb-6' : ''}`}>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Select Saved Address</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map(addr => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => {
                          setDeliveryDetails({ name: addr.name, address: addr.address, phone: addr.phone });
                          setIsAddingNewAddress(false);
                        }}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          !isAddingNewAddress && deliveryDetails.address === addr.address && deliveryDetails.phone === addr.phone 
                            ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary' 
                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                      >
                        <p className="font-bold text-gray-900">{addr.name}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{addr.address}</p>
                      </button>
                    ))}
                    
                    {/* Add New Address Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewAddress(true);
                        setDeliveryDetails({ name: '', address: '', phone: '' });
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all ${
                        isAddingNewAddress
                          ? 'border-primary bg-primary/5 shadow-sm text-primary'
                          : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50 text-gray-500 hover:text-primary'
                      }`}
                    >
                      <span className="font-bold">+ Add New Address</span>
                    </button>
                  </div>
                </div>
              )}

              {isAddingNewAddress && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
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
              )}
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
