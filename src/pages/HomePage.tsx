import React, { useState, useRef } from 'react';
import {
  Coffee,
  Sparkles,
  ShoppingBag,
  Star,
  Flame,
  ArrowRight,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Sliders,
  ShieldCheck,
  Award,
  Clock,
  Heart,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { MenuItem, CoffeeCategory } from '../types';
import { useToast } from '../components/Toast';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'ALL', label: 'All Offerings' },
  { id: 'Hot Coffee', label: 'Hot Coffee' },
  { id: 'Cold Brew', label: 'Cold Brew' },
  { id: 'Espresso Specialties', label: 'Espresso Specialties' },
  { id: 'Artisanal Teas', label: 'Artisanal Teas' },
  { id: 'Pastries & Bakery', label: 'Pastries & Bakery' },
  { id: 'Signature Blends', label: 'Signature Blends' },
];

interface HomePageProps {
  onOpenCart: () => void;
  onOpenLoginModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenCart, onOpenLoginModal }) => {
  const { menu, addToCart } = useCoffee();
  const { success, warning } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Video Controls state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Customization modal state
  const [customSize, setCustomSize] = useState<'Regular' | 'Large'>('Regular');
  const [customMilk, setCustomMilk] = useState<'Whole Milk' | 'Oat Milk' | 'Almond Milk' | 'Skim Milk'>('Whole Milk');
  const [customSweetness, setCustomSweetness] = useState<'0%' | '25%' | '50%' | '100%'>('100%');
  const [customNotes, setCustomNotes] = useState('');

  const filteredMenu = menu.filter(
    (item) => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  const handleQuickAdd = (product: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable || product.stock <= 0) {
      warning('Out of Stock', `"${product.name}" is currently sold out.`);
      return;
    }
    addToCart(product, 1);
    success('Added to Bag', `1x ${product.name} added. View your bag anytime!`);
  };

  const handleOpenCustomModal = (product: MenuItem) => {
    setSelectedProduct(product);
    setCustomSize('Regular');
    setCustomMilk('Whole Milk');
    setCustomSweetness('100%');
    setCustomNotes('');
  };

  const handleConfirmCustomAdd = () => {
    if (!selectedProduct) return;
    if (!selectedProduct.isAvailable || selectedProduct.stock <= 0) {
      warning('Out of Stock', 'This item is currently sold out.');
      return;
    }
    addToCart(selectedProduct, 1, {
      size: customSize,
      milkChoice: customMilk,
      sweetness: customSweetness,
      customNotes
    });
    success('Custom Order Added', `${selectedProduct.name} (${customSize}, ${customMilk}) added to bag.`);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-16 animate-fade-in pb-20">
      
      {/* ================= CINEMATIC VIDEO HERO SECTION ================= */}
      <section className="relative min-h-[580px] lg:min-h-[680px] flex items-center overflow-hidden bg-espresso-950 text-coffee-100 border-b border-amber-950">
        
        {/* Background Looping Video Stream */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isVideoMuted}
            playsInline
            poster="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80"
            className="w-full h-full object-cover scale-105 filter brightness-[0.45] contrast-125 transition-all duration-700"
          >
            {/* Reliable direct streaming video of coffee brewing & espresso pour */}
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-making-coffee-3580-large.mp4"
              type="video/mp4"
            />
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-steaming-coffee-cup-on-a-table-41270-large.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Ambient Dark Espresso & Liquid Caramel Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0603]/95 via-[#1a0c06]/80 to-[#120703]/85 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(217,119,6,0.18),transparent_70%)] z-10 pointer-events-none" />

        {/* Video Control Buttons in top-right */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <button
            onClick={toggleVideoPlay}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-amber-200 transition-all hover:scale-105 cursor-pointer"
            title={isVideoPlaying ? 'Pause video background' : 'Play video background'}
          >
            {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleVideoMute}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-amber-200 transition-all hover:scale-105 cursor-pointer"
            title={isVideoMuted ? 'Unmute video' : 'Mute video'}
          >
            {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Cinematic Specialty Roastery & Delivery
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-black text-amber-50 leading-[1.08] tracking-tight">
              Crafted with Passion. <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                Delivered to Your Table.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-coffee-200 max-w-xl leading-relaxed">
              Experience the art of slow-roasted single-origin coffees, nitrogen-infused cold foam, and warm Parisian croissants. Browse our menu or have drinks delivered directly to your campus desk.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#menu"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-amber-500 text-espresso-950 font-black text-sm shadow-xl shadow-amber-900/40 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Browse Menu & Order</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShowVideoModal(true)}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-amber-500/30 text-amber-200 font-semibold text-sm backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Watch Roasting Story</span>
              </button>
            </div>

            {/* Highlights Grid */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-amber-900/50 text-xs text-coffee-300">
              <div>
                <span className="font-serif font-bold text-lg text-amber-200 block">16-Hour</span>
                <span>Cold Steep Extraction</span>
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-amber-200 block">10% Off</span>
                <span>Student Scholar Perks</span>
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-amber-200 block">Table Delivery</span>
                <span>Direct Campus Drop-off</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Product Feature Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-espresso-900/60 backdrop-blur-md group">
              <img
                src="https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80"
                alt="Caramel Macchiato Reserve"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0704] via-transparent to-transparent opacity-80" />

              {/* Floating product detail pill */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-amber-500/40 text-xs text-amber-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif font-bold text-base text-amber-50">Caramel Macchiato Reserve</p>
                  <p className="text-[11px] text-coffee-400">Awarded Best Campus Espresso 2026</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-lg text-amber-300">$5.75</span>
                  <button
                    onClick={() => handleOpenCustomModal(menu[0] || { id: 'prod-1', name: 'Caramel Macchiato Reserve', price: 5.75, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80', description: '', category: 'Espresso Specialties', stock: 24, isAvailable: true, rating: 4.9 })}
                    className="block mt-1 px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-[10px] uppercase tracking-wider"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= MENU SECTION WITH PROMINENT PRODUCT PICTURES ================= */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-bold uppercase tracking-wider">
            <Coffee className="w-3.5 h-3.5 text-amber-800" />
            Seasonal Roaster Catalogue
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-coffee-950 tracking-tight">
            Handcrafted Coffee & Treats
          </h2>
          <p className="text-sm text-coffee-600">
            Click any beverage to inspect its ingredients and customize cup size, milk choice, and sweetness level.
          </p>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-800 text-white shadow-md shadow-amber-950/20'
                  : 'bg-white text-coffee-700 border border-coffee-200 hover:bg-coffee-100/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid with Large High-Def Pictures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenCustomModal(item)}
              className={`flex flex-col justify-between rounded-3xl bg-white border border-coffee-200/80 overflow-hidden shadow-sm hover:shadow-2xl hover:border-amber-400/80 transition-all duration-300 group cursor-pointer ${
                !item.isAvailable || item.stock <= 0 ? 'opacity-70' : ''
              }`}
            >
              {/* Product Picture Container with Zoom Hover Effect */}
              <div className="relative h-56 overflow-hidden bg-coffee-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                {/* Badges on picture */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/60 text-amber-200 backdrop-blur-md border border-white/10">
                    {item.category}
                  </span>
                  {item.roastLevel && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-900/80 text-amber-100 backdrop-blur-md">
                      {item.roastLevel}
                    </span>
                  )}
                </div>

                {/* Stock or sold out badge */}
                <div className="absolute bottom-3 right-3">
                  {!item.isAvailable || item.stock === 0 ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-600 text-white shadow-md">
                      Sold Out
                    </span>
                  ) : item.stock < 10 ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-600 text-white shadow-md animate-pulse">
                      Only {item.stock} left!
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                      {item.stock} in stock
                    </span>
                  )}
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white text-coffee-950 font-bold text-xs shadow-lg flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-700" />
                    <span>View & Customize</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="font-serif font-bold text-base text-coffee-950 group-hover:text-amber-800 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-coffee-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price and Add button */}
                <div className="pt-3 border-t border-coffee-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-coffee-400 uppercase font-semibold block">Price</span>
                    <span className="font-mono font-bold text-base text-amber-800">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    disabled={!item.isAvailable || item.stock <= 0}
                    onClick={(e) => handleQuickAdd(item, e)}
                    className="p-2.5 rounded-2xl bg-amber-800 hover:bg-amber-700 disabled:bg-stone-300 text-white shadow-md transition-all group-hover:scale-105 cursor-pointer disabled:cursor-not-allowed"
                    title="Add to bag"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRODUCT INSPECTION & CUSTOMIZATION MODAL ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-coffee-200 animate-scale-up text-coffee-950 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header with Big Product Picture */}
            <div className="relative h-48 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden bg-coffee-100">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-600/90 text-amber-100">
                    {selectedProduct.category}
                  </span>
                  <h3 className="font-serif font-black text-2xl text-white mt-1">
                    {selectedProduct.name}
                  </h3>
                </div>
                <span className="font-mono font-bold text-xl text-amber-300">
                  ${selectedProduct.price.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-xs text-coffee-600 mb-6 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Customization Options */}
            <div className="space-y-4 text-xs">
              {/* Cup Size */}
              <div>
                <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
                  Cup Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomSize('Regular')}
                    className={`py-2 px-3 rounded-xl font-semibold border transition-all cursor-pointer ${
                      customSize === 'Regular'
                        ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                        : 'bg-stone-50 text-coffee-700 border-coffee-200 hover:bg-coffee-100'
                    }`}
                  >
                    Regular (12 oz)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomSize('Large')}
                    className={`py-2 px-3 rounded-xl font-semibold border transition-all cursor-pointer ${
                      customSize === 'Large'
                        ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                        : 'bg-stone-50 text-coffee-700 border-coffee-200 hover:bg-coffee-100'
                    }`}
                  >
                    Large (16 oz)
                  </button>
                </div>
              </div>

              {/* Milk Option */}
              <div>
                <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
                  Milk Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Whole Milk', 'Oat Milk', 'Almond Milk', 'Skim Milk'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setCustomMilk(m)}
                      className={`py-2 px-3 rounded-xl font-semibold border transition-all cursor-pointer ${
                        customMilk === m
                          ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                          : 'bg-stone-50 text-coffee-700 border-coffee-200 hover:bg-coffee-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness */}
              <div>
                <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
                  Sweetness Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['0%', '25%', '50%', '100%'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCustomSweetness(s)}
                      className={`py-2 px-2 rounded-xl font-semibold border text-center transition-all cursor-pointer ${
                        customSweetness === s
                          ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                          : 'bg-stone-50 text-coffee-700 border-coffee-200 hover:bg-coffee-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Barista Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
                  Special Barista Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra hot, light ice, cinnamon sprinkle on top..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-coffee-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-6 mt-6 border-t border-coffee-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-coffee-600 hover:bg-coffee-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCustomAdd}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-900/20 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Drink (${selectedProduct.price.toFixed(2)})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ROASTING STORY VIDEO MODAL ================= */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/90 backdrop-blur-md">
          <div className="bg-[#140804] border border-amber-700/50 rounded-3xl p-6 sm:p-8 max-w-3xl w-full text-coffee-100 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-amber-950">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-xl text-amber-100">
                  BrewBean: The Art of Specialty Coffee
                </h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 rounded-full text-coffee-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 rounded-2xl overflow-hidden aspect-video bg-black relative">
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-making-coffee-3580-large.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <p className="text-xs text-coffee-300 leading-relaxed">
              From our partner farms in Ethiopia and Colombia to our custom-engineered drum roasters, each batch is calibrated to bring out subtle floral notes, chocolate sweetness, and velvety texture.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
