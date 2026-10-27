import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopilotDrawer } from '@/components/CopilotDrawer';
import { EventData } from '@/types';

const mockActiveEvent: EventData = {
  id: 'sarah-alex-wedding',
  title: 'Sarah & Alex Wedding Celebration',
  type: 'wedding',
  date: 'October 24, 2025',
  location: 'Big Sur, CA',
  daysRemaining: 142,
  readinessScore: 84,
  activeConceptTitle: 'Terracotta & Sunlit Linen',
  activeConceptDescription: 'Editorial celebration with coastal botanicals.',
  heroImage: '',
  guestCount: 180,
  confirmedGuests: 142,
  totalBudget: 65000,
  spentBudget: 36000,
  committedBudget: 4500,
  contingencyBudget: 24500,
  currency: '$',
  theme: {
    primaryColor: '#C57B57',
    secondaryColor: '#F4ECE1',
    accentColor: '#E0A96D',
  },
};

describe('CopilotDrawer Component Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders required accessibility role and data-testid attributes', () => {
    const handleClose = vi.fn();

    render(
      <CopilotDrawer
        isOpen={true}
        onClose={handleClose}
        activeEvent={mockActiveEvent}
        activeTab="Budget"
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const input = screen.getByTestId('copilot-input');
    expect(input).toBeInTheDocument();

    const sendBtn = screen.getByTestId('copilot-send-btn');
    expect(sendBtn).toBeInTheDocument();
  });

  it('validates input submission, optimistic message addition, and simulated AI response', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    // Mock successful fetch response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: '### Bespoke Strategy Recommendation\n- [ ] Reallocate $950 to twilight acoustic lighting',
      }),
    });

    render(
      <CopilotDrawer
        isOpen={true}
        onClose={handleClose}
        activeEvent={mockActiveEvent}
        activeTab="Budget"
      />
    );

    const input = screen.getByTestId('copilot-input');
    const sendBtn = screen.getByTestId('copilot-send-btn');

    // Type query
    await user.type(input, 'How can I optimize the floral budget?');
    expect(input).toHaveValue('How can I optimize the floral budget?');

    // Click send
    await user.click(sendBtn);

    // Optimistic addition: user message appears in DOM immediately
    expect(screen.getByText('How can I optimize the floral budget?')).toBeInTheDocument();
    // Input is cleared
    expect(input).toHaveValue('');

    // Wait for AI response to resolve and render
    await waitFor(() => {
      expect(
        screen.getByText(/Bespoke Strategy Recommendation/i)
      ).toBeInTheDocument();
    });

    // Check rendered action item affordance
    expect(
      screen.getByText(/Reallocate \$950 to twilight acoustic lighting/i)
    ).toBeInTheDocument();
  });
});
