import React from 'react';
import MenuCard from './MenuCard';
import { Pizza, Coffee, Croissant, Beef } from 'lucide-react';

export default function MenuSection() {
  const menuItems = [
    {
      id: 1,
      title: 'Classic Margherita',
      description: 'Fresh tomatoes, mozzarella, basil, and a drizzle of olive oil.',
      price: '$12.99',
      icon: <Pizza size={60} strokeWidth={1.5} />,
    },
    {
      id: 2,
      title: 'Spicy Beef Burger',
      description: 'Double patty with jalapenos, cheddar cheese, and spicy mayo.',
      price: '$14.50',
      icon: <Beef size={60} strokeWidth={1.5} />,
    },
    {
      id: 3,
      title: 'French Croissant',
      description: 'Flaky, buttery pastry baked fresh every morning.',
      price: '$4.99',
      icon: <Croissant size={60} strokeWidth={1.5} />,
    },
    {
      id: 4,
      title: 'Artisan Coffee',
      description: 'Locally roasted beans brewed to perfection.',
      price: '$3.50',
      icon: <Coffee size={60} strokeWidth={1.5} />,
    },
  ];

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item, index) => (
          <MenuCard 
            key={item.id}
            title={item.title}
            description={item.description}
            price={item.price}
            icon={item.icon}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
}
