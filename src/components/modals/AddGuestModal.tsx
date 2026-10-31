import React, { useState, useEffect } from 'react';
import { X, UserPlus, Utensils, Mail, Users } from 'lucide-react';
import { GuestItem } from '@/types';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guest: Omit<GuestItem, 'id'>) => void;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [dietary, setDietary] = useState<GuestItem['dietary']>('None');
  const [tableNumber, setTableNumber] = useState('Table 1 (Oceanfront)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      rsvpStatus: 'Confirmed',
      partySize: Number(partySize) || 1,
      dietary,
      tableNumber,
    });

    setName('');
    setEmail('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-guest-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 id="add-guest-modal-title" className="font-editorial text-lg font-bold text-stone-900">
              Add Attendee / VIP Guest
            </h3>
            <p className="text-xs text-stone-500">Record RSVP and table allocation</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="focus-visible:ring-2 focus-visible:ring-[#9D3E1A] p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Guest or Household Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Alistair & Mei Finch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="finch@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Party Size
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none font-tabular"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Dietary Preference
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value as GuestItem['dietary'])}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              >
                <option value="None">None (Standard)</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Halal">Halal</option>
                <option value="Dairy-Free">Dairy-Free</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Table Assignment
              </label>
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              >
                <option value="Table 1 (Oceanfront)">Table 1 (Oceanfront)</option>
                <option value="Table 2 (Cypress)">Table 2 (Cypress)</option>
                <option value="Table 3 (Bluff)">Table 3 (Bluff)</option>
                <option value="Table 4 (Meadow)">Table 4 (Meadow)</option>
                <option value="Honor Dais">Honor Dais</option>
                <option value="Unassigned">Unassigned</option>
              </select>
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
              Confirm Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
