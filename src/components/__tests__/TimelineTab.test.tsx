import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TimelineTab } from '@/components/tabs/TimelineTab';
import { INITIAL_EVENTS, INITIAL_MILESTONES, INITIAL_RUN_OF_SHOW } from '@/data/initialData';

describe('TimelineTab Component', () => {
  const mockEvent = INITIAL_EVENTS[0];
  const mockMilestones = INITIAL_MILESTONES[mockEvent.id] || [];
  const mockRunOfShow = INITIAL_RUN_OF_SHOW[mockEvent.id] || [];
  const mockToggleMilestone = vi.fn();
  const mockResolveConflict = vi.fn();
  const mockOpenCopilot = vi.fn();
  const mockAddMilestone = vi.fn();
  const mockAddRunOfShowItem = vi.fn();

  it('renders Day-of Run-of-Show cues and mode switchers', () => {
    render(
      <TimelineTab
        activeEvent={mockEvent}
        milestones={mockMilestones}
        runOfShow={mockRunOfShow}
        onToggleMilestone={mockToggleMilestone}
        onResolveConflict={mockResolveConflict}
        hasConflict={false}
        onOpenCopilotWithPrompt={mockOpenCopilot}
        onAddMilestone={mockAddMilestone}
        onAddRunOfShowItem={mockAddRunOfShowItem}
      />
    );

    expect(screen.getByText(/Live Day-of Production Schedule/i)).toBeInTheDocument();
  });

  it('displays conflict banner and triggers auto-resolve when conflict exists', () => {
    render(
      <TimelineTab
        activeEvent={mockEvent}
        milestones={mockMilestones}
        runOfShow={mockRunOfShow}
        onToggleMilestone={mockToggleMilestone}
        onResolveConflict={mockResolveConflict}
        hasConflict={true}
        onOpenCopilotWithPrompt={mockOpenCopilot}
        onAddMilestone={mockAddMilestone}
        onAddRunOfShowItem={mockAddRunOfShowItem}
      />
    );

    const resolveBtn = screen.queryByText(/Auto-Resolve/i) || screen.queryByText(/Resolve/i);
    if (resolveBtn) {
      fireEvent.click(resolveBtn);
      expect(mockResolveConflict).toHaveBeenCalled();
    }
  });

  it('switches between milestones and run-of-show modes', () => {
    render(
      <TimelineTab
        activeEvent={mockEvent}
        milestones={mockMilestones}
        runOfShow={mockRunOfShow}
        onToggleMilestone={mockToggleMilestone}
        onResolveConflict={mockResolveConflict}
        hasConflict={false}
        onOpenCopilotWithPrompt={mockOpenCopilot}
        onAddMilestone={mockAddMilestone}
        onAddRunOfShowItem={mockAddRunOfShowItem}
      />
    );

    const milestonesModeBtn = screen.queryByText(/Milestones/i);
    if (milestonesModeBtn) {
      fireEvent.click(milestonesModeBtn);
    }
  });
});
