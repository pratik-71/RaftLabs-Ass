import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../Config/api';
import { Package, CheckCircle } from 'lucide-react';

interface Order {
  id: number;
  tracking_number?: string;
  status: string;
  totalAmount: number;
  items: any[];
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'order received': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'preparing': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'out for delivery': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-body">
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-12 max-w-[1000px] mx-auto w-full">
        <h2 className="text-3xl font-bold font-heading text-gray-900 mb-8">Order History</h2>
        
        {loadingOrders ? (
          <div className="text-center py-20"><p className="text-gray-500 font-medium">Loading orders...</p></div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => {
              const statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
              const currentStatusIndex = Math.max(0, statuses.findIndex(s => s.toLowerCase() === order.status.toLowerCase()));
              
              return (
                <div key={order.id} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3">
                        Order #{order.id}
                        {order.tracking_number && (
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                            {order.tracking_number}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Horizontal Status Tracking */}
                  <div className="mb-12 px-2 sm:px-8 max-w-2xl mx-auto">
                    <div className="relative flex justify-between">
                      {/* Background Line */}
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                      
                      {/* Active Line */}
                      <div 
                        className="absolute top-1/2 left-0 h-1.5 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500"
                        style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                      ></div>

                      {statuses.map((status, index) => {
                        const isActive = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        return (
                          <div key={status} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isActive 
                                ? 'bg-primary border-primary text-white shadow-sm' 
                                : 'bg-white border-gray-200 text-transparent'
                            }`}>
                              <CheckCircle size={14} className={isActive ? 'opacity-100' : 'opacity-0'} />
                            </div>
                            <span className={`absolute top-full mt-2 text-[10px] sm:text-xs font-bold text-center w-24 -ml-12 left-1/2 ${
                              isCurrent ? 'text-gray-900' : isActive ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6 mt-16 bg-gray-50/50 p-4 sm:p-6 rounded-2xl border border-gray-50">
                    <h4 className="font-bold text-sm text-gray-900 mb-4 pb-2">Items Ordered</h4>
                    {order.items.map((item: any, idx: number) => {
                      const itemContent = (
                        <>
                          <div className="flex items-center gap-4">
                            {item.imageUrl ? (
                              <div className="w-12 h-12 shrink-0 bg-white border border-gray-200 rounded-xl p-1.5 overflow-hidden flex items-center justify-center">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 shrink-0 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
                                <span className="text-[10px] font-bold">Foodie</span>
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 line-clamp-1">{item.name}</span>
                              <span className="text-xs font-bold text-gray-500">Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="text-gray-900 font-bold whitespace-nowrap ml-4">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </>
                      );

                      return item.slug ? (
                        <Link 
                          key={idx} 
                          to={`/product/${item.slug}`}
                          className="flex justify-between items-center text-sm bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group"
                        >
                          {itemContent}
                        </Link>
                      ) : (
                        <div key={idx} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                          {itemContent}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Amount</span>
                    <span className="font-black text-2xl text-primary">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
