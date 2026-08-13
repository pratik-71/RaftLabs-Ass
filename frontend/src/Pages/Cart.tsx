import React, { useState } from 'react';
import { useCartStore } from '../Store/cartStore';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { deliverySchema, validateData } from '../Utils/validators';
import { BACKEND_URL } from '../Config/api';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Validate delivery details with Zod
    const validation = validateData(deliverySchema, deliveryDetails);
    if (validation.success === false) {
      toast.error(validation.error);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          totalAmount,
          deliveryDetails
        })
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/orders');
      } else {
        toast.error('Failed to place order.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error placing order.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-20 px-[5%] max-w-[1200px] mx-auto w-full">
        <h1 className="text-4xl font-heading font-extrabold text-textMain mb-8">Your Cart</h1>
        
        {items.length === 0 ? (
          <p className="text-textMuted text-lg">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <div key={item.product_id} className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl">{item.name}</h3>
                    <p className="text-primary font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold"
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold"
                    >+</button>
                    <button 
                      onClick={() => removeFromCart(item.product_id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border h-fit">
              <h3 className="font-bold text-2xl mb-6">Checkout</h3>
              <p className="text-xl mb-6">Total: <span className="font-bold text-primary">₹{totalAmount.toFixed(2)}</span></p>
              
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required type="text" className="w-full border p-2 rounded-md" 
                    value={deliveryDetails.name} onChange={e => setDeliveryDetails({...deliveryDetails, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea required className="w-full border p-2 rounded-md"
                    value={deliveryDetails.address} onChange={e => setDeliveryDetails({...deliveryDetails, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input required type="text" className="w-full border p-2 rounded-md"
                    value={deliveryDetails.phone} onChange={e => setDeliveryDetails({...deliveryDetails, phone: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primaryHover transition-colors">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
