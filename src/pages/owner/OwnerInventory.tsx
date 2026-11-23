import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { useToast } from '../../components/Toast';

export const OwnerInventory: React.FC = () => {
  const { menu, updateItemStock, adjustItemStock } = useCoffee();
  const { success, warning } = useToast();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OK' | 'LOW' | 'OUT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [manualStockVal, setManualStockVal] = useState<string>('');

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'OUT OF STOCK', color: 'bg-red-950/80 text-red-300 border-red-700' };
    if (stock < 10) return { label: 'LOW', color: 'bg-orange-950/80 text-orange-300 border-orange-700' };
    return { label: 'OK', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-700' };
  };

  const handleQuickAdjust = (id: string, delta: number, name: string) => {
    const res = adjustItemStock(id, delta);
    if (res.success) {
      if (delta > 0) {
        success('Stock Adjusted', `Added +${delta} to "${name}".`);
      } else {
        warning('Stock Deducted', `Removed ${Math.abs(delta)} from "${name}".`);
      }
    }
  };

  const handleManualSave = (id: string, name: string) => {
    const num = parseInt(manualStockVal, 10);
    if (isNaN(num) || num < 0) return;
    const res = updateItemStock(id, num);
    if (res.success) {
      success('Stock Updated', `Set "${name}" stock to ${num}.`);
      setEditingStockId(null);
    }
  };

  const handleRestockAllLow = () => {
    let count = 0;
    menu.forEach((item) => {
      if (item.stock < 10) {
        updateItemStock(item.id, item.stock + 15);
        count++;
      }
    });
    success('Inventory Restocked', `Batch restocked ${count} items by +15 units.`);
  };

  const filteredItems = menu.filter((item) => {
    const status = getStockStatus(item.stock).label;
    const matchesFilter =
      statusFilter === 'ALL' ||
      (statusFilter === 'OK' && status === 'OK') ||
      (statusFilter === 'LOW' && status === 'LOW') ||
      (statusFilter === 'OUT' && status === 'OUT OF STOCK');

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const lowCount = menu.filter((m) => m.stock > 0 && m.stock < 10).length;
  const outCount = menu.filter((m) => m.stock === 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-amber-100">Inventory & Bean Supplies</h1>
          <p className="text-xs text-coffee-400">
            Real-time roast bean inventories, batch restock alerts, and stock status categorization.
          </p>
        </div>

        {(lowCount > 0 || outCount > 0) && (
          <button
            onClick={handleRestockAllLow}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restock All Low Items (+15)</span>
          </button>
        )}
      </div>

      {/* Low stock alert banner */}
      {(lowCount > 0 || outCount > 0) && (
        <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-700/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-900/60 border border-orange-600/40 flex items-center justify-center text-orange-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-200">
                Action Required: {lowCount} item(s) below 10 units, {outCount} out of stock.
              </p>
              <p className="text-[11px] text-coffee-400">
                Low inventory can delay morning rush orders. Use the quick controls below to replenish.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-[#190d07] p-4 rounded-2xl border border-amber-900/30">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-amber-600 text-amber-950 font-bold'
                : 'bg-[#24130a] text-coffee-300 hover:text-white'
            }`}
          >
            All Stock ({menu.length})
          </button>
          <button
            onClick={() => setStatusFilter('OK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'OK'
                ? 'bg-emerald-600 text-emerald-950 font-bold'
                : 'bg-[#24130a] text-emerald-400 hover:text-emerald-300'
            }`}
          >
            OK: 10+ ({menu.filter((m) => m.stock >= 10).length})
          </button>
          <button
            onClick={() => setStatusFilter('LOW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'LOW'
                ? 'bg-orange-600 text-orange-950 font-bold'
                : 'bg-[#24130a] text-orange-400 hover:text-orange-300'
            }`}
          >
            LOW: &lt;10 ({lowCount})
          </button>
          <button
            onClick={() => setStatusFilter('OUT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'OUT'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-[#24130a] text-red-400 hover:text-red-300'
            }`}
          >
            OUT OF STOCK ({outCount})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-coffee-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 placeholder:text-coffee-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#190d07] border border-amber-900/30 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-coffee-200">
            <thead className="bg-[#24130a] text-amber-300/80 uppercase font-semibold text-[11px] border-b border-amber-900/30">
              <tr>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Update Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-950/60 bg-[#150a05]">
              {filteredItems.map((item) => {
                const status = getStockStatus(item.stock);
                const isEditing = editingStockId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-amber-950/20 transition-colors">
                    {/* Product Name with thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-amber-900/30 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-amber-100 text-xs">{item.name}</p>
                          <p className="text-[10px] text-coffee-400 font-mono">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-coffee-300 font-medium">
                      {item.category}
                    </td>

                    {/* Current Stock */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={manualStockVal}
                            onChange={(e) => setManualStockVal(e.target.value)}
                            className="w-16 px-2 py-1 bg-[#120703] border border-amber-600 rounded-lg text-xs text-amber-100 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleManualSave(item.id, item.name)}
                            className="px-2 py-1 bg-amber-600 text-amber-950 text-[10px] font-bold rounded-md hover:bg-amber-500"
                          >
                            Set
                          </button>
                          <button
                            onClick={() => setEditingStockId(null)}
                            className="px-1.5 py-1 text-coffee-400 hover:text-white text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingStockId(item.id);
                            setManualStockVal(item.stock.toString());
                          }}
                          className="cursor-pointer hover:underline text-amber-100 inline-flex items-center gap-1"
                          title="Click to directly type stock"
                        >
                          <span>{item.stock}</span>
                          <span className="text-[10px] text-coffee-500 font-sans">units</span>
                        </div>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${status.color}`}
                      >
                        {status.label === 'OK' && <CheckCircle2 className="w-3 h-3" />}
                        {status.label === 'LOW' && <AlertTriangle className="w-3 h-3" />}
                        {status.label === 'OUT OF STOCK' && <XCircle className="w-3 h-3" />}
                        {status.label}
                      </span>
                    </td>

                    {/* Quick Stock Controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1 bg-[#201008] p-1 rounded-xl border border-amber-900/40">
                        {/* -1 button */}
                        <button
                          disabled={item.stock <= 0}
                          onClick={() => handleQuickAdjust(item.id, -1, item.name)}
                          className="w-7 h-7 rounded-lg bg-[#2b160b] hover:bg-amber-900/60 disabled:opacity-40 text-coffee-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                          title="Deduct 1 unit"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        {/* +1 button */}
                        <button
                          onClick={() => handleQuickAdjust(item.id, 1, item.name)}
                          className="w-7 h-7 rounded-lg bg-[#2b160b] hover:bg-amber-700 disabled:opacity-40 text-amber-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                          title="Add 1 unit"
                        >
                          +1
                        </button>

                        {/* +5 button */}
                        <button
                          onClick={() => handleQuickAdjust(item.id, 5, item.name)}
                          className="px-2 h-7 rounded-lg bg-amber-950/80 hover:bg-amber-800 text-amber-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors border border-amber-700/30"
                          title="Add 5 units"
                        >
                          +5
                        </button>

                        {/* +20 button */}
                        <button
                          onClick={() => handleQuickAdjust(item.id, 20, item.name)}
                          className="px-2 h-7 rounded-lg bg-amber-700 hover:bg-amber-600 text-amber-950 flex items-center justify-center text-xs font-extrabold transition-colors shadow-sm"
                          title="Restock 20 units"
                        >
                          +20
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
