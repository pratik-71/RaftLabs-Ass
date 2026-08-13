import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../Config/api';
import ProductCard from '../Components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
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

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const filteredProducts = useMemo(() => activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory), [products, activeCategory]);

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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
