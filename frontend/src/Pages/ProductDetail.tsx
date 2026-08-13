import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../Store/cartStore';
import { ArrowLeft, ShoppingCart, CreditCard, Star } from 'lucide-react';
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
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndOthers = async () => {
      setLoading(true);
      try {
        // Fetch current product
        const res = await fetch(`${BACKEND_URL}/api/products/slug/${slug}`);
        const json = await res.json();
        
        if (json.success && json.data) {
          setProduct(json.data);
          
          // Fetch all products for 'Explore More'
          const productsRes = await fetch(`${BACKEND_URL}/api/products`);
          const productsJson = await productsRes.json();
          if (productsJson.success) {
            const allProducts: Product[] = productsJson.data;
            // Filter out the current product and grab up to 4
            const filtered = allProducts.filter(p => p.id !== json.data.id).slice(0, 4);
            setOtherProducts(filtered);
          }
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
      fetchProductAndOthers();
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface font-body flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-gray-50/50 font-body flex flex-col relative pb-20">
      
      <main className="flex-grow px-[5%] pt-6 pb-8 max-w-[1200px] mx-auto w-full relative">
        
        {/* Floating Back Button (Icon Only) - positioned absolutely so it doesn't take up vertical space */}
        <div className="absolute top-6 left-2 md:left-[-1rem] lg:left-[-3rem] z-40">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:shadow-md transition-all font-bold"
            aria-label="Go back"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center items-start">
            <div className="w-full max-w-md aspect-square bg-white flex items-center justify-center p-4">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 ease-out rounded-2xl"
                />
              ) : (
                <div className="text-gray-400 font-medium">No Image Available</div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col pt-2 md:pl-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 font-semibold text-xs rounded-lg uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-400 bg-yellow-50 px-2.5 py-1 rounded-lg">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-bold text-gray-800">4.8</span>
                <span className="text-xs text-gray-500 font-medium ml-1">(124)</span>
              </div>
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-gray-900 font-bold text-2xl mb-6">
              ₹{product.price.toFixed(2)}
            </p>
            
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.items && product.items.length > 0 && (
              <div className="mb-10">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">What's Inside</h3>
                <div className="flex flex-wrap gap-2">
                  {product.items.map((item, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-[1] bg-white border border-gray-300 hover:border-gray-400 text-gray-800 hover:bg-gray-50 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingCart size={20} strokeWidth={2} />
                Add to Cart
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="flex-[1.5] bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
              >
                <CreditCard size={20} fill="currentColor" />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Ratings and Reviews Section */}
        <div className="mt-8 bg-white rounded-[2rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="mb-10">
            <h2 className="text-3xl font-heading font-black text-gray-900 mb-2">Customer Reviews</h2>
            <p className="text-gray-500 font-medium">See what others are saying about {product.name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Rating Summary */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center bg-gray-50 rounded-[2rem] p-8 text-center h-full">
              <h1 className="text-6xl font-black text-gray-900 mb-4">4.8</h1>
              <div className="flex gap-1 text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={28} fill={i < 4 ? "currentColor" : "none"} strokeWidth={i < 4 ? 0 : 2} className={i === 4 ? "text-yellow-400/30" : ""} />
                ))}
              </div>
              <p className="text-gray-500 font-medium">Based on 124 reviews</p>
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-8">
              {/* Review 1 */}
              <div className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-lg">
                      SJ
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Sarah Jenkins</h4>
                      <div className="flex text-yellow-400 gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">2 days ago</span>
                </div>
                <p className="text-gray-600 leading-relaxed mt-4">
                  "Absolutely incredible! The flavors were perfectly balanced and it arrived so fresh. Definitely ordering this again next week. Highly recommend to anyone on the fence!"
                </p>
              </div>

              {/* Review 2 */}
              <div className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary text-lg">
                      MR
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Michael R.</h4>
                      <div className="flex text-yellow-400 gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} strokeWidth={i < 4 ? 0 : 2} className={i === 4 ? "text-yellow-400/30" : ""} />)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">1 week ago</span>
                </div>
                <p className="text-gray-600 leading-relaxed mt-4">
                  "Very good quality and portion size. It was a bit spicier than I expected, but still delicious. The packaging was also very neat and kept everything warm."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Explore More Section */}
        {otherProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-heading font-black text-gray-900 mb-6 px-2">Explore More</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {otherProducts.map(p => (
                <Link 
                  key={p.id} 
                  to={`/product/${p.slug}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group block"
                >
                  <div className="relative aspect-square bg-white flex items-center justify-center p-4">
                    {p.imageUrl ? (
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium bg-gray-50 rounded-xl">No Image</div>
                    )}
                  </div>
                  <div className="p-4 pt-2 border-t border-gray-50">
                    <h3 className="font-bold text-gray-900 font-heading text-sm md:text-base leading-tight mb-1 group-hover:text-primary transition-colors truncate">
                      {p.name}
                    </h3>
                    <p className="text-primary font-bold text-sm">
                      ₹{p.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
