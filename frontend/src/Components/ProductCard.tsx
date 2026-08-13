import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../Store/cartStore';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    slug: string;
    imageUrl?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const setBuyNowItem = useCartStore((state) => state.setBuyNowItem);
  const cartItems = useCartStore((state) => state.items);
  const isInCart = cartItems.some(item => item.product_id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ product_id: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBuyNowItem({ product_id: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl || '' });
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col">
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
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`w-12 h-12 shrink-0 border rounded-xl flex items-center justify-center transition-colors duration-200 ${
              isInCart 
                ? 'bg-green-50 border-green-200 text-green-600' 
                : 'bg-white border-gray-200 hover:border-primary hover:text-primary text-gray-600'
            }`}
          >
            {isInCart ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <ShoppingCart size={20} strokeWidth={2.5} />}
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-1 h-12 bg-gray-900 hover:bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-md shadow-gray-900/10"
          >
            <Zap size={18} fill="currentColor" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
