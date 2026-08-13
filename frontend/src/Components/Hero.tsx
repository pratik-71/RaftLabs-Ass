
import { motion } from 'framer-motion';
import { Utensils, Check } from 'lucide-react';

export default function Hero() {
  return (
    <main className="flex items-center justify-between px-[5%] py-20 max-w-[1200px] mx-auto gap-8">
      
      {/* Left Content */}
      <div className="flex-1">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-heading text-6xl text-textMain leading-[1.1] mb-6"
        >
          Fastest <span className="text-primary">Delivery</span> & <br/>
          Easy <span className="text-primary">Pickup</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-textMuted text-lg mb-10 max-w-[450px] leading-relaxed"
        >
          Discover the best food & drinks in your area. Get them delivered to your doorstep in minutes.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-4"
        >
          <button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-full font-semibold text-base shadow-[0_4px_14px_rgba(255,69,0,0.25)] transition-all">
            Order Now
          </button>
          <button className="bg-surface hover:bg-gray-50 text-textMain px-8 py-4 rounded-full font-semibold text-base border border-border transition-all">
            Explore Menu
          </button>
        </motion.div>
      </div>

      {/* Right Image/Graphic */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex-1 flex justify-center relative"
      >
        {/* Background Blob */}
        <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 absolute -z-10 top-[5%] right-[5%]"></div>
        
        {/* Icon Container */}
        <div className="w-[350px] h-[350px] rounded-full bg-surface border-8 border-background shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center justify-center text-primary">
          <Utensils size={120} strokeWidth={1.5} />
        </div>
        
        {/* Floating badge */}
        <motion.div 
           animate={{ y: [0, -10, 0] }}
           transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
           className="absolute bottom-[10%] left-[10%] bg-background p-4 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white font-bold">
            <Check size={20} strokeWidth={3} />
          </div>
          <div>
            <div className="font-heading font-bold text-textMain">Fast Delivery</div>
            <div className="text-sm text-textMuted">Under 30 mins</div>
          </div>
        </motion.div>

      </motion.div>
    </main>
  );
}
