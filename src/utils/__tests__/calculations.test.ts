import { describe, it, expect } from 'vitest';
import {
  calculateBudgetSummary,
  calculateCategoryBreakdown,
  applyCostOptimization,
  formatCurrency,
} from '@/utils/budget';
import {
  detectTimelineConflicts,
  resolveConflictWithBuffer,
  parseTimeToMinutes,
  formatMinutesToTime,
} from '@/utils/timeline';
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

  describe('applyCostOptimization', () => {
    it('applies floral optimization discount for sarah-alex-wedding', () => {
      const items: BudgetItem[] = [
        {
          id: 'b-floral',
          name: 'Peonies Decor',
          category: 'Florals & Decor',
          budgeted: 3000,
          actual: 0,
          vendor: 'Florist Co',
          status: 'Pending',
        },
      ];
      const result = applyCostOptimization(items, 'sarah-alex-wedding');
      expect(result.savings).toBe(950);
      expect(result.updatedItems[0].budgeted).toBe(2050);
      expect(result.details).toContain('Swapped rare imported peonies');
    });

    it('applies production discount for leo-space-birthday', () => {
      const items: BudgetItem[] = [
        {
          id: 'b-vr',
          name: 'VR Headset Simulator',
          category: 'Production',
          budgeted: 1000,
          actual: 0,
          vendor: 'Tech Kids',
          status: 'Pending',
        },
      ];
      const result = applyCostOptimization(items, 'leo-space-birthday');
      expect(result.savings).toBe(250);
      expect(result.updatedItems[0].budgeted).toBe(750);
      expect(result.details).toContain('Bundled VR simulator headset');
    });

    it('applies load-in shift optimization for global-gala-2025', () => {
      const items: BudgetItem[] = [
        {
          id: 'b-rigging',
          name: 'Rigging Load-In',
          category: 'Venue',
          budgeted: 20000,
          actual: 0,
          vendor: 'Stage Hands',
          status: 'Pending',
        },
      ];
      const result = applyCostOptimization(items, 'global-gala-2025');
      expect(result.savings).toBe(8500);
      expect(result.updatedItems[0].budgeted).toBe(11500);
      expect(result.details).toContain('Restructured rigging load-in');
    });

    it('returns unmodified items when no optimization rules match', () => {
      const items: BudgetItem[] = [
        {
          id: 'b-general',
          name: 'Catering Service',
          category: 'Catering',
          budgeted: 5000,
          actual: 5000,
          vendor: 'Chef Co',
          status: 'Paid',
        },
      ];
      const result = applyCostOptimization(items, 'custom-event');
      expect(result.savings).toBe(0);
      expect(result.details).toBe('');
    });
  });

  describe('calculateCategoryBreakdown & formatCurrency', () => {
    it('returns empty array when total budget is zero or negative', () => {
      expect(calculateCategoryBreakdown([], 0)).toEqual([]);
      expect(calculateCategoryBreakdown([], -100)).toEqual([]);
    });

    it('computes sorted category breakdowns with percentages', () => {
      const items: BudgetItem[] = [
        {
          id: 'b-1',
          name: 'Venue',
          category: 'Venue',
          budgeted: 10000,
          actual: 10000,
          vendor: 'Hall',
          status: 'Paid',
        },
        {
          id: 'b-2',
          name: 'Catering',
          category: 'Catering',
          budgeted: 5000,
          actual: 0,
          vendor: 'Kitchen',
          status: 'Pending',
        },
      ];
      const breakdown = calculateCategoryBreakdown(items, 20000);
      expect(breakdown).toHaveLength(2);
      expect(breakdown[0].category).toBe('Venue');
      expect(breakdown[0].percent).toBe(50);
      expect(breakdown[1].category).toBe('Catering');
      expect(breakdown[1].percent).toBe(25);
    });

    it('formats currency correctly without decimals', () => {
      expect(formatCurrency(1500)).toBe('$1,500');
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(2500000, '€')).toBe('€2,500,000');
    });
  });

  describe('resolveConflictWithBuffer & Time Helpers', () => {
    it('parses and formats 12-hour time correctly', () => {
      expect(parseTimeToMinutes('12:00 PM')).toBe(720);
      expect(parseTimeToMinutes('12:00 AM')).toBe(0);
      expect(parseTimeToMinutes('01:30 PM')).toBe(810);
      expect(parseTimeToMinutes('invalid')).toBe(0);

      expect(formatMinutesToTime(720)).toBe('12:00 PM');
      expect(formatMinutesToTime(0)).toBe('12:00 AM');
      expect(formatMinutesToTime(810)).toBe('01:30 PM');
    });

    it('automatically pushes conflicting next task to satisfy required buffer', () => {
      const tasks: RunOfShowItem[] = [
        {
          id: 't-1',
          time: '02:00 PM',
          durationMinutes: 30, // ends 02:30 PM
          title: 'Welcome Speech',
          location: 'Stage',
          leadPerson: 'Host',
          status: 'Upcoming',
          notes: 'Opening',
        },
        {
          id: 't-2',
          time: '02:35 PM', // only 5m buffer
          durationMinutes: 45,
          title: 'Panel Discussion',
          location: 'Stage',
          leadPerson: 'Moderator',
          status: 'Upcoming',
          notes: 'Panel',
        },
      ];

      const resolved = resolveConflictWithBuffer(tasks, 20);
      // t-1 ends 02:30 PM + 20 min buffer = 02:50 PM
      expect(resolved[1].time).toBe('02:50 PM');
      expect(resolved[1].hasConflictWarning).toBe(false);
      expect(resolved[1].notes).toContain('Auto-buffered +20m');
    });
  });

});
