import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, Clock, ShieldCheck, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = React.memo(() => {
  const navigate = useNavigate();

  return (
    <main 
      className="relative w-full min-h-[600px] h-screen max-h-[900px] flex items-center px-[5%] lg:px-[8%] py-20 lg:pt-32 bg-cover bg-center bg-no-repeat overflow-hidden font-body"
      style={{ backgroundImage: "url('/hero.png')" }}
    >
      {/* Optional gradient overlay to ensure text readability on mobile if the bg is too busy */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent sm:from-white/70 sm:via-transparent sm:to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-[650px]">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight"
        >
          Fastest <br/>
          <span className="text-primary">Delivery &</span> <br/>
          Easy <span className="text-primary">Pickup</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-600 font-medium text-lg md:text-xl mb-10 max-w-[480px] leading-relaxed"
        >
          Discover the best food & drinks in your area. Get them delivered to your doorstep in minutes.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          <button 
            onClick={() => navigate('/products')}
            className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-full font-bold text-base shadow-lg shadow-primary/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
          >
            Order Now <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => {
              const menuSection = document.getElementById('menu-section');
              if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/products');
              }
            }}
            className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-bold text-base shadow-md transition-all flex items-center gap-2 border border-gray-100 hover:-translate-y-0.5"
          >
            <LayoutGrid size={20} className="text-gray-600" /> Explore Menu
          </button>
        </motion.div>

        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-6 md:gap-10 mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Fast Delivery</div>
              <div className="text-[10px] text-gray-500 font-medium">Under 30 mins</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Safe & Reliable</div>
              <div className="text-[10px] text-gray-500 font-medium">Your safety, our priority</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-yellow-500">
              <ThumbsUp size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Top Quality</div>
              <div className="text-[10px] text-gray-500 font-medium">Best food, every time</div>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
});

export default Hero;
