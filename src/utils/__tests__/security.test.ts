import { describe, it, expect } from 'vitest';
import { sanitizeText, validateMonetaryInput, validateTextInput, SECURE_LINK_PROPS } from '@/utils/security';

describe('Security Utility Suite', () => {
  describe('sanitizeText', () => {
    it('handles empty or null string gracefully', () => {
      expect(sanitizeText('')).toBe('');
    });

    it('escapes dangerous HTML/XSS characters', () => {
      const malicious = '<script>alert("XSS")</script>&\'/';
      const cleaned = sanitizeText(malicious);
      expect(cleaned).not.toContain('<');
      expect(cleaned).not.toContain('>');
      expect(cleaned).toContain('&lt;script&gt;');
      expect(cleaned).toContain('&amp;');
      expect(cleaned).toContain('&quot;');
    });
  });

  describe('validateMonetaryInput', () => {
    it('accepts valid monetary amounts', () => {
      const res = validateMonetaryInput(1250.50);
      expect(res.isValid).toBe(true);
      expect(res.sanitizedValue).toBe(1250.50);
    });

    it('rejects negative numbers', () => {
      const res = validateMonetaryInput(-500);
      expect(res.isValid).toBe(false);
      expect(res.error).toBeDefined();
    });

    it('caps values exceeding maximum threshold', () => {
      const res = validateMonetaryInput(2000000, 1000000);
      expect(res.isValid).toBe(false);
      expect(res.sanitizedValue).toBe(1000000);
    });
  });

  describe('validateTextInput', () => {
    it('validates regular text within bounds', () => {
      const res = validateTextInput('Ocean Vista Sunset', 50);
      expect(res.isValid).toBe(true);
      expect(res.sanitizedValue).toBe('Ocean Vista Sunset');
    });

    it('rejects empty input', () => {
      const res = validateTextInput('   ');
      expect(res.isValid).toBe(false);
    });

    it('truncates input exceeding max length', () => {
      const res = validateTextInput('abcdefghij', 5);
      expect(res.isValid).toBe(false);
      expect(res.sanitizedValue).toBe('abcde');
    });
  });

  describe('SECURE_LINK_PROPS', () => {
    it('enforces noopener and noreferrer for external links', () => {
      expect(SECURE_LINK_PROPS.target).toBe('_blank');
      expect(SECURE_LINK_PROPS.rel).toBe('noopener noreferrer');
    });
  });
});
