import React from 'react';
import { Palette, Sofa, Layout, Lightbulb, Wand2, Camera } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Palette className="text-emerald-400" size={36} />,
      title: "AI Color Palette Generator",
      description: "Generate perfect color schemes for walls, furniture, and decor based on your preferences and existing interior elements.",
      id: "color-palette"
    },
    {
      icon: <Sofa className="text-emerald-400" size={36} />,
      title: "Furniture Recommender",
      description: "Get personalized furniture and decor recommendations based on your chosen style and space constraints.",
      id: "furniture"
    },
    {
      icon: <Layout className="text-emerald-400" size={36} />,
      title: "Interactive Mood Board",
      description: "Create and share stunning mood boards with colors, textures, and furniture ideas for your interior design projects.",
      id: "mood-board"
    },
    {
      icon: <Camera className="text-emerald-400" size={36} />,
      title: "Room Analysis",
      description: "Upload photos of your room and receive AI-powered suggestions based on size, color, and overall design.",
      id: "room-analysis"
    },
    {
      icon: <Wand2 className="text-emerald-400" size={36} />,
      title: "Style Transfer",
      description: "Convert your room photos into different design styles like Scandinavian, Industrial, Bohemian, and more.",
      id: "style-transfer"
    },
    {
      icon: <Lightbulb className="text-emerald-400" size={36} />,
      title: "DIY & Budget Tips",
      description: "Discover affordable design hacks and DIY projects to transform your space without breaking the bank.",
      id: "tips"
    }
  ];

  return (
    <section className="py-24 bg-gray-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">AI-Powered</span> Design Tools
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Transform your living space with our suite of powerful design tools, each enhanced with artificial intelligence to make interior design accessible to everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              id={feature.id}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;