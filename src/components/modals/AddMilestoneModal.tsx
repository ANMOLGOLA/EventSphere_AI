import React, { useState } from 'react';
import { X, Calendar, User, Tag } from 'lucide-react';
import { MilestoneItem } from '@/types';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (milestone: Omit<MilestoneItem, 'id'>) => void;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('2 Months Out');
  const [dueDate, setDueDate] = useState('Aug 30, 2025');
  const [assignee, setAssignee] = useState('Sarah & Alex');
  const [category, setCategory] = useState('Guests');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title,
      month,
      dueDate,
      assignee,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      completed: false,
      category,
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-editorial text-lg font-bold text-stone-900">
              Add Production Milestone
            </h3>
            <p className="text-xs text-stone-500">Insert checkpoint to planning roadmap</p>
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
              Milestone Objective *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Finalize tasting menu and sommelier wine pairings"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Roadmap Phase
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              >
                <option value="6 Months Out">6 Months Out</option>
                <option value="5 Months Out">5 Months Out</option>
                <option value="4 Months Out">4 Months Out</option>
                <option value="3 Months Out">3 Months Out</option>
                <option value="2 Months Out">2 Months Out</option>
                <option value="1 Month Out">1 Month Out</option>
                <option value="Week of Event">Week of Event</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Target Due Date
              </label>
              <input
                type="text"
                placeholder="Aug 30, 2025"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Assignee Lead
              </label>
              <input
                type="text"
                placeholder="Elena Rostova (Planner)"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              >
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Photo/Video">Photo/Video</option>
                <option value="Florals & Decor">Florals & Decor</option>
                <option value="Music">Music</option>
                <option value="Guests">Guests</option>
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
              Add Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
