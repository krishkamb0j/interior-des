import React, { useEffect, useRef } from 'react';
import { ArrowRight, MousePointerClick } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { Button } from './Navigation';

const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const colors = ['#10b981', '#059669', '#34d399', '#a7f3d0'];

    const createParticle = (x: number, y: number) => {
      const radius = Math.random() * 2 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const speedX = (Math.random() - 0.5) * 1;
      const speedY = (Math.random() - 0.5) * 1;
      const maxLife = Math.random() * 100 + 100;

      particles.push({
        x,
        y,
        radius,
        color,
        speedX,
        speedY,
        life: 0,
        maxLife
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() > 0.9) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        createParticle(x, y);
      }

      particles.forEach((particle, index) => {
        particle.life++;
        
        if (particle.life >= particle.maxLife) {
          particles.splice(index, 1);
          return;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        const opacity = 1 - particle.life / particle.maxLife;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/70 z-10"></div>
      
      <div className="container mx-auto px-4 z-20 pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <div className="inline-flex space-x-3 items-center bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-emerald-400 text-sm font-medium mx-auto md:mx-0">
              <MousePointerClick size={16} />
              <span>Transform Your Space with AI</span>
            </div>
            
            <TypeAnimation
              sequence={[
                'Redesign Your Home with\nArtificial Intelligence',
                1000,
                'Create stunning interior designs with AI',
                1000,
                'Generate perfect color palettes instantly',
                1000,
                'Get personalized recommendations',
                1000,
              ]}
              wrapper="h1"
              speed={50}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              repeat={Infinity}
            />
            
            <p className="text-gray-400 text-lg md:text-xl max-w-xl">
              <TypeAnimation
                sequence={[
                  'Create stunning interior designs, generate color palettes, and receive personalized recommendations with our cutting-edge AI tools.',
                  1000,
                ]}
                speed={50}
                repeat={0}
              />
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 mx-auto md:mx-0">
              <Button 
                type="primary" 
                icon={<ArrowRight size={18} />}
                className="group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300">Start Designing</span>
              </Button>
              <Button type="outline">
                Explore Features
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-emerald-500/20 transform transition-transform duration-700 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
              <img 
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" 
                alt="Modern interior design" 
                className="w-full h-auto object-cover" 
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-xl font-semibold text-white">Modern Living Room</h3>
                <p className="text-emerald-300">AI-Generated Design</p>
              </div>
            </div>
            
            <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -left-20 h-64 w-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;