import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../Config/api';
import { useCartStore } from '../Store/cartStore';
import { ShoppingCart, Zap } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = searchQuery ? `${BACKEND_URL}/api/products?q=${encodeURIComponent(searchQuery)}` : `${BACKEND_URL}/api/products`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50/50 px-6 pb-12 pt-6 md:px-12 md:pb-12 md:pt-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-black text-gray-900 mb-8 tracking-tight">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Menu'}
        </h1>
        
        {!loading && products.length > 0 && !searchQuery && (
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-gray-900 text-white shadow-md shadow-gray-900/20' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No items found</h2>
            <p className="text-gray-500">Try searching for something else or browse our full menu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col"
              >
                <div 
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="relative h-56 w-full bg-white flex items-center justify-center overflow-hidden p-6 cursor-pointer"
                >
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-gray-100">
                    {product.category}
                  </div>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium bg-gray-50 rounded-2xl">No Image</div>
                  )}
                </div>
                <div className="p-5 pt-2 flex flex-col flex-grow bg-white z-20">
                  <div className="flex justify-between items-start mb-6 gap-3">
                    <h3 
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="text-lg font-bold text-gray-900 font-heading leading-snug group-hover:text-primary transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <span className="text-lg font-black text-primary shrink-0">₹{product.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={() => addToCart({ product_id: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl })}
                      className="w-12 h-12 shrink-0 bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-600 rounded-xl flex items-center justify-center transition-colors duration-200"
                    >
                      <ShoppingCart size={20} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => {
                        addToCart({ product_id: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl });
                        navigate('/cart');
                      }}
                      className="flex-1 h-12 bg-gray-900 hover:bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-md shadow-gray-900/10"
                    >
                      <Zap size={18} fill="currentColor" /> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
