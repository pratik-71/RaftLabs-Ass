import { useMemo } from 'react';
import { useCartStore } from '../Store/cartStore';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-body">
      <main className="flex-1 py-8 px-[5%] max-w-[1200px] mx-auto w-full">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShoppingBag size={24} /> Your Cart
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
            
            {/* Left Column: Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.product_id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex gap-4 items-center transition-all hover:shadow-sm">
                      
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        ) : (
                          <div className="text-gray-400 text-xs font-medium">No Image</div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div>
                          <h4 className="font-heading font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h4>
                          <p className="text-primary font-bold text-base mt-1">₹{item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                            <button 
                              onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors text-sm"
                            >-</button>
                            <span className="w-10 text-center font-bold text-base">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors text-sm"
                            >+</button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-xs font-bold text-red-500 hover:text-white transition-colors border border-red-200 hover:bg-red-500 hover:border-red-500 px-4 py-2 rounded-lg"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (Simple) */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
                <h3 className="font-bold text-xl text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h3>

                <div className="space-y-4 mb-6 text-base">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-900 text-lg">Subtotal</span>
                    <span className="font-black text-2xl text-primary">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">Delivery fee added at checkout</p>
                </div>
                
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-white font-bold text-base py-4 rounded-xl hover:bg-primaryHover transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  Proceed to Checkout <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}
