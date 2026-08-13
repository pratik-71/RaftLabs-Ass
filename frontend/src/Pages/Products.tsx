import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../Config/api';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');

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

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-heading font-extrabold text-textMain mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Menu'}
        </h1>
        <p className="text-textMuted mb-10 text-lg">
          {searchQuery ? `Found ${products.length} delicious items` : 'Discover our most popular and delicious meals, made fresh for you.'}
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-2xl shadow-sm border border-border">
            <h2 className="text-2xl font-bold text-textMain mb-2">No items found</h2>
            <p className="text-textMuted">Try searching for something else or browse our full menu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-textMain shadow-sm">
                    {product.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-textMain font-heading">{product.name}</h3>
                    <span className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-textMuted text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  {product.items && product.items.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {product.items.map((item: string, i: number) => (
                        <span key={i} className="text-xs font-medium bg-surface text-textMuted px-2 py-1 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <button className="w-full mt-auto bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold py-2.5 rounded-xl transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
