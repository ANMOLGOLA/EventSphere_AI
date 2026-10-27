import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BudgetTab } from '@/components/tabs/BudgetTab';
import { EventData, BudgetItem } from '@/types';

const mockActiveEvent: EventData = {
  id: 'sarah-alex-wedding',
  title: 'Sarah & Alex Wedding Celebration',
  type: 'wedding',
  date: 'October 24, 2025',
  location: 'Post Ranch Inn, Big Sur, CA',
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

const mockBudgetItems: BudgetItem[] = [
  {
    id: 'b-1',
    name: 'Cliffside Amphitheater Rental',
    category: 'Venue',
    budgeted: 22000,
    actual: 22000,
    vendor: 'Post Ranch Inn',
    status: 'Paid',
    receiptAttached: true,
  },
  {
    id: 'b-2',
    name: 'Plated Organic Tasting Menu',
    category: 'Catering',
    budgeted: 16000,
    actual: 14000,
    vendor: 'Sierra Mar Catering',
    status: 'Paid',
    receiptAttached: true,
  },
  {
    id: 'b-3',
    name: 'Imported Peony Centerpieces',
    category: 'Florals & Decor',
    budgeted: 4500,
    actual: 0,
    vendor: 'Wildwood Flora',
    status: 'Pending',
  },
];

describe('BudgetTab Component Suite', () => {
  it('renders budget metrics accurately', () => {
    const handleAddExpense = vi.fn();
    const handleApplyOptimization = vi.fn();
    const handleOpenCopilot = vi.fn();
    const handleToggleReceipt = vi.fn();

    render(
      <BudgetTab
        activeEvent={mockActiveEvent}
        budgetItems={mockBudgetItems}
        onAddExpense={handleAddExpense}
        onApplyOptimization={handleApplyOptimization}
        optimizationApplied={false}
        onOpenCopilotWithPrompt={handleOpenCopilot}
        onToggleReceipt={handleToggleReceipt}
      />
    );

    // Total Budget: $65,000
    const totalEl = screen.getByTestId('budget-total');
    expect(totalEl).toHaveTextContent('$65,000');

    // Spent: $22,000 + $14,000 = $36,000
    const spentEl = screen.getByTestId('budget-spent');
    expect(spentEl).toHaveTextContent('$36,000');

    // Committed: Pending budgeted = $4,500
    const committedEl = screen.getByTestId('budget-committed');
    expect(committedEl).toHaveTextContent('$4,500');

    // Contingency: 65000 - 36000 - 4500 = $24,500
    const contingencyEl = screen.getByTestId('budget-contingency');
    expect(contingencyEl).toHaveTextContent('$24,500');
  });

  it('clicking "[Apply Optimization]" dispatches the state update callback', () => {
    const handleAddExpense = vi.fn();
    const handleApplyOptimization = vi.fn();
    const handleOpenCopilot = vi.fn();
    const handleToggleReceipt = vi.fn();

    render(
      <BudgetTab
        activeEvent={mockActiveEvent}
        budgetItems={mockBudgetItems}
        onAddExpense={handleAddExpense}
        onApplyOptimization={handleApplyOptimization}
        optimizationApplied={false}
        onOpenCopilotWithPrompt={handleOpenCopilot}
        onToggleReceipt={handleToggleReceipt}
      />
    );

    const applyBtn = screen.getByTestId('btn-apply-optimization');
    expect(applyBtn).toBeInTheDocument();
    expect(applyBtn).toHaveTextContent(/apply optimization/i);

    fireEvent.click(applyBtn);
    expect(handleApplyOptimization).toHaveBeenCalledTimes(1);
  });
});
