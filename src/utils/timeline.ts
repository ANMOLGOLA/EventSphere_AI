import { RunOfShowItem } from '@/types';

export interface TimelineConflictResult {
  hasConflict: boolean;
  conflictingItemIds: string[];
  alertMessage: string;
  recommendedBufferMinutes: number;
}

/**
 * Parses a 12-hour time string like "02:10 PM" into integer minutes from midnight.
 *
 * @param timeStr - e.g. "02:10 PM", "11:00 AM", "8:00 AM"
 * @returns Minutes since 00:00 (0 to 1439).
 */
export function parseTimeToMinutes(timeStr: string): number {
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Converts integer minutes from midnight into 12-hour formatted time "hh:mm AM/PM".
 *
 * @param totalMinutes - Minutes from midnight.
 * @returns Formatted time string.
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(norm / 60);
  const minutes = norm % 60;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;

  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedHours = hours12.toString().padStart(2, '0');

  return `${paddedHours}:${paddedMinutes} ${period}`;
}

/**
 * Detects schedule buffer conflicts between sequential day-of run-of-show events.
 * Specifically alerts when transition cushion is under minBufferMinutes (default 20m).
 *
 * @param tasks - Chronologically sorted array of run of show items.
 * @param minBufferMinutes - Required transition buffer (default: 20 min).
 * @returns TimelineConflictResult with details.
 */
export function detectTimelineConflicts(
  tasks: RunOfShowItem[],
  minBufferMinutes = 15
): TimelineConflictResult {
  const conflictingItemIds: string[] = [];
  let alertMessage = '';

  for (let i = 0; i < tasks.length - 1; i++) {
    const current = tasks[i];
    const next = tasks[i + 1];

    const currentStart = parseTimeToMinutes(current.time);
    const currentEnd = currentStart + current.durationMinutes;
    const nextStart = parseTimeToMinutes(next.time);

    const buffer = nextStart - currentEnd;

    // Trigger conflict if overlapping or if buffer is tighter than recommended safety threshold
    if (buffer < minBufferMinutes || next.hasConflictWarning) {
      conflictingItemIds.push(next.id);
      if (!alertMessage) {
        alertMessage = `Schedule Buffer Conflict: "${current.title}" ends at ${formatMinutesToTime(currentEnd)}, leaving only ${Math.max(0, buffer)} mins before "${next.title}" (${next.time}). A minimum ${minBufferMinutes}-minute buffer is strongly recommended.`;
      }
    }
  }

  return {
    hasConflict: conflictingItemIds.length > 0,
    conflictingItemIds,
    alertMessage: alertMessage || 'All scheduled items have sufficient buffer windows.',
    recommendedBufferMinutes: minBufferMinutes,
  };
}

/**
 * Pure function to automatically resolve schedule buffer conflicts by adjusting subsequent event times.
 *
 * @param tasks - Array of run of show items.
 * @param requiredBufferMinutes - Desired buffer to insert between flagged tasks.
 * @returns New array of run of show tasks with reconciled start times.
 */
export function resolveConflictWithBuffer(
  tasks: RunOfShowItem[],
  requiredBufferMinutes = 20
): RunOfShowItem[] {
  const updated = [...tasks];

  for (let i = 0; i < updated.length - 1; i++) {
    const current = updated[i];
    const next = updated[i + 1];

    const currentStart = parseTimeToMinutes(current.time);
    const currentEnd = currentStart + current.durationMinutes;
    const nextStart = parseTimeToMinutes(next.time);

    if (nextStart - currentEnd < requiredBufferMinutes || next.hasConflictWarning) {
      const resolvedNextStart = currentEnd + requiredBufferMinutes;
      updated[i + 1] = {
        ...next,
        time: formatMinutesToTime(resolvedNextStart),
        hasConflictWarning: false,
        conflictDetails: undefined,
        notes: `${next.notes} (Auto-buffered +${requiredBufferMinutes}m for smooth transition)`,
      };
    }
  }

  return updated;
}
