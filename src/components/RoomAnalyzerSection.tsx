import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Camera, 
  Upload, 
  X, 
  Brain, 
  Lightbulb, 
  Palette, 
  Ruler, 
  Eye, 
  TrendingUp,
  Home,
  Sofa,
  Lamp,
  PaintBucket,
  Layout,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { Button } from './Navigation';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

interface RoomAnalysis {
  roomType: string;
  confidence: number;
  style: string;
  lighting: {
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    type: string;
    suggestions: string[];
  };
  furniture: {
    detected: string[];
    missing: string[];
    arrangement: 'poor' | 'fair' | 'good' | 'excellent';
    suggestions: string[];
  };
  colors: {
    dominant: string[];
    harmony: 'poor' | 'fair' | 'good' | 'excellent';
    suggestions: string[];
  };
  space: {
    utilization: number;
    flow: 'poor' | 'fair' | 'good' | 'excellent';
    suggestions: string[];
  };
  overall: {
    score: number;
    grade: 'F' | 'D' | 'C' | 'B' | 'A';
    improvements: string[];
  };
  recommendations: {
    immediate: string[];
    budget: string[];
    luxury: string[];
  };
}

const RoomAnalyzerSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load AI models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log('AI models loaded successfully');
      } catch (error) {
        console.error('Error loading AI models:', error);
      }
    };
    loadModels();
  }, []);

  // Advanced room analysis using multiple AI techniques
  const analyzeRoom = async (imageElement: HTMLImageElement): Promise<RoomAnalysis> => {
    if (!model) throw new Error('AI model not loaded');

    // Step 1: Object Detection
    setCurrentStep('Detecting objects and furniture...');
    setAnalysisProgress(20);
    const predictions = await model.detect(imageElement);
    
    // Step 2: Room Type Classification
    setCurrentStep('Classifying room type...');
    setAnalysisProgress(35);
    const roomClassification = classifyRoomType(predictions, imageElement);
    
    // Step 3: Style Analysis
    setCurrentStep('Analyzing design style...');
    setAnalysisProgress(50);
    const styleAnalysis = analyzeDesignStyle(predictions, imageElement);
    
    // Step 4: Color Analysis
    setCurrentStep('Analyzing color palette...');
    setAnalysisProgress(65);
    const colorAnalysis = await analyzeColorHarmony(imageElement);
    
    // Step 5: Lighting Analysis
    setCurrentStep('Evaluating lighting conditions...');
    setAnalysisProgress(80);
    const lightingAnalysis = analyzeLighting(imageElement);
    
    // Step 6: Space Analysis
    setCurrentStep('Analyzing space utilization...');
    setAnalysisProgress(90);
    const spaceAnalysis = analyzeSpaceUtilization(predictions, imageElement);
    
    // Step 7: Generate Recommendations
    setCurrentStep('Generating AI recommendations...');
    setAnalysisProgress(100);
    const recommendations = generateIntelligentRecommendations(
      roomClassification,
      styleAnalysis,
      colorAnalysis,
      lightingAnalysis,
      spaceAnalysis,
      predictions
    );

    return {
      roomType: roomClassification.type,
      confidence: roomClassification.confidence,
      style: styleAnalysis.style,
      lighting: lightingAnalysis,
      furniture: {
        detected: predictions
          .filter(p => isFurniture(p.class))
          .map(p => p.class),
        missing: findMissingFurniture(roomClassification.type, predictions),
        arrangement: evaluateFurnitureArrangement(predictions, imageElement),
        suggestions: generateFurnitureSuggestions(roomClassification.type, predictions)
      },
      colors: colorAnalysis,
      space: spaceAnalysis,
      overall: calculateOverallScore(lightingAnalysis, colorAnalysis, spaceAnalysis),
      recommendations
    };
  };

  // Advanced room type classification
  const classifyRoomType = (predictions: cocoSsd.DetectedObject[], image: HTMLImageElement) => {
    const objects = predictions.map(p => p.class);
    
    // Bedroom indicators
    if (objects.includes('bed')) {
      return { type: 'Bedroom', confidence: 0.95 };
    }
    
    // Kitchen indicators
    if (objects.some(obj => ['refrigerator', 'microwave', 'oven', 'sink'].includes(obj))) {
      return { type: 'Kitchen', confidence: 0.90 };
    }
    
    // Living room indicators
    if (objects.includes('couch') || objects.includes('tv')) {
      return { type: 'Living Room', confidence: 0.85 };
    }
    
    // Dining room indicators
    if (objects.includes('dining table')) {
      return { type: 'Dining Room', confidence: 0.80 };
    }
    
    // Bathroom indicators
    if (objects.some(obj => ['toilet', 'sink'].includes(obj))) {
      return { type: 'Bathroom', confidence: 0.85 };
    }
    
    // Office indicators
    if (objects.some(obj => ['laptop', 'keyboard', 'mouse'].includes(obj))) {
      return { type: 'Home Office', confidence: 0.75 };
    }
    
    return { type: 'General Space', confidence: 0.60 };
  };

  // Design style analysis using visual cues
  const analyzeDesignStyle = (predictions: cocoSsd.DetectedObject[], image: HTMLImageElement) => {
    const objects = predictions.map(p => p.class);
    
    // Modern/Contemporary indicators
    if (objects.includes('tv') && predictions.length < 8) {
      return { style: 'Modern/Minimalist', confidence: 0.80 };
    }
    
    // Traditional indicators
    if (objects.some(obj => ['book', 'vase'].includes(obj))) {
      return { style: 'Traditional/Classic', confidence: 0.70 };
    }
    
    // Industrial indicators
    if (objects.length > 10) {
      return { style: 'Eclectic/Maximalist', confidence: 0.65 };
    }
    
    return { style: 'Contemporary', confidence: 0.60 };
  };

  // Advanced color harmony analysis
  const analyzeColorHarmony = async (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return { dominant: ['#FFFFFF'], harmony: 'fair' as const, suggestions: [] };

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorCounts = new Map<string, number>();
    
    // Sample colors more intelligently
    for (let i = 0; i < imageData.length; i += 16) { // Sample every 4th pixel
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      // Skip very dark or very light pixels
      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 225) continue;
      
      const hex = rgbToHex(r, g, b);
      colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
    }

    const dominantColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color);

    const harmony = evaluateColorHarmony(dominantColors);
    const suggestions = generateColorSuggestions(dominantColors, harmony);

    return {
      dominant: dominantColors,
      harmony,
      suggestions
    };
  };

  // Lighting analysis using image brightness and contrast
  const analyzeLighting = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return { quality: 'fair' as const, type: 'Unknown', suggestions: [] };

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let totalBrightness = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      totalBrightness += (r + g + b) / 3;
      pixelCount++;
    }
    
    const avgBrightness = totalBrightness / pixelCount;
    
    let quality: 'poor' | 'fair' | 'good' | 'excellent';
    let type: string;
    let suggestions: string[] = [];
    
    if (avgBrightness < 80) {
      quality = 'poor';
      type = 'Insufficient lighting';
      suggestions = [
        'Add more light sources',
        'Consider brighter bulbs',
        'Add table or floor lamps',
        'Use mirrors to reflect light'
      ];
    } else if (avgBrightness < 120) {
      quality = 'fair';
      type = 'Moderate lighting';
      suggestions = [
        'Add accent lighting',
        'Consider warmer light temperatures',
        'Add task lighting for specific areas'
      ];
    } else if (avgBrightness < 180) {
      quality = 'good';
      type = 'Well-lit space';
      suggestions = [
        'Consider dimmer switches for ambiance',
        'Add decorative lighting elements'
      ];
    } else {
      quality = 'excellent';
      type = 'Bright, well-lit space';
      suggestions = [
        'Perfect lighting levels',
        'Consider adding warm accent lights for evening'
      ];
    }
    
    return { quality, type, suggestions };
  };

  // Space utilization analysis
  const analyzeSpaceUtilization = (predictions: cocoSsd.DetectedObject[], image: HTMLImageElement) => {
    const totalArea = image.width * image.height;
    const occupiedArea = predictions.reduce((acc, obj) => {
      const area = obj.bbox[2] * obj.bbox[3];
      return acc + area;
    }, 0);
    
    const utilization = Math.min(Math.round((occupiedArea / totalArea) * 100), 100);
    
    let flow: 'poor' | 'fair' | 'good' | 'excellent';
    let suggestions: string[] = [];
    
    if (utilization < 30) {
      flow = 'poor';
      suggestions = [
        'Add more functional furniture',
        'Create defined activity zones',
        'Consider larger furniture pieces',
        'Add storage solutions'
      ];
    } else if (utilization < 50) {
      flow = 'fair';
      suggestions = [
        'Optimize furniture placement',
        'Add decorative elements',
        'Consider area rugs to define spaces'
      ];
    } else if (utilization < 75) {
      flow = 'good';
      suggestions = [
        'Great space utilization',
        'Consider minor adjustments for flow'
      ];
    } else {
      flow = 'excellent';
      suggestions = [
        'Excellent space utilization',
        'Perfect balance of function and flow'
      ];
    }
    
    return { utilization, flow, suggestions };
  };

  // Generate intelligent recommendations
  const generateIntelligentRecommendations = (
    roomType: any,
    style: any,
    colors: any,
    lighting: any,
    space: any,
    predictions: cocoSsd.DetectedObject[]
  ) => {
    const immediate = [];
    const budget = [];
    const luxury = [];
    
    // Lighting recommendations
    if (lighting.quality === 'poor') {
      immediate.push('Add table lamps for better lighting');
      budget.push('Install LED ceiling fixtures');
      luxury.push('Smart lighting system with dimmer controls');
    }
    
    // Color recommendations
    if (colors.harmony === 'poor') {
      immediate.push('Add colorful throw pillows or artwork');
      budget.push('Paint an accent wall');
      luxury.push('Professional color consultation and repainting');
    }
    
    // Space recommendations
    if (space.utilization < 40) {
      immediate.push('Rearrange existing furniture');
      budget.push('Add functional storage furniture');
      luxury.push('Custom built-in storage solutions');
    }
    
    // Room-specific recommendations
    if (roomType.type === 'Living Room') {
      immediate.push('Add plants for natural elements');
      budget.push('Invest in quality throw blankets');
      luxury.push('Statement art piece or gallery wall');
    }
    
    return { immediate, budget, luxury };
  };

  // Helper functions
  const isFurniture = (className: string) => {
    const furnitureItems = [
      'chair', 'couch', 'bed', 'dining table', 'tv', 'refrigerator',
      'microwave', 'oven', 'sink', 'toilet', 'book', 'vase', 'laptop'
    ];
    return furnitureItems.includes(className);
  };

  const findMissingFurniture = (roomType: string, predictions: cocoSsd.DetectedObject[]) => {
    const detected = predictions.map(p => p.class);
    const missing = [];
    
    if (roomType === 'Living Room') {
      if (!detected.includes('couch')) missing.push('Seating furniture');
      if (!detected.includes('tv')) missing.push('Entertainment center');
    } else if (roomType === 'Bedroom') {
      if (!detected.includes('bed')) missing.push('Bed');
    }
    
    return missing;
  };

  const evaluateFurnitureArrangement = (predictions: cocoSsd.DetectedObject[], image: HTMLImageElement) => {
    // Simple heuristic based on object distribution
    const centerX = image.width / 2;
    const centerY = image.height / 2;
    
    let balanceScore = 0;
    predictions.forEach(obj => {
      const objCenterX = obj.bbox[0] + obj.bbox[2] / 2;
      const objCenterY = obj.bbox[1] + obj.bbox[3] / 2;
      const distanceFromCenter = Math.sqrt(
        Math.pow(objCenterX - centerX, 2) + Math.pow(objCenterY - centerY, 2)
      );
      balanceScore += distanceFromCenter;
    });
    
    const avgDistance = balanceScore / predictions.length;
    const normalizedScore = avgDistance / (Math.sqrt(centerX * centerX + centerY * centerY));
    
    if (normalizedScore < 0.3) return 'excellent';
    if (normalizedScore < 0.5) return 'good';
    if (normalizedScore < 0.7) return 'fair';
    return 'poor';
  };

  const generateFurnitureSuggestions = (roomType: string, predictions: cocoSsd.DetectedObject[]) => {
    const suggestions = [];
    
    if (roomType === 'Living Room') {
      suggestions.push('Consider a coffee table for the seating area');
      suggestions.push('Add side tables for functionality');
    } else if (roomType === 'Bedroom') {
      suggestions.push('Add bedside tables for symmetry');
      suggestions.push('Consider a dresser for storage');
    }
    
    return suggestions;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const evaluateColorHarmony = (colors: string[]) => {
    // Simple color harmony evaluation
    if (colors.length < 3) return 'poor';
    if (colors.length > 6) return 'fair';
    return 'good';
  };

  const generateColorSuggestions = (colors: string[], harmony: string) => {
    const suggestions = [];
    
    if (harmony === 'poor') {
      suggestions.push('Add a unifying accent color');
      suggestions.push('Consider a more cohesive color palette');
    } else {
      suggestions.push('Great color harmony!');
      suggestions.push('Consider adding metallic accents');
    }
    
    return suggestions;
  };

  const calculateOverallScore = (lighting: any, colors: any, space: any) => {
    const scores = {
      poor: 1,
      fair: 2,
      good: 3,
      excellent: 4
    };
    
    const avgScore = (
      scores[lighting.quality] +
      scores[colors.harmony] +
      scores[space.flow]
    ) / 3;
    
    const score = Math.round(avgScore * 25);
    
    let grade: 'F' | 'D' | 'C' | 'B' | 'A';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';
    
    const improvements = [];
    if (lighting.quality === 'poor') improvements.push('Improve lighting');
    if (colors.harmony === 'poor') improvements.push('Enhance color harmony');
    if (space.flow === 'poor') improvements.push('Optimize space layout');
    
    return { score, grade, improvements };
  };

  // File drop handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep('Loading image...');
    
    const reader = new FileReader();
    reader.onload = async () => {
      const imageUrl = reader.result as string;
      setSelectedImage(imageUrl);

      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        try {
          const results = await analyzeRoom(img);
          setAnalysis(results);
        } catch (error) {
          console.error('Analysis error:', error);
        } finally {
          setIsAnalyzing(false);
          setAnalysisProgress(0);
          setCurrentStep('');
        }
      };
    };
    reader.readAsDataURL(file);
  }, [model]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysis(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <CheckCircle className="text-green-400" size={20} />;
      case 'good': return <CheckCircle className="text-emerald-400" size={20} />;
      case 'fair': return <AlertCircle className="text-yellow-400" size={20} />;
      default: return <AlertCircle className="text-red-400" size={20} />;
    }
  };

  return (
    <section id="room-analysis-details" className="py-24 relative bg-gray-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                AI-Powered Room Analyzer
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-transparent"></span>
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Upload a photo of your room and get comprehensive AI analysis with personalized recommendations 
            for lighting, colors, furniture arrangement, and style improvements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <div className="bg-black border border-gray-800 rounded-xl p-6 overflow-hidden relative">
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              {!selectedImage ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-12 h-80 hover:border-emerald-500/50 transition-colors duration-300">
                  <Brain className="h-12 w-12 text-emerald-500 mb-4" />
                  <span className="text-gray-300 text-lg font-medium mb-2">
                    {isDragActive ? 'Drop your room photo here' : 'Upload room photo for AI analysis'}
                  </span>
                  <span className="text-gray-500 text-sm text-center">
                    Our AI will analyze lighting, colors, furniture, and provide expert recommendations
                  </span>
                </div>
              ) : (
                <div className="relative h-80 overflow-hidden rounded-lg">
                  <img 
                    src={selectedImage} 
                    alt="Room to analyze" 
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

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center max-w-xs">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"
                      style={{
                        transform: `rotate(${analysisProgress * 3.6}deg)`
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-emerald-400 font-medium mb-2">AI Analysis in Progress</p>
                  <p className="text-gray-400 text-sm text-center">{currentStep}</p>
                  <div className="w-full bg-gray-800 rounded-full h-2 mt-3">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">{analysisProgress}% Complete</p>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div>
            {analysis ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-black/50 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-emerald-400 flex items-center">
                      <Target className="mr-3" />
                      Overall Analysis
                    </h3>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(analysis.overall.score)}`}>
                        {analysis.overall.score}
                      </div>
                      <div className="text-gray-400 text-sm">Grade: {analysis.overall.grade}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <div className="text-sm text-gray-400">Room Type</div>
                      <div className="font-medium">{analysis.roomType}</div>
                      <div className="text-xs text-emerald-400">{Math.round(analysis.confidence * 100)}% confidence</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <div className="text-sm text-gray-400">Style</div>
                      <div className="font-medium">{analysis.style}</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lighting Analysis */}
                  <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                    <h4 className="text-lg font-medium mb-3 flex items-center">
                      <Lamp className="mr-2 text-yellow-400" size={20} />
                      Lighting
                      {getQualityIcon(analysis.lighting.quality)}
                    </h4>
                    <div className="text-sm text-gray-400 mb-2">{analysis.lighting.type}</div>
                    <div className="space-y-1">
                      {analysis.lighting.suggestions.slice(0, 2).map((suggestion, index) => (
                        <div key={index} className="text-xs text-gray-300 flex items-start">
                          <Lightbulb size={12} className="mr-1 mt-0.5 text-yellow-400 flex-shrink-0" />
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Analysis */}
                  <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                    <h4 className="text-lg font-medium mb-3 flex items-center">
                      <Palette className="mr-2 text-purple-400" size={20} />
                      Colors
                      {getQualityIcon(analysis.colors.harmony)}
                    </h4>
                    <div className="flex space-x-1 mb-2">
                      {analysis.colors.dominant.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="space-y-1">
                      {analysis.colors.suggestions.slice(0, 2).map((suggestion, index) => (
                        <div key={index} className="text-xs text-gray-300 flex items-start">
                          <PaintBucket size={12} className="mr-1 mt-0.5 text-purple-400 flex-shrink-0" />
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Space Analysis */}
                  <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                    <h4 className="text-lg font-medium mb-3 flex items-center">
                      <Layout className="mr-2 text-blue-400" size={20} />
                      Space
                      {getQualityIcon(analysis.space.flow)}
                    </h4>
                    <div className="text-sm text-gray-400 mb-2">
                      {analysis.space.utilization}% utilized
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full"
                        style={{ width: `${analysis.space.utilization}%` }}
                      ></div>
                    </div>
                    <div className="space-y-1">
                      {analysis.space.suggestions.slice(0, 2).map((suggestion, index) => (
                        <div key={index} className="text-xs text-gray-300 flex items-start">
                          <Ruler size={12} className="mr-1 mt-0.5 text-blue-400 flex-shrink-0" />
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Furniture Analysis */}
                  <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                    <h4 className="text-lg font-medium mb-3 flex items-center">
                      <Sofa className="mr-2 text-green-400" size={20} />
                      Furniture
                      {getQualityIcon(analysis.furniture.arrangement)}
                    </h4>
                    <div className="text-sm text-gray-400 mb-2">
                      {analysis.furniture.detected.length} items detected
                    </div>
                    <div className="space-y-1">
                      {analysis.furniture.suggestions.slice(0, 2).map((suggestion, index) => (
                        <div key={index} className="text-xs text-gray-300 flex items-start">
                          <Home size={12} className="mr-1 mt-0.5 text-green-400 flex-shrink-0" />
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-black/50 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center">
                    <Sparkles className="mr-3" />
                    AI Recommendations
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h4 className="font-medium text-green-400 mb-2 flex items-center">
                        <Zap size={16} className="mr-2" />
                        Quick Wins
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.immediate.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <ArrowRight size={12} className="mr-1 mt-0.5 text-green-400 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-400 mb-2 flex items-center">
                        <TrendingUp size={16} className="mr-2" />
                        Budget Upgrades
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.budget.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <ArrowRight size={12} className="mr-1 mt-0.5 text-yellow-400 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h4 className="font-medium text-purple-400 mb-2 flex items-center">
                        <Star size={16} className="mr-2" />
                        Premium Options
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.luxury.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <ArrowRight size={12} className="mr-1 mt-0.5 text-purple-400 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button type="primary" icon={<Camera size={16} />}>
                    Analyze Another Room
                  </Button>
                  <Button type="outline">
                    Save Analysis Report
                  </Button>
                  <Button type="outline">
                    Get Professional Consultation
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 border border-gray-800 rounded-lg">
                <Brain className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-6">
                  Upload a photo of your room to receive comprehensive AI-powered analysis and personalized recommendations
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2 text-emerald-400" />
                    Object Detection
                  </div>
                  <div className="flex items-center">
                    <Palette className="w-4 h-4 mr-2 text-emerald-400" />
                    Color Analysis
                  </div>
                  <div className="flex items-center">
                    <Lamp className="w-4 h-4 mr-2 text-emerald-400" />
                    Lighting Assessment
                  </div>
                  <div className="flex items-center">
                    <Layout className="w-4 h-4 mr-2 text-emerald-400" />
                    Space Optimization
                  </div>
                </div>
                <Button type="primary" icon={<Upload size={16} />}>
                  Upload Room Photo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomAnalyzerSection;