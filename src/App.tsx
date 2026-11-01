import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { OverviewTab } from '@/components/tabs/OverviewTab';
import { BudgetTab } from '@/components/tabs/BudgetTab';
import { TimelineTab } from '@/components/tabs/TimelineTab';
import { VendorsTab } from '@/components/tabs/VendorsTab';
import { MoodboardTab } from '@/components/tabs/MoodboardTab';
import { GuestsTab } from '@/components/tabs/GuestsTab';
import { CopilotDrawer } from '@/components/CopilotDrawer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Modals
import { AddExpenseModal } from '@/components/modals/AddExpenseModal';
import { AddVendorModal } from '@/components/modals/AddVendorModal';
import { NewEventModal } from '@/components/modals/NewEventModal';
import { VendorInquiryModal } from '@/components/modals/VendorInquiryModal';
import { VendorComparisonModal } from '@/components/modals/VendorComparisonModal';
import { GenerateConceptModal } from '@/components/modals/GenerateConceptModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { AddRunOfShowModal } from '@/components/modals/AddRunOfShowModal';
import { AddMilestoneModal } from '@/components/modals/AddMilestoneModal';
import { AddGuestModal } from '@/components/modals/AddGuestModal';

// Initial Data
import {
  INITIAL_EVENTS,
  INITIAL_BUDGET_ITEMS,
  INITIAL_MILESTONES,
  INITIAL_RUN_OF_SHOW,
  INITIAL_VENDORS,
  INITIAL_MOODBOARD,
  INITIAL_GUESTS,
} from '@/data/initialData';
import { EventData, BudgetItem, MilestoneItem, RunOfShowItem, VendorItem, MoodboardItem, GuestItem } from '@/types';

/**
 * App — Root application component for EventSphere AI.
 *
 * Manages global event workspace state (events, budgets, milestones,
 * run-of-show, vendors, moodboard, guests) via per-event map patterns.
 * Renders the three-panel layout: Sidebar | Main Canvas | Copilot Drawer,
 * with lazy modal portals for all create/edit flows.
 *
 * All handler functions are stabilised with `useCallback` and all derived
 * per-event slices are memoised with `useMemo` to minimise unnecessary
 * re-renders of deeply nested tab components.
 */
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
  const [compareModalState, setCompareModalState] = useState<{
    open: boolean;
    vendorA: VendorItem | null;
    vendorB: VendorItem | null;
  }>({
    open: false,
    vendorA: null,
    vendorB: null,
  });
  const [vendorInquiryModal, setVendorInquiryModal] = useState<{ open: boolean; vendor: VendorItem | null }>({
    open: false,
    vendor: null,
  });
  const [conceptModalOpen, setConceptModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [addRunOfShowOpen, setAddRunOfShowOpen] = useState(false);
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [addGuestOpen, setAddGuestOpen] = useState(false);

  // ── Derived per-event slices (memoised for referential stability) ──────
  const activeEvent = useMemo(
    () => events.find((e) => e.id === activeEventId) ?? events[0],
    [events, activeEventId]
  );

  const currentBudgetItems = useMemo(
    () => budgetMap[activeEvent.id] ?? [],
    [budgetMap, activeEvent.id]
  );
  const currentMilestones = useMemo(
    () => milestonesMap[activeEvent.id] ?? [],
    [milestonesMap, activeEvent.id]
  );
  const currentRunOfShow = useMemo(
    () => runOfShowMap[activeEvent.id] ?? [],
    [runOfShowMap, activeEvent.id]
  );
  const currentVendors = useMemo(
    () => vendorsMap[activeEvent.id] ?? [],
    [vendorsMap, activeEvent.id]
  );
  const currentMoodboard = useMemo(
    () => moodboardMap[activeEvent.id] ?? [],
    [moodboardMap, activeEvent.id]
  );
  const currentGuests = useMemo(
    () => guestsMap[activeEvent.id] ?? [],
    [guestsMap, activeEvent.id]
  );
  const currentHasConflict = useMemo(
    () => hasConflictMap[activeEvent.id] ?? false,
    [hasConflictMap, activeEvent.id]
  );
  const currentOptimization = useMemo(
    () => optimizationMap[activeEvent.id] ?? false,
    [optimizationMap, activeEvent.id]
  );

  // ── Event Handlers (stabilised with useCallback) ───────────────────────
  /** Opens the AI Copilot drawer and seeds it with a pre-composed prompt. */
  const handleOpenCopilotWithPrompt = useCallback((prompt: string) => {
    setExternalPrompt(prompt);
    setCopilotOpen(true);
  }, []);

  /** Resolves the detected schedule conflict by applying a 20-minute buffer to cue r3. */
  const handleResolveConflict = useCallback(() => {
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
  }, [activeEvent.id]);

  /** Applies AI budget optimisation: reduces florals cost, marks music as Paid. */
  const handleApplyBudgetOptimization = useCallback(() => {
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
  }, [activeEvent.id]);

  /** Toggles completed state of a milestone and recalculates readiness score. */
  const handleToggleMilestone = useCallback((id: string) => {
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
  }, [activeEvent.id]);

  /** Toggles the receipt-attached flag on a budget line item. */
  const handleToggleReceipt = useCallback((budgetId: string) => {
    setBudgetMap((prev) => ({
      ...prev,
      [activeEvent.id]: (prev[activeEvent.id] ?? []).map((item) =>
        item.id === budgetId ? { ...item, receiptAttached: !item.receiptAttached } : item
      ),
    }));
  }, [activeEvent.id]);

  /** Prepends a new expense to the active event's budget ledger. */
  const handleAddExpense = useCallback((newItem: Omit<BudgetItem, 'id'>) => {
    const itemWithId: BudgetItem = { ...newItem, id: `exp-${Date.now()}` };
    setBudgetMap((prev) => ({
      ...prev,
      [activeEvent.id]: [itemWithId, ...(prev[activeEvent.id] ?? [])],
    }));
  }, [activeEvent.id]);

  /** Prepends a new vendor to the active event's vendor shortlist. */
  const handleAddVendor = useCallback((newVendor: Omit<VendorItem, 'id'>) => {
    const vendorWithId: VendorItem = { ...newVendor, id: `v-${Date.now()}` };
    setVendorsMap((prev) => ({
      ...prev,
      [activeEvent.id]: [vendorWithId, ...(prev[activeEvent.id] ?? [])],
    }));
  }, [activeEvent.id]);

  /** Appends a new cue block to the active event's run-of-show. */
  const handleAddRunOfShowItem = useCallback((newBlock: Omit<RunOfShowItem, 'id'>) => {
    const blockWithId: RunOfShowItem = { ...newBlock, id: `ros-${Date.now()}` };
    setRunOfShowMap((prev) => ({
      ...prev,
      [activeEvent.id]: [...(prev[activeEvent.id] ?? []), blockWithId],
    }));
  }, [activeEvent.id]);

  /** Appends a new milestone checkpoint to the production roadmap. */
  const handleAddMilestone = useCallback((newMilestone: Omit<MilestoneItem, 'id'>) => {
    const milestoneWithId: MilestoneItem = { ...newMilestone, id: `m-${Date.now()}` };
    setMilestonesMap((prev) => ({
      ...prev,
      [activeEvent.id]: [...(prev[activeEvent.id] ?? []), milestoneWithId],
    }));
  }, [activeEvent.id]);

  /** Prepends a new guest entry to the active event's guest list. */
  const handleAddGuest = useCallback((newGuest: Omit<GuestItem, 'id'>) => {
    const guestWithId: GuestItem = { ...newGuest, id: `g-${Date.now()}` };
    setGuestsMap((prev) => ({
      ...prev,
      [activeEvent.id]: [guestWithId, ...(prev[activeEvent.id] ?? [])],
    }));
  }, [activeEvent.id]);

  /** Creates a brand-new event workspace with seeded budget, milestone, and run-of-show data. */
  const handleCreateNewEvent = useCallback((newEvent: EventData) => {
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
  }, []);

  /** Updates the RSVP status for a single guest. */
  const handleToggleGuestStatus = useCallback((
    guestId: string,
    newStatus: 'Confirmed' | 'Awaiting' | 'Declined'
  ) => {
    setGuestsMap((prev) => ({
      ...prev,
      [activeEvent.id]: (prev[activeEvent.id] ?? []).map((g) =>
        g.id === guestId ? { ...g, rsvpStatus: newStatus } : g
      ),
    }));
  }, [activeEvent.id]);

  /** Toggles the "added to plan" flag on a moodboard concept card. */
  const handleToggleAddToPlan = useCallback((moodboardId: string) => {
    setMoodboardMap((prev) => ({
      ...prev,
      [activeEvent.id]: (prev[activeEvent.id] ?? []).map((mb) =>
        mb.id === moodboardId ? { ...mb, addedToPlan: !mb.addedToPlan } : mb
      ),
    }));
  }, [activeEvent.id]);

  /** Prepends AI-generated moodboard concepts to the active Idea Lab. */
  const handleAddConcepts = useCallback((newConcepts: MoodboardItem[]) => {
    setMoodboardMap((prev) => ({
      ...prev,
      [activeEvent.id]: [...newConcepts, ...(prev[activeEvent.id] ?? [])],
    }));
  }, [activeEvent.id]);


  // ── Stable modal & layout callbacks (eliminates inline JSX lambda churn) ──
  const handleOpenNewEvent = useCallback(() => setNewEventOpen(true), []);
  const handleOpenExport = useCallback(() => setExportModalOpen(true), []);
  const handleToggleCopilot = useCallback(() => setCopilotOpen((o) => !o), []);
  const handleToggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), []);
  const handleOpenAddExpense = useCallback(() => setAddExpenseOpen(true), []);
  const handleOpenAddVendor = useCallback(() => setAddVendorOpen(true), []);
  const handleOpenAddMilestone = useCallback(() => setAddMilestoneOpen(true), []);
  const handleOpenAddRunOfShow = useCallback(() => setAddRunOfShowOpen(true), []);
  const handleOpenAddGuest = useCallback(() => setAddGuestOpen(true), []);
  const handleOpenConceptModal = useCallback(() => setConceptModalOpen(true), []);
  const handleToggleVendorChecklist = useCallback((vendorId: string, checklistId: string) => {
    setVendorsMap((prev) => ({
      ...prev,
      [activeEvent.id]: (prev[activeEvent.id] ?? []).map((v) => {
        if (v.id !== vendorId || !v.checklist) return v;
        return {
          ...v,
          checklist: v.checklist.map((c) =>
            c.id === checklistId ? { ...c, completed: !c.completed } : c
          ),
        };
      }),
    }));
  }, [activeEvent.id]);

  const handleOpenCompare = useCallback((vendorA?: VendorItem, vendorB?: VendorItem) => {
    const list = vendorsMap[activeEvent.id] ?? [];
    setCompareModalState({
      open: true,
      vendorA: vendorA ?? list[0] ?? null,
      vendorB: vendorB ?? list[1] ?? null,
    });
  }, [vendorsMap, activeEvent.id]);

  const handleCloseCompare = useCallback(() => {
    setCompareModalState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleOpenVendorInquiry = useCallback((vendor: VendorItem) => setVendorInquiryModal({ open: true, vendor }), []);
  const handleCloseCopilot = useCallback(() => setCopilotOpen(false), []);
  const handleCloseAddExpense = useCallback(() => setAddExpenseOpen(false), []);
  const handleCloseAddVendor = useCallback(() => setAddVendorOpen(false), []);
  const handleCloseNewEvent = useCallback(() => setNewEventOpen(false), []);
  const handleCloseVendorInquiry = useCallback(() => setVendorInquiryModal({ open: false, vendor: null }), []);
  const handleCloseConceptModal = useCallback(() => setConceptModalOpen(false), []);
  const handleCloseExport = useCallback(() => setExportModalOpen(false), []);
  const handleCloseAddRunOfShow = useCallback(() => setAddRunOfShowOpen(false), []);
  const handleCloseAddMilestone = useCallback(() => setAddMilestoneOpen(false), []);
  const handleCloseAddGuest = useCallback(() => setAddGuestOpen(false), []);
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1B1C1A]">
      {/* Skip to Main Content Link for WCAG 2.1 AA Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-[#9D3E1A] focus:px-4 focus:py-2.5 focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      {/* 1. Left Navigation Bar */}
      <Sidebar
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={setActiveEventId}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewEvent={handleOpenNewEvent}
        onOpenExport={handleOpenExport}
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
          onSelectTab={setActiveTab}
          copilotOpen={copilotOpen}
          onToggleCopilot={handleToggleCopilot}
          onToggleSidebar={handleToggleSidebar}
          onOpenExport={handleOpenExport}
          hasTimelineConflict={currentHasConflict}
        />

        {/* Central Workspace Canvas */}
        <main id="main-content" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto" tabIndex={-1}>
          {/* Hero Section */}
          <HeroSection
            activeEvent={activeEvent}
            onAddExpense={handleOpenAddExpense}
            onAddVendor={handleOpenAddVendor}
            onAutoSchedule={handleResolveConflict}
            readinessScore={activeEvent.readinessScore}
            deadlinesCount={3}
          />

          {/* Active Tab View with Error Boundary Isolation */}
          <ErrorBoundary fallbackTitle="Event Planning Workspace">
            {activeTab === 'overview' && (
              <OverviewTab
                activeEvent={activeEvent}
                onSwitchTab={setActiveTab}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
                readinessScore={activeEvent.readinessScore}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetTab
                activeEvent={activeEvent}
                budgetItems={currentBudgetItems}
                onAddExpense={handleOpenAddExpense}
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
                onAddMilestone={handleOpenAddMilestone}
                onAddRunOfShowItem={handleOpenAddRunOfShow}
              />
            )}

            {activeTab === 'vendors' && (
              <VendorsTab
                activeEvent={activeEvent}
                vendors={currentVendors}
                onAddVendor={handleOpenAddVendor}
                onDraftInquiry={handleOpenVendorInquiry}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
                onOpenCompareModal={handleOpenCompare}
                onToggleChecklist={handleToggleVendorChecklist}
              />
            )}

            {activeTab === 'moodboard' && (
              <MoodboardTab
                activeEvent={activeEvent}
                moodboardItems={currentMoodboard}
                onToggleAddToPlan={handleToggleAddToPlan}
                onOpenGenerateConceptModal={handleOpenConceptModal}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              />
            )}

            {activeTab === 'guests' && (
              <GuestsTab
                activeEvent={activeEvent}
                guests={currentGuests}
                onToggleStatus={handleToggleGuestStatus}
                onAddGuest={handleOpenAddGuest}
                onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* 3. Persistent AI Copilot ("Event Whisperer" Right Drawer - 380px wide) */}
      <CopilotDrawer
        isOpen={copilotOpen}
        onClose={handleCloseCopilot}
        activeEvent={activeEvent}
        activeTab={activeTab}
        externalPrompt={externalPrompt}
        onClearExternalPrompt={() => setExternalPrompt(null)}
      />

      {/* Modals */}
      <AddExpenseModal
        isOpen={addExpenseOpen}
        onClose={handleCloseAddExpense}
        onAdd={handleAddExpense}
      />

      <AddVendorModal
        isOpen={addVendorOpen}
        onClose={handleCloseAddVendor}
        onAdd={handleAddVendor}
      />

      <NewEventModal
        isOpen={newEventOpen}
        onClose={handleCloseNewEvent}
        onCreateEvent={handleCreateNewEvent}
      />

      <VendorComparisonModal
        isOpen={compareModalState.open}
        onClose={handleCloseCompare}
        vendors={currentVendors}
        initialVendorA={compareModalState.vendorA}
        initialVendorB={compareModalState.vendorB}
        activeEvent={activeEvent}
        onDraftInquiry={handleOpenVendorInquiry}
      />

      <VendorInquiryModal
        isOpen={vendorInquiryModal.open}
        onClose={handleCloseVendorInquiry}
        vendor={vendorInquiryModal.vendor}
        activeEvent={activeEvent}
      />

      <GenerateConceptModal
        isOpen={conceptModalOpen}
        onClose={handleCloseConceptModal}
        activeEvent={activeEvent}
        onAddConcepts={handleAddConcepts}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={handleCloseExport}
        activeEvent={activeEvent}
        budgetItems={currentBudgetItems}
        runOfShow={currentRunOfShow}
      />

      <AddRunOfShowModal
        isOpen={addRunOfShowOpen}
        onClose={handleCloseAddRunOfShow}
        onAdd={handleAddRunOfShowItem}
      />

      <AddMilestoneModal
        isOpen={addMilestoneOpen}
        onClose={handleCloseAddMilestone}
        onAdd={handleAddMilestone}
      />

      <AddGuestModal
        isOpen={addGuestOpen}
        onClose={handleCloseAddGuest}
        onAdd={handleAddGuest}
      />
    </div>
  );
}
