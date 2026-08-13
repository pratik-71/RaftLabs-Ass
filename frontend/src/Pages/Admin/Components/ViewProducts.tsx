import React, { useState, useEffect } from 'react';
import { Package, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { CATEGORIES } from './AddProduct';
import { BACKEND_URL } from '../../../Config/api';

export default function ViewProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Modals state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${productToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        setProductToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(products.map(p => p.id === editingProduct.id ? data.data : p));
        setEditingProduct(null);
      }
    } catch (err) {
      console.error("Failed to update", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Products</h2>
      {isLoadingProducts ? (
        <div className="text-center py-12 text-textMuted">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-textMuted">
          <Package size={48} className="mx-auto mb-4 opacity-50" />
          <p>No products found. Add some products to see them here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border text-sm text-textMuted">
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-surface/50 transition-colors">
                  <td className="p-4">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="h-12 w-12 object-cover rounded-md" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-md text-gray-400 text-xs">No Img</div>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-textMain">{p.name}</td>
                  <td className="p-4 text-sm text-textMuted">
                    <span className="bg-surface border border-border px-2 py-1 rounded-full">{p.category}</span>
                  </td>
                  <td className="p-4 font-bold text-primary">₹{Number(p.price).toFixed(2)}</td>
                  <td className="p-4 text-sm text-textMuted">{p.stock || 0}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setEditingProduct({...p, items: p.items ? p.items.join(', ') : ''})}
                      className="p-2 text-textMuted hover:text-blue-500 transition-colors inline-block"
                      title="Edit Product"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => setProductToDelete(p)}
                      className="p-2 text-textMuted hover:text-red-500 transition-colors inline-block ml-2"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-xl font-bold text-textMain">Delete Product</h3>
            </div>
            <p className="text-textMuted mb-6">
              Are you sure you want to delete <span className="font-bold text-textMain">{productToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg font-semibold text-textMain hover:bg-surface transition-colors border border-border"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Full Screen Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-background z-[100] overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 md:p-12">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
              <h2 className="text-3xl font-bold font-heading text-textMain">Edit Product</h2>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-2 bg-surface hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-textMain mb-2">Product Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-textMain mb-2">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-textMain mb-2">Short Description</label>
                <textarea 
                  rows={3} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-textMain mb-2">Price (₹)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-textMain mb-2">Items Included (comma separated)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
                    value={editingProduct.items}
                    onChange={(e) => setEditingProduct({...editingProduct, items: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-textMain mb-2">Stock Quantity</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
                  value={editingProduct.stock || 0}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value, 10) || 0})}
                  required
                />
              </div>
              
              {/* Note: In a full app, you'd add image upload here for editing as well */}
              
              <div className="pt-8 flex justify-end gap-4 border-t border-border mt-8">
                <button 
                  type="button" 
                  onClick={() => setEditingProduct(null)}
                  className="px-6 py-3 rounded-xl font-bold text-textMain hover:bg-surface transition-colors border border-border"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-primary hover:bg-primaryHover text-white px-10 py-3 rounded-xl font-bold transition-colors shadow-md flex items-center gap-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
