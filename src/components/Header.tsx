import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Palette, Sofa, Layout, Lightbulb, Wand2 } from 'lucide-react';
import { Link } from './Navigation';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md shadow-lg shadow-emerald-500/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 mr-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <Wand2 className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-400">
            <span className="relative">
              <span className="relative z-10">DesignAI</span>
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-400 to-transparent transform translate-y-1"></span>
            </span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link icon={<Home size={18} />} href="#home" text="Home" />
          <Link icon={<Palette size={18} />} href="#color-palette" text="Color Palette" />
          <Link icon={<Sofa size={18} />} href="#furniture" text="Furniture" />
          <Link icon={<Layout size={18} />} href="#mood-board" text="Mood Board" />
          <Link icon={<Lightbulb size={18} />} href="#tips" text="Design Tips" />
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center p-2 rounded-full bg-black/20 backdrop-blur-sm border border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-300"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} className="text-emerald-400" /> : <Menu size={20} className="text-emerald-400" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-lg z-40 md:hidden transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full items-center justify-center space-y-8 p-4">
          <Link 
            icon={<Home size={24} />} 
            href="#home" 
            text="Home" 
            onClick={() => setIsMenuOpen(false)} 
            className="text-xl"
          />
          <Link 
            icon={<Palette size={24} />} 
            href="#color-palette" 
            text="Color Palette" 
            onClick={() => setIsMenuOpen(false)} 
            className="text-xl"
          />
          <Link 
            icon={<Sofa size={24} />} 
            href="#furniture" 
            text="Furniture" 
            onClick={() => setIsMenuOpen(false)} 
            className="text-xl"
          />
          <Link 
            icon={<Layout size={24} />} 
            href="#mood-board" 
            text="Mood Board" 
            onClick={() => setIsMenuOpen(false)} 
            className="text-xl"
          />
          <Link 
            icon={<Lightbulb size={24} />} 
            href="#tips" 
            text="Design Tips" 
            onClick={() => setIsMenuOpen(false)} 
            className="text-xl"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;