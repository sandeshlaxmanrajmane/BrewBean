import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Coffee,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  DollarSign,
  Package
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { CoffeeCategory, MenuItem } from '../../types';
import { useToast } from '../../components/Toast';

const CATEGORIES: CoffeeCategory[] = [
  'Hot Coffee',
  'Cold Brew',
  'Espresso Specialties',
  'Artisanal Teas',
  'Pastries & Bakery',
  'Signature Blends'
];

const PHOTO_PRESETS = [
  { label: 'Espresso', url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80' },
  { label: 'Caramel Macchiato', url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cold Brew Tower', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Latte Art', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80' },
  { label: 'Matcha Bowl', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80' },
  { label: 'Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
  { label: 'Whole Beans Bag', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80' }
];

export const OwnerMenu: React.FC = () => {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability } = useCoffee();
  const { success, error: toastError } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [category, setCategory] = useState<CoffeeCategory>('Hot Coffee');
  const [image, setImage] = useState('');
  const [roastLevel, setRoastLevel] = useState<'Light' | 'Medium' | 'Dark' | 'Single Origin'>('Medium');
  const [isAvailable, setIsAvailable] = useState(true);
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setModalMode('create');
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice('4.50');
    setStock('25');
    setCategory('Hot Coffee');
    setImage(PHOTO_PRESETS[0].url);
    setRoastLevel('Medium');
    setIsAvailable(true);
    setFormError('');
  };

  const openEditModal = (item: MenuItem) => {
    setModalMode('edit');
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setStock(item.stock.toString());
    setCategory(item.category);
    setImage(item.image);
    setRoastLevel(item.roastLevel || 'Medium');
    setIsAvailable(item.isAvailable);
    setFormError('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock, 10);

    // Strict validation
    if (!name.trim()) {
      setFormError('Item name cannot be empty.');
      return;
    }
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setFormError('Price must be a valid positive number greater than $0.00.');
      return;
    }
    if (isNaN(numericStock) || numericStock < 0) {
      setFormError('Stock cannot be negative.');
      return;
    }
    if (!image.trim()) {
      setFormError('Please select or specify an image URL.');
      return;
    }

    if (modalMode === 'create') {
      const res = addMenuItem({
        name,
        description,
        price: numericPrice,
        stock: numericStock,
        category,
        image,
        roastLevel,
        isAvailable,
        rating: 4.8
      });
      if (res.success) {
        success('Menu Item Added', `"${name}" is now part of the active catalogue.`);
        setModalMode(null);
      } else {
        setFormError(res.error || 'Failed to add item');
      }
    } else if (modalMode === 'edit' && editingItem) {
      const res = updateMenuItem(editingItem.id, {
        name,
        description,
        price: numericPrice,
        stock: numericStock,
        category,
        image,
        roastLevel,
        isAvailable
      });
      if (res.success) {
        success('Menu Item Updated', `"${name}" details updated successfully.`);
        setModalMode(null);
      } else {
        setFormError(res.error || 'Failed to update item');
      }
    }
  };

  const handleDelete = (id: string, itemName: string) => {
    if (confirm(`Are you sure you want to remove "${itemName}" from the catalogue?`)) {
      deleteMenuItem(id);
      success('Item Removed', `"${itemName}" was removed from the menu.`);
    }
  };

  const filteredItems = menu.filter(
    (item) => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-amber-100">Coffee Menu Catalogue</h1>
          <p className="text-xs text-coffee-400">
            Create, update, or remove artisanal espresso roasts, cold brews, and bakery items.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-900/40 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-amber-600 text-amber-950 shadow-sm'
              : 'bg-[#1e1008] text-coffee-300 hover:text-white'
          }`}
        >
          All Items ({menu.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-600 text-amber-950 shadow-sm'
                : 'bg-[#1e1008] text-coffee-300 hover:text-white'
            }`}
          >
            {cat} ({menu.filter((m) => m.category === cat).length})
          </button>
        ))}
      </div>

      {/* Grid of Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col justify-between rounded-3xl bg-[#190d07] border ${
              item.isAvailable ? 'border-amber-900/30' : 'border-red-900/40 opacity-70'
            } overflow-hidden shadow-xl hover:border-amber-700/50 transition-all duration-300 group`}
          >
            {/* Image Header with Availability Tag */}
            <div className="relative h-44 overflow-hidden bg-espresso-950">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#190d07] via-transparent to-black/30" />

              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-amber-300 backdrop-blur-md border border-white/10">
                  {item.category}
                </span>
                {!item.isAvailable && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                    Unavailable
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="absolute bottom-3 right-3">
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border backdrop-blur-md ${
                    item.stock === 0
                      ? 'bg-red-950/80 text-red-300 border-red-700/80'
                      : item.stock < 10
                      ? 'bg-orange-950/80 text-orange-300 border-orange-700/80'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                  }`}
                >
                  {item.stock} in stock
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif font-bold text-amber-100 text-base group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                  <span className="font-mono font-bold text-amber-300 text-base shrink-0">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-coffee-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-amber-950/80 flex items-center justify-between gap-2">
                {/* Availability Toggle */}
                <button
                  type="button"
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    item.isAvailable
                      ? 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/40'
                      : 'bg-red-950/60 text-red-300 hover:bg-red-900/60 border border-red-800/40'
                  }`}
                  title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                >
                  {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.isAvailable ? 'Active' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-[#25140b] hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 rounded-lg bg-[#25140b] hover:bg-red-950 text-coffee-400 hover:text-red-400 border border-amber-800/40 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md">
          <div className="bg-[#1c0f08] border border-amber-800/60 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-coffee-100 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-amber-950">
              <h3 className="text-xl font-serif font-bold text-amber-100">
                {modalMode === 'create' ? 'Add New Menu Item' : 'Edit Menu Item'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-coffee-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bourbon Vanilla Cold Brew"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Category & Roast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CoffeeCategory)}
                    className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#120703]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                    Roast Profile
                  </label>
                  <select
                    value={roastLevel}
                    onChange={(e) => setRoastLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Dark">Dark</option>
                    <option value="Single Origin">Single Origin</option>
                  </select>
                </div>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                    Price ($ USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400 text-xs">$</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0.01"
                      required
                      placeholder="5.50"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-7 pr-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <span className="text-[10px] text-coffee-500">Must be greater than $0.00</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-coffee-500">Non-negative whole number</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                  Artisanal Tasting Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes of bittersweet chocolate, caramel sweetness, pulled from high-altitude roasts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Product Image URL with Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase text-amber-300/80">
                    Product Image URL *
                  </label>
                  <span className="text-[10px] text-coffee-400">Click preset to autofill:</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PHOTO_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                        image === preset.url
                          ? 'bg-amber-600 text-amber-950 border-amber-400 font-bold'
                          : 'bg-[#120703] text-coffee-300 border-amber-900/30 hover:border-amber-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between pt-2">
                <label className="text-xs text-coffee-300 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded border-amber-800 text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Mark as currently available for customer ordering</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-amber-950 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-coffee-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {modalMode === 'create' ? 'Save New Item' : 'Update Item Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
