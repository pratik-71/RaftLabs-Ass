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
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row gap-6 lg:items-center relative">
          
          {/* Order Identity (ID & Date) */}
          <div className="w-full lg:w-48 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-heading font-extrabold text-xl text-gray-900">#{order.id}</span>
              {order.tracking_number && (
                <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-bold">
                  {order.tracking_number}
                </span>
              )}
            </div>
            <div className="text-xs font-medium text-gray-400">
              {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Customer Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2">Customer</h4>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-800 text-sm">{order.deliveryDetails?.name || 'Unknown'}</span>
              <span className="text-xs font-medium text-gray-500 line-clamp-1">{order.deliveryDetails?.address || 'No address provided'}</span>
              <span className="text-xs font-bold text-primary">{order.deliveryDetails?.phone || '-'}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="flex-1 min-w-0">
            <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2">Items</h4>
            <div className="space-y-1.5">
              {order.items.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 flex items-center justify-center bg-gray-50 text-gray-500 font-bold text-xs rounded">
                    {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-700 truncate">{item.name}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-xs font-bold text-primary pl-7">
                  +{order.items.length - 2} more items
                </div>
              )}
            </div>
          </div>

          {/* Total & Action */}
          <div className="w-full lg:w-48 shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
            <div className="flex flex-col lg:items-end">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">Total Paid</span>
              <span className="font-black text-2xl text-primary">₹{order.totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="relative w-40">
              <select
                disabled={updatingId === order.id}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={`appearance-none w-full border-none outline-none font-bold text-xs px-4 py-2.5 pr-8 rounded-xl cursor-pointer disabled:opacity-50 transition-colors shadow-sm focus:ring-2 focus:ring-primary/20 ${getStatusColor(order.status)}`}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt} className="bg-white text-gray-900 font-medium">
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}
