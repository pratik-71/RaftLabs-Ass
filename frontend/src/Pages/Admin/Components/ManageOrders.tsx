import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../../../Config/api';
import { toast } from 'react-hot-toast';
import { Package, ChevronDown } from 'lucide-react';

interface Order {
  id: number;
  tracking_number?: string;
  status: string;
  totalAmount: number;
  items: any[];
  deliveryDetails: {
    name: string;
    address: string;
    phone: string;
  };
  createdAt: string;
}

const STATUS_OPTIONS = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        toast.success(`Order #${orderId} marked as ${newStatus}`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'order received': return 'text-blue-700 bg-blue-100';
      case 'preparing': return 'text-yellow-700 bg-yellow-100';
      case 'out for delivery': return 'text-purple-700 bg-purple-100';
      case 'delivered': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-textMuted font-medium">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center border border-dashed border-border rounded-xl">
        <Package size={32} className="text-textMuted mb-3 opacity-50" />
        <p className="text-textMuted font-medium">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-sm font-semibold text-textMuted">
            <th className="pb-3 px-4 font-heading">Order ID</th>
            <th className="pb-3 px-4 font-heading">Customer</th>
            <th className="pb-3 px-4 font-heading">Items</th>
            <th className="pb-3 px-4 font-heading">Total</th>
            <th className="pb-3 px-4 font-heading">Date</th>
            <th className="pb-3 px-4 font-heading">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {orders.map(order => (
            <tr key={order.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
              
              {/* Order ID & Tracking */}
              <td className="py-4 px-4 align-top">
                <div className="font-bold text-textMain mb-1">#{order.id}</div>
                {order.tracking_number && (
                  <div className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded inline-block">
                    {order.tracking_number}
                  </div>
                )}
              </td>
              
              {/* Customer */}
              <td className="py-4 px-4 align-top max-w-[200px]">
                <p className="font-bold text-textMain line-clamp-1">{order.deliveryDetails?.name || 'Unknown'}</p>
                <p className="text-xs text-textMuted line-clamp-1 mt-0.5">{order.deliveryDetails?.address || 'No address'}</p>
                <p className="text-xs font-semibold text-textMuted mt-0.5">{order.deliveryDetails?.phone || '-'}</p>
              </td>

              {/* Items */}
              <td className="py-4 px-4 align-top max-w-[200px]">
                <div className="space-y-1">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex text-xs items-center gap-1.5">
                      <span className="font-bold text-gray-400">{item.quantity}x</span>
                      <span className="font-medium text-gray-700 line-clamp-1">{item.name}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="text-xs font-semibold text-primary">+{order.items.length - 2} more</div>
                  )}
                </div>
              </td>

              {/* Total */}
              <td className="py-4 px-4 align-top font-bold text-primary">
                ₹{order.totalAmount.toFixed(2)}
              </td>

              {/* Date */}
              <td className="py-4 px-4 align-top text-xs font-medium text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}<br/>
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>

              {/* Status Select */}
              <td className="py-4 px-4 align-top">
                <div className="relative inline-block w-full min-w-[140px]">
                  <select
                    disabled={updatingId === order.id}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`appearance-none w-full border-none outline-none font-bold text-xs px-3 py-1.5 pr-8 rounded-full cursor-pointer disabled:opacity-50 transition-colors ${getStatusColor(order.status)}`}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-white text-gray-900 font-medium">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
