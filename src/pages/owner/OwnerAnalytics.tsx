import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Sparkles,
  PieChart as PieIcon,
  Award,
  GraduationCap,
  Users,
  Calendar
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';

export const OwnerAnalytics: React.FC = () => {
  const { stats, orders, menu } = useCoffee();

  // Aggregate product sales from actual orders
  const productSalesMap: Record<
    string,
    { name: string; quantity: number; revenue: number; category: string }
  > = {};

  orders.forEach((o) => {
    if (o.status === 'Cancelled') return;
    o.items.forEach((item) => {
      if (!productSalesMap[item.productName]) {
        const productDef = menu.find((m) => m.name === item.productName);
        productSalesMap[item.productName] = {
          name: item.productName,
          quantity: 0,
          revenue: 0,
          category: productDef?.category || 'Coffee'
        };
      }
      productSalesMap[item.productName].quantity += item.quantity;
      productSalesMap[item.productName].revenue += item.price * item.quantity;
    });
  });

  const productSalesList = Object.values(productSalesMap).sort(
    (a, b) => b.revenue - a.revenue
  );

  // Category sales breakdown
  const categorySalesMap: Record<string, number> = {};
  productSalesList.forEach((p) => {
    categorySalesMap[p.category] = (categorySalesMap[p.category] || 0) + p.revenue;
  });

  const totalSalesRevenue = Object.values(categorySalesMap).reduce(
    (sum, val) => sum + val,
    0
  );

  // Student vs Regular orders
  const studentOrders = orders.filter((o) => o.customerType === 'STUDENT' && o.status !== 'Cancelled');
  const regularOrders = orders.filter((o) => o.customerType === 'REGULAR' && o.status !== 'Cancelled');

  const studentRev = studentOrders.reduce((sum, o) => sum + o.total, 0);
  const regularRev = regularOrders.reduce((sum, o) => sum + o.total, 0);
  const totalCombined = studentOrders.length + regularOrders.length || 1;
  const studentPercent = Math.round((studentOrders.length / totalCombined) * 100);
  const regularPercent = 100 - studentPercent;

  // Daily timeline (last 5 days derived from orders)
  const daysMap: Record<string, { label: string; count: number; revenue: number }> = {};
  for (let i = 4; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    daysMap[dateKey] = { label, count: 0, revenue: 0 };
  }

  orders.forEach((o) => {
    if (o.status === 'Cancelled') return;
    const dateKey = o.createdAt.split('T')[0];
    if (daysMap[dateKey]) {
      daysMap[dateKey].count += 1;
      daysMap[dateKey].revenue += o.total;
    }
  });

  const timelineDays = Object.values(daysMap);
  const maxDayRevenue = Math.max(...timelineDays.map((d) => d.revenue), 20);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-amber-100">Sales Intelligence & Analytics</h1>
        <p className="text-xs text-coffee-400">
          Computed from active customer transactions, item sales volume, and customer segment metrics.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#1c0f08] border border-amber-900/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-coffee-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-emerald-300">
              ${stats.totalRevenue.toFixed(2)}
            </span>
            <p className="text-[11px] text-coffee-400 mt-1">Excludes cancelled orders</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#1c0f08] border border-amber-900/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-coffee-400">Total Volume</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800/40">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-amber-100">
              {stats.totalOrders}
            </span>
            <p className="text-[11px] text-coffee-400 mt-1">Completed & in-progress</p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-2xl bg-[#1c0f08] border border-amber-900/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-coffee-400">Average Ticket</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-800/40">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-blue-300">
              ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
            </span>
            <p className="text-[11px] text-coffee-400 mt-1">Average spent per ticket</p>
          </div>
        </div>

        {/* Most Popular Product */}
        <div className="p-5 rounded-2xl bg-[#1c0f08] border border-amber-900/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-coffee-400">Top Seller</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-950 text-yellow-400 flex items-center justify-center border border-yellow-800/40">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-sm font-serif font-bold text-amber-200 line-clamp-1">
              {stats.mostPopularProduct}
            </span>
            <p className="text-[11px] text-amber-400 mt-1 font-semibold">
              ★ Customer Favorite
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Sales Overview Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#190d07] border border-amber-900/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Daily Sales Timeline
              </h2>
              <p className="text-xs text-coffee-400">Revenue activity across recent store days</p>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-amber-950">
            {timelineDays.map((day, idx) => {
              const heightPercent = Math.max(12, Math.round((day.revenue / maxDayRevenue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-espresso-950 border border-amber-600/40 text-amber-200 px-2 py-1 rounded-md mb-2 shadow-lg pointer-events-none text-center whitespace-nowrap">
                    ${day.revenue.toFixed(2)} ({day.count} orders)
                  </div>
                  
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-amber-800 to-amber-500 group-hover:from-amber-600 group-hover:to-yellow-400 transition-all duration-300 relative shadow-md shadow-amber-950"
                  >
                    <div className="absolute top-1 inset-x-0 mx-auto w-3/4 h-1 bg-white/30 rounded-full" />
                  </div>

                  {/* Day label */}
                  <span className="text-[11px] font-medium text-coffee-400 mt-2 text-center truncate max-w-full">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-coffee-400">
            <span>Peak Day: ${maxDayRevenue.toFixed(2)}</span>
            <span className="text-amber-400 font-mono font-semibold">Active Rolling Window</span>
          </div>
        </div>

        {/* Student vs Regular Customer Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-[#190d07] border border-amber-900/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Customer Demographics
            </h2>
            <p className="text-xs text-coffee-400">Student vs Regular customer orders breakdown</p>

            {/* Ratio visualization progress bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-400" /> Students ({studentPercent}%)
                </span>
                <span className="text-coffee-300">
                  Regular Patrons ({regularPercent}%)
                </span>
              </div>

              <div className="h-4 w-full bg-[#120703] rounded-full overflow-hidden flex border border-amber-900/40 p-0.5">
                <div
                  style={{ width: `${studentPercent}%` }}
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-l-full transition-all duration-500"
                />
                <div
                  style={{ width: `${regularPercent}%` }}
                  className="h-full bg-gradient-to-r from-coffee-700 to-coffee-500 rounded-r-full transition-all duration-500"
                />
              </div>
            </div>

            {/* Metric Comparison Cards */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3.5 rounded-2xl bg-[#120703] border border-amber-900/30">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student Orders</span>
                </div>
                <div className="text-xl font-bold font-mono text-amber-100">{studentOrders.length}</div>
                <div className="text-[10px] text-emerald-400 mt-1">${studentRev.toFixed(2)} generated</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#120703] border border-amber-900/30">
                <div className="flex items-center gap-2 text-coffee-300 text-xs font-semibold mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Regular Orders</span>
                </div>
                <div className="text-xl font-bold font-mono text-amber-100">{regularOrders.length}</div>
                <div className="text-[10px] text-emerald-400 mt-1">${regularRev.toFixed(2)} generated</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-950 text-[11px] text-coffee-400">
            Perk: 10% student discount applied with valid scholar badge.
          </div>
        </div>
      </div>

      {/* Category Performance & Product Sales Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Bars (5 cols) */}
        <div className="lg:col-span-5 bg-[#190d07] border border-amber-900/30 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-serif font-bold text-amber-100 mb-1">Sales by Category</h2>
          <p className="text-xs text-coffee-400 mb-6">Revenue share by drink and food classification</p>

          <div className="space-y-4">
            {Object.entries(categorySalesMap).map(([cat, rev]) => {
              const pct = totalSalesRevenue > 0 ? Math.round((rev / totalSalesRevenue) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-amber-100">{cat}</span>
                    <span className="font-mono text-amber-300">${rev.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-[#120703] rounded-full overflow-hidden border border-amber-900/30">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-amber-700 to-amber-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Performance Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#190d07] border border-amber-900/30 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-serif font-bold text-amber-100 mb-1">Product Sales Volume</h2>
          <p className="text-xs text-coffee-400 mb-4">Units dispensed and gross earnings per beverage</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-coffee-200">
              <thead className="bg-[#24130a] text-amber-300/80 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Units Sold</th>
                  <th className="py-2.5 px-3">Revenue</th>
                  <th className="py-2.5 px-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-950/60">
                {productSalesList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-coffee-500">
                      No products sold yet.
                    </td>
                  </tr>
                ) : (
                  productSalesList.map((p, idx) => {
                    const share = totalSalesRevenue > 0 ? Math.round((p.revenue / totalSalesRevenue) * 100) : 0;
                    return (
                      <tr key={idx} className="hover:bg-amber-950/20">
                        <td className="py-3 px-3 font-semibold text-amber-100">
                          {p.name}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-amber-300">
                          {p.quantity} cups
                        </td>
                        <td className="py-3 px-3 font-mono text-emerald-400">
                          ${p.revenue.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-coffee-400">
                          {share}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
