import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { MoodboardTab } from '../tabs/MoodboardTab';
import { EventData, MoodboardItem } from '@/types';

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

const mockMoodboard: MoodboardItem[] = [
  {
    id: 'mb1',
    title: 'Earth & Clay Table Linens',
    category: 'Palette',
    description: 'Raw-edge natural flax runners over weathered pine tables.',
    swatches: ['#C57B57', '#F4ECE1', '#E0A96D'],
    tags: ['Earthy', 'Organic', 'Textured'],
    addedToPlan: true,
  },
  {
    id: 'mb2',
    title: 'Wild Coast Rosemary Spritz',
    category: 'Cocktails',
    description: 'Smoked rosemary syrup, bitter blood orange, prosecco float.',
    tags: ['Aperitif', 'Signature', 'Herbal'],
    recipe: {
      glass: 'Crystal Collins',
      ingredients: ['1.5 oz Botanical spirit', '0.75 oz Smoked rosemary syrup', 'Top with blood orange soda'],
      garnish: 'Torched rosemary sprig',
    },
    addedToPlan: false,
  },
];

describe('MoodboardTab Component', () => {
  it('renders moodboard concept cards and tags', () => {
    render(
      <MoodboardTab
        activeEvent={mockEvent}
        moodboardItems={mockMoodboard}
        onToggleAddToPlan={vi.fn()}
        onOpenGenerateConceptModal={vi.fn()}
        onOpenCopilotWithPrompt={vi.fn()}
      />
    );

    expect(screen.getByText('Earth & Clay Table Linens')).toBeInTheDocument();
    expect(screen.getByText('Wild Coast Rosemary Spritz')).toBeInTheDocument();
  });

  it('triggers onOpenGenerateConceptModal when Generate New Concept button is clicked', () => {
    const handleOpenGenerate = vi.fn();
    render(
      <MoodboardTab
        activeEvent={mockEvent}
        moodboardItems={mockMoodboard}
        onToggleAddToPlan={vi.fn()}
        onOpenGenerateConceptModal={handleOpenGenerate}
        onOpenCopilotWithPrompt={vi.fn()}
      />
    );

    const generateBtn = screen.getByRole('button', { name: /Generate New Concept/i });
    fireEvent.click(generateBtn);
    expect(handleOpenGenerate).toHaveBeenCalledTimes(1);
  });

  it('filters moodboard cards by category selection', () => {
    render(
      <MoodboardTab
        activeEvent={mockEvent}
        moodboardItems={mockMoodboard}
        onToggleAddToPlan={vi.fn()}
        onOpenGenerateConceptModal={vi.fn()}
        onOpenCopilotWithPrompt={vi.fn()}
      />
    );

    const cocktailsFilter = screen.getByRole('button', { name: /Cocktails/i });
    fireEvent.click(cocktailsFilter);

    expect(screen.getByText('Wild Coast Rosemary Spritz')).toBeInTheDocument();
    expect(screen.queryByText('Earth & Clay Table Linens')).not.toBeInTheDocument();
  });

  it('toggles item inclusion when Add to Plan button is clicked', () => {
    const handleTogglePlan = vi.fn();
    render(
      <MoodboardTab
        activeEvent={mockEvent}
        moodboardItems={mockMoodboard}
        onToggleAddToPlan={handleTogglePlan}
        onOpenGenerateConceptModal={vi.fn()}
        onOpenCopilotWithPrompt={vi.fn()}
      />
    );

    const addButtons = screen.getAllByRole('button', { name: /Add to Plan/i });
    expect(addButtons.length).toBeGreaterThan(0);
    fireEvent.click(addButtons[0]);
    expect(handleTogglePlan).toHaveBeenCalledWith('mb2');
  });
});
