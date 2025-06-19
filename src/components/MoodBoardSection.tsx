import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Palette,
  Download,
  Trash2,
  RotateCcw,
  Move,
  ZoomIn,
  ZoomOut,
  Layers,
  Share2,
  Save,
  Upload,
  X,
  Circle,
  Square,
  Heart,
  Star
} from 'lucide-react';

interface MoodBoardItem {
  id: string;
  type: 'image' | 'text' | 'color' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  content: string;
  color?: string;
  fontSize?: number;
  shape?: 'circle' | 'square' | 'heart' | 'star';
  zIndex: number;
}

const MoodBoardSection: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<MoodBoardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [activeToolbar, setActiveToolbar] = useState<string | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#FF8A80', '#80CBC4', '#81C784', '#FFB74D', '#F06292'
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedItem) {
          deleteItem(selectedItem);
        }
      }
      if (e.key === 'Escape') {
        setSelectedItem(null);
        setActiveToolbar(null);
        setShowTextInput(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedItem]);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add new item
  const addItem = (type: MoodBoardItem['type'], content: string, extra?: any) => {
    const newItem: MoodBoardItem = {
      id: generateId(),
      type,
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
      width: type === 'text' ? 200 : type === 'color' ? 80 : 150,
      height: type === 'text' ? 40 : type === 'color' ? 80 : 150,
      rotation: 0,
      scale: 1,
      content,
      zIndex: items.length,
      ...extra
    };

    setItems(prev => [...prev, newItem]);
    setSelectedItem(newItem.id);
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        addItem('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }, [items]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    noClick: true,
    noKeyboard: true
  });

  // Mouse/Touch handlers
  const handleMouseDown = (e: React.MouseEvent, itemId?: string) => {
    e.preventDefault();
    
    if (itemId) {
      setSelectedItem(itemId);
      setIsDragging(true);
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const item = items.find(i => i.id === itemId);
        if (item) {
          setDragOffset({
            x: (e.clientX - rect.left) / zoom - item.x,
            y: (e.clientY - rect.top) / zoom - item.y
          });
        }
      }
    } else {
      setSelectedItem(null);
      setActiveToolbar(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedItem || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left) / zoom - dragOffset.x;
    const newY = (e.clientY - rect.top) / zoom - dragOffset.y;

    setItems(prev => prev.map(item => 
      item.id === selectedItem 
        ? { ...item, x: newX, y: newY }
        : item
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, itemId?: string) => {
    e.preventDefault();
    
    const now = Date.now();
    const timeDiff = now - lastTap;
    
    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap
      if (itemId) {
        const item = items.find(i => i.id === itemId);
        if (item?.type === 'text') {
          setTextInput(item.content);
          setShowTextInput(true);
        }
      }
    }
    setLastTap(now);

    if (itemId) {
      setSelectedItem(itemId);
      setIsDragging(true);
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const touch = e.touches[0];
        const item = items.find(i => i.id === itemId);
        if (item) {
          setDragOffset({
            x: (touch.clientX - rect.left) / zoom - item.x,
            y: (touch.clientY - rect.top) / zoom - item.y
          });
        }
      }
    } else {
      setSelectedItem(null);
      setActiveToolbar(null);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !selectedItem || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newX = (touch.clientX - rect.left) / zoom - dragOffset.x;
    const newY = (touch.clientY - rect.top) / zoom - dragOffset.y;

    setItems(prev => prev.map(item => 
      item.id === selectedItem 
        ? { ...item, x: newX, y: newY }
        : item
    ));
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItem(null);
  };

  // Add text
  const addText = () => {
    if (textInput.trim()) {
      if (selectedItem && items.find(i => i.id === selectedItem)?.type === 'text') {
        // Update existing text
        setItems(prev => prev.map(item => 
          item.id === selectedItem 
            ? { ...item, content: textInput }
            : item
        ));
      } else {
        // Add new text
        addItem('text', textInput, { fontSize: 24, color: '#FFFFFF' });
      }
      setTextInput('');
      setShowTextInput(false);
    }
  };

  // Zoom functions
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.25, Math.min(3, prev + delta)));
  };

  // Export canvas
  const exportCanvas = () => {
    // This would implement actual export functionality
    console.log('Exporting canvas...');
  };

  // Clear canvas
  const clearCanvas = () => {
    setItems([]);
    setSelectedItem(null);
  };

  return (
    <section id="mood-board-details" className="py-24 relative bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                Creative Mood Board Studio
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-transparent"></span>
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Create beautiful mood boards with fluid gestures and intuitive controls. Drag, pinch, and create like on an iPad.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Floating Toolbar */}
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2 shadow-2xl">
              <div className="flex items-center space-x-2">
                {/* Add Tools */}
                <div className="relative">
                  <button
                    onClick={() => setActiveToolbar(activeToolbar === 'add' ? null : 'add')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      activeToolbar === 'add'
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-emerald-400'
                    }`}
                  >
                    <Plus size={20} />
                  </button>
                  
                  {activeToolbar === 'add' && (
                    <div className="absolute top-full mt-2 left-0 bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-2 shadow-2xl min-w-[200px]">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setShowTextInput(true);
                            setActiveToolbar(null);
                          }}
                          className="flex items-center space-x-2 p-3 rounded-lg bg-gray-800/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300"
                        >
                          <Type size={16} />
                          <span className="text-sm">Text</span>
                        </button>
                        
                        <label className="flex items-center space-x-2 p-3 rounded-lg bg-gray-800/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 cursor-pointer">
                          <ImageIcon size={16} />
                          <span className="text-sm">Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => addItem('image', reader.result as string);
                                reader.readAsDataURL(file);
                              }
                              setActiveToolbar(null);
                            }}
                            className="hidden"
                          />
                        </label>
                        
                        <button
                          onClick={() => {
                            setActiveToolbar('colors');
                          }}
                          className="flex items-center space-x-2 p-3 rounded-lg bg-gray-800/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300"
                        >
                          <Palette size={16} />
                          <span className="text-sm">Colors</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setActiveToolbar('shapes');
                          }}
                          className="flex items-center space-x-2 p-3 rounded-lg bg-gray-800/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300"
                        >
                          <Square size={16} />
                          <span className="text-sm">Shapes</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-1 bg-gray-800/30 rounded-xl p-1">
                  <button
                    onClick={() => handleZoom(-0.25)}
                    className="p-2 rounded-lg text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-xs text-gray-400 px-2 min-w-[50px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => handleZoom(0.25)}
                    className="p-2 rounded-lg text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                {/* Actions */}
                <button
                  onClick={() => setZoom(1)}
                  className="p-3 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-emerald-400 transition-all duration-300"
                >
                  <RotateCcw size={20} />
                </button>

                <button
                  onClick={clearCanvas}
                  className="p-3 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                >
                  <Trash2 size={20} />
                </button>

                <button
                  onClick={exportCanvas}
                  className="p-3 rounded-xl bg-emerald-500 text-black hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-emerald-500/25"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Color Palette Toolbar */}
          {activeToolbar === 'colors' && (
            <div className="fixed top-40 left-1/2 transform -translate-x-1/2 z-40">
              <div className="bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-2xl">
                <div className="grid grid-cols-5 gap-3">
                  {colorPalette.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        addItem('color', color, { color });
                        setActiveToolbar(null);
                      }}
                      className="w-12 h-12 rounded-xl border-2 border-gray-600 hover:border-emerald-400 hover:scale-110 transition-all duration-300 shadow-lg"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Shapes Toolbar */}
          {activeToolbar === 'shapes' && (
            <div className="fixed top-40 left-1/2 transform -translate-x-1/2 z-40">
              <div className="bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-2xl">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { shape: 'square', icon: Square, label: 'Square' },
                    { shape: 'circle', icon: Circle, label: 'Circle' },
                    { shape: 'heart', icon: Heart, label: 'Heart' },
                    { shape: 'star', icon: Star, label: 'Star' }
                  ].map(({ shape, icon: Icon, label }) => (
                    <button
                      key={shape}
                      onClick={() => {
                        addItem('shape', shape, { shape, color: '#10b981' });
                        setActiveToolbar(null);
                      }}
                      className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-gray-800/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300"
                    >
                      <Icon size={24} />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Text Input Modal */}
          {showTextInput && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Add Text</h3>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter your text..."
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && addText()}
                  autoFocus
                />
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={addText}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-medium py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Add Text
                  </button>
                  <button
                    onClick={() => {
                      setShowTextInput(false);
                      setTextInput('');
                    }}
                    className="px-6 py-3 bg-gray-800/50 text-gray-400 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Canvas Area */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800/50">
            <div
              {...getRootProps()}
              ref={canvasRef}
              className={`relative w-full h-[600px] overflow-hidden cursor-${isSpacePressed ? 'grab' : 'default'}`}
              style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: 'center center'
              }}
              onMouseDown={(e) => !isSpacePressed && handleMouseDown(e)}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={(e) => handleTouchStart(e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              <input {...getInputProps()} />
              
              {/* Grid Background */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Mood Board Items */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`absolute cursor-move transition-all duration-200 ${
                    selectedItem === item.id 
                      ? 'ring-2 ring-emerald-400 ring-opacity-50 shadow-lg shadow-emerald-500/25' 
                      : 'hover:shadow-lg'
                  }`}
                  style={{
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: item.height,
                    transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                    zIndex: item.zIndex,
                    borderRadius: item.type === 'color' || item.shape === 'circle' ? '50%' : '12px'
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, item.id);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleTouchStart(e, item.id);
                  }}
                >
                  {/* Render different item types */}
                  {item.type === 'image' && (
                    <img
                      src={item.content}
                      alt="Mood board item"
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                      draggable={false}
                    />
                  )}
                  
                  {item.type === 'text' && (
                    <div
                      className="w-full h-full flex items-center justify-center text-center p-2 bg-black/20 backdrop-blur-sm rounded-xl"
                      style={{
                        fontSize: item.fontSize || 24,
                        color: item.color || '#FFFFFF'
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                  
                  {item.type === 'color' && (
                    <div
                      className="w-full h-full rounded-xl shadow-lg border-2 border-white/20"
                      style={{ backgroundColor: item.content }}
                    />
                  )}
                  
                  {item.type === 'shape' && (
                    <div className="w-full h-full flex items-center justify-center">
                      {item.shape === 'square' && (
                        <div
                          className="w-full h-full rounded-xl shadow-lg"
                          style={{ backgroundColor: item.color || '#10b981' }}
                        />
                      )}
                      {item.shape === 'circle' && (
                        <div
                          className="w-full h-full rounded-full shadow-lg"
                          style={{ backgroundColor: item.color || '#10b981' }}
                        />
                      )}
                      {item.shape === 'heart' && (
                        <Heart
                          size={Math.min(item.width, item.height) * 0.8}
                          fill={item.color || '#10b981'}
                          color={item.color || '#10b981'}
                        />
                      )}
                      {item.shape === 'star' && (
                        <Star
                          size={Math.min(item.width, item.height) * 0.8}
                          fill={item.color || '#10b981'}
                          color={item.color || '#10b981'}
                        />
                      )}
                    </div>
                  )}

                  {/* Delete button for selected item */}
                  {selectedItem === item.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-all duration-300 shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}

              {/* Drop Zone Overlay */}
              {isDragActive && (
                <div className="absolute inset-0 bg-emerald-500/10 border-2 border-dashed border-emerald-400 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <p className="text-emerald-400 text-xl font-medium">Drop images here</p>
                    <p className="text-emerald-300 text-sm">They'll be added to your mood board</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {items.length === 0 && !isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-xl font-medium mb-2">Start Creating</p>
                    <p className="text-gray-500 text-sm">
                      Click the + button to add text, images, colors, or shapes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-6 bg-black/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-6 py-3">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Move size={16} />
                <span>Drag to move</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span className="w-4 h-4 bg-gray-600 rounded"></span>
                <span>Double-tap to edit</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Del</span>
                <span>Delete selected</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Space</span>
                <span>Pan canvas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoodBoardSection;