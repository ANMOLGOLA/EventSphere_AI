import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Plus,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { EventData } from '../types';

interface HeroSectionProps {
  activeEvent: EventData;
  onAddExpense: () => void;
  onAddVendor: () => void;
  onAutoSchedule: () => void;
  readinessScore: number;
  deadlinesCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeEvent,
  onAddExpense,
  onAddVendor,
  onAutoSchedule,
  readinessScore,
  deadlinesCount,
}) => {
  // SVG circular progress calculation
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 sm:p-6 shadow-sm">
      {/* Background Accent Gradients */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-[#F4ECE1] via-[#E0A96D]/15 to-transparent blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Titles & Metadata */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#F4ECE1] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#802A05]">
              {activeEvent.type} production
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/80 px-2.5 py-0.5 text-[11px] font-medium text-stone-600">
              <Clock className="h-3 w-3 text-stone-500" />
              <span>{activeEvent.daysRemaining} Days Remaining</span>
              <span className="text-stone-300">·</span>
              <Calendar className="h-3 w-3 text-stone-500" />
              <span>{activeEvent.date}</span>
            </span>
          </div>

          <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900">
            {activeEvent.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="h-3.5 w-3.5 text-[#9D3E1A]" />
              {activeEvent.location}
            </span>
            <span className="text-stone-300">·</span>
            <span className="font-tabular font-medium">
              {activeEvent.confirmedGuests} Confirmed of {activeEvent.guestCount} Invited
            </span>
          </div>
        </div>

        {/* Center / Right: Circular Readiness Gauge & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-t border-stone-100 pt-4 lg:border-t-0 lg:pt-0">
          {/* AI Event Readiness Gauge */}
          <div className="flex items-center gap-3.5 rounded-xl border border-[#E6D5C3]/70 bg-[#FBF9F5] p-2.5 pr-4 shadow-2xs">
            <div className="relative flex h-18 w-18 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-stone-200"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-[#9D3E1A] transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-tabular text-sm font-bold text-stone-900">
                  {readinessScore}%
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>On Track</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                {deadlinesCount} Deadlines This Week
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                AI autonomous health check
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <button
              onClick={onAddExpense}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-2xs hover:border-stone-300 hover:bg-stone-50 transition"
            >
              <Plus className="h-3.5 w-3.5 text-stone-500" />
              <span>Add Expense</span>
            </button>

            <button
              onClick={onAddVendor}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-2xs hover:border-stone-300 hover:bg-stone-50 transition"
            >
              <Plus className="h-3.5 w-3.5 text-stone-500" />
              <span>Shortlist Vendor</span>
            </button>

            <button
              onClick={onAutoSchedule}
              className="flex items-center gap-1.5 rounded-xl bg-[#9D3E1A] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#802A05] transition active:scale-98"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Auto-Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
