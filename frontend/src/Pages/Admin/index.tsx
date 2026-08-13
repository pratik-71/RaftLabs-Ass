import React, { useState } from 'react';
import { Package, Plus, ClipboardList } from 'lucide-react';
import AddProduct from './Components/AddProduct';
import ViewProducts from './Components/ViewProducts';
import ManageOrders from './Components/ManageOrders';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'view' | 'add' | 'orders'>('orders');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456789') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="bg-background p-8 rounded-xl shadow-md w-full max-w-md border border-border">
          <h2 className="text-2xl font-bold font-heading text-textMain mb-6 text-center">Admin Access</h2>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-textMain mb-2">Password</label>
              <input 
                type="password" 
                placeholder="Enter admin password"
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primaryHover text-white py-2.5 rounded-xl font-bold transition-colors"
            >
              Enter Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-textMain">Admin Dashboard</h1>
            <p className="text-textMuted mt-1">Manage your products, inventory, and incoming orders</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-border text-textMain font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Lock Panel
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto hide-scrollbar gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-textMuted hover:text-textMain'
            }`}
          >
            <ClipboardList size={20} />
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'view' ? 'border-primary text-primary' : 'border-transparent text-textMuted hover:text-textMain'
            }`}
          >
            <Package size={20} />
            View all products
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'add' ? 'border-primary text-primary' : 'border-transparent text-textMuted hover:text-textMain'
            }`}
          >
            <Plus size={20} />
            Add products
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-background rounded-xl p-6 shadow-sm border border-border overflow-hidden">
          {activeTab === 'orders' && <ManageOrders />}
          {activeTab === 'view' && <ViewProducts />}
          {activeTab === 'add' && <AddProduct />}
        </div>
      </div>
    </div>
  );
}
