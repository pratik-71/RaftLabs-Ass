import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useAuthStore } from '../Store/authStore';
import { useAddressStore } from '../Store/addressStore';
import { BACKEND_URL } from '../Config/api';
import { Package, MapPin, User, CheckCircle, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Order {
  id: number;
  tracking_number?: string;
  status: string;
  totalAmount: number;
  items: any[];
  createdAt: string;
}

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const { addresses, addAddress, deleteAddress } = useAddressStore();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('addresses');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', address: '', phone: '' });

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
    let interval: ReturnType<typeof setInterval>;
    if (activeTab === 'orders') {
      fetchOrders();
      interval = setInterval(fetchOrders, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.address || !newAddress.phone) {
      toast.error('Please fill all fields');
      return;
    }
    addAddress(newAddress);
    setNewAddress({ name: '', address: '', phone: '' });
    setShowAddForm(false);
    toast.success('Address saved successfully');
  };

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
      <Navbar />
      <main className="flex-1 py-10 px-[5%] max-w-[1000px] mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 line-clamp-1">{user?.user_metadata?.username || 'My Account'}</h2>
                <p className="text-xs text-gray-500">{user?.email || 'Manage your details'}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'addresses' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin size={16} /> Saved Addresses
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'orders' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package size={16} /> Order History
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                {!showAddForm && (
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={16} /> Add New
                  </button>
                )}
              </div>

              {showAddForm && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm">Add New Address</h3>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name</label>
                        <input 
                          required type="text" placeholder="John Doe"
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Phone Number</label>
                        <input 
                          required type="tel" placeholder="9876543210"
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Complete Address</label>
                      <textarea 
                        required rows={2} placeholder="123 Main St, Apartment 4B..."
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                      <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                      <button type="submit" className="px-5 py-2 text-sm font-bold bg-gray-900 text-white rounded-lg shadow-sm hover:bg-black transition-colors">Save Address</button>
                    </div>
                  </form>
                </div>
              )}

              {addresses.length === 0 && !showAddForm ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                  <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No saved addresses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col group relative">
                      <button 
                        onClick={() => deleteAddress(addr.id)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Address"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-sm text-gray-900">{addr.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">Saved</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 leading-relaxed flex-1">{addr.address}</p>
                      <p className="text-xs font-semibold text-gray-500">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
              
              {loadingOrders ? (
                <div className="text-center py-10"><p className="text-gray-500 text-sm">Loading orders...</p></div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                  <Package size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => {
                    const statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
                    const currentStatusIndex = statuses.findIndex(s => s.toLowerCase() === order.status.toLowerCase());
                    
                    return (
                      <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                          <div>
                            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                              Order #{order.id}
                              {order.tracking_number && (
                                <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                  {order.tracking_number}
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        {/* Horizontal Status Tracking (Amazon Style) */}
                        <div className="mb-8 px-2 sm:px-6">
                          <div className="relative flex justify-between">
                            {/* Background Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                            
                            {/* Active Line */}
                            <div 
                              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500"
                              style={{ width: `${Math.max(0, (currentStatusIndex / (statuses.length - 1)) * 100)}%` }}
                            ></div>

                            {statuses.map((status, index) => {
                              const isActive = index <= currentStatusIndex;
                              const isCurrent = index === currentStatusIndex;
                              return (
                                <div key={status} className="relative z-10 flex flex-col items-center gap-2">
                                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                    isActive 
                                      ? 'bg-primary border-primary text-white shadow-sm' 
                                      : 'bg-white border-gray-200 text-transparent'
                                  }`}>
                                    <CheckCircle size={12} className={isActive ? 'opacity-100' : 'opacity-0'} />
                                  </div>
                                  <span className={`absolute top-full mt-2 text-[10px] sm:text-xs font-bold text-center w-20 sm:w-24 -ml-10 sm:-ml-12 left-1/2 ${
                                    isCurrent ? 'text-gray-900' : isActive ? 'text-gray-600' : 'text-gray-400'
                                  }`}>
                                    {status}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4 mt-12">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-400">{item.quantity}x</span>
                                <span className="font-medium text-gray-700">{item.name}</span>
                              </div>
                              <span className="text-gray-600 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                          <span className="text-xs font-bold text-gray-500">Total Paid</span>
                          <span className="font-bold text-primary">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
