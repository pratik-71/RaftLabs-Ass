import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface MenuCardProps {
  title: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function MenuCard({ title, description, price, icon, delay = 0 }: MenuCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-surface rounded-3xl p-6 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="w-full h-40 bg-background rounded-2xl mb-6 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
        {icon}
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-heading font-bold text-xl text-textMain">{title}</h3>
        <span className="font-bold text-primary text-lg">{price}</span>
      </div>
      
      <p className="text-textMuted text-sm mb-6 line-clamp-2">
        {description}
      </p>
      
      <div className="flex gap-2 w-full">
        <button className="flex-1 py-3 rounded-xl border border-border flex items-center justify-center gap-2 font-semibold text-textMain hover:bg-primary hover:text-white hover:border-primary transition-colors">
          <ShoppingCart size={18} /> Cart
        </button>
        <button className="flex-1 py-3 rounded-xl bg-primary text-white flex items-center justify-center font-semibold hover:bg-primaryHover transition-colors shadow-md shadow-primary/20">
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}
