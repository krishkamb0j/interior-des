import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Droplet, Plus, X, Image } from 'lucide-react';
import { Button } from './Navigation';
import ColorThief from 'colorthief';

const ColorPaletteSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedPalette, setExtractedPalette] = useState<string[] | null>(null);
  const [suggestedPalettes, setSuggestedPalettes] = useState<string[][]>([]);
  
  const styleBasedPalettes = {
    modern: [
      ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2ECC71'],
      ['#34495E', '#9B59B6', '#F1C40F', '#E67E22', '#1ABC9C'],
      ['#2980B9', '#27AE60', '#F39C12', '#8E44AD', '#C0392B']
    ],
    minimalist: [
      ['#FFFFFF', '#000000', '#CCCCCC', '#666666', '#999999'],
      ['#F5F5F5', '#2C3E50', '#BDC3C7', '#7F8C8D', '#95A5A6'],
      ['#FAFAFA', '#34495E', '#ECF0F1', '#95A5A6', '#BDC3C7']
    ],
    scandinavian: [
      ['#FFFFFF', '#E6E6E6', '#B2D8D8', '#66B2B2', '#008080'],
      ['#F5F5F5', '#006D77', '#83C5BE', '#EDF6F9', '#FFDDD2'],
      ['#FFFFFF', '#006D77', '#E29578', '#EDF6F9', '#83C5BE']
    ],
    industrial: [
      ['#2B2B2B', '#4A4A4A', '#8C8C8C', '#BFBFBF', '#D9D9D9'],
      ['#1A1A1A', '#4D4D4D', '#808080', '#A6A6A6', '#BFBFBF'],
      ['#262626', '#595959', '#8C8C8C', '#A6A6A6', '#D9D9D9']
    ]
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    const reader = new FileReader();
    reader.onload = async () => {
      const img = new window.Image();
      img.onload = () => {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5);
        const hexPalette = palette.map(color => 
          `#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`
        );
        
        setExtractedPalette(hexPalette);
        setSuggestedPalettes([
          ...Object.values(styleBasedPalettes).flat().sort(() => Math.random() - 0.5).slice(0, 6)
        ]);
        setIsAnalyzing(false);
      };
      img.src = reader.result as string;
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const clearImage = () => {
    setSelectedImage(null);
    setExtractedPalette(null);
    setSuggestedPalettes([]);
  };

  return (
    <section id="color-palette-details" className="py-24 relative bg-gray-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">Color Palette Generator</span>
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-transparent"></span>
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Upload or drag & drop an image of your room or inspiration photo, and our AI will generate the perfect color palette to match your style.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-black border border-gray-800 rounded-xl p-6 overflow-hidden relative">
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              {!selectedImage ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-12 h-80 hover:border-emerald-500/50 transition-colors duration-300">
                  <Upload className="h-12 w-12 text-emerald-500 mb-4" />
                  <span className="text-gray-300 text-lg font-medium mb-2">
                    {isDragActive ? 'Drop your image here' : 'Drag & drop an image here'}
                  </span>
                  <span className="text-gray-500 text-sm text-center">
                    or click to browse
                  </span>
                </div>
              ) : (
                <div className="relative h-80 overflow-hidden rounded-lg">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded interior" 
                    className="w-full h-full object-cover" 
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full hover:bg-red-500/80 transition-colors duration-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                  <p className="mt-4 text-emerald-400">Analyzing image...</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            {extractedPalette && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center">
                    <Droplet className="text-emerald-400 mr-3" />
                    <span>Extracted Palette</span>
                  </h3>
                  <div className="flex overflow-hidden rounded-lg h-24">
                    {extractedPalette.map((color, index) => (
                      <div 
                        key={index} 
                        className="flex-1 relative group"
                        style={{ backgroundColor: color }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
                          <span className="font-mono text-white text-sm">
                            {color}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4">Suggested Style Palettes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestedPalettes.map((palette, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex overflow-hidden rounded-lg h-12">
                          {palette.map((color, colorIndex) => (
                            <div 
                              key={colorIndex}
                              className="flex-1 relative group"
                              style={{ backgroundColor: color }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
                                <span className="font-mono text-white text-xs">
                                  {color}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="primary" icon={<Image size={16} />}>
                    Try Another Image
                  </Button>
                  <Button type="outline">
                    Save Palette
                  </Button>
                </div>
              </div>
            )}

            {!extractedPalette && (
              <div className="text-center p-12 border border-gray-800 rounded-lg">
                <p className="text-gray-400 mb-6">
                  Upload an image to generate your custom color palette
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {Object.entries(styleBasedPalettes).map(([style, palettes], index) => (
                    <div key={index} className="w-full">
                      <h4 className="text-lg font-medium text-gray-300 mb-2 capitalize">{style}</h4>
                      <div className="flex flex-wrap gap-4">
                        {palettes.map((palette, paletteIndex) => (
                          <div key={paletteIndex} className="flex overflow-hidden rounded-lg h-6 w-32 shadow-md">
                            {palette.map((color, colorIndex) => (
                              <div 
                                key={colorIndex}
                                className="flex-1"
                                style={{ backgroundColor: color }}
                              ></div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColorPaletteSection;