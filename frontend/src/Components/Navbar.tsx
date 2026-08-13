import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User as UserIcon, LogOut, ShoppingCart } from 'lucide-react';
import { BACKEND_URL } from '../Config/api';
import { useAuthStore } from '../Store/authStore';
import { useCartStore } from '../Store/cartStore';
import { supabase } from '../Config/supabase';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const cartItemsCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`${BACKEND_URL}/api/products?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.data.slice(0, 5)); // limit to 5 suggestions
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    // Debounce to prevent too many requests
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="flex justify-between items-center px-[5%] py-4 border-b border-border sticky top-0 bg-background z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-heading text-2xl font-extrabold text-primary">
          Foodie
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-textMain font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-textMain font-medium hover:text-primary transition-colors">
            Products
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Search Auto-suggest */}
        <div ref={searchRef} className="relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 pr-4 py-2 bg-surface border border-border rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 lg:w-64 transition-all"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
              {suggestions.map(item => (
                <Link 
                  key={item.id} 
                  to={`/products?q=${encodeURIComponent(item.name)}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-3 p-3 hover:bg-surface transition-colors border-b border-border last:border-0"
                >
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-textMain line-clamp-1">{item.name}</p>
                    <p className="text-xs text-textMuted">{item.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Search Icon */}
        <button className="md:hidden text-textMain hover:text-primary transition-colors p-2 rounded-full hover:bg-surface">
          <Search size={20} />
        </button>
        
        {/* Cart Icon - Always visible */}
        <Link to="/cart" className="text-textMain hover:text-primary transition-colors p-2 rounded-full hover:bg-surface relative">
          <ShoppingCart size={20} />
          {cartItemsCount > 0 && (
            <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cartItemsCount}
            </span>
          )}
        </Link>
        
        {user ? (
          <>
            <div className="group relative">
              <button className="flex items-center gap-2 text-textMain hover:text-primary transition-colors p-2 rounded-full hover:bg-surface">
                <UserIcon size={20} />
                <span className="text-sm font-medium hidden sm:block">
                  {user.user_metadata?.username || 'User'}
                </span>
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2 flex flex-col">
                  <Link to="/profile" className="px-4 py-2 hover:bg-background rounded-lg text-sm text-textMain transition-colors">
                    Profile
                  </Link>
                  <Link to="/orders" className="px-4 py-2 hover:bg-background rounded-lg text-sm text-textMain transition-colors">
                    Orders
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg text-sm text-left flex items-center gap-2 transition-colors">
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center ml-2">
            <Link to="/login" className="text-textMain font-semibold mr-6 hover:text-primary transition-colors text-sm sm:text-base">
              Log in
            </Link>
            <Link to="/signup" className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold transition-colors hover:bg-primaryHover text-sm sm:text-base">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
