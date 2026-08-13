import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../Config/supabase';
import { useAuthStore } from '../Store/authStore';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      if (data.session) {
        setUser(data.user);
        navigate('/');
      } else {
        // If session is null, email confirmation is required
        setError('Signup successful! Please check your email to confirm your account.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-24 lg:px-24 xl:px-32 bg-surface">
        <div className="max-w-sm w-full mx-auto">
          
          <h2 className="font-heading text-3xl font-bold text-textMain mb-6">Sign Up</h2>
          
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}
          
          <form className="space-y-5" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-semibold text-textMain mb-2">Username</label>
              <input 
                type="text" 
                placeholder="Choose a username"
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-textMain mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-textMain mb-2">Password</label>
              <input 
                type="password" 
                placeholder="Create a strong password"
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primaryHover text-white py-2.5 rounded-xl font-bold text-base shadow-[0_4px_14px_rgba(255,69,0,0.25)] transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-textMuted">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
      
      {/* Right Image Side */}
      <div className="hidden lg:block w-1/2 relative bg-textMain">
        <img 
          src="/auth-bg.png" 
          alt="Gourmet food background" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
        
        {/* Logo at Top Right */}
        <Link to="/" className="absolute top-8 right-12 font-heading text-3xl font-extrabold text-primary drop-shadow-md">
          Foodie
        </Link>
        
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="font-heading text-4xl font-bold mb-4">Discover local flavors</h2>
          <p className="text-lg text-gray-200">From street food to fine dining, explore the best culinary experiences in your city.</p>
        </div>
      </div>
    </div>
  );
}
