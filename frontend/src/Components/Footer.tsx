import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-textMain text-white pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-[5%] grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-12 mb-8">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="font-heading text-2xl font-extrabold text-primary mb-4">
            Foodie
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Delivering the best food and drinks right to your doorstep. Fresh, fast, and always delicious.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-heading font-bold text-lg mb-4">Company</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg mb-4">Services</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Partner with us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Restaurants</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Delivery Drivers</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Business Accounts</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg mb-4">Legal</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="max-w-[1200px] mx-auto px-[5%] text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Foodie. All rights reserved.
      </div>
    </footer>
  );
}
