import { BudgetItem } from '@/types';

export interface BudgetMetrics {
  total: number;
  spent: number;
  committed: number;
  contingency: number;
  savingsApplied: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percent: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Venue: 'bg-[#9D3E1A]',
  Catering: 'bg-[#C57B57]',
  'Photo/Video': 'bg-[#E0A96D]',
  'Florals & Decor': 'bg-[#776B5D]',
  'Music & Sound': 'bg-[#4A5568]',
  'Attire & Beauty': 'bg-[#D97706]',
  Production: 'bg-[#0F766E]',
  Contingency: 'bg-emerald-600',
};

/**
 * Calculates deterministic budget metrics based on total allocated and line items.
 *
 * @param totalBudget - Total planned event budget in integer or float currency units.
 * @param items - List of itemized expenses.
 * @returns Comprehensive summary metrics including Spent, Committed, and Contingency.
 */
export function calculateBudgetMetrics(totalBudget: number, items: BudgetItem[]): BudgetMetrics {
  let spent = 0;
  let committed = 0;

  for (const item of items) {
    if (item.status === 'Paid') {
      spent += item.actual;
    } else {
      // Pending or Overdue counts towards committed liability
      committed += item.budgeted;
    }
  }

  const contingency = Math.max(0, totalBudget - spent - committed);

  return {
    total: totalBudget,
    spent,
    committed,
    contingency,
    savingsApplied: 0,
  };
}

/**
 * Calculates budget summary for tests and components.
 */
export function calculateBudgetSummary(items: BudgetItem[], totalBudget: number) {
  const metrics = calculateBudgetMetrics(totalBudget, items);
  return {
    spent: metrics.spent,
    committed: metrics.committed,
    contingency: metrics.contingency,
    total: metrics.total,
  };
}

/**
 * Computes category breakdown percentages for multi-category progress bars.
 *
 * @param items - Array of BudgetItem line items.
 * @param totalBudget - Total budget denominator for percentage distribution.
 * @returns Array of sorted category metrics with assigned theme colors.
 */
export function calculateCategoryBreakdown(items: BudgetItem[], totalBudget: number): CategoryBreakdown[] {
  if (totalBudget <= 0) return [];

  const map = new Map<string, number>();

  for (const item of items) {
    const val = item.status === 'Paid' ? item.actual : item.budgeted;
    map.set(item.category, (map.get(item.category) || 0) + val);
  }

  const breakdown: CategoryBreakdown[] = [];
  map.forEach((amount, category) => {
    const percent = Math.min(100, Math.round((amount / totalBudget) * 100));
    breakdown.push({
      category,
      amount,
      percent,
      color: CATEGORY_COLORS[category] || 'bg-stone-500',
    });
  });

  return breakdown.sort((a, b) => b.amount - a.amount);
}

/**
 * Applies deterministic GenAI cost optimization rules to expense items.
 *
 * @param items - Current budget items.
 * @param activeEventId - Selected event ID for context-aware rules.
 * @returns Updated items, total savings amount, and descriptive action summary.
 */
export function applyCostOptimization(
  items: BudgetItem[],
  activeEventId: string
): { updatedItems: BudgetItem[]; savings: number; details: string } {
  let savings = 0;
  let details = '';

  const updatedItems = items.map((item) => {
    if (activeEventId === 'sarah-alex-wedding' && item.category === 'Florals & Decor' && item.status === 'Pending') {
      const discount = 950;
      savings += discount;
      details = 'Swapped rare imported peonies with locally harvested Big Sur pampas & dried terracotta botanicals (-$950).';
      return {
        ...item,
        budgeted: Math.max(0, item.budgeted - discount),
        name: `${item.name} (AI Optimized: Local Botanicals)`,
      };
    }

    if (activeEventId === 'leo-space-birthday' && item.category === 'Production') {
      const discount = 250;
      savings += discount;
      details = 'Bundled VR simulator headset license with Observatory planetarium package (-$250).';
      return {
        ...item,
        budgeted: Math.max(0, item.budgeted - discount),
        name: `${item.name} (AI Bundled Package)`,
      };
    }

    if (activeEventId === 'global-gala-2025' && item.category === 'Venue') {
      const discount = 8500;
      savings += discount;
      details = 'Restructured rigging load-in schedule into standard non-overtime municipal hours (-$8,500).';
      return {
        ...item,
        budgeted: Math.max(0, item.budgeted - discount),
        name: `${item.name} (Optimized Load-In Shift)`,
      };
    }

    return item;
  });

  return { updatedItems, savings, details };
}

/**
 * Currency formatter with zero decimals and strict tabular numbers.
 *
 * @param amount - Numeric dollar value.
 * @param currency - Optional currency symbol (default: '$').
 * @returns Formatted currency string.
 */
export function formatCurrency(amount: number, currency = '$'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
  return `${currency}${formatted}`;
}
