import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { VendorsTab } from '../tabs/VendorsTab';
import { EventData, VendorItem } from '@/types';

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

const mockVendors: VendorItem[] = [
  {
    id: 'v1',
    name: 'Big Sur Bakery & Wood-Fired Catering',
    category: 'Catering',
    rating: 4.9,
    reviewCount: 38,
    status: 'Contract Signed',
    paymentStatus: 'Deposit Paid ($3,500)',
    contactEmail: 'events@bigsurbakery.com',
    contactPhone: '+1 (831) 667-0520',
    cost: 7200,
    avatarText: 'BS',
    avatarColor: 'bg-[#C57B57] text-white',
    notes: 'Seasonal farm-to-table dinner menu with wild king salmon.',
  },
  {
    id: 'v2',
    name: 'Loomis & Co. Fine Art Photography',
    category: 'Photography',
    rating: 4.8,
    reviewCount: 29,
    status: 'In Review',
    paymentStatus: 'Quote Pending ($4,800)',
    contactEmail: 'studio@loomisco.com',
    contactPhone: '+1 (415) 889-1120',
    cost: 4800,
    avatarText: 'LP',
    avatarColor: 'bg-stone-800 text-white',
    notes: 'Editorial 35mm film coverage.',
  },
];

describe('VendorsTab Component', () => {
  it('renders vendor list and summary metrics', () => {
    render(
      <VendorsTab
        activeEvent={mockEvent}
        vendors={mockVendors}
        onAddVendor={vi.fn()}
        onDraftInquiry={vi.fn()}
        onOpenCopilotWithPrompt={vi.fn()}
        onOpenCompareModal={vi.fn()}
      />
    );

    expect(screen.getByText('Big Sur Bakery & Wood-Fired Catering')).toBeInTheDocument();
    expect(screen.getByText('Loomis & Co. Fine Art Photography')).toBeInTheDocument();
    expect(screen.getByText('$7,200')).toBeInTheDocument();
  });

  it('triggers onAddVendor when Shortlist Vendor button is clicked', () => {
    const handleAddVendor = vi.fn();
    render(
      <VendorsTab
        activeEvent={mockEvent}
        vendors={mockVendors}
        onAddVendor={handleAddVendor}
        onDraftInquiry={vi.fn()}
        onOpenCopilotWithPrompt={vi.fn()}
        onOpenCompareModal={vi.fn()}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Shortlist Vendor/i });
    fireEvent.click(addBtn);
    expect(handleAddVendor).toHaveBeenCalledTimes(1);
  });

  it('filters vendors by category selection', () => {
    render(
      <VendorsTab
        activeEvent={mockEvent}
        vendors={mockVendors}
        onAddVendor={vi.fn()}
        onDraftInquiry={vi.fn()}
        onOpenCopilotWithPrompt={vi.fn()}
        onOpenCompareModal={vi.fn()}
      />
    );

    const cateringFilter = screen.getByRole('button', { name: /^Catering/i });
    fireEvent.click(cateringFilter);

    expect(screen.getByText('Big Sur Bakery & Wood-Fired Catering')).toBeInTheDocument();
    expect(screen.queryByText('Loomis & Co. Fine Art Photography')).not.toBeInTheDocument();
  });

  it('triggers AI draft inquiry callback on button click', () => {
    const handleDraftInquiry = vi.fn();
    render(
      <VendorsTab
        activeEvent={mockEvent}
        vendors={mockVendors}
        onAddVendor={vi.fn()}
        onDraftInquiry={handleDraftInquiry}
        onOpenCopilotWithPrompt={vi.fn()}
        onOpenCompareModal={vi.fn()}
      />
    );

    const inquiryButtons = screen.getAllByRole('button', { name: /Draft Inquiry with AI/i });
    expect(inquiryButtons.length).toBeGreaterThan(0);
    fireEvent.click(inquiryButtons[0]);
    expect(handleDraftInquiry).toHaveBeenCalledWith(mockVendors[0]);
  });
});
