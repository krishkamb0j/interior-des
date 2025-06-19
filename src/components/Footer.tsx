import React from 'react';
import { Wand2, Github, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 mr-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Wand2 className="h-6 w-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-400">DesignAI</h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              Transform your living space with the power of artificial intelligence and expert interior design.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Features</h3>
            <ul className="space-y-3">
              <li>
                <a href="#color-palette-details" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Color Palette Generator</a>
              </li>
              <li>
                <a href="#furniture" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Furniture Recommender</a>
              </li>
              <li>
                <a href="#mood-board" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Mood Board Creator</a>
              </li>
              <li>
                <a href="#room-analysis-details" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Room Analysis</a>
              </li>
              <li>
                <a href="#style-transfer" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Style Transfer</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Design Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Tutorials</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Color Theory</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Interior Design Styles</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">FAQs</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-400">
                <Mail size={18} className="mr-2 text-emerald-400" />
                <a href="mailto:contact@designai.com" className="hover:text-emerald-400 transition-colors duration-300">contact@designai.com</a>
              </p>
              
              <div>
                <h4 className="text-white mb-2">Subscribe to Newsletter</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-gray-900 border border-gray-700 rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white w-full"
                  />
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium px-4 py-2 rounded-r-md transition-colors duration-300">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} DesignAI. All rights reserved.
            </p>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;