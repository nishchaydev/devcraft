import { InputRecord, OrderRecord, DomainType } from './types';
import { sanitizeAttributes } from './vocabMatcher';
import { generateWhatsAppReply } from './offlineParser';
import { detectDomain } from './domainDetector';

const SYSTEM_INSTRUCTIONS = `
You are an expert structured data extraction engine for Indian micro-businesses.
Extract an order record from the user's message according to these non-negotiable rules:

1. customer: Customer name if clearly stated or implied, else null. Generic terms like "bhaiya", "uncle" are null.
2. items: Array of distinct items ordered.
   - description: Normalized to lowercase singular (e.g. "kurta", "pajama", "thali", "samosa", "jalebi", "fan", "geyser", "cake").
   - quantity: Count ordered as integer >= 1. Unmarked items default to 1. Handle Devanagari digits (३ -> 3, २ -> 2).
   - attributes: Keys MUST come strictly from the domain vocabulary:
     - tailor: ["color", "fabric", "chest", "waist", "length", "sleeve", "size", "fit"]
     - tiffin: ["portion", "spice_level", "meal", "roti_count", "jain", "days"]
     - electrician: ["appliance", "issue", "room", "brand", "wattage"]
     - baker: ["flavour", "weight_kg", "egg_free", "tier", "message_on_cake", "shape"]
3. due_date: ISO-8601 YYYY-MM-DD date. Resolve ALL relative dates against the input's received_at timestamp in Asia/Kolkata timezone:
   - "aaj": received_at + 0 days
   - "kal": received_at + 1 day (always tomorrow)
   - "parso": received_at + 2 days
   - "narsu"/"tarso": received_at + 3 days
   - "agle <weekday>": strictly next occurrence of day (e.g. if today is Tuesday, "agle mangalvar" is +7 days)
   - "is weekend": upcoming Saturday
   - "<N> tarikh": Nth of current month if N >= today.day else Nth of next month
   - Imprecise deadlines ("jaldi", "asap", "urgent", "jab ho jaye", "diwali se pehle", "next week kabhi bhi", "agle mahine") -> due_date: null AND needs_clarification: true.
4. amount: Money in INR as a plain number without symbols, else null.
5. references_prior_order: true if message refers to previous order ("last time jaisa", "pichli baar wala"), else false.
6. confidence: Number between 0.0 and 1.0.
7. needs_clarification: boolean. Set to true if and only if:
   - (a) No identifiable item ordered.
   - (b) Quantity referenced but unreadable or ambiguous ("do ya teen kurta" -> record quantity: 2 AND set needs_clarification: true).
   - (c) Deadline referenced but unresolvable to a calendar date.
   - (d) Missing domain blocking attribute: baker missing flavour across ALL items, or electrician missing issue across ALL items.

Return ONLY a single valid JSON object with these 7 fields.
`;

export async function parseOnlineRecord(input: InputRecord, apiKey: string): Promise<OrderRecord | null> {
  const startTime = Date.now();
  const domain: DomainType = input.domain || detectDomain(input.message);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const promptText = `
Input Record:
Domain: ${domain}
Received At (Asia/Kolkata): ${input.received_at}
Message: "${input.message}"
`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_INSTRUCTIONS}\n\n${promptText}` }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      })
    });

    if (!response.ok) {
      console.warn(`Gemini API HTTP error ${response.status}`);
      return null;
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText) as OrderRecord;

    const sanitizedItems = (parsed.items || []).map(item => ({
      description: (item.description || '').toLowerCase().trim(),
      quantity: typeof item.quantity === 'number' && item.quantity >= 1 ? Math.floor(item.quantity) : 1,
      attributes: sanitizeAttributes(domain, item.attributes || {})
    }));

    const result: OrderRecord = {
      customer: typeof parsed.customer === 'string' ? parsed.customer.trim() : null,
      items: sanitizedItems,
      due_date: typeof parsed.due_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed.due_date) ? parsed.due_date : null,
      amount: typeof parsed.amount === 'number' ? parsed.amount : null,
      references_prior_order: Boolean(parsed.references_prior_order),
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.98,
      needs_clarification: Boolean(parsed.needs_clarification),
      detectedDomain: domain,
      engineUsed: 'gemini-flash',
      latencyMs: Date.now() - startTime,
      ruleExplanation: parsed.needs_clarification ? 'Gemini 1.5 Flash flagged ambiguity / missing blocking attribute.' : 'Gemini 1.5 Flash parsed record with high confidence.'
    };

    result.whatsappReply = generateWhatsAppReply(result);
    return result;
  } catch (err) {
    console.warn('Gemini API call failed:', err);
    return null;
  }
}
