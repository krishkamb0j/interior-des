import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Star, 
  ExternalLink,
  Truck,
  Shield,
  Zap,
  TrendingUp,
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  CreditCard,
  Package,
  Award,
  Sparkles,
  ArrowRight,
  X,
  Plus,
  Minus,
  Check,
  Grid3X3,
  List,
  SlidersHorizontal,
  Flame,
  Crown,
  Percent,
  Users,
  ThumbsUp,
  MessageCircle,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
  ZoomIn,
  Bookmark,
  ShoppingBag,
  CreditCard as Card,
  Banknote,
  Wallet,
  IndianRupee
} from 'lucide-react';
import { Button } from './Navigation';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  video?: string;
  gallery: string[];
  url: string;
  source: string;
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  inStock: boolean;
  fastShipping: boolean;
  freeShipping: boolean;
  discount?: number;
  tags: string[];
  description: string;
  features: string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  colors: string[];
  materials: string[];
  warranty: string;
  delivery: string;
  popularity: number;
  trending: boolean;
  bestseller: boolean;
  newArrival: boolean;
  salePrice?: number;
  stockCount: number;
  shippingCost: number;
  assemblyRequired: boolean;
  ecoFriendly: boolean;
  customerPhotos: string[];
  videoReviews: string[];
  relatedProducts: string[];
}

const FurnitureSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400000]); // Updated for Indian prices
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popularity'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  const [showQuickView, setShowQuickView] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate comprehensive product data (50+ per category) with Indian pricing
  const generateProducts = (): Product[] => {
    const categories = ['Sofas', 'Chairs', 'Tables', 'Beds', 'Storage', 'Lighting', 'Decor', 'Desks', 'Dining', 'Outdoor'];
    const brands = ['Urban Ladder', 'Pepperfry', 'Godrej Interio', 'Nilkamal', 'Durian', 'HomeTown', 'FabIndia', 'Wooden Street', 'Wakefit', 'IKEA India', 'Flipkart Perfect Homes', 'Amazon Brand - Solimo'];
    const sources = ['Amazon India', 'Flipkart', 'Myntra Home', 'Urban Ladder', 'Pepperfry', 'Nykaa Fashion', 'Ajio Home', 'Tata CLiQ'];
    
    const productTemplates = {
      Sofas: [
        'Modern Sectional Sofa', 'Leather Reclining Sofa', 'Velvet Chesterfield Sofa', 'Scandinavian Loveseat',
        'Mid-Century Modern Sofa', 'Sleeper Sofa Bed', 'Modular Sofa System', 'Tufted Ottoman Sofa',
        'Corner Sectional', 'Convertible Futon', 'Curved Accent Sofa', 'Minimalist 2-Seater'
      ],
      Chairs: [
        'Ergonomic Office Chair', 'Accent Armchair', 'Dining Chair Set', 'Rocking Chair',
        'Swivel Desk Chair', 'Lounge Chair', 'Bar Stool', 'Gaming Chair',
        'Wingback Chair', 'Bean Bag Chair', 'Folding Chair', 'Massage Chair'
      ],
      Tables: [
        'Coffee Table', 'Dining Table', 'Side Table', 'Console Table',
        'End Table', 'Nesting Tables', 'Bar Table', 'Desk Table',
        'Outdoor Table', 'Glass Table', 'Wooden Table', 'Metal Table'
      ],
      Beds: [
        'Platform Bed', 'Storage Bed', 'Canopy Bed', 'Bunk Bed',
        'Daybed', 'Murphy Bed', 'Adjustable Bed', 'Sleigh Bed',
        'Panel Bed', 'Upholstered Bed', 'Metal Bed Frame', 'Wooden Bed'
      ],
      Storage: [
        'Bookshelf', 'Wardrobe', 'Dresser', 'Nightstand',
        'Storage Ottoman', 'TV Stand', 'Shoe Rack', 'Filing Cabinet',
        'Storage Bench', 'Closet Organizer', 'Shelving Unit', 'Storage Basket'
      ],
      Lighting: [
        'Floor Lamp', 'Table Lamp', 'Ceiling Light', 'Pendant Light',
        'Chandelier', 'Wall Sconce', 'Desk Lamp', 'String Lights',
        'LED Strip', 'Smart Bulb', 'Track Lighting', 'Outdoor Light'
      ],
      Decor: [
        'Wall Art', 'Mirror', 'Vase', 'Throw Pillow',
        'Area Rug', 'Curtains', 'Plant Pot', 'Candle Holder',
        'Picture Frame', 'Clock', 'Sculpture', 'Tapestry'
      ],
      Desks: [
        'Standing Desk', 'Computer Desk', 'Writing Desk', 'Corner Desk',
        'L-Shaped Desk', 'Gaming Desk', 'Executive Desk', 'Floating Desk',
        'Secretary Desk', 'Roll-Top Desk', 'Adjustable Desk', 'Compact Desk'
      ],
      Dining: [
        'Dining Set', 'Bar Cart', 'China Cabinet', 'Buffet',
        'Kitchen Island', 'Breakfast Nook', 'Wine Rack', 'Serving Cart',
        'Dining Bench', 'Counter Stool', 'Lazy Susan', 'Placemats'
      ],
      Outdoor: [
        'Patio Set', 'Garden Chair', 'Outdoor Sofa', 'Fire Pit',
        'Umbrella', 'Outdoor Table', 'Lounge Chair', 'Swing',
        'Gazebo', 'Outdoor Storage', 'Grill', 'Planters'
      ]
    };

    const images = [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg',
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      'https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg',
      'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
      'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg',
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg'
    ];

    const colors = ['Black', 'White', 'Gray', 'Brown', 'Navy', 'Beige', 'Green', 'Blue', 'Red', 'Yellow'];
    const materials = ['Wood', 'Metal', 'Fabric', 'Leather', 'Glass', 'Plastic', 'Rattan', 'Marble'];

    const allProducts: Product[] = [];
    let productId = 1;

    categories.forEach(category => {
      const templates = productTemplates[category as keyof typeof productTemplates] || ['Generic Item'];
      
      // Generate 8-12 products per template to get 50+ per category
      templates.forEach(template => {
        for (let i = 0; i < Math.floor(Math.random() * 5) + 8; i++) {
          const brand = brands[Math.floor(Math.random() * brands.length)];
          const source = sources[Math.floor(Math.random() * sources.length)];
          // Convert to Indian pricing (multiply by ~80 for USD to INR conversion)
          const basePrice = Math.floor(Math.random() * 160000) + 8000; // ₹8,000 to ₹1,68,000
          const hasDiscount = Math.random() > 0.7;
          const discount = hasDiscount ? Math.floor(Math.random() * 40) + 10 : 0;
          const salePrice = hasDiscount ? Math.floor(basePrice * (1 - discount / 100)) : basePrice;
          
          const product: Product = {
            id: productId.toString(),
            title: `${template} - ${brand} Collection ${i + 1}`,
            price: salePrice,
            originalPrice: hasDiscount ? basePrice : undefined,
            image: images[Math.floor(Math.random() * images.length)],
            gallery: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, () => 
              images[Math.floor(Math.random() * images.length)]
            ),
            url: `https://${source.toLowerCase().replace(' ', '').replace('india', '')}.com/product/${productId}`,
            source,
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            reviews: Math.floor(Math.random() * 1000) + 10,
            category,
            brand,
            inStock: Math.random() > 0.1,
            fastShipping: Math.random() > 0.6,
            freeShipping: Math.random() > 0.4,
            discount: hasDiscount ? discount : undefined,
            tags: [
              ...(Math.random() > 0.8 ? ['bestseller'] : []),
              ...(Math.random() > 0.9 ? ['new'] : []),
              ...(Math.random() > 0.85 ? ['trending'] : []),
              ...(Math.random() > 0.7 ? ['eco-friendly'] : []),
              ...(Math.random() > 0.8 ? ['premium'] : [])
            ],
            description: `Premium ${template.toLowerCase()} featuring modern design and exceptional comfort. Perfect for contemporary Indian homes.`,
            features: [
              'Premium materials',
              'Modern design',
              'Easy assembly',
              'Durable construction',
              ...(Math.random() > 0.5 ? ['Stain resistant'] : []),
              ...(Math.random() > 0.6 ? ['Eco-friendly'] : [])
            ],
            dimensions: {
              width: Math.floor(Math.random() * 50) + 30,
              height: Math.floor(Math.random() * 40) + 20,
              depth: Math.floor(Math.random() * 30) + 20
            },
            colors: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, () => 
              colors[Math.floor(Math.random() * colors.length)]
            ),
            materials: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
              materials[Math.floor(Math.random() * materials.length)]
            ),
            warranty: `${Math.floor(Math.random() * 5) + 1} years`,
            delivery: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 3) + 2} weeks`,
            popularity: Math.floor(Math.random() * 100),
            trending: Math.random() > 0.85,
            bestseller: Math.random() > 0.9,
            newArrival: Math.random() > 0.8,
            salePrice: hasDiscount ? salePrice : undefined,
            stockCount: Math.floor(Math.random() * 50) + 1,
            shippingCost: Math.random() > 0.4 ? 0 : Math.floor(Math.random() * 4000) + 800, // ₹800-₹4800 shipping
            assemblyRequired: Math.random() > 0.3,
            ecoFriendly: Math.random() > 0.7,
            customerPhotos: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
              images[Math.floor(Math.random() * images.length)]
            ),
            videoReviews: [],
            relatedProducts: []
          };

          allProducts.push(product);
          productId++;
        }
      });
    });

    return allProducts;
  };

  // Initialize products
  useEffect(() => {
    setLoading(true);
    const generatedProducts = generateProducts();
    setProducts(generatedProducts);
    setFilteredProducts(generatedProducts);
    setLoading(false);
  }, []);

  // Real-time search and filtering
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    
    searchTimeoutRef.current = setTimeout(() => {
      filterProducts();
      setIsSearching(false);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, selectedCategory, selectedBrands, priceRange, sortBy, products]);

  const filterProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // Get unique categories and brands
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['all', ...cats];
  }, [products]);

  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand)));
  }, [products]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Cart and wishlist functions
  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const nextImage = (productId: string, gallery: string[]) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % gallery.length
    }));
  };

  const prevImage = (productId: string, gallery: string[]) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + gallery.length) % gallery.length
    }));
  };

  // Format Indian currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const currentIndex = currentImageIndex[product.id] || 0;
    const isInCart = cart[product.id] > 0;
    const isInWishlist = wishlist.includes(product.id);
    const isHovered = hoveredProduct === product.id;

    return (
      <div 
        className="group relative bg-black/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2"
        onMouseEnter={() => setHoveredProduct(product.id)}
        onMouseLeave={() => setHoveredProduct(null)}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.gallery[currentIndex]}
            alt={product.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Image Navigation */}
          {product.gallery.length > 1 && (
            <>
              <button
                onClick={() => prevImage(product.id, product.gallery)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-500"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => nextImage(product.id, product.gallery)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-500"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.discount && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <Percent size={10} className="mr-1" />
                -{product.discount}%
              </span>
            )}
            {product.bestseller && (
              <span className="bg-emerald-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <Crown size={10} className="mr-1" />
                Best
              </span>
            )}
            {product.trending && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <Flame size={10} className="mr-1" />
                Hot
              </span>
            )}
            {product.newArrival && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <Sparkles size={10} className="mr-1" />
                New
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-full transition-all duration-300 ${
                isInWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-black/70 text-white hover:bg-red-500'
              }`}
            >
              <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => setShowQuickView(product.id)}
              className="p-2 rounded-full bg-black/70 text-white hover:bg-emerald-500 transition-all duration-300"
            >
              <Eye size={16} />
            </button>
            <button className="p-2 rounded-full bg-black/70 text-white hover:bg-blue-500 transition-all duration-300">
              <Share2 size={16} />
            </button>
          </div>

          {/* Shipping & Stock Info */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {product.fastShipping && (
              <span className="bg-emerald-500/90 text-black px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Zap size={8} className="mr-1" />
                Fast
              </span>
            )}
            {product.freeShipping && (
              <span className="bg-blue-500/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Truck size={8} className="mr-1" />
                Free
              </span>
            )}
            {product.stockCount < 10 && (
              <span className="bg-orange-500/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                Only {product.stockCount} left
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <span className="text-red-400 font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
              {product.title}
            </h3>
            <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
              {product.source}
            </span>
          </div>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>

          {/* Rating & Reviews */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                {product.rating} ({product.reviews})
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Users size={12} />
              <span>{product.popularity}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-emerald-400 flex items-center">
                <IndianRupee size={20} className="mr-1" />
                {product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through flex items-center">
                  <IndianRupee size={16} className="mr-1" />
                  {product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.shippingCost === 0 && (
              <span className="text-xs text-green-400 flex items-center">
                <Truck size={12} className="mr-1" />
                Free Ship
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex space-x-2 mb-3">
            {isInCart ? (
              <div className="flex items-center space-x-2 flex-1">
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 bg-gray-800 hover:bg-red-500 text-white rounded-lg transition-all duration-300"
                >
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center bg-emerald-500/20 text-emerald-400 py-2 rounded-lg font-medium">
                  {cart[product.id]} in cart
                </span>
                <button
                  onClick={() => addToCart(product.id)}
                  className="p-2 bg-gray-800 hover:bg-emerald-500 text-white rounded-lg transition-all duration-300"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product.id)}
                disabled={!product.inStock}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-black font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </button>
            )}
            
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <Clock size={12} className="mr-1" />
              {product.delivery}
            </span>
            <span className="flex items-center">
              <Shield size={12} className="mr-1" />
              {product.warranty}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="furniture-details" className="py-24 relative bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_70%)]"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                Live Furniture Marketplace
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-transparent"></span>
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Discover 500+ furniture pieces from top Indian brands. Search, compare, and buy directly from leading retailers.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Package className="w-4 h-4 mr-2 text-emerald-400" />
              {products.length}+ Products
            </span>
            <span className="flex items-center">
              <Award className="w-4 h-4 mr-2 text-emerald-400" />
              Top Indian Brands
            </span>
            <span className="flex items-center">
              <IndianRupee className="w-4 h-4 mr-2 text-emerald-400" />
              Indian Pricing
            </span>
            <span className="flex items-center">
              <Truck className="w-4 h-4 mr-2 text-emerald-400" />
              Direct Purchase
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Main Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search furniture, brands, styles... (e.g., 'modern sofa', 'Urban Ladder chair')"
                className="w-full bg-black/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                  showFilters 
                    ? 'bg-emerald-500 text-black border-emerald-500' 
                    : 'bg-black/50 text-gray-300 border-gray-700 hover:border-emerald-500'
                }`}
              >
                <SlidersHorizontal size={20} />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/50 border border-gray-700 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="relevance">Most Relevant</option>
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="flex border border-gray-700 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-4 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-500 text-black' 
                      : 'bg-black/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-4 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-emerald-500 text-black' 
                      : 'bg-black/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-emerald-500 text-black font-medium'
                    : 'bg-black/50 text-gray-300 border border-gray-700 hover:border-emerald-500 hover:text-emerald-400'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
                {category !== 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({products.filter(p => p.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Price Range (₹)</label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Min"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Max"
                      />
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <IndianRupee size={12} className="mr-1" />
                      {priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Brands</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {brands.slice(0, 8).map((brand) => (
                      <label key={brand} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                          className="form-checkbox h-4 w-4 text-emerald-500 rounded border-gray-700 bg-gray-900 focus:ring-emerald-500"
                        />
                        <span className="text-gray-300 text-sm">{brand}</span>
                        <span className="text-xs text-gray-500">
                          ({products.filter(p => p.brand === brand).length})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Quick Filters</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSelectedBrands([]);
                        setPriceRange([0, 400000]);
                        setSortBy('relevance');
                      }}
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      Clear All Filters
                    </button>
                    <div className="text-xs text-gray-500 text-center">
                      Showing {filteredProducts.length} of {products.length} products
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSearchTerm('bestseller')}
                        className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full hover:bg-emerald-500/30 transition-all duration-300"
                      >
                        Bestsellers
                      </button>
                      <button
                        onClick={() => setSearchTerm('new')}
                        className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full hover:bg-blue-500/30 transition-all duration-300"
                      >
                        New Arrivals
                      </button>
                      <button
                        onClick={() => setSearchTerm('sale')}
                        className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full hover:bg-red-500/30 transition-all duration-300"
                      >
                        On Sale
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold text-white">
              {selectedCategory === 'all' ? 'All Furniture' : selectedCategory}
            </h3>
            <span className="text-gray-400">
              ({filteredProducts.length} products found)
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-black/50 border border-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-black/50 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-500 transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-emerald-500 text-black font-medium'
                          : 'bg-black/50 border border-gray-700 text-white hover:border-emerald-500'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-black/50 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-500 transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <Button 
              type="primary" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedBrands([]);
                setPriceRange([0, 400000]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Floating Cart Summary */}
        {Object.keys(cart).length > 0 && (
          <div className="fixed bottom-6 right-6 bg-black/90 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-4 shadow-2xl z-50 max-w-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-500 text-black p-3 rounded-xl">
                <ShoppingBag size={20} />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">
                  {Object.values(cart).reduce((a, b) => a + b, 0)} items in cart
                </div>
                <div className="text-emerald-400 text-sm flex items-center">
                  <IndianRupee size={14} className="mr-1" />
                  {Object.entries(cart).reduce((total, [id, qty]) => {
                    const product = products.find(p => p.id === id);
                    return total + (product ? product.price * qty : 0);
                  }, 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button type="primary" className="text-sm py-2 px-4">
                  Checkout
                </Button>
                <button
                  onClick={() => setCart({})}
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors duration-300"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Counter */}
        {wishlist.length > 0 && (
          <div className="fixed bottom-6 left-6 bg-black/90 backdrop-blur-xl border border-pink-500/50 rounded-2xl p-4 shadow-2xl z-50">
            <div className="flex items-center space-x-3">
              <div className="bg-pink-500 text-white p-2 rounded-lg">
                <Heart size={16} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">
                  {wishlist.length} saved items
                </div>
                <button className="text-xs text-pink-400 hover:text-pink-300 transition-colors duration-300">
                  View Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FurnitureSection;