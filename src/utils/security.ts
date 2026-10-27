/**
 * Sanitizes arbitrary user or AI string inputs to strictly prevent XSS without dangerouslySetInnerHTML.
 *
 * @param input - Raw input string.
 * @returns Clean, entity-escaped string safe for DOM rendering.
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and normalizes monetary numerical inputs.
 *
 * @param value - Dollar value from form or API.
 * @param maxAllowed - Upper threshold (default: $1,000,000).
 * @returns Validation result with safe clamped number.
 */
export function validateMonetaryInput(
  value: number | string,
  maxAllowed = 1000000
): { isValid: boolean; sanitizedValue: number; error?: string } {
  const numeric = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ''));

  if (isNaN(numeric) || numeric < 0) {
    return {
      isValid: false,
      sanitizedValue: 0,
      error: 'Budget amount must be a positive number.',
    };
  }

  if (numeric > maxAllowed) {
    return {
      isValid: false,
      sanitizedValue: maxAllowed,
      error: `Amount exceeds maximum safety limit of $${maxAllowed.toLocaleString()}.`,
    };
  }

  return {
    isValid: true,
    sanitizedValue: Math.round(numeric * 100) / 100,
  };
}

/**
 * Validates textual input ensuring proper bounds and stripping control characters.
 *
 * @param text - User input string.
 * @param maxLength - Maximum allowed character length (default: 500).
 * @returns Validated safe text object.
 */
export function validateTextInput(
  text: string,
  maxLength = 500
): { isValid: boolean; sanitizedValue: string; error?: string } {
  const trimmed = (text || '').trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      sanitizedValue: '',
      error: 'Input cannot be empty.',
    };
  }

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      sanitizedValue: trimmed.slice(0, maxLength),
      error: `Input exceeds maximum limit of ${maxLength} characters.`,
    };
  }

  // Strip potential script injections or control characters
  const clean = trimmed.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  return {
    isValid: true,
    sanitizedValue: clean,
  };
}

/**
 * Hardens external link properties for secure tab opening.
 */
export const SECURE_LINK_PROPS = {
  target: '_blank' as const,
  rel: 'noopener noreferrer' as const,
};
