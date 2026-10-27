import React from 'react';
import {
  Palette,
  Sparkles,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { EventData } from '@/types';

interface OverviewTabProps {
  activeEvent: EventData;
  onSwitchTab: (tabId: string) => void;
  onOpenCopilotWithPrompt: (prompt: string) => void;
  readinessScore: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  activeEvent,
  onSwitchTab,
  onOpenCopilotWithPrompt,
  readinessScore,
}) => {
  const rsvpPercentage = Math.round(
    (activeEvent.confirmedGuests / activeEvent.guestCount) * 100
  );

  return (
    <div className="space-y-6">
      {/* Top Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Concept Card (Col span 2) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#E6D5C3]/80 bg-stone-900 text-white p-6 sm:p-8 flex flex-col justify-between min-h-[340px] shadow-sm">
          {/* Background Image with warm overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-105 transition-transform duration-700 hover:scale-100"
            style={{
              backgroundImage: `url(${activeEvent.heroImage})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Header Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="rounded-full bg-[#9D3E1A] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
              Active Concept
            </span>
            <span className="font-tabular text-xs font-medium text-stone-300 backdrop-blur-md bg-white/10 px-3 py-1 rounded-full">
              T-Minus {activeEvent.daysRemaining} Days
            </span>
          </div>

          {/* Title & Description */}
          <div className="relative z-10 my-6 max-w-2xl">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2.5">
              {activeEvent.activeConceptTitle}
            </h2>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-light">
              {activeEvent.activeConceptDescription}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSwitchTab('moodboard')}
              className="flex items-center gap-2 rounded-xl bg-[#9D3E1A] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#802A05] transition active:scale-98"
            >
              <Palette className="h-4 w-4" />
              <span>Explore Moodboard</span>
            </button>
            <button
              onClick={() =>
                onOpenCopilotWithPrompt(
                  `Analyze current theme readiness and aesthetic coherence for "${activeEvent.activeConceptTitle}".`
                )
              }
              className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/25 transition border border-white/20 active:scale-98"
            >
              <Sparkles className="h-4 w-4 text-[#E0A96D]" />
              <span>AI Theme Critique</span>
            </button>
          </div>
        </div>

        {/* Live Health Score Card */}
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-editorial text-lg font-bold text-stone-900">
                Live Health Score
              </span>
              <TrendingUp className="h-5 w-5 text-[#9D3E1A]" />
            </div>

            <div className="flex items-baseline gap-2 my-3">
              <span className="font-editorial text-5xl font-bold text-[#9D3E1A] tracking-tight">
                {readinessScore}
              </span>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                / 100 Optimal
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Autonomously compiled from vendor confirmations, budget contingency ratio, and RSVP velocity.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-stone-100">
            <div>
              <div className="flex justify-between text-xs font-medium text-stone-600 mb-1.5">
                <span>Budget Efficiency</span>
                <span className="font-tabular font-bold text-stone-900">98%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-[#9D3E1A] transition-all duration-700"
                  style={{ width: '98%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-600 mb-1.5">
                <span>RSVP Confirmation</span>
                <span className="font-tabular font-bold text-stone-900">
                  {rsvpPercentage}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-[#E0A96D] transition-all duration-700"
                  style={{ width: `${rsvpPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Venue Status */}
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-editorial text-base font-bold text-stone-900">
                Venue Status
              </span>
              <MapPin className="h-4 w-4 text-[#9D3E1A]" />
            </div>

            <div
              className="h-36 w-full rounded-xl bg-cover bg-center mb-4 border border-stone-200/60 shadow-inner overflow-hidden relative group"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <span className="text-xs font-semibold text-white drop-shadow">
                  {activeEvent.location}
                </span>
              </div>
            </div>

            <h4 className="font-semibold text-stone-900 text-sm">{activeEvent.location}</h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Master venue contract verified. Rigging & load-in schedule locked for production crew.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Site Permitted
            </span>
            <button
              onClick={() => onSwitchTab('vendors')}
              className="text-[#9D3E1A] font-medium hover:underline flex items-center gap-1"
            >
              <span>View Contract</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* AI Risk Radar */}
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-editorial text-base font-bold text-stone-900">
                AI Risk Radar
              </span>
              <ShieldAlert className="h-4 w-4 text-[#9D3E1A]" />
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-amber-900">
                    Catering Staff Shortage Risk
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Recommend confirming backup agency roster by Tuesday to preserve synchronized banquet service.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-900">
                    Audio/Visual Specs Approved
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  All acoustic channel mappings, power distribution, and stage lighting presets verified.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              onOpenCopilotWithPrompt(
                'Run a full risk assessment on current staffing, weather, and vendor contingencies.'
              )
            }
            className="mt-4 w-full rounded-xl border border-stone-200 bg-stone-50 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition text-center"
          >
            Run Comprehensive Risk Scan
          </button>
        </div>

        {/* VIP Stakeholders / Key Leads */}
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-editorial text-base font-bold text-stone-900">
                Key Leaders & Contacts
              </span>
              <Users className="h-4 w-4 text-[#9D3E1A]" />
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Elena Rostova"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#E0A96D]"
                />
                <div>
                  <p className="text-xs font-semibold text-stone-900">Elena Rostova</p>
                  <p className="text-[11px] text-stone-500">Lead Event Architect & Ethics Director</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Marcus Vance"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#E0A96D]"
                />
                <div>
                  <p className="text-xs font-semibold text-stone-900">Marcus Vance</p>
                  <p className="text-[11px] text-stone-500">Creative Production & Stage Design</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              onOpenCopilotWithPrompt(
                'Draft a personalized check-in note to key event leaders regarding run-of-show cues.'
              )
            }
            className="mt-4 w-full rounded-xl bg-[#F4ECE1] py-2 text-xs font-semibold text-[#802A05] hover:bg-[#EBDDCB] transition text-center"
          >
            Coordinate via AI Whisperer
          </button>
        </div>
      </div>
    </div>
  );
};
