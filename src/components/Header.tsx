import React, { useState, useCallback, useRef } from 'react';
import {
  Menu,
  Sparkles,
  Bell,
  PanelRightClose,
  PanelRightOpen,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { EventData, NotificationItem } from '@/types';

interface HeaderProps {
  activeEvent: EventData;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  copilotOpen: boolean;
  onToggleCopilot: () => void;
  onToggleSidebar: () => void;
  onOpenExport: () => void;
  hasTimelineConflict: boolean;
}

/**
 * Header — Sticky top navigation bar displaying the active event name, the six
 * workspace tab buttons (with full WAI-ARIA tab pattern), AI Copilot toggle,
 * conflict indicator badge, and export action. Collapses to an icon-only rail
 * on mobile with a hamburger sidebar toggle.
 */
export const Header: React.FC<HeaderProps> = ({
  activeEvent,
  activeTab,
  onSelectTab,
  copilotOpen,
  onToggleCopilot,
  onToggleSidebar,
  onOpenExport,
  
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Buffer conflict flagged in Day-of Run-of-Show (+20m cushion needed)',
      time: '12m ago',
      type: 'alert',
      read: false,
    },
    {
      id: 'n-2',
      title: 'AI Cost Optimization saved $950 via seasonal botanical alternative',
      time: '1h ago',
      type: 'success',
      read: false,
    },
    {
      id: 'n-3',
      title: '4 new RSVPs confirmed from Table 2 (Cypress)',
      time: '3h ago',
      type: 'info',
      read: true,
    },
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview & Vision' },
    { id: 'budget', label: 'Smart Budget' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'moodboard', label: 'AI Moodboard' },
    { id: 'guests', label: 'Guest List' },
  ];

  const tabsContainerRef = useRef<HTMLElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  /**
   * WCAG 2.1 SC 2.1.1 — Keyboard Navigation for Tab Pattern
   * ArrowRight/ArrowLeft moves focus between tabs; Home/End jump to first/last.
   */
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      const container = tabsContainerRef.current;
      if (!container) return;
      const tabButtons = Array.from(
        container.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      );
      let nextIndex: number;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = tabButtons.length - 1;
      } else {
        return;
      }
      tabButtons[nextIndex].focus();
      onSelectTab(tabs[nextIndex].id);
    },
    [onSelectTab, tabs]
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E6D5C3]/70 bg-[#FDFBF7]/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200/50 focus-visible:ring-2 focus-visible:ring-[#9D3E1A]"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-editorial text-sm font-semibold tracking-wide text-stone-400">
            Workspace
          </span>
          <span className="text-stone-300">/</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9D3E1A] truncate max-w-[140px] sm:max-w-none">
            {activeEvent.title}
          </span>
        </div>
      </div>

      {/* Center: Interactive Tab Switcher */}
      <nav ref={tabsContainerRef} aria-label="Event workspace sections" className="hidden md:flex items-center gap-1 rounded-xl border border-[#E6D5C3] bg-[#F5F3EF] p-1 shadow-2xs" role="tablist">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#9D3E1A] ${
                isActive
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenExport}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 shadow-2xs hover:bg-stone-50 transition focus-visible:ring-2 focus-visible:ring-[#9D3E1A]"
          title="Share or Export"
          aria-label="Share or Export Event Data"
        >
          <Share2 className="h-3.5 w-3.5 text-stone-500" />
          <span>Share</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition focus-visible:ring-2 focus-visible:ring-[#9D3E1A]"
            title="Production Alerts"
            aria-label={`Production Alerts, ${unreadCount} unread`}
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#9D3E1A] animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div
              role="region"
              aria-label="Notifications list"
              className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-stone-200 bg-white p-3 shadow-xl z-50"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                <span className="font-editorial text-xs font-bold text-stone-900">
                  Autonomous Alerts ({unreadCount} new)
                </span>
                <button
                  onClick={markAllRead}
                  aria-label="Mark all notifications as read"
                  className="text-[10px] font-semibold text-[#9D3E1A] hover:underline focus-visible:ring-2 focus-visible:ring-[#9D3E1A]"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl p-2.5 text-xs transition ${
                      n.read ? 'bg-stone-50/60' : 'bg-[#F4ECE1]/40 border border-[#C57B57]/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {n.type === 'alert' ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      ) : n.type === 'success' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="h-3.5 w-3.5 text-stone-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-stone-900 leading-tight">{n.title}</p>
                        <span className="text-[10px] text-stone-400 mt-0.5 inline-block">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Persistent Copilot Toggle Button */}
        <button
          onClick={onToggleCopilot}
          aria-label={copilotOpen ? "Close Event Whisperer Copilot" : "Open Event Whisperer Copilot"}
          aria-expanded={copilotOpen}
          className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-[#9D3E1A] ${
            copilotOpen
              ? 'bg-[#9D3E1A] text-white ring-2 ring-[#9D3E1A]/20'
              : 'border border-[#E6D5C3] bg-white text-stone-800 hover:border-[#9D3E1A]/50 hover:bg-[#F4ECE1]/40'
          }`}
          title="Toggle Event Whisperer AI"
        >
          <Sparkles className={`h-4 w-4 ${copilotOpen ? 'text-white' : 'text-[#9D3E1A]'}`} />
          <span className="hidden sm:inline">Event Whisperer</span>
          {copilotOpen ? (
            <PanelRightClose className="h-3.5 w-3.5 opacity-80" />
          ) : (
            <PanelRightOpen className="h-3.5 w-3.5 opacity-80" />
          )}
        </button>
      </div>
    </header>
  );
};
