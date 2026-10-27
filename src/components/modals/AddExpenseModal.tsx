import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Building, CheckCircle2 } from 'lucide-react';
import { BudgetItem } from '@/types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<BudgetItem, 'id'>) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<BudgetItem['category']>('Catering');
  const [budgeted, setBudgeted] = useState('');
  const [actual, setActual] = useState('');
  const [status, setStatus] = useState<BudgetItem['status']>('Pending');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      vendor: vendor || 'Unassigned Partner',
      category,
      budgeted: Number(budgeted) || 0,
      actual: Number(actual) || Number(budgeted) || 0,
      status,
      receiptAttached: false,
    });

    setName('');
    setVendor('');
    setBudgeted('');
    setActual('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-expense-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <h3 id="add-expense-modal-title" className="font-editorial text-lg font-bold text-stone-900">
            Add New Expense / Commitment
          </h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition focus-visible:ring-2 focus-visible:ring-[#9D3E1A]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Item or Service Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acoustic Trio Cocktail Music"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Vendor / Supplier
            </label>
            <input
              type="text"
              placeholder="e.g. Pacific Sunset Strings"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BudgetItem['category'])}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              >
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Photo/Video">Photo/Video</option>
                <option value="Florals & Decor">Florals &amp; Decor</option>
                <option value="Music & Sound">Music &amp; Sound</option>
                <option value="Attire & Beauty">Attire &amp; Beauty</option>
                <option value="Production">Production</option>
                <option value="Contingency">Contingency</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Payment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BudgetItem['status'])}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Budgeted Amount ($)
              </label>
              <input
                type="number"
                placeholder="2500"
                value={budgeted}
                onChange={(e) => setBudgeted(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none font-tabular"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Actual Cost ($)
              </label>
              <input
                type="number"
                placeholder="2100"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none font-tabular"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2 text-stone-600 hover:bg-stone-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#9D3E1A] px-4 py-2 font-semibold text-white shadow-xs hover:bg-[#802A05] transition"
            >
              Add to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
