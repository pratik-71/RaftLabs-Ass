import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useCartStore } from '../Store/cartStore';
import { useAddressStore } from '../Store/addressStore';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { deliverySchema, validateData } from '../Utils/validators';
import { BACKEND_URL } from '../Config/api';
import { MapPin, Phone, User, CheckCircle, CreditCard, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { addresses } = useAddressStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<1 | 2>(1);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const deliveryFee = 40.00;
  const totalAmount = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const handleContinueToSummary = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(deliverySchema, deliveryDetails);
    if (validation.success === false) {
      toast.error(validation.error);
      return;
    }
    setStep(2);
  }, [deliveryDetails]);

  useEffect(() => {
    if (step === 2 && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  const handleCheckout = useCallback(async () => {
    if (items.length === 0 || isSubmitting) return;

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
          deliveryDetails
        })
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        clearCart();
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-body">
      <main className="flex-1 py-8 px-[5%] max-w-[1200px] mx-auto w-full">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShoppingBag size={24} /> Checkout
        </h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100 max-w-lg mx-auto mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
            <button onClick={() => navigate('/products')} className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-black transition-colors shadow-sm text-sm">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2 px-1">Order Items</h2>
              {items.map(item => (
                <div key={item.product_id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center transition-all hover:shadow-md">
                  
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    ) : (
                      <div className="text-gray-400 text-[10px] font-medium">No Image</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-base text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-primary font-bold text-sm">₹{item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-100/80 rounded-lg p-0.5 border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                          disabled={isSubmitting}
                          className="w-7 h-7 rounded-md bg-white flex items-center justify-center font-bold text-gray-700 shadow-sm hover:text-primary transition-colors text-sm disabled:opacity-50"
                        >-</button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={isSubmitting}
                          className="w-7 h-7 rounded-md bg-white flex items-center justify-center font-bold text-gray-700 shadow-sm hover:text-primary transition-colors text-sm disabled:opacity-50"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product_id)}
                        disabled={isSubmitting}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors bg-red-50 px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Right Column: Multi-Step Checkout */}
            <div className="lg:col-span-1">
              
              {step === 1 ? (
                /* Step 1: Address Details */
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-20">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <MapPin size={18} className="text-primary" /> Delivery Details
                  </h3>
                  
                  {/* Saved Addresses Selector */}
                  {addresses.length > 0 && (
                    <div className="mb-5 border-b border-gray-100 pb-5">
                      <label className="block text-xs font-bold text-gray-600 mb-2">Select Saved Address</label>
                      <div className="space-y-2">
                        {addresses.map(addr => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => setDeliveryDetails({ name: addr.name, address: addr.address, phone: addr.phone })}
                            className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                              deliveryDetails.address === addr.address && deliveryDetails.phone === addr.phone 
                                ? 'border-primary bg-primary/5 shadow-sm' 
                                : 'border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            <p className="font-bold text-gray-900">{addr.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{addr.address}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleContinueToSummary} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" /> Full Name
                      </label>
                      <input 
                        required 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all" 
                        value={deliveryDetails.name} 
                        onChange={e => setDeliveryDetails({...deliveryDetails, name: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" /> Address
                      </label>
                      <textarea 
                        required 
                        rows={2}
                        placeholder="123 Main St, Apt 4B..."
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all resize-none"
                        value={deliveryDetails.address} 
                        onChange={e => setDeliveryDetails({...deliveryDetails, address: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" /> Phone Number
                      </label>
                      <input 
                        required 
                        type="tel" 
                        placeholder="9876543210"
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                        value={deliveryDetails.phone} 
                        onChange={e => setDeliveryDetails({...deliveryDetails, phone: e.target.value})} 
                      />
                    </div>
                    <button type="submit" className="w-full bg-gray-900 text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-black transition-colors shadow-sm mt-2 flex items-center justify-center gap-2 group">
                      Continue to Payment <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </div>
              ) : (
                /* Step 2: Order Summary */
                <div ref={summaryRef} className="bg-white p-6 rounded-2xl shadow-md border border-primary/20 sticky top-20">
                  <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">Order Summary</h3>
                    <button onClick={() => setStep(1)} disabled={isSubmitting} className="text-xs font-bold text-primary hover:underline disabled:opacity-50">Edit</button>
                  </div>

                  {/* Delivery Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-5 border border-gray-100">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="font-bold text-sm text-gray-900">{deliveryDetails.name}</p>
                        <p className="text-xs text-gray-600 mt-0.5 leading-snug">{deliveryDetails.address}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{deliveryDetails.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2.5 mb-5 text-sm">
                    <div className="flex justify-between text-gray-600 font-medium">
                      <span>Subtotal ({items.length} items)</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 font-medium">
                      <span>Delivery Fee</span>
                      <span>+₹{deliveryFee.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3 mb-6">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-gray-900 text-base">Total</span>
                      <span className="font-black text-xl text-primary">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCheckout} 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white font-semibold text-sm py-3 rounded-lg hover:bg-primaryHover transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Place Order (₹{totalAmount.toFixed(2)})
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-wider">
                    Secure Checkout
                  </p>
                </div>
              )}
              
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
