import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Enthusiast',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    text: "The fastest delivery I've ever experienced! The food arrived piping hot and tasted absolutely amazing. Highly recommended!"
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Regular Customer',
    avatar: 'https://i.pravatar.cc/150?img=11',
    rating: 5,
    text: "I love the variety of options available. The interface is so easy to use, and the quality of the food never disappoints."
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Local Guide',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 4,
    text: "Great experience overall! The tracking feature is very accurate, and the delivery partners are always polite and professional."
  }
];

export default function ReviewSection() {
  return (
    <section className="px-[5%] py-20 max-w-[1200px] mx-auto bg-gray-50/50 rounded-3xl mb-20">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-black text-gray-900 mb-4 tracking-tight">
          What Our <span className="text-primary">Customers</span> Say
        </h2>
        <p className="text-gray-500 font-medium text-lg max-w-[600px] mx-auto">
          Don't just take our word for it. Here is what people are saying about their Foodie experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
          >
            <Quote className="absolute top-6 right-6 text-gray-100" size={40} />
            
            <div className="flex gap-1 mb-6 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
              ))}
            </div>
            
            <p className="text-gray-700 font-medium leading-relaxed mb-8 relative z-10">
              "{review.text}"
            </p>
            
            <div className="flex items-center gap-4 mt-auto">
              <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                <p className="text-xs font-medium text-gray-500">{review.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
