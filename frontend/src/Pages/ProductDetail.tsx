import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../Store/cartStore';
import Navbar from '../Components/Navbar';
import { ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '../Config/api';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  items: string[];
  imageUrl?: string;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products/slug/${slug}`);
        const json = await res.json();
        
        if (json.success && json.data) {
          setProduct(json.data);
        } else {
          toast.error("Product not found");
          navigate('/products');
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchProduct();
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface font-body flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-surface font-body flex flex-col">
      <Navbar />
      
      <main className="flex-grow px-[5%] py-12 max-w-[1200px] mx-auto w-full">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-textMuted hover:text-primary transition-colors mb-8 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </button>

        <div className="bg-background rounded-3xl p-6 md:p-10 shadow-sm border border-border flex flex-col md:flex-row gap-10">
          
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden aspect-square bg-surface border border-border flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 font-medium">No Image Available</div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            
            <h1 className="font-heading text-4xl font-extrabold text-textMain mb-4">
              {product.name}
            </h1>
            
            <p className="text-primary font-bold text-3xl mb-6">
              ₹{product.price.toFixed(2)}
            </p>
            
            <div className="mb-8">
              <h3 className="font-bold text-textMain mb-2 text-lg">Description</h3>
              <p className="text-textMuted leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.items && product.items.length > 0 && (
              <div className="mb-10">
                <h3 className="font-bold text-textMain mb-3 text-lg">Includes:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.items.map((item, index) => (
                    <span 
                      key={index} 
                      className="bg-surface border border-border px-4 py-2 rounded-xl text-sm font-medium text-textMain"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-surface border-2 border-primary text-primary hover:bg-primary/5 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-primary hover:bg-primaryHover text-white py-4 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
