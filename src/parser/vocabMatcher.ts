import { DOMAIN_VOCABULARY, DomainType } from './types';

// Number word mapping (Hindi & Hinglish to digits)
export const HINDI_NUMERAL_MAP: Record<string, number> = {
  'ek': 1, 'do': 2, 'teen': 3, 'chaar': 4, 'char': 4, 'paanch': 5, 'panch': 5,
  'chhe': 6, 'chhah': 6, 'che': 6, 'saat': 7, 'sat': 7, 'aath': 8, 'ath': 8,
  'nau': 9, 'no': 9, 'das': 10, 'gyarah': 11, 'barah': 12, 'terah': 13,
  'chaudah': 14, 'pandrah': 15, 'solah': 16, 'satrah': 17, 'atharah': 18,
  'unnis': 19, 'unnees': 19, 'bees': 20, 'pachees': 25, 'pachis': 25, 'tees': 30,
  'paintis': 35, 'chhattis': 36, 'adhtis': 38, 'aadtis': 38, 'chaalis': 40, 'chalis': 40,
  'bayalis': 42, 'chawalis': 44, 'chavalis': 44, 'pachaas': 50, 'pachas': 50,
  '१': 1, '२': 2, '३': 3, '४': 4, '५': 5, '६': 6, '७': 7, '८': 8, '९': 9, '१०': 10
};

export const SPICE_LEVEL_MAP: Record<string, string> = {
  'kam': 'mild', 'kam teekha': 'mild', 'mild': 'mild', 'less spicy': 'mild',
  'medium': 'medium', 'normal': 'medium', 'teekha': 'spicy', 'spicy': 'spicy',
  'tez': 'spicy', 'tez teekha': 'spicy', 'extra spicy': 'spicy'
};

const BRANDS_MAP: Record<string, string> = {
  anchor: 'Anchor',
  bajaj: 'Bajaj',
  crompton: 'Crompton',
  havells: 'Havells',
  orient: 'Orient',
  polycab: 'Polycab',
  usha: 'Usha'
};

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

        if (k === 'size') {
          if (/^[a-zA-Z]+$/.test(trimmed)) {
            sanitized[k] = trimmed.toUpperCase();
          } else if (/^\d+(\.\d+)?$/.test(trimmed)) {
            sanitized[k] = parseFloat(trimmed);
          } else {
            sanitized[k] = trimmed.toUpperCase();
          }
        } else if (k === 'brand') {
          sanitized[k] = BRANDS_MAP[trimmed.toLowerCase()] || (trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
        } else if (/^\d+(\.\d+)?$/.test(trimmed) && k !== 'color' && k !== 'fabric' && k !== 'flavour' && k !== 'appliance' && k !== 'issue' && k !== 'room' && k !== 'shape' && k !== 'meal') {
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
