import { describe, it, expect } from 'vitest';
import { calculateBudgetSummary } from '@/utils/budget';
import { detectTimelineConflicts } from '@/utils/timeline';
import { BudgetItem, RunOfShowItem } from '@/types';

describe('Calculations Utility Suite', () => {
  describe('calculateBudgetSummary', () => {
    it('accurately computes spent, committed, and contingency balances', () => {
      const totalBudget = 50000;
      const items: BudgetItem[] = [
        {
          id: 'b-1',
          name: 'Venue Downpayment',
          category: 'Venue',
          budgeted: 15000,
          actual: 15000,
          vendor: 'Ocean Vista Cliffside',
          status: 'Paid',
          receiptAttached: true,
        },
        {
          id: 'b-2',
          name: 'Catering Deposit',
          category: 'Catering',
          budgeted: 12000,
          actual: 8000,
          vendor: 'Artisan Hearth',
          status: 'Paid',
          receiptAttached: true,
        },
        {
          id: 'b-3',
          name: 'Photography Package',
          category: 'Photo/Video',
          budgeted: 6000,
          actual: 0,
          vendor: 'Lumiere Studios',
          status: 'Pending',
        },
        {
          id: 'b-4',
          name: 'Floral Installations',
          category: 'Florals & Decor',
          budgeted: 4000,
          actual: 0,
          vendor: 'Wildwood Flora',
          status: 'Pending',
        },
      ];

      // Spent = Paid actuals = 15000 + 8000 = 23000
      // Committed = Pending budgeted = 6000 + 4000 = 10000
      // Contingency = 50000 - 23000 - 10000 = 17000
      const summary = calculateBudgetSummary(items, totalBudget);

      expect(summary.total).toBe(50000);
      expect(summary.spent).toBe(23000);
      expect(summary.committed).toBe(10000);
      expect(summary.contingency).toBe(17000);
    });

    it('clamps contingency to 0 when expenditures exceed total budget', () => {
      const totalBudget = 20000;
      const items: BudgetItem[] = [
        {
          id: 'b-ov',
          name: 'Rigging',
          category: 'Production',
          budgeted: 25000,
          actual: 25000,
          vendor: 'Stage Pro',
          status: 'Paid',
        },
      ];

      const summary = calculateBudgetSummary(items, totalBudget);
      expect(summary.spent).toBe(25000);
      expect(summary.contingency).toBe(0);
    });
  });

  describe('detectTimelineConflicts', () => {
    it('flags buffer violations when transition between sequential events is < 15 mins', () => {
      const tasks: RunOfShowItem[] = [
        {
          id: 'task-1',
          time: '02:00 PM',
          title: 'Guest Arrival & Welcome Cocktails',
          location: 'Courtyard Terrace',
          durationMinutes: 45, // Ends at 02:45 PM
          leadPerson: 'Coordinator',
          status: 'Upcoming',
          notes: 'Passed champagne',
        },
        {
          id: 'task-2',
          time: '02:50 PM', // 02:50 PM - 02:45 PM = only 5 mins buffer (< 15 mins)
          title: 'Ceremony Seating Call',
          location: 'Ocean Bluff Lawn',
          durationMinutes: 20,
          leadPerson: 'Maître D',
          status: 'Upcoming',
          notes: 'Chimes sound',
        },
      ];

      const result = detectTimelineConflicts(tasks, 15);
      expect(result.hasConflict).toBe(true);
      expect(result.conflictingItemIds).toContain('task-2');
      expect(result.alertMessage).toContain('Schedule Buffer Conflict');
    });

    it('reports no conflict when transition meets or exceeds 15-minute buffer', () => {
      const tasks: RunOfShowItem[] = [
        {
          id: 'task-1',
          time: '01:00 PM',
          title: 'Bridal Party First Look',
          location: 'Redwood Grove',
          durationMinutes: 30, // Ends at 01:30 PM
          leadPerson: 'Lead Photographer',
          status: 'Upcoming',
          notes: 'First look pictures',
        },
        {
          id: 'task-2',
          time: '01:50 PM', // 20 mins buffer (>= 15 mins)
          title: 'Family Formals',
          location: 'Rose Garden',
          durationMinutes: 40,
          leadPerson: 'Photographer Assistant',
          status: 'Upcoming',
          notes: 'Immediate family',
        },
      ];

      const result = detectTimelineConflicts(tasks, 15);
      expect(result.hasConflict).toBe(false);
      expect(result.conflictingItemIds).toHaveLength(0);
    });
  });
});
