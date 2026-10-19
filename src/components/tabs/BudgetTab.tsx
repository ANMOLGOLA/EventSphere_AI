import React, { useState } from 'react';
import {
  Wallet,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Plus,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { BudgetItem, EventData } from '../../types';

interface BudgetTabProps {
  activeEvent: EventData;
  budgetItems: BudgetItem[];
  onAddExpense: () => void;
  onApplyOptimization: () => void;
  optimizationApplied: boolean;
  onOpenCopilotWithPrompt: (prompt: string) => void;
  onToggleReceipt: (id: string) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  activeEvent,
  budgetItems,
  onAddExpense,
  onApplyOptimization,
  optimizationApplied,
  onOpenCopilotWithPrompt,
  onToggleReceipt,
}) => {
  const [guestCountSim, setGuestCountSim] = useState(activeEvent.guestCount);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate totals
  const totalBudget = activeEvent.totalBudget;
  const totalSpent = budgetItems.reduce((acc, item) => acc + item.actual, 0);
  const totalBudgeted = budgetItems.reduce((acc, item) => acc + item.budgeted, 0);
  const remainingContingency = totalBudget - totalSpent;

  // Simulator multipliers
  const baseGuestCount = activeEvent.guestCount || 180;
  const simMultiplier = guestCountSim / baseGuestCount;
  const simCatering = Math.round((totalSpent * 0.42) * simMultiplier);
  const simProduction = Math.round((totalSpent * 0.28) * (0.8 + 0.2 * simMultiplier));

  // Category breakdown
  const categories = [
    { name: 'Venue', percent: 42, color: 'bg-[#9D3E1A]' },
    { name: 'Catering', percent: 28, color: 'bg-[#C57B57]' },
    { name: 'Photo/Video', percent: 15, color: 'bg-[#E0A96D]' },
    { name: 'Florals & Decor', percent: 10, color: 'bg-[#776B5D]' },
    { name: 'Contingency', percent: 5, color: 'bg-emerald-600' },
  ];

  const filteredItems = budgetItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Total Allocated
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {formatCurrency(totalBudget)}
          </h3>
          <p className="text-xs text-[#9D3E1A] font-semibold mt-1">100% Target Pool</p>
        </div>

        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Committed / Spent
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {formatCurrency(totalSpent)}
          </h3>
          <p className="text-xs text-stone-600 font-medium mt-1">
            {Math.round((totalSpent / totalBudget) * 100)}% Utilized
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            AI Projected Savings
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
            {optimizationApplied ? '+$950 Saved' : '+$950 Identified'}
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {optimizationApplied ? 'Optimization Active' : 'Via Seasonal Bloom Swap'}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Remaining Contingency
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {formatCurrency(remainingContingency)}
          </h3>
          <p className="text-xs text-stone-600 font-medium mt-1">Unallocated Cushion</p>
        </div>
      </div>

      {/* Visual Multi-Segment Category Bar */}
      <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="font-editorial text-base font-bold text-stone-900">
              Budget Distribution Allocation
            </h4>
            <p className="text-xs text-stone-500">
              Target percentages calibrated to high-end event production benchmarks
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-600">
            Total Cap: {formatCurrency(totalBudget)}
          </span>
        </div>

        {/* Multi-segment colored bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100 flex">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`${cat.color} h-full transition-all duration-500`}
              style={{ width: `${cat.percent}%` }}
              title={`${cat.name}: ${cat.percent}%`}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`} />
              <span className="font-medium text-stone-700">{cat.name}</span>
              <span className="font-tabular text-stone-400 font-semibold">{cat.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Expense Simulator & Proactive AI Optimization Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Slider (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#F4ECE1] text-[#9D3E1A]">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-editorial text-base font-bold text-stone-900">
                  Interactive Expense Simulator
                </h4>
                <p className="text-xs text-stone-500">
                  Simulate live food & beverage and production cost variance by guest head-count
                </p>
              </div>
            </div>
            <span className="font-tabular text-sm font-bold text-[#9D3E1A] bg-[#F4ECE1] px-3 py-1 rounded-full">
              {guestCountSim} Attendees
            </span>
          </div>

          <div className="my-5">
            <div className="flex justify-between text-xs font-medium text-stone-500 mb-2">
              <span>50 Guests (Intimate)</span>
              <span>Baseline: {activeEvent.guestCount} Guests</span>
              <span>400 Guests (Extended)</span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              value={guestCountSim}
              onChange={(e) => setGuestCountSim(Number(e.target.value))}
              className="w-full accent-[#9D3E1A] h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F5] p-4">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Simulated Catering & Bar
              </span>
              <p className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                {formatCurrency(simCatering)}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {(simMultiplier * 100).toFixed(0)}% of baseline dining allocation
              </p>
            </div>

            <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F5] p-4">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Simulated Production & Staff
              </span>
              <p className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                {formatCurrency(simProduction)}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Includes rentals, table runners, and service labor
              </p>
            </div>
          </div>
        </div>

        {/* Proactive AI Optimization Card */}
        <div className="rounded-2xl border border-[#C57B57]/40 bg-gradient-to-br from-[#FDFBF7] to-[#F4ECE1]/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9D3E1A] text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <h4 className="font-editorial text-base font-bold text-stone-900">
                AI Cost-Saving Suggestion
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
              Switching table florals to in-season marigolds and eucalyptus saves{' '}
              <span className="font-bold text-[#802A05]">$950</span>, fully funding your
              acoustic guitarist while elevating textural warmth.
            </p>

            {optimizationApplied && (
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-100/80 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Optimization applied to active ledger</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={onApplyOptimization}
              disabled={optimizationApplied}
              className={`w-full rounded-xl py-2.5 text-xs font-semibold transition active:scale-98 ${
                optimizationApplied
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  : 'bg-[#9D3E1A] text-white shadow-xs hover:bg-[#802A05]'
              }`}
            >
              {optimizationApplied ? 'Optimization Applied' : 'Apply Optimization'}
            </button>
            <button
              onClick={() =>
                onOpenCopilotWithPrompt(
                  'Explore 3 alternative budget optimizations for catering and rentals without sacrificing guest experience.'
                )
              }
              className="w-full rounded-xl border border-stone-200 bg-white py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              Explore Alternatives
            </button>
          </div>
        </div>
      </div>

      {/* Itemized Ledger Table */}
      <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 p-5">
          <div>
            <h4 className="font-editorial text-lg font-bold text-stone-900">
              Itemized Ledger & Commitments
            </h4>
            <p className="text-xs text-stone-500">
              Track vendor invoices, payment milestones, and verified receipt attachments
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-stone-200 bg-stone-50/70 pl-8 pr-3 py-1.5 text-xs text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-1.5 text-xs text-stone-700 focus:border-[#9D3E1A] focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Venue">Venue</option>
              <option value="Catering">Catering</option>
              <option value="Photo/Video">Photo/Video</option>
              <option value="Florals & Decor">Florals & Decor</option>
              <option value="Music & Sound">Music & Sound</option>
              <option value="Attire & Beauty">Attire & Beauty</option>
              <option value="Contingency">Contingency</option>
            </select>

            <button
              onClick={onAddExpense}
              className="flex items-center gap-1.5 rounded-xl bg-[#9D3E1A] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#802A05] transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-100 bg-[#FBF9F5] text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-3 px-5">Item & Description</th>
                <th className="py-3 px-4">Vendor Partner</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Budgeted</th>
                <th className="py-3 px-4 text-right">Actual Cost</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-stone-50/60 transition-colors"
                >
                  <td className="py-3.5 px-5 font-semibold text-stone-900">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">{item.vendor}</td>
                  <td className="py-3.5 px-4">
                    <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-tabular text-stone-500">
                    {formatCurrency(item.budgeted)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-tabular font-bold text-stone-900">
                    {formatCurrency(item.actual)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onToggleReceipt(item.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                        item.receiptAttached
                          ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          : 'border border-dashed border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-800'
                      }`}
                      title={
                        item.receiptAttached
                          ? 'Receipt Verified (Click to toggle)'
                          : 'Upload Receipt PDF/Image'
                      }
                    >
                      {item.receiptAttached ? (
                        <>
                          <FileText className="h-3 w-3 text-emerald-600" />
                          <span>Attached</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3 w-3" />
                          <span>Upload</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-stone-500">
                    No budget items found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
