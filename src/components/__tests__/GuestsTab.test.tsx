import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { GuestsTab } from '../tabs/GuestsTab';
import { EventData, GuestItem } from '@/types';

const mockEvent: EventData = {
  id: 'ev-test',
  type: 'wedding',
  title: 'Test Wedding Gala',
  location: 'Carmel Valley, CA',
  date: 'Oct 20, 2025',
  daysRemaining: 120,
  readinessScore: 85,
  activeConceptTitle: 'Coastal Terracotta',
  activeConceptDescription: 'Warm earthy palette',
  heroImage: 'https://example.com/hero.jpg',
  guestCount: 150,
  confirmedGuests: 110,
  totalBudget: 50000,
  spentBudget: 22000,
  committedBudget: 15000,
  contingencyBudget: 13000,
  currency: '$',
  theme: {
    primaryColor: '#C57B57',
    secondaryColor: '#F4ECE1',
    accentColor: '#E0A96D',
  },
};

const mockGuests: GuestItem[] = [
  {
    id: 'g1',
    name: 'Julianne & Robert Vance',
    email: 'julianne.vance@example.com',
    rsvpStatus: 'Confirmed',
    partySize: 2,
    dietary: 'Vegetarian',
    tableNumber: 'Table 4',
  },
  {
    id: 'g2',
    name: 'Marcus Holloway',
    email: 'marcus.h@techfirm.io',
    rsvpStatus: 'Awaiting',
    partySize: 1,
    dietary: 'Gluten-Free',
    tableNumber: 'Unassigned',
  },
  {
    id: 'g3',
    name: 'Devon Miles',
    email: 'devon@milesdesign.co',
    rsvpStatus: 'Declined',
    partySize: 1,
    dietary: 'None',
    tableNumber: 'None',
  },
];

describe('GuestsTab Component', () => {
  it('renders guest list and RSVP counts', () => {
    render(
      <GuestsTab
        activeEvent={mockEvent}
        guests={mockGuests}
        onToggleStatus={vi.fn()}
        onAddGuest={vi.fn()}
        onOpenCopilotWithPrompt={vi.fn()}
      />
    );

    expect(screen.getByText('Julianne & Robert Vance')).toBeInTheDocument();
    expect(screen.getByText('Marcus Holloway')).toBeInTheDocument();
  });

  it('filters guests by search input query', () => {
    render(
      <GuestsTab
        activeEvent={mockEvent}
        guests={mockGuests}
        onToggleStatus={vi.fn()}
        onAddGuest={vi.fn()}
        onOpenCopilotWithPrompt={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search guest or table/i);
    fireEvent.change(searchInput, { target: { value: 'Julianne' } });

    expect(screen.getByText('Julianne & Robert Vance')).toBeInTheDocument();
    expect(screen.queryByText('Marcus Holloway')).not.toBeInTheDocument();
  });

  it('triggers onAddGuest when Add Guest button is clicked', () => {
    const handleAddGuest = vi.fn();
    render(
      <GuestsTab
        activeEvent={mockEvent}
        guests={mockGuests}
        onToggleStatus={vi.fn()}
        onAddGuest={handleAddGuest}
        onOpenCopilotWithPrompt={vi.fn()}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add Guest/i });
    fireEvent.click(addBtn);
    expect(handleAddGuest).toHaveBeenCalledTimes(1);
  });

  it('invokes onToggleStatus when clicking RSVP status button', () => {
    const handleToggleStatus = vi.fn();
    render(
      <GuestsTab
        activeEvent={mockEvent}
        guests={mockGuests}
        onToggleStatus={handleToggleStatus}
        onAddGuest={vi.fn()}
        onOpenCopilotWithPrompt={vi.fn()}
      />
    );

    const yesButtons = screen.getAllByTitle('Mark Confirmed');
    expect(yesButtons.length).toBeGreaterThan(0);
    fireEvent.click(yesButtons[0]);
    expect(handleToggleStatus).toHaveBeenCalledWith('g1', 'Confirmed');
  });
});
