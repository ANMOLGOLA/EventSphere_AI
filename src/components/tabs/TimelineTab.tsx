import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  MapPin,
  User,
  Music2,
  Play,
  Pause,
  Volume2,
  Radio,
} from 'lucide-react';
import { MilestoneItem, RunOfShowItem, EventData, SoundCueItem } from '@/types';
import { detectTimelineConflicts } from '@/utils/timeline';

interface TimelineTabProps {
  activeEvent: EventData;
  milestones: MilestoneItem[];
  runOfShow: RunOfShowItem[];
  onToggleMilestone: (id: string) => void;
  onResolveConflict: () => void;
  hasConflict: boolean;
  onOpenCopilotWithPrompt: (prompt: string) => void;
  onAddMilestone: () => void;
  onAddRunOfShowItem: () => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  activeEvent,
  milestones,
  runOfShow,
  onToggleMilestone,
  onResolveConflict,
  hasConflict,
  onOpenCopilotWithPrompt,
  onAddMilestone,
  onAddRunOfShowItem,
}) => {
  const [timelineMode, setTimelineMode] = useState<'milestones' | 'run-of-show' | 'soundscapes'>('run-of-show');
  const [playingCueId, setPlayingCueId] = useState<string | null>(null);

  const completedMilestones = milestones.filter((m) => m.completed).length;

  const soundCues: SoundCueItem[] = [
    {
      id: 'sc-1',
      title: 'Prelude: Sunlit Coast Folk & Fingerstyle Guitar',
      artistOrGenre: 'Acoustic Guitar Soloist',
      timing: '03:30 PM · Guest Arrival',
      zone: 'Ocean Lawn Terrace',
      status: 'Ready',
      vibeTag: 'Warm & Organic',
    },
    {
      id: 'sc-2',
      title: 'Processional: Cascading Strings in D Major',
      artistOrGenre: 'Pacific Sunset Trio',
      timing: '04:00 PM · Bridal Entry',
      zone: 'Ocean Cliff Pavilion',
      status: 'Queued',
      vibeTag: 'Celebratory Grandeur',
    },
    {
      id: 'sc-3',
      title: 'Golden Hour Cocktail Lounge & Bossa Nova',
      artistOrGenre: 'Live Trio & Upright Bass',
      timing: '05:00 PM · Cocktail Hour',
      zone: 'Sunset Patio & Bar',
      status: 'Queued',
      vibeTag: 'Lively & Refined',
    },
    {
      id: 'sc-4',
      title: 'Grand Entrance Horn Fanfare & First Dance',
      artistOrGenre: 'Main Brass & Rhythm Section',
      timing: '06:30 PM · Dinner Unveil',
      zone: 'Glass Marquee Tent',
      status: 'Queued',
      vibeTag: 'High Energy Euphoria',
    },
  ];

  const togglePlayCue = (id: string) => {
    if (playingCueId === id) {
      setPlayingCueId(null);
    } else {
      setPlayingCueId(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E6D5C3]/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap rounded-xl border border-[#E6D5C3] bg-[#F5F3EF] p-1 gap-1">
            <button
              onClick={() => setTimelineMode('milestones')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                timelineMode === 'milestones'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Month-by-Month Milestones ({completedMilestones}/{milestones.length})
            </button>
            <button
              onClick={() => setTimelineMode('run-of-show')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                timelineMode === 'run-of-show'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Hour-by-Hour Day-of Run-of-Show</span>
              {hasConflict && (
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setTimelineMode('soundscapes')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                timelineMode === 'soundscapes'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Music2 className="h-3.5 w-3.5 text-[#9D3E1A]" />
              <span>Soundscape Cues</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {timelineMode === 'milestones' ? (
            <button
              onClick={onAddMilestone}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Milestone</span>
            </button>
          ) : timelineMode === 'run-of-show' ? (
            <button
              onClick={onAddRunOfShowItem}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Cue Block</span>
            </button>
          ) : null}

          <button
            onClick={() =>
              onOpenCopilotWithPrompt(
                'Review and optimize the current Day-of Run-of-Show timeline for transitions, sunset golden hour lighting, and vendor load-out.'
              )
            }
            className="flex items-center gap-1.5 rounded-xl bg-[#9D3E1A] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#802A05] transition active:scale-98"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Schedule Polish</span>
          </button>
        </div>
      </div>

      {/* Smart Conflict Alert Box (Visible in Run-of-Show when conflict exists) */}
      {timelineMode === 'run-of-show' && hasConflict && (
        <div
          data-testid="timeline-conflict-alert"
          role="alert"
          aria-live="polite"
          className="relative overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50 p-5 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-editorial text-base font-bold text-amber-950">
                    Smart Buffer Conflict Detected
                  </h4>
                  <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    High Risk of Delay
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 mt-1 leading-relaxed max-w-2xl">
                  ⚠️ <strong>Buffer Warning:</strong> Hair &amp; Makeup finishes at 2:00 PM,
                  leaving only 10 minutes before First Look starts at 2:10 PM. Add a 20-minute
                  cushion to allow bride transition, dress lacing, and veil placement without
                  delaying ceremony seating.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:shrink-0">
              <button
                type="button"
                onClick={onResolveConflict}
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Apply 20-Min AI Cushion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 1: Month-by-Month Milestones */}
      {timelineMode === 'milestones' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900">
                  Production Milestone Roadmap
                </h3>
                <p className="text-xs text-stone-500">
                  Chronological checkpoints assigned to coordinators, planners, and clients
                </p>
              </div>
              <span className="text-xs font-semibold text-[#9D3E1A] bg-[#F4ECE1] px-3 py-1 rounded-full font-tabular">
                {completedMilestones} of {milestones.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {milestones.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleMilestone(item.id)}
                  className={`group flex items-center justify-between rounded-xl border p-4 transition-all cursor-pointer ${
                    item.completed
                      ? 'border-emerald-200 bg-emerald-50/20 text-stone-500'
                      : 'border-stone-200/90 bg-white hover:border-[#9D3E1A]/40 hover:bg-stone-50/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition ${
                        item.completed
                          ? 'bg-emerald-600 text-white'
                          : 'border border-stone-300 text-transparent group-hover:border-stone-400'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-600">
                          {item.month}
                        </span>
                        <span className="text-stone-300 text-xs">·</span>
                        <span className="text-[11px] font-medium text-stone-500">
                          Due {item.dueDate}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-semibold transition ${
                          item.completed
                            ? 'line-through text-stone-400'
                            : 'text-stone-900 group-hover:text-[#9D3E1A]'
                        }`}
                      >
                        {item.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.avatar}
                        alt={item.assignee}
                        className="h-6 w-6 rounded-full object-cover ring-1 ring-stone-200"
                      />
                      <span className="hidden sm:inline text-xs font-medium text-stone-600">
                        {item.assignee}
                      </span>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.completed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {item.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Hour-by-Hour Day-of Run-of-Show */}
      {timelineMode === 'run-of-show' && (
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Live Day-of Production Schedule
              </h3>
              <p className="text-xs text-stone-500">
                Minute-level cues, designated leads, venue zones, and stage transitions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-medium text-stone-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Completed
              </span>
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1 text-xs font-medium text-stone-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> In Progress
              </span>
            </div>
          </div>

          <div className="relative border-l-2 border-[#E6D5C3] ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-6">
            {runOfShow.map((block) => (
              <div
                key={block.id}
                className={`relative rounded-xl border p-4 sm:p-5 transition-all ${
                  block.hasConflictWarning
                    ? 'border-amber-300 bg-amber-50/40 shadow-xs'
                    : 'border-stone-200/80 bg-white hover:border-stone-300 hover:shadow-2xs'
                }`}
              >
                {/* Timeline Node Dot */}
                <span
                  className={`absolute -left-[27px] sm:-left-[35px] top-5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ${
                    block.status === 'Completed'
                      ? 'ring-emerald-500 text-emerald-600'
                      : block.status === 'In Progress'
                      ? 'ring-amber-500 text-amber-600'
                      : 'ring-stone-300 text-stone-400'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      block.status === 'Completed'
                        ? 'bg-emerald-500'
                        : block.status === 'In Progress'
                        ? 'bg-amber-500'
                        : 'bg-stone-300'
                    }`}
                  />
                </span>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-tabular font-bold text-xs text-[#9D3E1A] bg-[#F4ECE1] px-2 py-0.5 rounded-md">
                        {block.time} [{block.durationMinutes}m]
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-stone-500">
                        <MapPin className="h-3 w-3 text-stone-400" />
                        {block.location}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-stone-500">
                        <User className="h-3 w-3 text-stone-400" />
                        {block.leadPerson}
                      </span>
                    </div>

                    <h4 className="font-editorial text-base sm:text-lg font-bold text-stone-900">
                      {block.title}
                    </h4>

                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {block.notes}
                    </p>

                    {block.hasConflictWarning && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-100/70 p-2 text-xs font-semibold text-amber-900">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
                        <span>{block.conflictDetails}</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        block.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : block.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {block.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Soundscape & Audio Cues */}
      {timelineMode === 'soundscapes' && (
        <div className="rounded-2xl border border-[#E6D5C3]/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Atmospheric Soundscape &amp; Stage Cues
              </h3>
              <p className="text-xs text-stone-500">
                Synchronized audio transitions locked to stage mics and ceremony cues
              </p>
            </div>
            <span className="rounded-full bg-[#F4ECE1] px-3 py-1 text-xs font-bold text-[#802A05]">
              Dolby Atmos &amp; Live Band
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {soundCues.map((cue) => {
              const isPlaying = playingCueId === cue.id;
              return (
                <div
                  key={cue.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isPlaying
                      ? 'border-[#9D3E1A] bg-[#F4ECE1]/40 shadow-xs'
                      : 'border-stone-200/80 bg-[#FBF9F5]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => togglePlayCue(cue.id)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition shadow-xs ${
                          isPlaying
                            ? 'bg-[#9D3E1A] text-white'
                            : 'bg-white text-stone-700 hover:text-[#9D3E1A]'
                        }`}
                        title={isPlaying ? 'Pause Cue' : 'Preview Cue Soundscape'}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4 ml-0.5" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                            {cue.timing}
                          </span>
                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            {cue.vibeTag}
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs sm:text-sm text-stone-900">
                          {cue.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {cue.artistOrGenre} · {cue.zone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isPlaying && (
                    <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center gap-2 text-xs text-[#9D3E1A]">
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      <span className="font-medium text-[11px]">
                        Previewing soundscape simulation · Acoustic master output active
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
