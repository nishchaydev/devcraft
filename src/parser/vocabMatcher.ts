import { DOMAIN_VOCABULARY, DomainType } from './types';

/**
 * Validates and sanitizes attribute keys per domain.
 * Drops unknown keys according to schema rules.
 */
export function sanitizeAttributes(
  domain: DomainType,
  attributes: Record<string, any>
): Record<string, string | number | boolean> {
  const allowedKeys = DOMAIN_VOCABULARY[domain] || [];
  const sanitized: Record<string, string | number | boolean> = {};

  for (const [key, val] of Object.entries(attributes)) {
    const k = key.toLowerCase().trim();
    if (allowedKeys.includes(k)) {
      if (typeof val === 'boolean') {
        sanitized[k] = val;
      } else if (typeof val === 'number') {
        sanitized[k] = val;
      } else if (typeof val === 'string') {
        const trimmed = val.trim();
        // Convert numeric string to number if appropriate (e.g. "40" -> 40)
        if (/^\d+(\.\d+)?$/.test(trimmed) && k !== 'color' && k !== 'fabric' && k !== 'flavour' && k !== 'appliance' && k !== 'issue' && k !== 'room' && k !== 'brand' && k !== 'shape' && k !== 'meal') {
          sanitized[k] = parseFloat(trimmed);
        } else if (trimmed.toLowerCase() === 'true') {
          sanitized[k] = true;
        } else if (trimmed.toLowerCase() === 'false') {
          sanitized[k] = false;
        } else {
          sanitized[k] = trimmed.toLowerCase();
        }
      }
    }
  }

  return sanitized;
}
