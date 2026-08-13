import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { BACKEND_URL } from '../Config/api';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  imageUrl?: string;
}

export default function MenuSection() {
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`);
        const json = await res.json();
        if (json.success) {
          setMenuItems(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="menu-section" className="px-[5%] py-20 max-w-[1200px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-extrabold text-textMain mb-4">
          Popular <span className="text-primary">Dishes</span>
        </h2>
        <p className="text-textMuted text-lg max-w-[600px] mx-auto">
          Explore our most loved meals, crafted with the freshest ingredients just for you.
        </p>
      </div>
      
      {loading ? (
        <p className="text-center">Loading menu...</p>
      ) : menuItems.length === 0 ? (
        <p className="text-center text-textMuted">No products found. Add some from the Admin Panel!</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link 
              to="/products"
              className="group flex items-center gap-2 bg-gray-900 hover:bg-primary text-white px-8 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              Explore Full Menu
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
