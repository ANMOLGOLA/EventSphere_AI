import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OverviewTab } from './components/tabs/OverviewTab';
import { BudgetTab } from './components/tabs/BudgetTab';
import { TimelineTab } from './components/tabs/TimelineTab';
import { VendorsTab } from './components/tabs/VendorsTab';
import { MoodboardTab } from './components/tabs/MoodboardTab';
import { GuestsTab } from './components/tabs/GuestsTab';
import { CopilotDrawer } from './components/CopilotDrawer';

// Modals
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { AddVendorModal } from './components/modals/AddVendorModal';
import { NewEventModal } from './components/modals/NewEventModal';
import { VendorInquiryModal } from './components/modals/VendorInquiryModal';
import { GenerateConceptModal } from './components/modals/GenerateConceptModal';
import { ExportModal } from './components/modals/ExportModal';
import { AddRunOfShowModal } from './components/modals/AddRunOfShowModal';
import { AddMilestoneModal } from './components/modals/AddMilestoneModal';
import { AddGuestModal } from './components/modals/AddGuestModal';

// Initial Data
import {
  INITIAL_EVENTS,
  INITIAL_BUDGET_ITEMS,
  INITIAL_MILESTONES,
  INITIAL_RUN_OF_SHOW,
  INITIAL_VENDORS,
  INITIAL_MOODBOARD,
  INITIAL_GUESTS,
} from './data/initialData';
import { EventData, BudgetItem, MilestoneItem, RunOfShowItem, VendorItem, MoodboardItem, GuestItem } from './types';

export default function App() {
  const [events, setEvents] = useState<EventData[]>(INITIAL_EVENTS);
  const [activeEventId, setActiveEventId] = useState<string>('sarah-alex-wedding');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Per-event data states
  const [budgetMap, setBudgetMap] = useState<Record<string, BudgetItem[]>>(INITIAL_BUDGET_ITEMS);
  const [milestonesMap, setMilestonesMap] = useState<Record<string, MilestoneItem[]>>(INITIAL_MILESTONES);
  const [runOfShowMap, setRunOfShowMap] = useState<Record<string, RunOfShowItem[]>>(INITIAL_RUN_OF_SHOW);
  const [vendorsMap, setVendorsMap] = useState<Record<string, VendorItem[]>>(INITIAL_VENDORS);
  const [moodboardMap, setMoodboardMap] = useState<Record<string, MoodboardItem[]>>(INITIAL_MOODBOARD);
  const [guestsMap, setGuestsMap] = useState<Record<string, GuestItem[]>>(INITIAL_GUESTS);

  // Buffer Conflict State
  const [hasConflictMap, setHasConflictMap] = useState<Record<string, boolean>>({
    'sarah-alex-wedding': true,
    'leo-space-birthday': false,
    'global-gala-2025': false,
  });

  // AI Optimization Applied state
  const [optimizationMap, setOptimizationMap] = useState<Record<string, boolean>>({
    'sarah-alex-wedding': false,
  });

  // Layout states
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  // Modals
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [vendorInquiryModal, setVendorInquiryModal] = useState<{ open: boolean; vendor: VendorItem | null }>({
    open: false,
    vendor: null,
  });
  const [conceptModalOpen, setConceptModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [addRunOfShowOpen, setAddRunOfShowOpen] = useState(false);
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [addGuestOpen, setAddGuestOpen] = useState(false);

  // Current Active Event
  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];

  const currentBudgetItems = budgetMap[activeEvent.id] || [];
  const currentMilestones = milestonesMap[activeEvent.id] || [];
  const currentRunOfShow = runOfShowMap[activeEvent.id] || [];
  const currentVendors = vendorsMap[activeEvent.id] || [];
  const currentMoodboard = moodboardMap[activeEvent.id] || [];
  const currentGuests = guestsMap[activeEvent.id] || [];
  const currentHasConflict = hasConflictMap[activeEvent.id] ?? false;
  const currentOptimization = optimizationMap[activeEvent.id] ?? false;

  // Handlers
  const handleOpenCopilotWithPrompt = (prompt: string) => {
    setExternalPrompt(prompt);
    setCopilotOpen(true);
  };

  const handleResolveConflict = () => {
    setRunOfShowMap((prev) => ({
      ...prev,
      [activeEvent.id]: (prev[activeEvent.id] || []).map((item) => {
        if (item.id === 'r3') {
          return {
            ...item,
            time: '02:30 PM',
            hasConflictWarning: false,
            conflictDetails: undefined,
            notes: '20-min cushion applied by EventSphere AI. Bride unhurried arrival at cliff edge.',
          };
        }
        return item;
      }),
    }));

    setHasConflictMap((prev) => ({
      ...prev,
      [activeEvent.id]: false,
    }));

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === activeEvent.id
          ? { ...ev, readinessScore: Math.min(100, ev.readinessScore + 4) }
          : ev
      )
    );
  };

  const handleApplyBudgetOptimization = () => {
    setBudgetMap((prev) => ({
      ...prev,
      [activeEvent.id]: (prev[activeEvent.id] || []).map((item) => {
        if (item.id === 'b4') {
          return {
            ...item,
            actual: 1600,
            name: 'Terracotta & In-Season Marigold & Eucalyptus Florals',
          };
        }
        if (item.id === 'b5') {
          return {
            ...item,
            status: 'Paid',
            name: 'Acoustic Guitarist & Evening Strings (Fully Funded)',
          };
        }
        return item;
      }),
    }));

    setOptimizationMap((prev) => ({
      ...prev,
      [activeEvent.id]: true,
    }));

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === activeEvent.id
          ? {
              ...ev,
              spentBudget: ev.spentBudget - 950,
              contingencyBudget: ev.contingencyBudget + 950,
              readinessScore: Math.min(100, ev.readinessScore + 3),
            }
          : ev
      )
    );
  };

  const handleToggleMilestone = (id: string) => {
    setMilestonesMap((prev) => {
      const updated = (prev[activeEvent.id] || []).map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      );

      const completedCount = updated.filter((m) => m.completed).length;
      const pct = Math.round((completedCount / updated.length) * 20);
      setEvents((evPrev) =>
        evPrev.map((ev) =>
          ev.id === activeEvent.id ? { ...ev, readinessScore: 80 + pct } : ev
        )
      );

      return { ...prev, [activeEvent.id]: updated };
    });
  };

  const handleToggleReceipt = (budgetId: string) => {
    setBudgetMap((prev) => ({
      ...prev,
      [activeEvent.id]: (prev[activeEvent.id] || []).map((item) =>
        item.id === budgetId ? { ...item, receiptAttached: !item.receiptAttached } : item
      ),
    }));
  };

  const handleAddExpense = (newItem: Omit<BudgetItem, 'id'>) => {
    const itemWithId: BudgetItem = {
      ...newItem,
      id: `exp-${Date.now()}`,
    };
    setBudgetMap((prev) => ({
      ...prev,
      [activeEvent.id]: [itemWithId, ...(prev[activeEvent.id] || [])],
    }));
  };

  const handleAddVendor = (newVendor: Omit<VendorItem, 'id'>) => {
    const vendorWithId: VendorItem = {
      ...newVendor,
      id: `v-${Date.now()}`,
    };
    setVendorsMap((prev) => ({
      ...prev,
      [activeEvent.id]: [vendorWithId, ...(prev[activeEvent.id] || [])],
    }));
  };

  const handleAddRunOfShowItem = (newBlock: Omit<RunOfShowItem, 'id'>) => {
    const blockWithId: RunOfShowItem = {
      ...newBlock,
      id: `ros-${Date.now()}`,
    };
    setRunOfShowMap((prev) => ({
      ...prev,
      [activeEvent.id]: [...(prev[activeEvent.id] || []), blockWithId],
    }));
  };

  const handleAddMilestone = (newMilestone: Omit<MilestoneItem, 'id'>) => {
    const milestoneWithId: MilestoneItem = {
      ...newMilestone,
      id: `m-${Date.now()}`,
    };
    setMilestonesMap((prev) => ({
      ...prev,
      [activeEvent.id]: [...(prev[activeEvent.id] || []), milestoneWithId],
    }));
  };

  const handleAddGuest = (newGuest: Omit<GuestItem, 'id'>) => {
    const guestWithId: GuestItem = {
      ...newGuest,
      id: `g-${Date.now()}`,
    };
    setGuestsMap((prev) => ({
      ...prev,
      [activeEvent.id]: [guestWithId, ...(prev[activeEvent.id] || [])],
    }));
  };

  const handleCreateNewEvent = (newEvent: EventData) => {
    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventId(newEvent.id);
    setActiveTab('overview');

    setBudgetMap((prev) => ({
      ...prev,
      [newEvent.id]: [
        {
          id: `b-${Date.now()}-1`,
          name: 'Primary Venue Reservation & Sound Permit',
          vendor: newEvent.location,
          category: 'Venue',
          budgeted: Math.round(newEvent.totalBudget * 0.4),
          actual: Math.round(newEvent.totalBudget * 0.4),
          status: 'Paid',
          receiptAttached: true,
        },
      ],
    }));

    setMilestonesMap((prev) => ({
      ...prev,
      [newEvent.id]: [
        {
          id: `m-${Date.now()}-1`,
          month: '6 Months Out',
          title: 'Confirm Primary Venue Contract & Deposit',
          assignee: 'Lead Planner',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
          dueDate: 'Oct 01, 2025',
          completed: true,
          category: 'Venue',
        },
      ],
    }));

    setRunOfShowMap((prev) => ({
      ...prev,
      [newEvent.id]: [
        {
          id: `ros-${Date.now()}-1`,
          time: '09:00 AM',
          durationMinutes: 120,
          title: 'Production Load-In & Audio Rigging',
          location: 'Main Pavilion',
          notes: 'Crew arrival and baseline electrical checks.',
          leadPerson: 'Stage Manager',
          status: 'Upcoming',
        },
      ],
    }));
  };

  const handleToggleGuestStatus = (
    guestId: string,
    newStatus: 'Confirmed' | 'Awaiting' | 'Declined'
  ) => {
    setGuestsMap((prev) => ({
      ...prev,
      [activeEvent.id]: (prev[activeEvent.id] || []).map((g) =>
        g.id === guestId ? { ...g, rsvpStatus: newStatus } : g
      ),
    }));
  };

  const handleToggleAddToPlan = (moodboardId: string) => {
    setMoodboardMap((prev) => ({
      ...prev,
      [activeEvent.id]: (prev[activeEvent.id] || []).map((mb) =>
        mb.id === moodboardId ? { ...mb, addedToPlan: !mb.addedToPlan } : mb
      ),
    }));
  };

  const handleAddConcepts = (newConcepts: MoodboardItem[]) => {
    setMoodboardMap((prev) => ({
      ...prev,
      [activeEvent.id]: [...newConcepts, ...(prev[activeEvent.id] || [])],
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1B1C1A]">
      {/* 1. Left Navigation Bar */}
      <Sidebar
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={(id) => setActiveEventId(id)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenNewEvent={() => setNewEventOpen(true)}
        onOpenExport={() => setExportModalOpen(true)}
        hasTimelineConflict={currentHasConflict}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 2. Main Content Canvas */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        } ${copilotOpen ? 'xl:pr-[380px]' : ''}`}
      >
        {/* Workspace Top Header */}
        <Header
          activeEvent={activeEvent}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          copilotOpen={copilotOpen}
          onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenExport={() => setExportModalOpen(true)}
          hasTimelineConflict={currentHasConflict}
        />

        {/* Central Workspace Canvas */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Hero Section */}
          <HeroSection
            activeEvent={activeEvent}
            onAddExpense={() => setAddExpenseOpen(true)}
            onAddVendor={() => setAddVendorOpen(true)}
            onAutoSchedule={handleResolveConflict}
            readinessScore={activeEvent.readinessScore}
            deadlinesCount={3}
          />

          {/* Active Tab View */}
          {activeTab === 'overview' && (
            <OverviewTab
              activeEvent={activeEvent}
              onSwitchTab={(tab) => setActiveTab(tab)}
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              readinessScore={activeEvent.readinessScore}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetTab
              activeEvent={activeEvent}
              budgetItems={currentBudgetItems}
              onAddExpense={() => setAddExpenseOpen(true)}
              onApplyOptimization={handleApplyBudgetOptimization}
              optimizationApplied={currentOptimization}
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              onToggleReceipt={handleToggleReceipt}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineTab
              activeEvent={activeEvent}
              milestones={currentMilestones}
              runOfShow={currentRunOfShow}
              onToggleMilestone={handleToggleMilestone}
              onResolveConflict={handleResolveConflict}
              hasConflict={currentHasConflict}
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              onAddMilestone={() => setAddMilestoneOpen(true)}
              onAddRunOfShowItem={() => setAddRunOfShowOpen(true)}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorsTab
              activeEvent={activeEvent}
              vendors={currentVendors}
              onAddVendor={() => setAddVendorOpen(true)}
              onDraftInquiry={(vendor) =>
                setVendorInquiryModal({ open: true, vendor })
              }
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
            />
          )}

          {activeTab === 'moodboard' && (
            <MoodboardTab
              activeEvent={activeEvent}
              moodboardItems={currentMoodboard}
              onToggleAddToPlan={handleToggleAddToPlan}
              onOpenGenerateConceptModal={() => setConceptModalOpen(true)}
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
            />
          )}

          {activeTab === 'guests' && (
            <GuestsTab
              activeEvent={activeEvent}
              guests={currentGuests}
              onToggleStatus={handleToggleGuestStatus}
              onAddGuest={() => setAddGuestOpen(true)}
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
            />
          )}
        </main>
      </div>

      {/* 3. Persistent AI Copilot ("Event Whisperer" Right Drawer - 380px wide) */}
      <CopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        activeEvent={activeEvent}
        activeTab={activeTab}
        externalPrompt={externalPrompt}
        onClearExternalPrompt={() => setExternalPrompt(null)}
      />

      {/* Modals */}
      <AddExpenseModal
        isOpen={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        onAdd={handleAddExpense}
      />

      <AddVendorModal
        isOpen={addVendorOpen}
        onClose={() => setAddVendorOpen(false)}
        onAdd={handleAddVendor}
      />

      <NewEventModal
        isOpen={newEventOpen}
        onClose={() => setNewEventOpen(false)}
        onCreateEvent={handleCreateNewEvent}
      />

      <VendorInquiryModal
        isOpen={vendorInquiryModal.open}
        onClose={() => setVendorInquiryModal({ open: false, vendor: null })}
        vendor={vendorInquiryModal.vendor}
        activeEvent={activeEvent}
      />

      <GenerateConceptModal
        isOpen={conceptModalOpen}
        onClose={() => setConceptModalOpen(false)}
        activeEvent={activeEvent}
        onAddConcepts={handleAddConcepts}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        activeEvent={activeEvent}
        budgetItems={currentBudgetItems}
        runOfShow={currentRunOfShow}
      />

      <AddRunOfShowModal
        isOpen={addRunOfShowOpen}
        onClose={() => setAddRunOfShowOpen(false)}
        onAdd={handleAddRunOfShowItem}
      />

      <AddMilestoneModal
        isOpen={addMilestoneOpen}
        onClose={() => setAddMilestoneOpen(false)}
        onAdd={handleAddMilestone}
      />

      <AddGuestModal
        isOpen={addGuestOpen}
        onClose={() => setAddGuestOpen(false)}
        onAdd={handleAddGuest}
      />
    </div>
  );
}
