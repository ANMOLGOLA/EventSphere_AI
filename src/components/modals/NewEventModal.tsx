import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, DollarSign, Sparkles } from 'lucide-react';
import { EventData, EventType } from '@/types';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: EventData) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('wedding');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('Nov 15, 2025');
  const [guestCount, setGuestCount] = useState('150');
  const [budget, setBudget] = useState('45000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const totalB = Number(budget) || 25000;
    const spentB = Math.round(totalB * 0.45);
    const commB = Math.round(totalB * 0.35);
    const contB = totalB - spentB - commB;

    let theme = {
      primaryColor: '#C57B57',
      secondaryColor: '#F4ECE1',
      accentColor: '#E0A96D',
    };
    let heroImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80';

    if (type === 'birthday') {
      theme = {
        primaryColor: '#F72585',
        secondaryColor: '#EDE9FE',
        accentColor: '#FFB703',
      };
      heroImage = 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80';
    } else if (type === 'gala') {
      theme = {
        primaryColor: '#0F766E',
        secondaryColor: '#F0FDFA',
        accentColor: '#D97706',
      };
      heroImage = '/assets/aistudio/Image_1_1148dfd9.png';
    }

    const newEv: EventData = {
      id: `ev-${Date.now()}`,
      type,
      title,
      location: location || 'Private Estate & Pavilion',
      date,
      daysRemaining: 180,
      readinessScore: 78,
      activeConceptTitle: `${title} Signature Concept`,
      activeConceptDescription: `Curated autonomous styling featuring tactile organic linens, bespoke lighting cues, and elevated culinary pairings for ${guestCount} guests.`,
      heroImage,
      guestCount: Number(guestCount) || 100,
      confirmedGuests: Math.round((Number(guestCount) || 100) * 0.65),
      totalBudget: totalB,
      spentBudget: spentB,
      committedBudget: commB,
      contingencyBudget: contB,
      currency: '$',
      theme,
    };

    onCreateEvent(newEv);
    setTitle('');
    setLocation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <h3 className="font-editorial text-lg font-bold text-stone-900">
            Create New Event Workspace
          </h3>
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
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maya & Julian's Napa Valley Wedding"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Event Celebration Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'wedding', label: '💍 Wedding' },
                { id: 'birthday', label: '🎂 Birthday' },
                { id: 'gala', label: '🎪 Community Gala' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as EventType)}
                  className={`rounded-xl border p-2 text-center font-medium transition ${
                    type === t.id
                      ? 'border-[#9D3E1A] bg-[#F4ECE1] text-[#802A05] font-semibold'
                      : 'border-stone-200 bg-stone-50/70 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Venue Location &amp; City
            </label>
            <input
              type="text"
              placeholder="e.g. Meadowood Estate, St. Helena, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Target Date
              </label>
              <input
                type="text"
                placeholder="Nov 15, 2025"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Target Guest Count
              </label>
              <input
                type="number"
                placeholder="150"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none font-tabular"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Total Budget Cap ($)
            </label>
            <input
              type="number"
              placeholder="45000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none font-tabular"
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
              Launch Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
