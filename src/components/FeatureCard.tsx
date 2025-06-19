import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  id: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, id, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Add a small delay based on the index to create a staggered animation
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      id={id}
      ref={cardRef}
      className={`group relative bg-black border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/10 overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}
    >
      {/* Background Effects */}
      <div className="absolute -inset-px bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 blur group-hover:animate-pulse transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="mb-4 bg-emerald-500/10 w-16 h-16 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
        
        <p className="text-gray-400 mb-5">{description}</p>
        
        <a href={`#${id}-details`} className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors duration-300">
          <span className="mr-2">Learn more</span>
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
    </div>
  );
};

export default FeatureCard;