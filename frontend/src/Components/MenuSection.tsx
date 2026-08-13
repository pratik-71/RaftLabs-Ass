import { useState, useEffect } from 'react';
import MenuCard from './MenuCard';
import { Pizza } from 'lucide-react'; // Fallback icon
import { BACKEND_URL } from '../Config/api';

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
    <section className="px-[5%] py-20 max-w-[1200px] mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.slice(0, 4).map((item, index) => (
            <MenuCard 
              key={item.id}
              id={item.id}
              title={item.name}
              slug={item.slug}
              description={item.description}
              price={`₹${item.price.toFixed(2)}`}
              icon={
                item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Pizza size={60} strokeWidth={1.5} />
                )
              }
              delay={index * 0.1}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
