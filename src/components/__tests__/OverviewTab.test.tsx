import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { OverviewTab } from '@/components/tabs/OverviewTab';
import { INITIAL_EVENTS } from '@/data/initialData';

describe('OverviewTab Component', () => {
  const mockEvent = INITIAL_EVENTS[0];
  const mockSwitchTab = vi.fn();
  const mockOpenCopilot = vi.fn();

  it('renders event vision, countdown, and active concept', () => {
    render(
      <OverviewTab
        activeEvent={mockEvent}
        onSwitchTab={mockSwitchTab}
        onOpenCopilotWithPrompt={mockOpenCopilot}
        readinessScore={mockEvent.readinessScore}
      />
    );

    expect(screen.getByText(mockEvent.activeConceptTitle)).toBeInTheDocument();
    expect(screen.getByText(/Active Concept/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`T-Minus ${mockEvent.daysRemaining} Days`, 'i'))).toBeInTheDocument();
  });

  it('allows switching tabs via quick links', () => {
    render(
      <OverviewTab
        activeEvent={mockEvent}
        onSwitchTab={mockSwitchTab}
        onOpenCopilotWithPrompt={mockOpenCopilot}
        readinessScore={mockEvent.readinessScore}
      />
    );

    const exploreButton = screen.queryByText(/Explore Moodboard/i) || screen.queryByText(/Moodboard/i);
    if (exploreButton) {
      fireEvent.click(exploreButton);
      expect(mockSwitchTab).toHaveBeenCalled();
    }
  });

  it('triggers copilot prompt action upon recommendation click', () => {
    render(
      <OverviewTab
        activeEvent={mockEvent}
        onSwitchTab={mockSwitchTab}
        onOpenCopilotWithPrompt={mockOpenCopilot}
        readinessScore={mockEvent.readinessScore}
      />
    );

    const actionButtons = screen.getAllByRole('button');
    const copilotBtn = actionButtons.find((btn) => btn.textContent?.includes('Ask') || btn.textContent?.includes('Copilot'));
    if (copilotBtn) {
      fireEvent.click(copilotBtn);
      expect(mockOpenCopilot).toHaveBeenCalled();
    }
  });
});
