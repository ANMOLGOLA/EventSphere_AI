import React, { useState } from 'react';
import { X, Clock, MapPin, User, FileText } from 'lucide-react';
import { RunOfShowItem } from '@/types';

interface AddRunOfShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<RunOfShowItem, 'id'>) => void;
}

export const AddRunOfShowModal: React.FC<AddRunOfShowModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [time, setTime] = useState('07:30 PM');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Ocean Cliff Pavilion');
  const [leadPerson, setLeadPerson] = useState('Elena (Lead Coordinator)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      time,
      durationMinutes: Number(durationMinutes) || 30,
      title,
      location: location || 'Main Stage',
      notes: notes || 'Standard cue sequence verified by production lead.',
      leadPerson: leadPerson || 'Coordinator',
      status: 'Upcoming',
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-editorial text-lg font-bold text-stone-900">
              Add Day-of Cue Block
            </h3>
            <p className="text-xs text-stone-500">Insert minute-level timeline event</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Cue Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sunset Champagne Toast & Cake Cutting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Start Time
              </label>
              <input
                type="text"
                placeholder="07:30 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none font-tabular"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                placeholder="45"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none font-tabular"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Venue Location / Zone
              </label>
              <input
                type="text"
                placeholder="Ocean Lawn Pavilion"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Lead Person / Cue Owner
              </label>
              <input
                type="text"
                placeholder="Elena (Planner)"
                value={leadPerson}
                onChange={(e) => setLeadPerson(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Production Cues &amp; Technical Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Dim chandeliers to 30%, spot lighting centered on bride & groom, acoustic strings segue into crescendo."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none resize-none"
            />
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
              Add Cue Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
