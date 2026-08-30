import { InputRecord, OrderRecord, DomainType } from './types';
import { parseOfflineRecord } from './offlineParser';
import { parseOnlineRecord } from './onlineParser';
import { detectDomain } from './domainDetector';

export async function parseMessageRecord(
  input: string | InputRecord | { message?: string; raw_text?: string; [key: string]: any },
  options?: { apiKey?: string; timeoutMs?: number }
): Promise<OrderRecord> {
  const normalizedInput: InputRecord = typeof input === 'string'
    ? {
        id: `msg-${Date.now()}`,
        message: input,
        received_at: new Date().toISOString()
      }
    : {
        id: (input as any).id || `msg-${Date.now()}`,
        message: (input as any).message || (input as any).raw_text || '',
        received_at: (input as any).received_at || new Date().toISOString(),
        domain: (input as any).domain
      };


  const activeDomain: DomainType = normalizedInput.domain || detectDomain(normalizedInput.message);
  const resolvedInput: InputRecord = { ...normalizedInput, domain: activeDomain };

  const apiKey =
    options?.apiKey ||
    (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_GEMINI_API_KEY : undefined) ||
    (typeof process !== 'undefined' ? process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY : undefined);

  const timeoutMs = options?.timeoutMs || 3000;

  if (apiKey && typeof fetch !== 'undefined' && (typeof navigator === 'undefined' || navigator.onLine)) {
    try {
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs));
      const onlinePromise = parseOnlineRecord(resolvedInput, apiKey);

      const result = await Promise.race([onlinePromise, timeoutPromise]);
      if (result) {
        result.detectedDomain = activeDomain;
        return result;
      }
    } catch (e) {
      console.warn('Online parser failed, falling back to offline parser', e);
    }
  }

  // Fallback to fast zero-dependency offline parser
  const rec = parseOfflineRecord(resolvedInput);
  rec.detectedDomain = activeDomain;
  return rec;
}
