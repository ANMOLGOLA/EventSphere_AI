/**
 * @file src/constants/index.ts
 * @description Application-wide string constants for tab identifiers, event IDs,
 * and other magic values. Using typed `as const` objects prevents typos and
 * enables exhaustive compile-time checks throughout the codebase.
 */

/** Identifiers for the six main event workspace navigation tabs. */
export const TAB_IDS = {
  OVERVIEW: 'overview',
  BUDGET: 'budget',
  TIMELINE: 'timeline',
  VENDORS: 'vendors',
  MOODBOARD: 'moodboard',
  GUESTS: 'guests',
} as const;

/** Union type of valid tab identifier strings, derived from TAB_IDS values. */
export type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS];

/** Identifier of the default (pre-seeded) event that loads on first render. */
export const DEFAULT_EVENT_ID = 'sarah-alex-wedding' as const;

/** Seed event identifiers for the three built-in demo workspaces. */
export const SEED_EVENT_IDS = {
  WEDDING: 'sarah-alex-wedding',
  BIRTHDAY: 'leo-space-birthday',
  GALA: 'global-gala-2025',
} as const;

/** API route base paths — centralised to prevent duplication and typos. */
export const API_ROUTES = {
  COPILOT: '/api/gemini/copilot',
  VENDOR_INQUIRY: '/api/gemini/vendor-inquiry',
  COMPARE_VENDORS: '/api/gemini/compare-vendors',
  GENERATE_CONCEPT: '/api/gemini/generate-concept',
  BUDGET_VALIDATE: '/api/budget/validate',
} as const;

/** Default avatar placeholder image used for newly created milestone assignees. */
export const DEFAULT_AVATAR_URL =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
