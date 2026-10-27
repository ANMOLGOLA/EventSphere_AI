import React, { useState, useMemo, useCallback } from 'react';
import {
  Wallet,
  Sparkles,
  CheckCircle2,
  FileText,
  Upload,
  Plus,
  Search,
  Sliders,
  Check,
  TrendingDown,
} from 'lucide-react';
import { BudgetItem, EventData } from '@/types';
import {
  calculateBudgetMetrics,
  calculateCategoryBreakdown,
  formatCurrency,
} from '@/utils/budget';

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
  const [guestCountSim, setGuestCountSim] = useState(activeEvent.guestCount || 180);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Deterministic pure calculation via useMemo
  const metrics = useMemo(
    () => calculateBudgetMetrics(activeEvent.totalBudget, budgetItems),
    [activeEvent.totalBudget, budgetItems]
  );

  // 2. Multi-category breakdown for progress bar
  const categories = useMemo(
    () => calculateCategoryBreakdown(budgetItems, activeEvent.totalBudget),
    [budgetItems, activeEvent.totalBudget]
  );

  // 3. Simulator multipliers
  const baseGuestCount = activeEvent.guestCount || 180;
  const simMultiplier = guestCountSim / (baseGuestCount || 1);
  const simCatering = Math.round(metrics.spent * 0.42 * simMultiplier);
  const simProduction = Math.round(metrics.spent * 0.28 * (0.8 + 0.2 * simMultiplier));

  // 4. Filtered ledger with memoization
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return budgetItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.vendor.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [budgetItems, selectedCategory, searchQuery]);

  // 5. Stable callbacks
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="space-y-6">
      {/* Real-time Stat Cards: Total, Spent, Committed, Contingency */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total Budget
            </span>
            <span className="rounded-full bg-[#F4ECE1] px-2 py-0.5 text-[10px] font-semibold text-[#802A05]">
              Target Cap
            </span>
          </div>
          <h3
            data-testid="budget-total"
            className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-tabular"
          >
            {formatCurrency(metrics.total, activeEvent.currency)}
          </h3>
          <p className="text-xs text-[#9D3E1A] font-semibold mt-1">100% Allocated Pool</p>
        </div>

        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Spent
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
              Paid Actuals
            </span>
          </div>
          <h3
            data-testid="budget-spent"
            className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-tabular"
          >
            {formatCurrency(metrics.spent, activeEvent.currency)}
          </h3>
          <p className="text-xs text-stone-600 font-medium mt-1">
            {metrics.total > 0 ? Math.round((metrics.spent / metrics.total) * 100) : 0}% Utilized
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Committed
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              Pending / Due
            </span>
          </div>
          <h3
            data-testid="budget-committed"
            className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-tabular"
          >
            {formatCurrency(metrics.committed, activeEvent.currency)}
          </h3>
          <p className="text-xs text-amber-800 font-medium mt-1">
            In negotiation &amp; signed
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Contingency
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
              Liquid Cushion
            </span>
          </div>
          <h3
            data-testid="budget-contingency"
            className="font-editorial text-2xl sm:text-3xl font-bold text-emerald-800 mt-1 font-tabular"
          >
            {formatCurrency(metrics.contingency, activeEvent.currency)}
          </h3>
          <p className="text-xs text-stone-600 font-medium mt-1">
            {optimizationApplied ? '+$950 AI Savings Added' : 'Unallocated Buffer'}
          </p>
        </div>
      </div>

      {/* Multi-Category Segmented Progress Bar */}
      <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="font-editorial text-base font-bold text-stone-900">
              Multi-Category Segmented Allocation
            </h4>
            <p className="text-xs text-stone-500">
              Proportional distribution mapped to vendor and production requirements
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-600 font-tabular">
            Active Total: {formatCurrency(metrics.total, activeEvent.currency)}
          </span>
        </div>

        {/* Multi-segment ARIA compliant bar */}
        <div
          role="progressbar"
          aria-label="Multi-category event expense breakdown"
          aria-valuenow={metrics.total > 0 ? Math.round(((metrics.spent + metrics.committed) / metrics.total) * 100) : 0}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-3.5 w-full overflow-hidden rounded-full bg-stone-100 flex p-0.5 ring-1 ring-stone-200/50"
        >
          {categories.map((cat) => (
            <div
              key={cat.category}
              className={`${cat.color} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${cat.percent}%` }}
              title={`${cat.category}: ${formatCurrency(cat.amount, activeEvent.currency)} (${cat.percent}%)`}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs">
          {categories.map((cat) => (
            <div key={cat.category} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`} aria-hidden="true" />
              <span className="font-medium text-stone-700">{cat.category}</span>
              <span className="font-tabular text-stone-400 font-semibold">{cat.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Expense Simulator & Proactive AI Cost-Saving Recommendation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Slider (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#F4ECE1] text-[#9D3E1A]">
                <Sliders className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-editorial text-base font-bold text-stone-900">
                  Interactive Headcount &amp; Budget Simulator
                </h4>
                <p className="text-xs text-stone-500">
                  Dynamic sensitivity analysis across catering, bar packages, and rentals
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
              <span>400 Guests (Grand)</span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              value={guestCountSim}
              aria-label="Simulate guest headcount"
              onChange={(e) => setGuestCountSim(Number(e.target.value))}
              className="w-full accent-[#9D3E1A] h-2 bg-stone-200 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C57B57]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F5] p-4">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Simulated Catering &amp; Bar
              </span>
              <p className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 mt-1 font-tabular">
                {formatCurrency(simCatering, activeEvent.currency)}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {(simMultiplier * 100).toFixed(0)}% of baseline dining allocation
              </p>
            </div>

            <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F5] p-4">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Simulated Rentals &amp; Staff
              </span>
              <p className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 mt-1 font-tabular">
                {formatCurrency(simProduction, activeEvent.currency)}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Includes service labor, linens, and table ware
              </p>
            </div>
          </div>
        </div>

        {/* Interactive AI Cost-Saving Recommendation Card with [Apply Optimization] Button */}
        <div className="rounded-2xl border border-[#C57B57]/40 bg-gradient-to-br from-[#FDFBF7] to-[#F4ECE1]/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9D3E1A] text-white shadow-xs">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-editorial text-base font-bold text-stone-900">
                  AI Cost-Saving Suggestion
                </h4>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  Autonomous Optimization
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
              Switching floral centerpieces to locally sourced Big Sur dried botanicals &amp; in-season eucalyptus saves{' '}
              <span className="font-bold text-[#802A05]">$950</span>, funding your evening acoustic guitarist without diminishing visual grandeur.
            </p>

            {optimizationApplied && (
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-100/90 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Optimization applied! $950 shifted to Contingency Cushion.</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              data-testid="btn-apply-optimization"
              onClick={onApplyOptimization}
              disabled={optimizationApplied}
              className={`w-full rounded-xl py-2.5 text-xs font-semibold transition active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C57B57] focus-visible:ring-offset-2 cursor-pointer ${
                optimizationApplied
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed shadow-none'
                  : 'bg-[#9D3E1A] text-white shadow-sm hover:bg-[#802A05]'
              }`}
            >
              {optimizationApplied ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Optimization Applied
                </span>
              ) : (
                'Apply Optimization'
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenCopilotWithPrompt(
                  'Explore 3 alternative budget optimizations for catering, photography, and floral packages without sacrificing guest experience.'
                )
              }
              className="w-full rounded-xl border border-stone-200 bg-white py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C57B57] cursor-pointer"
            >
              Explore Alternatives
            </button>
          </div>
        </div>
      </div>

      {/* Itemized Expense Table with Status Badges */}
      <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 p-5">
          <div>
            <h4 className="font-editorial text-lg font-bold text-stone-900">
              Itemized Expense Ledger
            </h4>
            <p className="text-xs text-stone-500">
              Track vendor invoices, payment status badges, and verified receipts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search ledger expenses"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="rounded-xl border border-stone-200 bg-stone-50/70 pl-8 pr-3 py-1.5 text-xs text-stone-800 focus:border-[#9D3E1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C57B57]"
              />
            </div>

            <select
              aria-label="Filter expenses by category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-1.5 text-xs text-stone-700 focus:border-[#9D3E1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C57B57]"
            >
              <option value="All">All Categories</option>
              <option value="Venue">Venue</option>
              <option value="Catering">Catering</option>
              <option value="Photo/Video">Photo/Video</option>
              <option value="Florals & Decor">Florals &amp; Decor</option>
              <option value="Music & Sound">Music &amp; Sound</option>
              <option value="Attire & Beauty">Attire &amp; Beauty</option>
              <option value="Contingency">Contingency</option>
            </select>

            <button
              type="button"
              onClick={onAddExpense}
              className="flex items-center gap-1.5 rounded-xl bg-[#9D3E1A] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#802A05] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C57B57] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-100 bg-[#FBF9F5] text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <th scope="col" className="py-3 px-5">Item &amp; Description</th>
                <th scope="col" className="py-3 px-4">Vendor Partner</th>
                <th scope="col" className="py-3 px-4">Category</th>
                <th scope="col" className="py-3 px-4 text-right">Budgeted</th>
                <th scope="col" className="py-3 px-4 text-right">Actual Cost</th>
                <th scope="col" className="py-3 px-4 text-center">Status</th>
                <th scope="col" className="py-3 px-5 text-right">Receipt</th>
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
                    {formatCurrency(item.budgeted, activeEvent.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-tabular font-bold text-stone-900">
                    {formatCurrency(item.actual, activeEvent.currency)}
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
                      type="button"
                      onClick={() => onToggleReceipt(item.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C57B57] cursor-pointer ${
                        item.receiptAttached
                          ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          : 'border border-dashed border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-800'
                      }`}
                      aria-label={
                        item.receiptAttached
                          ? `Receipt attached for ${item.name}. Click to remove.`
                          : `Upload receipt for ${item.name}.`
                      }
                      title={
                        item.receiptAttached
                          ? 'Receipt Verified (Click to toggle)'
                          : 'Upload Receipt PDF/Image'
                      }
                    >
                      {item.receiptAttached ? (
                        <>
                          <FileText className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                          <span>Attached</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3 w-3" aria-hidden="true" />
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
