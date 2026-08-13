import React, { useEffect, useState } from 'react';

import { BACKEND_URL } from '../Config/api';

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  items: any[];
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Simulate real-time updates with polling every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Order Received': return 'text-blue-500 bg-blue-100';
      case 'Preparing': return 'text-yellow-600 bg-yellow-100';
      case 'Out for Delivery': return 'text-purple-600 bg-purple-100';
      case 'Delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 py-20 px-[5%] max-w-[1200px] mx-auto w-full">
        <h1 className="text-4xl font-heading font-extrabold text-textMain mb-8">Your Orders</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-textMuted text-lg">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
                  <h3 className="font-bold text-xl">Order #{order.id}</h3>
                  <span className={`px-4 py-1 rounded-full font-bold text-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-textMuted mb-4">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <ul className="list-disc list-inside mb-4">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx} className="text-textMuted">
                        {item.quantity}x {item.name} - ₹{(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <p className="font-bold text-lg">Total: <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
