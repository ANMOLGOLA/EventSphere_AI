import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Plus,
  Search,
  Utensils,
  Mail,
  UserCheck,
  Grid,
  List,
  MapPin,
  Check,
} from 'lucide-react';
import { GuestItem, EventData } from '../../types';

interface GuestsTabProps {
  activeEvent: EventData;
  guests: GuestItem[];
  onToggleStatus: (id: string, newStatus: 'Confirmed' | 'Awaiting' | 'Declined') => void;
  onAddGuest: () => void;
  onOpenCopilotWithPrompt: (prompt: string) => void;
}

export const GuestsTab: React.FC<GuestsTabProps> = ({
  activeEvent,
  guests,
  onToggleStatus,
  onAddGuest,
  onOpenCopilotWithPrompt,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Awaiting' | 'Declined'>('All');

  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;
  const awaitingCount = guests.filter((g) => g.rsvpStatus === 'Awaiting').length;
  const declinedCount = guests.filter((g) => g.rsvpStatus === 'Declined').length;

  const dietaryCounts = guests.reduce((acc, g) => {
    if (g.dietary !== 'None') {
      acc[g.dietary] = (acc[g.dietary] || 0) + g.partySize;
    }
    return acc;
  }, {} as Record<string, number>);

  const filteredGuests = guests.filter((g) => {
    const matchesStatus = statusFilter === 'All' || g.rsvpStatus === statusFilter;
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Unique tables
  const knownTables = [
    'Table 1 (Oceanfront)',
    'Table 2 (Cypress)',
    'Table 3 (Bluff)',
    'Table 4 (Meadow)',
    'Honor Dais',
  ];

  return (
    <div className="space-y-6">
      {/* RSVP Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Total Guest Pool
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-tabular">
            {activeEvent.guestCount}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Invited Attendees</p>
        </div>

        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Confirmed Attendees
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-emerald-700 mt-1 font-tabular">
            {activeEvent.confirmedGuests}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-0.5">
            {Math.round((activeEvent.confirmedGuests / activeEvent.guestCount) * 100)}% Confirmation Rate
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Awaiting Response
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-amber-600 mt-1 font-tabular">
            {activeEvent.guestCount - activeEvent.confirmedGuests - 8}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Follow-up reminder suggested</p>
        </div>

        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Dietary Requirements
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#9D3E1A] mt-1 font-tabular">
            {Object.values(dietaryCounts).reduce((a, b) => a + b, 0)} Special
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Shared with catering team</p>
        </div>
      </div>

      {/* Dietary Requirements Banner */}
      <div className="rounded-2xl border border-[#E6D5C3]/80 bg-[#FBF9F5] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4ECE1] text-[#9D3E1A]">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-editorial text-base font-bold text-stone-900">
              Kitchen Dietary Summary
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              {Object.entries(dietaryCounts).map(([type, count]) => (
                <span
                  key={type}
                  className="rounded-md bg-white border border-stone-200 px-2.5 py-0.5 font-medium text-stone-700 shadow-2xs"
                >
                  <strong>{count}</strong> {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-stone-200 bg-white p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === 'table' ? 'bg-[#9D3E1A] text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === 'map' ? 'bg-[#9D3E1A] text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Seating Map</span>
            </button>
          </div>

          <button
            onClick={() =>
              onOpenCopilotWithPrompt(
                'Draft a warm, polite digital RSVP follow-up message to guests whose responses are still pending.'
              )
            }
            className="flex items-center gap-2 rounded-xl bg-white border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#9D3E1A] transition shadow-2xs shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#9D3E1A]" />
            <span>Draft RSVP Reminder</span>
          </button>
        </div>
      </div>

      {/* View Mode 1: Directory Table View */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 p-5">
            <div>
              <h4 className="font-editorial text-lg font-bold text-stone-900">
                RSVP Directory &amp; Seating Allocations
              </h4>
              <p className="text-xs text-stone-500">
                Manage contact details, party sizes, dietary alerts, and table placements
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search guest or table..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-stone-50/70 pl-8 pr-3 py-1.5 text-xs text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-1.5 text-xs text-stone-700 focus:border-[#9D3E1A] focus:outline-none"
              >
                <option value="All">All RSVP Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Awaiting">Awaiting</option>
                <option value="Declined">Declined</option>
              </select>

              <button
                onClick={onAddGuest}
                className="flex items-center gap-1.5 rounded-xl bg-[#9D3E1A] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#802A05] transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Guest</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-[#FBF9F5] text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3 px-5">Guest Name</th>
                  <th className="py-3 px-4">Contact Email</th>
                  <th className="py-3 px-4 text-center">Party</th>
                  <th className="py-3 px-4">Dietary Preference</th>
                  <th className="py-3 px-4">Seating Table</th>
                  <th className="py-3 px-5 text-right">RSVP Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-stone-900">
                      {guest.name}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{guest.email}</td>
                    <td className="py-3.5 px-4 text-center font-tabular font-semibold text-stone-800">
                      {guest.partySize}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          guest.dietary === 'None'
                            ? 'bg-stone-100 text-stone-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {guest.dietary}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 font-medium">
                      {guest.tableNumber}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex rounded-lg border border-stone-200 bg-stone-50 p-0.5">
                        <button
                          onClick={() => onToggleStatus(guest.id, 'Confirmed')}
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${
                            guest.rsvpStatus === 'Confirmed'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                          title="Mark Confirmed"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => onToggleStatus(guest.id, 'Awaiting')}
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${
                            guest.rsvpStatus === 'Awaiting'
                              ? 'bg-amber-500 text-white shadow-2xs'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                          title="Mark Pending"
                        >
                          ?
                        </button>
                        <button
                          onClick={() => onToggleStatus(guest.id, 'Declined')}
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${
                            guest.rsvpStatus === 'Declined'
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                          title="Mark Declined"
                        >
                          No
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredGuests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-stone-500">
                      No guests found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode 2: Visual Table Seating Map */}
      {viewMode === 'map' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knownTables.map((tableName, idx) => {
              const seatedAtTable = guests.filter((g) => g.tableNumber === tableName);
              const totalSeats = seatedAtTable.reduce((acc, g) => acc + g.partySize, 0);
              const maxSeats = tableName === 'Honor Dais' ? 6 : 10;

              return (
                <div
                  key={tableName}
                  className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                      <div>
                        <h4 className="font-editorial text-base font-bold text-stone-900">
                          {tableName}
                        </h4>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {totalSeats} of {maxSeats} Seats Filled
                        </span>
                      </div>
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full bg-[#9D3E1A] rounded-full"
                          style={{ width: `${Math.min(100, (totalSeats / maxSeats) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Table schematic circle */}
                    <div className="relative my-4 flex h-24 items-center justify-center rounded-2xl bg-[#FBF9F5] border border-dashed border-[#E6D5C3]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xs border border-stone-200">
                        <span className="font-editorial text-xs font-bold text-[#9D3E1A]">
                          T-{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Seated Guests List */}
                    <div className="space-y-2">
                      {seatedAtTable.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center justify-between rounded-xl bg-stone-50 p-2 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-stone-900">{g.name}</p>
                            <p className="text-[10px] text-stone-500">Party of {g.partySize}</p>
                          </div>
                          {g.dietary !== 'None' && (
                            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-900">
                              {g.dietary}
                            </span>
                          )}
                        </div>
                      ))}
                      {seatedAtTable.length === 0 && (
                        <p className="py-3 text-center text-[11px] text-stone-400 italic">
                          No guests assigned yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onAddGuest}
                    className="mt-4 w-full rounded-xl border border-dashed border-stone-200 py-1.5 text-[11px] font-medium text-stone-600 hover:border-[#9D3E1A]/40 hover:text-[#9D3E1A] transition text-center"
                  >
                    + Assign Guest to {tableName}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
