import React, { useState } from 'react';
import {
  Users,
  Search,
  GraduationCap,
  ShoppingBag,
  ExternalLink,
  X,
  Mail,
  Phone,
  Calendar,
  Clock
} from 'lucide-react';
import { getStoredAccounts } from '../../services/storage';
import { useCoffee } from '../../context/CoffeeContext';
import { User, Order } from '../../types';

export const OwnerCustomers: React.FC = () => {
  const { orders } = useCoffee();
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedCustomer, setInspectedCustomer] = useState<User | null>(null);

  // Retrieve actual registered customer accounts collected by application
  const storedAccounts = getStoredAccounts();
  const customers = storedAccounts
    .filter((a) => a.user.role === 'CUSTOMER')
    .map((a) => a.user);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCustomerOrders = (userId: string, email: string): Order[] => {
    return orders.filter(
      (o) => o.customerId === userId || o.customerEmail.toLowerCase() === email.toLowerCase()
    );
  };

  const inspectedOrders = inspectedCustomer
    ? getCustomerOrders(inspectedCustomer.id, inspectedCustomer.email)
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-amber-100">Registered Customer Roster</h1>
          <p className="text-xs text-coffee-400">
            Secure directory of patron accounts and their verified order transaction history.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-coffee-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 placeholder:text-coffee-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Customer Cards & Table */}
      <div className="bg-[#190d07] border border-amber-900/30 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-coffee-200">
            <thead className="bg-[#24130a] text-amber-300/80 uppercase text-[11px] font-semibold border-b border-amber-900/30">
              <tr>
                <th className="py-3.5 px-4">Patron Details</th>
                <th className="py-3.5 px-4">Customer Type</th>
                <th className="py-3.5 px-4">Member Since</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4 text-right">Order History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-950/60 bg-[#150a05]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-coffee-500">
                    No registered customers match your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const custOrders = getCustomerOrders(customer.id, customer.email);
                  const totalSpent = custOrders
                    .filter((o) => o.status !== 'Cancelled')
                    .reduce((sum, o) => sum + o.total, 0);

                  return (
                    <tr key={customer.id} className="hover:bg-amber-950/20 transition-colors">
                      {/* Patron Details with Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 border border-amber-500/30 flex items-center justify-center font-bold text-amber-200 text-sm shadow-md shrink-0">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-amber-100 text-xs">{customer.name}</p>
                            <p className="text-[11px] text-coffee-400 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-coffee-500" />
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Customer Type Badge */}
                      <td className="py-4 px-4">
                        {customer.customerType === 'STUDENT' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                            <GraduationCap className="w-3 h-3" />
                            <span>Student ({customer.studentId || 'Verified'})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-coffee-800/40 border border-coffee-700/30 text-coffee-300 text-[10px] font-semibold">
                            <Users className="w-3 h-3" />
                            <span>Regular Patron</span>
                          </span>
                        )}
                      </td>

                      {/* Member Since */}
                      <td className="py-4 px-4 text-coffee-400">
                        {new Date(customer.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Orders Count */}
                      <td className="py-4 px-4 font-mono font-bold text-amber-200">
                        {custOrders.length} orders
                      </td>

                      {/* Lifetime Spend */}
                      <td className="py-4 px-4 font-mono font-bold text-emerald-400 text-sm">
                        ${totalSpent.toFixed(2)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setInspectedCustomer(customer)}
                          className="px-3 py-1.5 rounded-xl bg-[#23120a] hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>View History ({custOrders.length})</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order History Inspection Modal */}
      {inspectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md">
          <div className="bg-[#1c0f08] border border-amber-800/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-coffee-100 shadow-2xl animate-scale-up max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-700/60 flex items-center justify-center text-amber-200 font-bold text-base">
                  {inspectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-amber-100">
                    {inspectedCustomer.name}
                  </h3>
                  <p className="text-xs text-coffee-400">{inspectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectedCustomer(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-coffee-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - List of Orders */}
            <div className="py-4 overflow-y-auto space-y-3 flex-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Lifetime Orders Archive ({inspectedOrders.length})
              </h4>

              {inspectedOrders.length === 0 ? (
                <div className="py-8 text-center text-xs text-coffee-500">
                  This customer has not completed any orders yet.
                </div>
              ) : (
                inspectedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-[#120703] border border-amber-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-200 text-sm">
                          {ord.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                          {ord.token}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-100">
                        ${ord.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-coffee-400">
                      <span>Status: <strong className="text-amber-300">{ord.status}</strong></span>
                      <span>Counter: {ord.pickupCounter}</span>
                      <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-2 border-t border-amber-950/60 text-xs text-coffee-300 space-y-1">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{it.quantity}x {it.productName}</span>
                          <span className="font-mono text-coffee-400">${(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-amber-950 flex justify-end">
              <button
                onClick={() => setInspectedCustomer(null)}
                className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold transition-colors"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
