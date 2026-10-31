import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Wallet,
  Clock,
  Users2,
  Palette,
  UserCheck,
  ChevronDown,
  Plus,
  Download,
  AlertCircle,
  Menu,
  X,
  Radio,
} from 'lucide-react';
import { EventData } from '@/types';

interface SidebarProps {
  events: EventData[];
  activeEvent: EventData;
  onSelectEvent: (eventId: string) => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenNewEvent: () => void;
  onOpenExport: () => void;
  hasTimelineConflict: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  activeTab,
  onSelectTab,
  onOpenNewEvent,
  onOpenExport,
  hasTimelineConflict,
  collapsed,
  onToggleCollapse,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getEventEmoji = (type: string) => {
    switch (type) {
      case 'wedding':
        return '💍';
      case 'birthday':
        return '🎂';
      case 'gala':
        return '🎪';
      default:
        return '✨';
    }
  };

  const remainingBudgetFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(activeEvent.contingencyBudget);

  const navItems = [
    {
      id: 'overview',
      label: 'Overview & Vision',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'budget',
      label: 'Budget Allocator',
      icon: Wallet,
      badge: {
        text: `${remainingBudgetFormatted} Left`,
        color: 'text-stone-600 bg-stone-100',
      },
    },
    {
      id: 'timeline',
      label: 'Timeline & Cues',
      icon: Clock,
      badge: hasTimelineConflict
        ? {
            text: 'Conflict Flagged',
            color: 'text-amber-800 bg-amber-100 animate-pulse',
          }
        : null,
    },
    {
      id: 'vendors',
      label: 'Vendor & Contract Hub',
      icon: Users2,
      badge: {
        text: '4 In Review',
        color: 'text-stone-600 bg-stone-100',
      },
    },
    {
      id: 'moodboard',
      label: 'AI Moodboard & Idea Lab',
      icon: Palette,
      badge: null,
    },
    {
      id: 'guests',
      label: 'Guest List & RSVP Tracker',
      icon: UserCheck,
      badge: {
        text: `${activeEvent.confirmedGuests}/${activeEvent.guestCount}`,
        color: 'text-emerald-800 bg-emerald-50',
      },
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs transition-opacity lg:hidden ${
          collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        onClick={onToggleCollapse}
      />

      <aside
        aria-label="Application navigation sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-[#E6D5C3]/70 bg-[#FBF9F5] transition-all duration-300 ease-in-out ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64 translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E6D5C3]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#9D3E1A] via-[#C57B57] to-[#E0A96D] text-white shadow-sm ring-1 ring-black/5">
                <Sparkles className="h-5 w-5" />
              </div>
              {!collapsed && (
                <div>
                  <span className="font-editorial text-xl font-bold tracking-tight text-stone-900">
                    EventSphere
                  </span>
                  <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-[#9D3E1A]">
                    AI
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onToggleCollapse}
              aria-label="Close navigation sidebar"
              className="lg:hidden p-1.5 text-stone-500 hover:text-stone-800 rounded-lg focus-visible:ring-2 focus-visible:ring-[#9D3E1A]"
              title="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Active Event Switcher Dropdown */}
          {!collapsed && (
            <div className="relative mt-4">
              <button
                type="button"
                data-testid="event-switcher"
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
                aria-label="Switch active event"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="group flex w-full items-center justify-between rounded-xl border border-[#E6D5C3] bg-white px-3 py-2.5 text-left text-xs font-medium text-stone-800 shadow-xs transition hover:border-[#C57B57]/60 hover:bg-stone-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C57B57] focus-visible:ring-offset-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-sm">{getEventEmoji(activeEvent.type)}</span>
                  <div className="truncate">
                    <p className="truncate font-semibold text-stone-900">{activeEvent.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="h-2 w-2 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: activeEvent.theme?.primaryColor || '#9D3E1A' }}
                      />
                      <span className="text-[10px] text-stone-500">
                        {activeEvent.date} · {activeEvent.location.split(',')[0]}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Your Active Events
                  </div>
                  <div className="mt-1 space-y-1">
                    {events.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          onSelectEvent(ev.id);
                          setDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl p-2 text-left text-xs transition ${
                          ev.id === activeEvent.id
                            ? 'bg-[#F4ECE1] text-[#9D3E1A] font-semibold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{getEventEmoji(ev.type)}</span>
                          <span className="truncate">{ev.title}</span>
                        </div>
                        <span className="text-[10px] opacity-70">
                          {ev.date.split(',')[0]}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 border-t border-stone-100 pt-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenNewEvent();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl border border-dashed border-stone-300 p-2 text-xs font-semibold text-stone-700 hover:border-[#9D3E1A] hover:bg-[#F4ECE1]/40 hover:text-[#9D3E1A] transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create New Event</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav aria-label="Sidebar Sections" className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#9D3E1A] ${
                  isActive
                    ? 'bg-[#9D3E1A] text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition ${
                      isActive ? 'text-white' : 'text-stone-500 group-hover:text-stone-800'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : item.badge.color
                    }`}
                  >
                    {item.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Tray: Collaborators & Export */}
        <div className="border-t border-[#E6D5C3]/60 bg-white/50 p-3 space-y-3">
          {!collapsed && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-stone-500">Live Team</span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  4 Online
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="relative" title="Sarah (Bride/Client)">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Sarah"
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div className="relative" title="Alex (Groom/Client)">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Alex"
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div className="relative" title="Elena Rostova (Lead Planner)">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                    alt="Elena"
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div className="relative" title="Marcus Vance (Creative Lead)">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                    alt="Marcus"
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onOpenExport}
            aria-label="Export Production Pack (PDF or CSV)"
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:border-[#9D3E1A]/40 hover:text-[#9D3E1A] transition focus-visible:ring-2 focus-visible:ring-[#9D3E1A] ${
              collapsed ? 'px-2' : 'px-3'
            }`}
            title="Export Plan (PDF / CSV)"
          >
            <Download className="h-3.5 w-3.5" />
            {!collapsed && <span>Export Production Pack</span>}
          </button>

          {!collapsed && (
            <div className="flex items-center gap-2.5 rounded-xl border border-stone-200/80 bg-white p-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9D3E1A] text-xs font-bold text-white">
                AG
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-stone-900 truncate">Anmol Gola</p>
                <p className="text-[10px] text-stone-500">Principal Planner</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
