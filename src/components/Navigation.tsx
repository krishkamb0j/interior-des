import React, { ReactNode } from 'react';

interface LinkProps {
  href: string;
  text: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({ href, text, icon, onClick, className = '' }) => {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className={`group relative flex items-center text-gray-300 hover:text-emerald-400 transition-all duration-300 ${className}`}
    >
      {icon && <span className="mr-2 group-hover:scale-110 transition-transform duration-300">{icon}</span>}
      <span className="font-medium">{text}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300 ease-in-out"></span>
    </a>
  );
};

export const Button: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  type?: 'primary' | 'secondary' | 'outline';
  className?: string;
  icon?: ReactNode;
}> = ({ 
  children, 
  onClick, 
  type = 'primary', 
  className = '',
  icon
}) => {
  const baseClasses = "relative overflow-hidden font-medium rounded-md py-3 px-6 inline-flex items-center justify-center transition-all duration-300";
  
  const buttonClasses = {
    primary: `${baseClasses} bg-gradient-to-r from-emerald-500 to-emerald-600 text-black hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1`,
    secondary: `${baseClasses} bg-black border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1`,
    outline: `${baseClasses} bg-transparent border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 hover:-translate-y-1`
  };

  return (
    <button 
      onClick={onClick} 
      className={`${buttonClasses[type]} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </button>
  );
};